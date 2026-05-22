// ============================================
// OrdenaTEC — Pedido Controller
// Gestión de pedidos (órdenes de compra).
// ============================================

import { Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../types';

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

        const {
            configuracionId,
            componenteIds,
            metodoPago,
            cantidad: cantidadRaw,
            total: totalEnviado,
            // ---- Dirección de envío (legacy + desglosada) ----
            nombreDestinatario,
            nombreDestinatarioPila,
            apellidoPaterno,
            apellidoMaterno,
            telefonoContacto,
            telefonoAlternativo,
            calle,
            numeroExterior,
            numeroInterior,
            entreCalles,
            colonia,
            alcaldiaMunicipio,
            ciudad,
            estadoEnvio,
            codigoPostal,
            pais,
            tipoVivienda,
            referenciasEnvio,
        } = req.body;

        const cantidad = Math.max(1, parseInt(cantidadRaw as string) || 1);

        // Determinar el total y la configuración
        let total = 0;
        let configId = configuracionId;

        if (configuracionId) {
            // Pedido basado en una configuración existente
            const configuracion = await prisma.configuracion.findUnique({
                where: { id: configuracionId },
                include: { componentes: { include: { componente: true } } },
            });
            if (!configuracion) {
                res.status(404).json({
                    error: 'Configuración no encontrada',
                    mensaje: 'La configuración especificada no existe',
                });
                return;
            }
            total = configuracion.precioTotal * cantidad;
        } else if (componenteIds && componenteIds.length > 0) {
            // Pedido basado en componentes sueltos (carrito temporal)
            const componentes = await prisma.componente.findMany({
                where: { id: { in: componenteIds } },
            });

            if (componentes.length !== componenteIds.length) {
                res.status(400).json({
                    error: 'Componentes inválidos',
                    mensaje: 'Uno o más componentes no existen',
                });
                return;
            }

            total = componentes.reduce((sum: number, c: any) => sum + c.precio, 0) * cantidad;

            const config = await prisma.configuracion.create({
                data: {
                    nombre: 'Pedido desde carrito',
                    usuarioId: req.user!.userId,
                    precioTotal: total,
                    componentes: {
                        create: componenteIds.map((cId: string) => ({
                            componenteId: cId,
                        })),
                    },
                },
            });
            configId = config.id;
        } else if (totalEnviado && totalEnviado > 0) {
            total = totalEnviado;
        }

        if (total <= 0) {
            res.status(400).json({
                error: 'Total inválido',
                mensaje: 'El pedido debe tener un total mayor a 0',
            });
            return;
        }

        // Crear pedido con transacción (incluye descuento de stock)
        const pedido = await prisma.$transaction(async (tx) => {
            // Descontar stock de los componentes (x cantidad)
            if (configId) {
                const configConComponentes = await tx.configuracion.findUnique({
                    where: { id: configId },
                    include: { componentes: { include: { componente: true } } },
                });

                if (configConComponentes) {
                    for (const cc of configConComponentes.componentes) {
                        if (cc.componente.stock < cantidad) {
                            throw Object.assign(
                                new Error(`Stock insuficiente de ${cc.componente.nombre}: disponible ${cc.componente.stock}, requerido ${cantidad}`),
                                { statusCode: 400 }
                            );
                        }
                        await tx.componente.update({
                            where: { id: cc.componente.id },
                            data: { stock: { decrement: cantidad } },
                        });
                    }
                }
            }

            const nuevoPedido = await tx.pedido.create({
                data: {
                    usuarioId: req.user!.userId,
                    configuracionId: configId,
                    estado: 'PENDIENTE',
                    total,
                    // Legacy: nombre completo en un solo campo (se mantiene por compat).
                    nombreDestinatario,
                    nombreDestinatarioPila: nombreDestinatarioPila || null,
                    apellidoPaterno: apellidoPaterno || null,
                    apellidoMaterno: apellidoMaterno || null,
                    telefonoContacto,
                    telefonoAlternativo: telefonoAlternativo || null,
                    calle,
                    numeroExterior,
                    numeroInterior: numeroInterior || null,
                    entreCalles: entreCalles || null,
                    colonia,
                    alcaldiaMunicipio: alcaldiaMunicipio || null,
                    ciudad,
                    estadoEnvio,
                    codigoPostal,
                    pais,
                    tipoVivienda: tipoVivienda || null,
                    referenciasEnvio: referenciasEnvio || null,
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
                    estado: 'COMPLETADO',
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
        if (!req.user || (req.user.userId !== pedido.usuarioId && req.user.rol !== 'ADMIN')) {
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
/**
 * POST /api/pedidos/batch
 * Crea múltiples pedidos en una sola transacción (carrito completo).
 */
export const crearBatch = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'No autenticado', mensaje: 'Debe iniciar sesión' });
            return;
        }

        const { items, ...datosComunes } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            res.status(400).json({ error: 'Datos inválidos', mensaje: 'Debe incluir al menos un item' });
            return;
        }

        const pedidos = await prisma.$transaction(async (tx) => {
            const resultados = [];

            for (const item of items) {
                const cantidad = Math.max(1, parseInt(item.cantidad as string) || 1);
                const configId = item.configuracionId;

                if (!configId) {
                    throw Object.assign(new Error('Cada item debe tener un configuracionId'), { statusCode: 400 });
                }

                // Validar que la configuración existe y pertenece al usuario
                const configExistente = await tx.configuracion.findUnique({
                    where: { id: configId },
                    include: { componentes: { include: { componente: true } } },
                });

                if (!configExistente) {
                    throw Object.assign(new Error(`Configuración ${configId} no encontrada`), { statusCode: 404 });
                }

                const total = configExistente.precioTotal * cantidad;

                // Descontar stock
                for (const cc of configExistente.componentes) {
                    if (cc.componente.stock < cantidad) {
                        throw Object.assign(
                            new Error(`Stock insuficiente de ${cc.componente.nombre}: disponible ${cc.componente.stock}, requerido ${cantidad}`),
                            { statusCode: 400 }
                        );
                    }
                    await tx.componente.update({
                        where: { id: cc.componente.id },
                        data: { stock: { decrement: cantidad } },
                    });
                }

                const nuevoPedido = await tx.pedido.create({
                    data: {
                        usuarioId: req.user!.userId,
                        configuracionId: configId,
                        estado: 'PENDIENTE',
                        total,
                        nombreDestinatario: datosComunes.nombreDestinatario,
                        nombreDestinatarioPila: datosComunes.nombreDestinatarioPila || null,
                        apellidoPaterno: datosComunes.apellidoPaterno || null,
                        apellidoMaterno: datosComunes.apellidoMaterno || null,
                        telefonoContacto: datosComunes.telefonoContacto,
                        telefonoAlternativo: datosComunes.telefonoAlternativo || null,
                        calle: datosComunes.calle,
                        numeroExterior: datosComunes.numeroExterior,
                        numeroInterior: datosComunes.numeroInterior || null,
                        entreCalles: datosComunes.entreCalles || null,
                        colonia: datosComunes.colonia,
                        alcaldiaMunicipio: datosComunes.alcaldiaMunicipio || null,
                        ciudad: datosComunes.ciudad,
                        estadoEnvio: datosComunes.estadoEnvio,
                        codigoPostal: datosComunes.codigoPostal,
                        pais: datosComunes.pais,
                        tipoVivienda: datosComunes.tipoVivienda || null,
                        referenciasEnvio: datosComunes.referenciasEnvio || null,
                    },
                });

                await tx.pago.create({
                    data: {
                        pedidoId: nuevoPedido.id,
                        monto: total,
                        metodo: datosComunes.metodoPago || 'simulado',
                        estado: 'COMPLETADO',
                    },
                });

                const pedidoFinal = await tx.pedido.update({
                    where: { id: nuevoPedido.id },
                    data: { estado: 'PAGADO' },
                    include: {
                        configuracion: {
                            include: { componentes: { include: { componente: true } } },
                        },
                        pagos: true,
                    },
                });

                resultados.push(pedidoFinal);
            }

            return resultados;
        });

        res.status(201).json({ mensaje: 'Pedidos creados exitosamente', pedidos });
    } catch (error) {
        next(error);
    }
};

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
