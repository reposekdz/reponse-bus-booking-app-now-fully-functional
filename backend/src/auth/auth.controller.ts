import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as authService from './auth.service';

export const register = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    res.status(201).json(result);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    res.status(200).json(result);
});

export const getMe = asyncHandler(async (req: any, res: Response) => {
    const user = await authService.getUserById(req.user.id);
    res.status(200).json({ success: true, data: user });
});