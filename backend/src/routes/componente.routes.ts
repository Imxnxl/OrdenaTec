// ============================================
// OrdenaTEC — Componente Routes
// ============================================

import { Router } from 'express';
import * as componenteController from '../controllers/componente.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';
import { validateBody } from '../middlewares/validation.middleware';
import { componenteSchema, componenteUpdateSchema } from '../utils/validators';

const router = Router();

// GET /api/componentes — Listar (público, con filtros)
router.get('/', componenteController.listar);

// GET /api/componentes/compatibles — Listar filtrando incompatibles (público)
router.get('/compatibles', componenteController.listarCompatibles);

// GET /api/componentes/:id — Obtener por ID (público)
router.get('/:id', componenteController.obtenerPorId);

// GET /api/componentes/:id/alternativas — Alternativas compatibles (público)
router.get('/:id/alternativas', componenteController.obtenerAlternativas);

// POST /api/componentes — Crear (admin)
router.post(
    '/',
    authMiddleware,
    adminMiddleware,
    validateBody(componenteSchema),
    componenteController.crear
);

// PUT /api/componentes/:id — Actualizar (admin)
router.put(
    '/:id',
    authMiddleware,
    adminMiddleware,
    validateBody(componenteUpdateSchema),
    componenteController.actualizar
);

// DELETE /api/componentes/:id — Desactivar (admin)
router.delete(
    '/:id',
    authMiddleware,
    adminMiddleware,
    componenteController.eliminar
);

export default router;
