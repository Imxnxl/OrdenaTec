// ============================================
// OrdenaTEC — Benchmark Controller
// Estimación de rendimiento para builds de PC.
// ============================================

import { Request, Response, NextFunction } from 'express';
import { estimarBenchmarks } from '../services/benchmark.service';

/**
 * POST /api/benchmarks/estimar
 * Estima FPS y rendimiento para un combo CPU + GPU.
 */
export const estimar = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { cpuId, gpuId } = req.body;

        if (!cpuId || !gpuId) {
            res.status(400).json({
                error: 'Parámetros requeridos',
                mensaje: 'Debe proporcionar cpuId y gpuId',
            });
            return;
        }

        const resultado = await estimarBenchmarks(cpuId, gpuId);

        res.json({
            mensaje: 'Benchmarks estimados exitosamente',
            ...resultado,
        });
    } catch (error: any) {
        if (error.status === 429) {
            res.status(429).json({
                error: 'Límite de solicitudes',
                mensaje: 'Demasiadas solicitudes. Espera unos segundos.',
            });
            return;
        }
        next(error);
    }
};
