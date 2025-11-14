import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { pool } from '../config/db';
import { AppError } from '../utils/AppError';
import asyncHandler from '../utils/asyncHandler';
import { User } from '../types';
import * as mysql from 'mysql2/promise';

// FIX: Removed custom AuthRequest interface. The `user` property is added to Express.Request via module augmentation in `src/types/express/index.d.ts`.
// This ensures that the `Request` type has all the default properties like `headers`.

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('Not authorized to access this route', 401));
    }

    try {
        const decoded = jwt.verify(token, config.jwt.secret!) as { id: string };
        
        const [rows] = await pool.query<User[] & mysql.RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [decoded.id]);
        const user = rows[0];
        
        if (!user) {
            return next(new AppError('No user found with this id', 401));
        }

        delete user.password_hash;
        req.user = user;

        next();
    } catch (error) {
        return next(new AppError('Not authorized, token failed', 401));
    }
});

export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError(`User role '${req.user?.role}' is not authorized to access this route`, 403));
        }
        next();
    };
};