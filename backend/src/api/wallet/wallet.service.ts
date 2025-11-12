import User from '../users/user.model';
import WalletTransaction from './wallet.model';
import { AppError } from '../../utils/AppError';

export const topUpUserWallet = async (userId: string, amount: number) => {
    if (!amount || amount <= 0) {
        throw new AppError('Please provide a valid amount to top up.', 400);
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new AppError('User not found.', 404);
    }
    
    // In a real scenario, this would come after a successful payment gateway response.
    user.walletBalance += amount;

    await WalletTransaction.create({
        user: userId,
        type: 'top-up',
        amount: amount,
        status: 'completed',
        description: 'User-initiated wallet top-up'
    });
    
    await user.save();

    return user;
};

export const getUserWalletHistory = async (userId: string) => {
    return WalletTransaction.find({ user: userId }).sort({ createdAt: -1 });
};