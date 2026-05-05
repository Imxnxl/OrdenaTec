// ============================================
// OrdenaTEC — IA Routes
// Rutas para el configurador con IA.
// ============================================

import { Router } from 'express';
import * as iaController from '../controllers/ia.controller';

const router = Router();

// Público (no requiere auth para demo)
router.post('/configurar', iaController.configurar);

export default router;
