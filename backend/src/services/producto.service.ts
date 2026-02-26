// ============================================
// OrdenaTEC — Servicio de Producto
// CRUD para componentes de PC con filtros
// y paginación.
// ============================================

import { PrismaClient, Prisma } from '@prisma/client';
import { FiltrosComponente, RespuestaPaginada } from '../types';
import { CompatibilidadService } from './compatibilidad.service';

const prisma = new PrismaClient();

/**
 * Servicio para gestionar el catálogo de componentes.
 */
export class ProductoService {
    /**
     * Lista componentes con filtros y paginación.
     */
    static async listar(filtros: FiltrosComponente): Promise<RespuestaPaginada<any>> {
        const pagina = filtros.pagina || 1;
        const porPagina = filtros.porPagina || 20;
        const skip = (pagina - 1) * porPagina;

        // Construir condiciones WHERE
        const where: Prisma.ComponenteWhereInput = {
            activo: true,
        };

        if (filtros.tipo) {
            where.tipo = filtros.tipo;
        }

        if (filtros.precioMin !== undefined || filtros.precioMax !== undefined) {
            where.precio = {};
            if (filtros.precioMin !== undefined) {
                where.precio.gte = filtros.precioMin;
            }
            if (filtros.precioMax !== undefined) {
                where.precio.lte = filtros.precioMax;
            }
        }

        if (filtros.enStock) {
            where.stock = { gt: 0 };
        }

        if (filtros.busqueda) {
            where.OR = [
                { nombre: { contains: filtros.busqueda, mode: 'insensitive' } },
                { sku: { contains: filtros.busqueda, mode: 'insensitive' } },
            ];
        }

        // Ejecutar consulta con paginación
        const [datos, total] = await Promise.all([
            prisma.componente.findMany({
                where,
                skip,
                take: porPagina,
                orderBy: { nombre: 'asc' },
            }),
            prisma.componente.count({ where }),
        ]);

        return {
            datos,
            total,
            pagina,
            porPagina,
            totalPaginas: Math.ceil(total / porPagina),
        };
    }

    /**
     * Obtiene un componente por ID.
     */
    static async obtenerPorId(id: string) {
        const componente = await prisma.componente.findUnique({
            where: { id },
        });

        if (!componente) {
            throw Object.assign(
                new Error('Componente no encontrado'),
                { statusCode: 404 }
            );
        }

        return componente;
    }

    /**
     * Crea un nuevo componente (admin).
     */
    static async crear(data: {
        sku: string;
        nombre: string;
        tipo: string;
        precio: number;
        stock: number;
        atributos: Record<string, unknown>;
        imagenUrl?: string | null;
        activo?: boolean;
    }) {
        return prisma.componente.create({
            data: {
                sku: data.sku,
                nombre: data.nombre,
                tipo: data.tipo as any,
                precio: data.precio,
                stock: data.stock,
                atributos: data.atributos as any,
                imagenUrl: data.imagenUrl,
                activo: data.activo ?? true,
            },
        });
    }

    /**
     * Actualiza un componente existente (admin).
     */
    static async actualizar(id: string, data: Partial<{
        sku: string;
        nombre: string;
        tipo: string;
        precio: number;
        stock: number;
        atributos: Record<string, unknown>;
        imagenUrl: string | null;
        activo: boolean;
    }>) {
        return prisma.componente.update({
            where: { id },
            data: data as any,
        });
    }

    /**
     * Desactiva un componente (soft delete, admin).
     */
    static async eliminar(id: string) {
        return prisma.componente.update({
            where: { id },
            data: { activo: false },
        });
    }

    /**
     * Obtiene componentes alternativos compatibles con la configuración actual.
     * HU-06: Sugerir alternativas compatibles.
     */
    static async obtenerAlternativas(
        tipo: string,
        componenteIdsActuales: string[]
    ) {
        // Obtener componentes actuales (excluyendo el tipo que se busca reemplazar)
        const componentesActuales = await prisma.componente.findMany({
            where: { id: { in: componenteIdsActuales } },
        });

        // Obtener candidatos del mismo tipo que estén en stock
        const candidatos = await prisma.componente.findMany({
            where: {
                tipo: tipo as any,
                activo: true,
                stock: { gt: 0 },
                id: { notIn: componenteIdsActuales },
            },
            orderBy: { precio: 'asc' },
            take: 10,
        });

        // Filtrar solo los compatibles con la configuración actual
        return CompatibilidadService.filtrarCompatibles(candidatos, componentesActuales);
    }
}
