import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const router = Router();

// Todas las rutas admin requieren autenticación + rol ADMIN
router.use(authMiddleware, adminMiddleware);

// Pedidos
router.get('/pedidos', adminController.listarPedidos);
router.put('/pedidos/:id/estado', adminController.actualizarEstadoPedido);

// Usuarios
router.get('/usuarios', adminController.listarUsuarios);
router.put('/usuarios/:id/rol', adminController.actualizarRol);

// Pre-armadas
router.post('/prearmadas', adminController.crearPrearmada);
router.put('/prearmadas/:id', adminController.actualizarPrearmada);
router.delete('/prearmadas/:id', adminController.eliminarPrearmada);

// Estadísticas
router.get('/estadisticas', adminController.estadisticas);

// Exportar
router.get('/exportar/componentes', adminController.exportarComponentes);

export default router;
