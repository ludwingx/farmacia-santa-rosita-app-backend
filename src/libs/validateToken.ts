import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "daojwdkwakd";

const validateToken = (req: Request, res: Response, next: NextFunction) => {
    const headerToken = req.headers['authorization'];

    if (headerToken != undefined && headerToken.startsWith('Bearer ')) {
        try {
            const bearerToken = headerToken.slice(7);
            jwt.verify(bearerToken, JWT_SECRET);
            next();
        } catch (error) {
            res.status(401).json({
                msg: 'Token no valido o expirado'
            });
        }
    } else {
        // En caso de que no se envíe token
        res.status(401).json({
            msg: 'Acceso denegado. No se proporcionó token de autenticación.'
        });
    }
};

export default validateToken;
