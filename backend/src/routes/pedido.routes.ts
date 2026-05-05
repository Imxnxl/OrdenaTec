// ============================================
// OrdenaTEC — Pedido Routes
// ============================================

import { Router } from 'express';
import * as pedidoController from '../controllers/pedido.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';
import { validateBody } from '../middlewares/validation.middleware';
import { pedidoSchema, estadoPedidoSchema } from '../utils/validators';

const router = Router();

// POST /api/pedidos — Crear pedido (autenticado)
router.post(
    '/',
    authMiddleware,
    validateBody(pedidoSchema),
    pedidoController.crear
);

// GET /api/pedidos — Listar pedidos del usuario (autenticado)
router.get('/', authMiddleware, pedidoController.listar);

// GET /api/pedidos/:id — Obtener pedido por ID (autenticado)
router.get('/:id', authMiddleware, pedidoController.obtenerPorId);

// PUT /api/pedidos/:id/estado — Actualizar estado (admin)
router.put(
    '/:id/estado',
    authMiddleware,
    adminMiddleware,
    validateBody(estadoPedidoSchema),
    pedidoController.actualizarEstado
);

export default router;
