import Company from '../companies/company.model';
import User from '../users/user.model';
import { AppError } from '../../utils/AppError';

// --- Company Services ---
export const createCompany = async (companyData: any) => {
    const { name, email, phone, address, ownerEmail } = companyData;

    // Find the user who will own this company
    const owner = await User.findOne({ email: ownerEmail });
    if (!owner) {
        throw new AppError(`User with email ${ownerEmail} not found to be assigned as owner.`, 404);
    }
    if (owner.role !== 'company') {
        throw new AppError(`User role must be 'company' to own a company.`, 400);
    }

    const company = await Company.create({
        name,
        contact: { email, phone, address },
        owner: owner._id,
    });
    
    // Link company back to user
    owner.company = company._id as any;
    await owner.save();

    return company;
};

export const getAllCompanies = async () => {
    return Company.find().populate('owner', 'name email');
};

export const updateCompanyById = async (id: string, updateData: any) => {
    const company = await Company.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    });
    if (!company) {
        throw new AppError('Company not found', 404);
    }
    return company;
};

export const deleteCompanyById = async (id: string) => {
    const company = await Company.findById(id);
    if (!company) {
        throw new AppError('Company not found', 404);
    }
    // In a real app, you'd handle cascading deletes (buses, routes, etc.)
    await company.deleteOne();
    return;
};


// --- Driver Services ---
export const createDriver = async (driverData: any) => {
    const { name, email, password, phone, companyId } = driverData;
    const company = await Company.findById(companyId);
    if (!company) {
        throw new AppError('Company not found', 404);
    }
    const driver = await User.create({ name, email, password, phone, role: 'driver', company: companyId });
    const driverResponse = driver.toObject();
    delete driverResponse.password;
    return driverResponse;
};

export const getAllDrivers = async () => {
    return User.find({ role: 'driver' }).populate('company', 'name');
};

export const updateDriverById = async (id: string, updateData: any) => {
    // Admins shouldn't change passwords here
    delete updateData.password;
    
    const driver = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!driver || driver.role !== 'driver') {
        throw new AppError('Driver not found', 404);
    }
    return driver;
};

export const deleteDriverById = async (id: string) => {
    const driver = await User.findById(id);
    if (!driver || driver.role !== 'driver') {
        throw new AppError('Driver not found', 404);
    }
    await driver.deleteOne();
    return;
};


// --- Agent Services ---
export const createAgent = async (agentData: any) => {
    const { name, email, password, phone, companyId } = agentData;
    
    // For agents, company is not strictly required, but can be an association
    if (companyId) {
        const company = await Company.findById(companyId);
        if (!company) {
            throw new AppError('Company to associate agent with not found', 404);
        }
    }
    
    const agent = await User.create({
        name,
        email,
        password,
        phone,
        role: 'agent',
        company: companyId || null
    });

    const agentResponse = agent.toObject();
    delete agentResponse.password;

    return agentResponse;
};

// --- User Services ---
export const getAllUsers = async () => {
    return User.find().populate('company', 'name');
};