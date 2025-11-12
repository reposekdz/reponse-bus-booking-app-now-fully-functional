import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';

// A simple utility for handling async controller functions
// FIX: Removed explicit types to allow for correct type inference.
const asyncHandler = (fn: Function) => (req: any, res: any, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// FIX: Removed explicit types to allow for correct type inference.
export const register = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;
    const { user, token } = await authService.registerUser({ name, email, password, role });
    res.status(201).json({ success: true, token, data: user });
});

// FIX: Removed explicit types to allow for correct type inference.
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { user, token } = await authService.loginUser({ email, password });
    res.status(200).json({ success: true, token, data: user });
});

// FIX: Removed explicit types to allow for correct type inference.
export const getMe = asyncHandler(async (req: any, res) => {
    // In a real app, req.user would be attached by the 'protect' middleware
    const user = req.user; 
    res.status(200).json({ success: true, data: user });
});