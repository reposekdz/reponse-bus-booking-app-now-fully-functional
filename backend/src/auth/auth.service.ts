import User from '../api/users/user.model';
import { AppError } from '../utils/AppError';

export const registerUser = async (userData: any) => {
    const { name, email, password, role } = userData;

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
