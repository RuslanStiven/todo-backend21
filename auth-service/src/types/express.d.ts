import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}


//Исправляем ошибку req.>userId< = response.data.userId; в authMiddleware.ts