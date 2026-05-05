// ============================================
// OrdenaTEC — Admin Middleware
// Verifies that the authenticated user has ADMIN role.
// ============================================

import { Response, NextFunction } from 'express';
import { AuthRequest, Rol } from '../types';

/**
 * Middleware que verifica que el usuario autenticado tenga rol ADMIN.
 * Debe usarse DESPUÉS del authMiddleware.
 */
export const adminMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    if (!req.user) {
        res.status(401).json({
            error: 'No autenticado',
            mensaje: 'Debe iniciar sesión para acceder a este recurso',
        });
        return;
    }

    if (req.user.rol !== Rol.ADMIN) {
        res.status(403).json({
            error: 'Acceso prohibido',
            mensaje: 'Se requieren permisos de administrador',
        });
        return;
    }

    next();
};
