// ============================================
// OrdenaTEC — Benchmark Routes
// Rutas para estimación de rendimiento.
// ============================================

import { Router } from 'express';
import * as benchmarkController from '../controllers/benchmark.controller';

const router = Router();

// Público
router.post('/estimar', benchmarkController.estimar);

export default router;
