import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

// FIX: Removed explicit types from middleware function parameters to allow for correct type inference.
export const errorHandler = (err: AppError | Error, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500;
    let message = 'Something went wrong';

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    } else {
        logger.error(err.stack);
    }
    
    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};