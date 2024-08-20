import axios from 'axios';
import { Request, Response, NextFunction } from 'express';

const AUTH_SERVICE_URL = 'http://localhost:3000/auth/validate';



export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1];

    try {
        const response = await axios.post<AuthenticatorResponse>(AUTH_SERVICE_URL, { token });

        // Важно: на стороне микросервиса /validate должен возвращать userId, если токен валиден.
        req.userId = response.data.userId;
        next();
    } catch (err) {
        return res.status(401).send('Invalid token');
    }
};