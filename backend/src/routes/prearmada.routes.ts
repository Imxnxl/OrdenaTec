// ============================================
// OrdenaTEC — Prearmada Routes
// Rutas para computadoras pre-armadas.
// ============================================

import { Router } from 'express';
import * as prearmadaController from '../controllers/prearmada.controller';

const router = Router();

// Públicas
router.get('/', prearmadaController.listar);
router.get('/:id', prearmadaController.obtenerPorId);

export default router;
