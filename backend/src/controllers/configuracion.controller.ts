// ============================================
// OrdenaTEC — Configuración Controller
// Gestión de configuraciones de PC.
// ============================================

import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { ConfiguracionService } from '../services/configuracion.service';

/**
 * POST /api/configuraciones
 * Guarda una nueva configuración.
 */
export const crear = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { nombre, componenteIds } = req.body;

        const configuracion = await ConfiguracionService.crear({
            nombre,
            usuarioId: req.user?.userId,
            componenteIds,
        });

        res.status(201).json({
            mensaje: 'Configuración guardada exitosamente',
            configuracion,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/configuraciones/:id
 * Obtiene una configuración por ID.
 */
export const obtenerPorId = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const configuracion = await ConfiguracionService.obtenerPorId(req.params.id);
        res.json(configuracion);
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/configuraciones/usuario
 * Lista las configuraciones del usuario autenticado.
 */
export const listarPorUsuario = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                error: 'No autenticado',
                mensaje: 'Debe iniciar sesión para ver sus configuraciones',
            });
            return;
        }

        const configuraciones = await ConfiguracionService.listarPorUsuario(
            req.user.userId
        );
        res.json(configuraciones);
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/configuraciones/validar
 * Valida la compatibilidad de un conjunto de componentes.
 */
export const validar = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { componenteIds } = req.body;
        const resultado = await ConfiguracionService.validarComponentes(componenteIds);
        res.json(resultado);
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /api/configuraciones/:id
 * Actualiza una configuración existente.
 */
export const actualizar = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { nombre, componenteIds } = req.body;
        const configuracion = await ConfiguracionService.actualizar(req.params.id, {
            nombre,
            componenteIds,
        });

        res.json({
            mensaje: 'Configuración actualizada exitosamente',
            configuracion,
        });
    } catch (error) {
        next(error);
    }
};
