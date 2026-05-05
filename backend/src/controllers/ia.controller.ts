// ============================================
// OrdenaTEC — IA Controller
// Generación de configuraciones con IA.
// ============================================

import { Request, Response, NextFunction } from 'express';
import { generarConfiguracion } from '../services/ia.service';

/**
 * POST /api/ia/configurar
 * Genera una configuración de PC basada en texto del usuario.
 */
export const configurar = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { prompt } = req.body;

        if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 5) {
            res.status(400).json({
                error: 'Prompt requerido',
                mensaje: 'Describe qué tipo de PC quieres (mínimo 5 caracteres)',
            });
            return;
        }

        if (!process.env.GROQ_API_KEY) {
            res.status(503).json({
                error: 'Servicio no disponible',
                mensaje: 'La función de IA no está configurada en el servidor',
            });
            return;
        }

        const resultado = await generarConfiguracion(prompt.trim());

        res.json({
            mensaje: 'Configuración generada exitosamente',
            ...resultado,
        });
    } catch (error: any) {
        // Handle Groq API errors gracefully
        if (error.status === 429) {
            res.status(429).json({
                error: 'Límite de solicitudes',
                mensaje: 'Demasiadas solicitudes a la IA. Espera unos segundos e intenta de nuevo.',
            });
            return;
        }
        next(error);
    }
};
