import User from '../users/user.model';
import { AppError } from '../../utils/AppError';

export const registerUser = async (userData: any) => {
    const { name, email, password, role } = userData;

    // A protection layer so users can't register as admins
    const allowedRoles = ['passenger', 'driver', 'agent', 'company'];
    if (role && !allowedRoles.includes(role)) {
        throw new AppError(`Role '${role}' is not a valid registration role.`, 400);
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new AppError('User already exists', 400);
    }

    const user = await User.create({ name, email, password, role });

    const token = user.getSignedJwtToken();
    
    // Omit password from the returned user object
    const userResponse = user.toObject();
    delete userResponse.password;

    return { user: userResponse, token };
};

export const loginUser = async (loginData: any) => {
    const { email, password } = loginData;

    if (!email || !password) {
        throw new AppError('Please provide an email and password', 400);
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
        throw new AppError('Invalid credentials', 401);
    }

    const token = user.getSignedJwtToken();
    
    const userResponse = user.toObject();
    delete userResponse.password;

    return { user: userResponse, token };
};
