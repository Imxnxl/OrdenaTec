// ============================================
// OrdenaTEC — Error Middleware
// Centralized error handling for the API.
// ============================================

import { Request, Response, NextFunction } from 'express';

/**
 * Interfaz para errores personalizados con código de estado HTTP
 */
interface AppError extends Error {
    statusCode?: number;
    code?: string;
}

/**
 * Middleware centralizado de manejo de errores.
 * Captura todos los errores no manejados y devuelve
 * una respuesta JSON consistente.
 */
export const errorMiddleware = (
    err: AppError,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    console.error('[Error]:', err.message);

    // Error de Prisma: registro no encontrado
    if (err.code === 'P2025') {
        res.status(404).json({
            error: 'No encontrado',
            mensaje: 'El recurso solicitado no existe',
        });
        return;
    }

    // Error de Prisma: violación de unicidad
    if (err.code === 'P2002') {
        res.status(409).json({
            error: 'Conflicto',
            mensaje: 'Ya existe un registro con esos datos únicos',
        });
        return;
    }

    // Error con código de estado personalizado
    const statusCode = err.statusCode || 500;
    const mensaje =
        statusCode === 500
            ? 'Error interno del servidor'
            : err.message || 'Ha ocurrido un error';

    res.status(statusCode).json({
        error: statusCode === 500 ? 'Error del servidor' : 'Error',
        mensaje,
    });
};

/**
 * Middleware para rutas no encontradas (404)
 */
export const notFoundMiddleware = (
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        mensaje: `La ruta ${req.method} ${req.originalUrl} no existe`,
    });
};
