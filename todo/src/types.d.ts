import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
    userId?: string;  // или number, если userId будет числом
}