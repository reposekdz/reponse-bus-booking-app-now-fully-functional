import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import User from '../api/users/user.model';
import { AppError } from '../utils/AppError';
import asyncHandler from '../utils/asyncHandler';

// FIX: Removed explicit types from middleware function parameters to allow for correct type inference.
export const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('Not authorized to access this route', 401));
    }

    try {
        const decoded = jwt.verify(token, config.jwt.secret!) as { id: string };
        
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return next(new AppError('No user found with this id', 401));
        }

        next();
    } catch (error) {
        return next(new AppError('Not authorized, token failed', 401));
    }
});

export const authorize = (...roles: string[]) => {
    // FIX: Removed explicit types from middleware function parameters to allow for correct type inference.
    return (req: any, res: any, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError(`User role '${req.user?.role}' is not authorized to access this route`, 403));
        }
        next();
    };
};