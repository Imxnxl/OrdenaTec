// ============================================
// OrdenaTEC — Componente Controller
// CRUD de componentes (catálogo de PC).
// ============================================

import { Request, Response, NextFunction } from 'express';
import { ProductoService } from '../services/producto.service';
import { FiltrosComponente } from '../types';

/**
 * GET /api/componentes
 * Lista componentes con filtros y paginación.
 */
export const listar = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const filtros: FiltrosComponente = {
            tipo: req.query.tipo as any,
            precioMin: req.query.precioMin ? Number(req.query.precioMin) : undefined,
            precioMax: req.query.precioMax ? Number(req.query.precioMax) : undefined,
            enStock: req.query.enStock === 'true',
            busqueda: req.query.busqueda as string,
            pagina: req.query.pagina ? Number(req.query.pagina) : 1,
            porPagina: req.query.porPagina ? Number(req.query.porPagina) : 20,
        };

        const resultado = await ProductoService.listar(filtros);
        res.json(resultado);
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/componentes/:id
 * Obtiene un componente por ID.
 */
export const obtenerPorId = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const componente = await ProductoService.obtenerPorId(req.params.id);
        res.json(componente);
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/componentes (admin)
 * Crea un nuevo componente.
 */
export const crear = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const componente = await ProductoService.crear(req.body);
        res.status(201).json({
            mensaje: 'Componente creado exitosamente',
            componente,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /api/componentes/:id (admin)
 * Actualiza un componente existente.
 */
export const actualizar = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const componente = await ProductoService.actualizar(req.params.id, req.body);
        res.json({
            mensaje: 'Componente actualizado exitosamente',
            componente,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /api/componentes/:id (admin)
 * Desactiva un componente (soft delete).
 */
export const eliminar = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        await ProductoService.eliminar(req.params.id);
        res.json({ mensaje: 'Componente desactivado exitosamente' });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/componentes/:id/alternativas
 * Obtiene componentes alternativos compatibles.
 */
export const obtenerAlternativas = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { tipo } = req.query;
        const componenteIds = (req.query.componenteIds as string || '').split(',').filter(Boolean);

        if (!tipo) {
            res.status(400).json({
                error: 'Parámetro requerido',
                mensaje: 'Debe especificar el tipo de componente',
            });
            return;
        }

        const alternativas = await ProductoService.obtenerAlternativas(
            tipo as string,
            componenteIds
        );
        res.json(alternativas);
    } catch (error) {
        next(error);
    }
};
