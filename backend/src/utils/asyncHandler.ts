import { Request, Response, NextFunction } from 'express';

const asyncHandler = (fn: (req: any, res: any, next: NextFunction) => Promise<any>) => 
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            next(error);
        }
};

export default asyncHandler;
