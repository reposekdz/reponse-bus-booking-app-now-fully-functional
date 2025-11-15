import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { pool } from '../config/db';
import { AppError } from './error.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import * as mysql from 'mysql2/promise';
import logger from '../utils/logger';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    company_id?: number;
    password_hash?: string;
    is_active: boolean;
    last_login?: Date;
}

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;
    
    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies
    else if (req.cookies?.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return next(new AppError('Access denied. No token provided.', 401));
    }

    try {
        const decoded = jwt.verify(token, config.jwt.secret) as { id: number; iat: number; exp: number };
        
        const [rows] = await pool.execute<mysql.RowDataPacket[]>(
            'SELECT id, name, email, role, company_id, is_active, last_login FROM users WHERE id = ? AND is_active = 1',
            [decoded.id]
        );
        
        const users = rows as User[];
        if (users.length === 0) {
            return next(new AppError('User not found or account deactivated.', 401));
        }

        const user = users[0];
        
        // Update last seen
        await pool.execute(
            'UPDATE users SET last_seen = NOW() WHERE id = ?',
            [user.id]
        );

        req.user = user;
        next();
    } catch (error: any) {
        logger.error('Token verification failed:', error.message);
        
        if (error.name === 'TokenExpiredError') {
            return next(new AppError('Token has expired. Please login again.', 401));
        } else if (error.name === 'JsonWebTokenError') {
            return next(new AppError('Invalid token. Please login again.', 401));
        }
        
        return next(new AppError('Authentication failed.', 401));
    }
});

export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new AppError('Authentication required.', 401));
        }
        
        if (!roles.includes(req.user.role)) {
            logger.warn(`Unauthorized access attempt by user ${req.user.id} with role ${req.user.role}`);
            return next(new AppError(`Access denied. Required role: ${roles.join(' or ')}.`, 403));
        }
        
        next();
    };
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
        token = req.cookies.token;
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, config.jwt.secret) as { id: number };
            
            const [rows] = await pool.execute<mysql.RowDataPacket[]>(
                'SELECT id, name, email, role, company_id, is_active FROM users WHERE id = ? AND is_active = 1',
                [decoded.id]
            );
            
            const users = rows as User[];
            if (users.length > 0) {
                req.user = users[0];
            }
        } catch (error) {
            // Silently fail for optional auth
            logger.debug('Optional auth failed:', error);
        }
    }
    
    next();
});

// Check if user owns resource or is admin
export const checkOwnership = (resourceIdField: string = 'id') => {
    return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new AppError('Authentication required.', 401));
        }

        // Admin can access everything
        if (req.user.role === 'admin') {
            return next();
        }

        const resourceId = req.params[resourceIdField];
        const userId = req.user.id;

        // For company resources, check company ownership
        if (req.user.role === 'company' && req.user.company_id) {
            // This would need specific logic based on the resource type
            return next();
        }

        // Check if user owns the resource
        if (parseInt(resourceId) !== userId) {
            return next(new AppError('Access denied. You can only access your own resources.', 403));
        }

        next();
    });
};

// Rate limiting for authentication endpoints
export const authRateLimit = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: {
        success: false,
        message: 'Too many authentication attempts. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
};