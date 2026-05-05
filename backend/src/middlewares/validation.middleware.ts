// ============================================
// OrdenaTEC — Validation Middleware
// Uses Zod schemas to validate request data.
// ============================================

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Crea un middleware que valida req.body contra el schema Zod proporcionado.
 */
export const validateBody = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errores = error.errors.map((e) => ({
                    campo: e.path.join('.'),
                    mensaje: e.message,
                }));

                res.status(400).json({
                    error: 'Datos inválidos',
                    detalles: errores,
                });
                return;
            }
            next(error);
        }
    };
};

/**
 * Crea un middleware que valida req.query contra el schema Zod proporcionado.
 */
export const validateQuery = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            req.query = schema.parse(req.query) as any;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errores = error.errors.map((e) => ({
                    campo: e.path.join('.'),
                    mensaje: e.message,
                }));

                res.status(400).json({
                    error: 'Parámetros de consulta inválidos',
                    detalles: errores,
                });
                return;
            }
            next(error);
        }
    };
};

/**
 * Crea un middleware que valida req.params contra el schema Zod proporcionado.
 */
export const validateParams = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            req.params = schema.parse(req.params) as any;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errores = error.errors.map((e) => ({
                    campo: e.path.join('.'),
                    mensaje: e.message,
                }));

                res.status(400).json({
                    error: 'Parámetros de ruta inválidos',
                    detalles: errores,
                });
                return;
            }
            next(error);
        }
    };
};
