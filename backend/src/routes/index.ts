// ============================================
// OrdenaTEC — Route Index
// Registra todas las rutas de la API.
// ============================================

import { Router } from 'express';
import authRoutes from './auth.routes';
import componenteRoutes from './componente.routes';
import configuracionRoutes from './configuracion.routes';
import pedidoRoutes from './pedido.routes';
import prearmadaRoutes from './prearmada.routes';
import iaRoutes from './ia.routes';
import benchmarkRoutes from './benchmark.routes';

const router = Router();

// Montar sub-routers
router.use('/auth', authRoutes);
router.use('/componentes', componenteRoutes);
router.use('/configuraciones', configuracionRoutes);
router.use('/pedidos', pedidoRoutes);
router.use('/prearmadas', prearmadaRoutes);
router.use('/ia', iaRoutes);
router.use('/benchmarks', benchmarkRoutes);

// Health check
router.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'OrdenaTEC API',
    });
});

export default router;

