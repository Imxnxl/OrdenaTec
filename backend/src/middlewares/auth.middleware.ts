// ============================================
// OrdenaTEC — Auth Middleware
// Verifies JWT token and attaches user to request.
// ============================================

import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, JwtPayload } from '../types';

/**
 * Middleware que verifica el token JWT en el header Authorization.
 * Adjunta el payload del usuario a req.user si es válido.
 */
export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                error: 'Acceso denegado',
                mensaje: 'Token de autenticación no proporcionado',
            });
            return;
        }

        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET!;

        const decoded = jwt.verify(token, secret) as JwtPayload;
        req.user = decoded;

        next();
    } catch (error) {
        res.status(401).json({
            error: 'Token inválido',
            mensaje: 'El token de autenticación ha expirado o es inválido',
        });
    }
};
