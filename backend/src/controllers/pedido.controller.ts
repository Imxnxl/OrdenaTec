// ============================================
// OrdenaTEC — Pedido Controller
// Gestión de pedidos (órdenes de compra).
// ============================================

import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

/**
 * POST /api/pedidos
 * Crea un nuevo pedido a partir del carrito/configuración.
 */
export const crear = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                error: 'No autenticado',
                mensaje: 'Debe iniciar sesión para crear un pedido',
            });
            return;
        }

        const { configuracionId, direccionEnvio, metodoPago } = req.body;

        // Obtener configuración para calcular total
        let total = 0;
        if (configuracionId) {
            const configuracion = await prisma.configuracion.findUnique({
                where: { id: configuracionId },
            });
            if (!configuracion) {
                res.status(404).json({
                    error: 'Configuración no encontrada',
                    mensaje: 'La configuración especificada no existe',
                });
                return;
            }
            total = configuracion.precioTotal;
        }

        // Crear pedido con transacción
        const pedido = await prisma.$transaction(async (tx) => {
            const nuevoPedido = await tx.pedido.create({
                data: {
                    usuarioId: req.user!.userId,
                    configuracionId,
                    estado: 'PENDIENTE',
                    total,
                    direccionEnvio,
                },
                include: {
                    configuracion: {
                        include: {
                            componentes: { include: { componente: true } },
                        },
                    },
                },
            });

            // Crear registro de pago simulado
            await tx.pago.create({
                data: {
                    pedidoId: nuevoPedido.id,
                    monto: total,
                    metodo: metodoPago || 'simulado',
                    estado: 'COMPLETADO', // Pago simulado: se marca como completado
                },
            });

            // Actualizar estado del pedido a PAGADO (simulado)
            return tx.pedido.update({
                where: { id: nuevoPedido.id },
                data: { estado: 'PAGADO' },
                include: {
                    configuracion: {
                        include: {
                            componentes: { include: { componente: true } },
                        },
                    },
                    pagos: true,
                },
            });
        });

        res.status(201).json({
            mensaje: 'Pedido creado exitosamente',
            pedido,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/pedidos
 * Lista los pedidos del usuario autenticado.
 */
export const listar = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                error: 'No autenticado',
                mensaje: 'Debe iniciar sesión para ver sus pedidos',
            });
            return;
        }

        const pedidos = await prisma.pedido.findMany({
            where: { usuarioId: req.user.userId },
            include: {
                configuracion: {
                    include: {
                        componentes: { include: { componente: true } },
                    },
                },
                pagos: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(pedidos);
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/pedidos/:id
 * Obtiene un pedido por ID.
 */
export const obtenerPorId = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const pedido = await prisma.pedido.findUnique({
            where: { id: req.params.id },
            include: {
                usuario: {
                    select: { id: true, nombre: true, email: true },
                },
                configuracion: {
                    include: {
                        componentes: { include: { componente: true } },
                    },
                },
                pagos: true,
            },
        });

        if (!pedido) {
            res.status(404).json({
                error: 'Pedido no encontrado',
                mensaje: 'El pedido especificado no existe',
            });
            return;
        }

        // Verificar que el pedido pertenece al usuario (o es admin)
        if (req.user && req.user.userId !== pedido.usuarioId && req.user.rol !== 'ADMIN') {
            res.status(403).json({
                error: 'Acceso denegado',
                mensaje: 'No tiene permisos para ver este pedido',
            });
            return;
        }

        res.json(pedido);
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /api/pedidos/:id/estado (admin)
 * Actualiza el estado de un pedido.
 */
export const actualizarEstado = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { estado } = req.body;

        const pedido = await prisma.pedido.update({
            where: { id: req.params.id },
            data: { estado },
            include: {
                usuario: {
                    select: { id: true, nombre: true, email: true },
                },
                pagos: true,
            },
        });

        res.json({
            mensaje: `Estado del pedido actualizado a ${estado}`,
            pedido,
        });
    } catch (error) {
        next(error);
    }
};
