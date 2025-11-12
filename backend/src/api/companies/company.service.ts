import Company from './company.model';
import { AppError } from '../../utils/AppError';

export const getAllCompanies = async () => {
    return Company.find({ status: 'Active' }).select('name logoUrl description coverUrl');
};

export const getCompanyById = async (id: string) => {
    const company = await Company.findById(id);
    if (!company) {
        throw new AppError('Company not found', 404);
    }
    return company;
};
