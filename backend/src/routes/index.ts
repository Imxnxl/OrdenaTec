// ============================================
// OrdenaTEC — Route Index
// Registra todas las rutas de la API.
// ============================================

import { Router } from 'express';
import authRoutes from './auth.routes';
import componenteRoutes from './componente.routes';
import configuracionRoutes from './configuracion.routes';
import pedidoRoutes from './pedido.routes';

const router = Router();

// Montar sub-routers
router.use('/auth', authRoutes);
router.use('/componentes', componenteRoutes);
router.use('/configuraciones', configuracionRoutes);
router.use('/pedidos', pedidoRoutes);

// Health check
router.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'OrdenaTEC API',
    });
});

export default router;
