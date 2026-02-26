// ============================================
// OrdenaTEC — Configuración Routes
// ============================================

import { Router } from 'express';
import * as configuracionController from '../controllers/configuracion.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validation.middleware';
import { configuracionSchema, validarCompatibilidadSchema } from '../utils/validators';

const router = Router();

// POST /api/configuraciones/validar — Validar compatibilidad (público)
// NOTA: Esta ruta debe ir ANTES de /:id para evitar conflictos
router.post(
    '/validar',
    validateBody(validarCompatibilidadSchema),
    configuracionController.validar
);

// GET /api/configuraciones/usuario — Listar del usuario (autenticado)
router.get('/usuario', authMiddleware, configuracionController.listarPorUsuario);

// POST /api/configuraciones — Guardar configuración
router.post(
    '/',
    authMiddleware,
    validateBody(configuracionSchema),
    configuracionController.crear
);

// GET /api/configuraciones/:id — Obtener por ID
router.get('/:id', configuracionController.obtenerPorId);

// PUT /api/configuraciones/:id — Actualizar
router.put(
    '/:id',
    authMiddleware,
    validateBody(configuracionSchema),
    configuracionController.actualizar
);

export default router;
