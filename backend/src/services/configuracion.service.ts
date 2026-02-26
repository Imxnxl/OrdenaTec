// ============================================
// OrdenaTEC — Servicio de Configuración
// Lógica de negocio para crear, obtener y
// actualizar configuraciones de PC.
// ============================================

import { PrismaClient } from '@prisma/client';
import { CompatibilidadService } from './compatibilidad.service';
import { ResultadoCompatibilidad } from '../types';

const prisma = new PrismaClient();

/**
 * Servicio para gestionar configuraciones de PC armadas por el usuario.
 */
export class ConfiguracionService {
    /**
     * Crea una nueva configuración con los componentes seleccionados.
     * Calcula el precio total y el consumo estimado automáticamente.
     */
    static async crear(data: {
        nombre?: string;
        usuarioId?: string;
        componenteIds: string[];
    }) {
        // Obtener componentes para calcular totales
        const componentes = await prisma.componente.findMany({
            where: { id: { in: data.componenteIds } },
        });

        if (componentes.length !== data.componenteIds.length) {
            throw Object.assign(
                new Error('Uno o más componentes no existen'),
                { statusCode: 400 }
            );
        }

        const precioTotal = CompatibilidadService.calcularPrecioTotal(componentes);
        const consumoEstimado = CompatibilidadService.calcularConsumoTotal(componentes);

        const configuracion = await prisma.configuracion.create({
            data: {
                nombre: data.nombre,
                usuarioId: data.usuarioId,
                precioTotal,
                consumoEstimado,
                componentes: {
                    create: data.componenteIds.map((componenteId) => ({
                        componenteId,
                    })),
                },
            },
            include: {
                componentes: {
                    include: { componente: true },
                },
            },
        });

        return configuracion;
    }

    /**
     * Obtiene una configuración por ID con todos sus componentes.
     */
    static async obtenerPorId(id: string) {
        const configuracion = await prisma.configuracion.findUnique({
            where: { id },
            include: {
                componentes: {
                    include: { componente: true },
                },
                usuario: {
                    select: { id: true, nombre: true, email: true },
                },
            },
        });

        if (!configuracion) {
            throw Object.assign(
                new Error('Configuración no encontrada'),
                { statusCode: 404 }
            );
        }

        return configuracion;
    }

    /**
     * Lista todas las configuraciones de un usuario.
     */
    static async listarPorUsuario(usuarioId: string) {
        return prisma.configuracion.findMany({
            where: { usuarioId },
            include: {
                componentes: {
                    include: { componente: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Valida la compatibilidad de un conjunto de componentes (por IDs).
     * Retorna el resultado de compatibilidad + precio total + consumo estimado.
     */
    static async validarComponentes(componenteIds: string[]): Promise<{
        compatibilidad: ResultadoCompatibilidad;
        precioTotal: number;
        consumoEstimado: number;
    }> {
        const componentes = await prisma.componente.findMany({
            where: { id: { in: componenteIds } },
        });

        if (componentes.length === 0) {
            throw Object.assign(
                new Error('No se encontraron componentes con los IDs proporcionados'),
                { statusCode: 400 }
            );
        }

        const compatibilidad = CompatibilidadService.validarConfiguracion(componentes);
        const precioTotal = CompatibilidadService.calcularPrecioTotal(componentes);
        const consumoEstimado = CompatibilidadService.calcularConsumoTotal(componentes);

        return { compatibilidad, precioTotal, consumoEstimado };
    }

    /**
     * Actualiza una configuración existente con nuevos componentes.
     */
    static async actualizar(
        id: string,
        data: { nombre?: string; componenteIds: string[] }
    ) {
        // Verificar que la configuración exista
        const existente = await prisma.configuracion.findUnique({ where: { id } });
        if (!existente) {
            throw Object.assign(
                new Error('Configuración no encontrada'),
                { statusCode: 404 }
            );
        }

        // Obtener componentes para calcular totales
        const componentes = await prisma.componente.findMany({
            where: { id: { in: data.componenteIds } },
        });

        const precioTotal = CompatibilidadService.calcularPrecioTotal(componentes);
        const consumoEstimado = CompatibilidadService.calcularConsumoTotal(componentes);

        // Eliminar relaciones anteriores y crear las nuevas
        await prisma.configuracionComponente.deleteMany({
            where: { configuracionId: id },
        });

        const configuracion = await prisma.configuracion.update({
            where: { id },
            data: {
                nombre: data.nombre ?? existente.nombre,
                precioTotal,
                consumoEstimado,
                componentes: {
                    create: data.componenteIds.map((componenteId) => ({
                        componenteId,
                    })),
                },
            },
            include: {
                componentes: {
                    include: { componente: true },
                },
            },
        });

        return configuracion;
    }

    /**
     * Elimina una configuración.
     */
    static async eliminar(id: string) {
        await prisma.configuracion.delete({ where: { id } });
    }
}
