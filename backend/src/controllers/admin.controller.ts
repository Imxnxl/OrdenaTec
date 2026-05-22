import { Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../types';

export const listarPedidos = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const pagina = Math.max(1, parseInt(req.query.pagina as string) || 1);
        const porPagina = Math.min(100, Math.max(1, parseInt(req.query.porPagina as string) || 20));
        const estado = req.query.estado as string | undefined;

        const where: any = {};
        if (estado) where.estado = estado;

        const [pedidos, total] = await Promise.all([
            prisma.pedido.findMany({
                where,
                include: {
                    usuario: { select: { id: true, nombre: true, email: true } },
                    configuracion: {
                        include: { componentes: { include: { componente: true } } },
                    },
                    pagos: true,
                },
                orderBy: { createdAt: 'desc' },
                skip: (pagina - 1) * porPagina,
                take: porPagina,
            }),
            prisma.pedido.count({ where }),
        ]);

        res.json({
            datos: pedidos,
            total,
            pagina,
            porPagina,
            totalPaginas: Math.ceil(total / porPagina),
        });
    } catch (error) {
        next(error);
    }
};

export const listarUsuarios = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const usuarios = await prisma.usuario.findMany({
            select: {
                id: true,
                email: true,
                nombre: true,
                rol: true,
                createdAt: true,
                _count: { select: { pedidos: true, configuraciones: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(usuarios);
    } catch (error) {
        next(error);
    }
};

export const actualizarRol = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const { rol } = req.body;

        if (!['CLIENTE', 'ADMIN'].includes(rol)) {
            res.status(400).json({ error: 'Rol inválido', mensaje: 'El rol debe ser CLIENTE o ADMIN' });
            return;
        }

        const usuario = await prisma.usuario.update({
            where: { id },
            data: { rol },
            select: { id: true, email: true, nombre: true, rol: true },
        });

        res.json({ mensaje: `Rol actualizado a ${rol}`, usuario });
    } catch (error) {
        next(error);
    }
};

export const crearPrearmada = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { nombre, categoria, descripcion, imagenUrl, destacada, componenteIds } = req.body;

        if (!componenteIds || !Array.isArray(componenteIds) || componenteIds.length === 0) {
            res.status(400).json({ error: 'Datos inválidos', mensaje: 'Debe incluir al menos un componente' });
            return;
        }

        const componentes = await prisma.componente.findMany({
            where: { id: { in: componenteIds } },
        });

        if (componentes.length !== componenteIds.length) {
            res.status(400).json({ error: 'Datos inválidos', mensaje: 'Uno o más componentes no existen' });
            return;
        }

        // Validar que se incluyan los tipos esenciales
        const tiposIncluidos = new Set<string>(componentes.map((c) => c.tipo));
        const REQUERIDOS = ['CPU', 'MOTHERBOARD', 'RAM', 'GPU', 'ALMACENAMIENTO', 'PSU', 'GABINETE'];
        const faltantes = REQUERIDOS.filter((t) => !tiposIncluidos.has(t));
        if (faltantes.length > 0) {
            res.status(400).json({
                error: 'Componentes incompletos',
                mensaje: `Faltan tipos requeridos: ${faltantes.join(', ')}`,
            });
            return;
        }

        const precioTotal = componentes.reduce((s, c) => s + c.precio, 0);

        const configuracion = await prisma.configuracion.create({
            data: {
                nombre,
                esPrearmada: true,
                categoria: categoria || null,
                descripcion: descripcion || null,
                imagenUrl: imagenUrl || null,
                destacada: destacada || false,
                precioTotal,
                componentes: {
                    create: componenteIds.map((id: string) => ({ componenteId: id })),
                },
            },
            include: {
                componentes: { include: { componente: true } },
            },
        });

        res.status(201).json({ mensaje: 'PC pre-armada creada', configuracion });
    } catch (error) {
        next(error);
    }
};

export const actualizarPrearmada = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const { nombre, categoria, descripcion, imagenUrl, destacada, componenteIds } = req.body;

        const existente = await prisma.configuracion.findFirst({
            where: { id, esPrearmada: true },
        });
        if (!existente) {
            res.status(404).json({ error: 'No encontrada', mensaje: 'La PC pre-armada no existe' });
            return;
        }

        let precioTotal = existente.precioTotal;

        if (componenteIds && Array.isArray(componenteIds)) {
            const componentes = await prisma.componente.findMany({
                where: { id: { in: componenteIds } },
            });

            // Validar tipos requeridos
            const tiposIncluidos = new Set<string>(componentes.map((c) => c.tipo));
            const REQUERIDOS = ['CPU', 'MOTHERBOARD', 'RAM', 'GPU', 'ALMACENAMIENTO', 'PSU', 'GABINETE'];
            const faltantes = REQUERIDOS.filter((t) => !tiposIncluidos.has(t));
            if (faltantes.length > 0) {
                res.status(400).json({
                    error: 'Componentes incompletos',
                    mensaje: `Faltan tipos requeridos: ${faltantes.join(', ')}`,
                });
                return;
            }

            precioTotal = componentes.reduce((s, c) => s + c.precio, 0);

            await prisma.configuracionComponente.deleteMany({ where: { configuracionId: id } });
        }

        const configuracion = await prisma.configuracion.update({
            where: { id },
            data: {
                nombre: nombre ?? existente.nombre,
                categoria: categoria !== undefined ? categoria : existente.categoria,
                descripcion: descripcion !== undefined ? descripcion : existente.descripcion,
                imagenUrl: imagenUrl !== undefined ? imagenUrl : existente.imagenUrl,
                destacada: destacada !== undefined ? destacada : existente.destacada,
                precioTotal,
                ...(componenteIds && Array.isArray(componenteIds) ? {
                    componentes: {
                        create: componenteIds.map((cid: string) => ({ componenteId: cid })),
                    },
                } : {}),
            },
            include: {
                componentes: { include: { componente: true } },
            },
        });

        res.json({ mensaje: 'PC pre-armada actualizada', configuracion });
    } catch (error) {
        next(error);
    }
};

export const actualizarEstadoPedido = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!['PENDIENTE', 'PAGADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'].includes(estado)) {
            res.status(400).json({ error: 'Estado inválido', mensaje: 'Estado de pedido no válido' });
            return;
        }

        const pedido = await prisma.pedido.update({
            where: { id },
            data: { estado },
            include: {
                usuario: { select: { id: true, nombre: true, email: true } },
                pagos: true,
            },
        });

        res.json({ mensaje: `Pedido actualizado a ${estado}`, pedido });
    } catch (error) {
        next(error);
    }
};

export const eliminarPrearmada = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const existente = await prisma.configuracion.findFirst({
            where: { id, esPrearmada: true },
        });
        if (!existente) {
            res.status(404).json({ error: 'No encontrada', mensaje: 'La PC pre-armada no existe' });
            return;
        }
        await prisma.configuracion.delete({ where: { id } });
        res.json({ mensaje: 'PC pre-armada eliminada' });
    } catch (error) {
        next(error);
    }
};

export const estadisticas = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const [
            totalComponentes,
            totalPedidos,
            totalUsuarios,
            totalPrearmadas,
            ingresos,
            pedidosPorEstado,
            componentesBajoStock,
        ] = await Promise.all([
            prisma.componente.count({ where: { activo: true } }),
            prisma.pedido.count(),
            prisma.usuario.count(),
            prisma.configuracion.count({ where: { esPrearmada: true } }),
            prisma.pedido.aggregate({ _sum: { total: true } }),
            prisma.pedido.groupBy({
                by: ['estado'],
                _count: { estado: true },
            }),
            prisma.componente.findMany({
                where: { activo: true, stock: { lte: 5, gt: 0 } },
                select: { id: true, nombre: true, sku: true, stock: true },
                orderBy: { stock: 'asc' },
                take: 10,
            }),
        ]);

        res.json({
            totalComponentes,
            totalPedidos,
            totalUsuarios,
            totalPrearmadas,
            ingresosTotales: ingresos._sum.total || 0,
            pedidosPorEstado: pedidosPorEstado.map((p) => ({
                estado: p.estado,
                cantidad: p._count.estado,
            })),
            componentesBajoStock,
        });
    } catch (error) {
        next(error);
    }
};

export const exportarComponentes = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const componentes = await prisma.componente.findMany({
            where: { activo: true },
            orderBy: [{ tipo: 'asc' }, { nombre: 'asc' }],
        });

        const cabeceras = ['SKU', 'Nombre', 'Tipo', 'Precio', 'Stock', 'Activo'];
        const filas = componentes.map((c) =>
            [c.sku, c.nombre, c.tipo, c.precio, c.stock, c.activo ? 'Sí' : 'No'].join(',')
        );

        const csv = [cabeceras.join(','), ...filas].join('\n');

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=componentes.csv');
        res.send(csv);
    } catch (error) {
        next(error);
    }
};
