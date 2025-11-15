import { Request, Response } from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                name: string;
                email: string;
                role: string;
                company_id?: number;
                is_active: boolean;
                last_login?: Date;
            };
        }
    }
}

export interface AuthenticatedRequest extends Request {
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
        company_id?: number;
        is_active: boolean;
        last_login?: Date;
    };
}

export interface TypedRequest<T = any> extends Request {
    body: T;
}

export interface TypedResponse<T = any> extends Response {
    json: (body: T) => this;
}