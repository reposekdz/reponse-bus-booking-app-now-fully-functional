import * as authService from './auth.service';
import asyncHandler from '../../utils/asyncHandler';

export const register = asyncHandler(async (req, res) => {
    const { name, email, password, phone } = req.body;
    const { user, token } = await authService.registerUser({ name, email, password, phone });
    res.status(201).json({ success: true, token, data: user });
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { user, token } = await authService.loginUser({ email, password });
    res.status(200).json({ success: true, token, data: user });
});

export const getMe = asyncHandler(async (req, res) => {
    // req.user is attached by the 'protect' middleware
    const user = req.user; 
    res.status(200).json({ success: true, data: user });
});

export const updatePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    await authService.updatePassword(req.user.id, currentPassword, newPassword);
    res.status(200).json({ success: true, message: 'Password updated successfully' });
});