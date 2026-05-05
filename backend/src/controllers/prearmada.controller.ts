// ============================================
// OrdenaTEC — Prearmada Controller
// CRUD de computadoras pre-armadas.
// ============================================

import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

/**
 * GET /api/prearmadas
 * Lista todas las computadoras pre-armadas (público).
 */
export const listar = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { categoria, destacada } = req.query;

        const where: any = { esPrearmada: true };
        if (categoria) where.categoria = categoria;
        if (destacada === 'true') where.destacada = true;

        const prearmadas = await prisma.configuracion.findMany({
            where,
            include: {
                componentes: {
                    include: { componente: true },
                },
            },
            orderBy: [
                { destacada: 'desc' },
                { precioTotal: 'asc' },
            ],
        });

        res.json(prearmadas);
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/prearmadas/:id
 * Obtiene una computadora pre-armada por ID.
 */
export const obtenerPorId = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const prearmada = await prisma.configuracion.findFirst({
            where: {
                id: req.params.id,
                esPrearmada: true,
            },
            include: {
                componentes: {
                    include: { componente: true },
                },
            },
        });

        if (!prearmada) {
            res.status(404).json({
                error: 'No encontrada',
                mensaje: 'La computadora pre-armada no existe',
            });
            return;
        }

        res.json(prearmada);
    } catch (error) {
        next(error);
    }
};
