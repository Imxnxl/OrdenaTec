// ============================================
// OrdenaTEC — Validators (Zod Schemas)
// Centralized validation schemas using Zod.
// ============================================

import { z } from 'zod';

/**
 * Schema de registro de usuario
 */
export const registroSchema = z.object({
    email: z.string().email('Email inválido'),
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
    password: z
        .string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .max(128),
});

/**
 * Schema de login
 */
export const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'La contraseña es requerida'),
});

/**
 * Enum de tipos de componentes para validación
 */
const tipoComponenteEnum = z.enum([
    'CPU',
    'MOTHERBOARD',
    'RAM',
    'GPU',
    'ALMACENAMIENTO',
    'PSU',
    'GABINETE',
    'MONITOR',
    'TECLADO',
    'MOUSE',
    'AUDIFONOS',
    'SILLA',
    'MOUSEPAD',
    'WEBCAM',
    'MICROFONO',
    'BOCINAS',
]);

/**
 * Enum de tipo de vivienda para la dirección de envío.
 */
const tipoViviendaEnum = z.enum(['CASA', 'DEPARTAMENTO', 'OFICINA', 'OTRO']);

/**
 * Schema para crear/actualizar un componente
 */
export const componenteSchema = z.object({
    sku: z.string().min(1, 'SKU requerido').max(50),
    nombre: z.string().min(1, 'Nombre requerido').max(200),
    tipo: tipoComponenteEnum,
    precio: z.number().positive('El precio debe ser positivo'),
    stock: z.number().int().min(0, 'El stock no puede ser negativo'),
    atributos: z.record(z.unknown()),
    imagenUrl: z.string().url().optional().nullable(),
    activo: z.boolean().optional(),
});

/**
 * Schema para actualización parcial de componente
 */
export const componenteUpdateSchema = componenteSchema.partial();

/**
 * Schema para crear una configuración
 */
export const configuracionSchema = z.object({
    nombre: z.string().max(200).optional(),
    componenteIds: z
        .array(z.string().uuid('ID de componente inválido'))
        .min(1, 'Debe incluir al menos un componente'),
});

/**
 * Schema para validar compatibilidad
 */
export const validarCompatibilidadSchema = z.object({
    componenteIds: z
        .array(z.string().uuid('ID de componente inválido'))
        .min(1, 'Debe incluir al menos un componente'),
});

/**
 * Schema para crear un pedido (dirección desglosada).
 */
export const pedidoSchema = z
    .object({
        configuracionId: z.string().uuid('ID de configuración inválido').optional(),
        componenteIds: z.array(z.string().uuid('ID de componente inválido')).optional(),
        total: z.number().positive().optional(),
        metodoPago: z.string().min(1, 'Método de pago requerido'),

        // ---- Dirección desglosada ----
        // El nombre completo (legacy) sigue siendo obligatorio para retrocompat;
        // los campos de pila/apellidos son opcionales y se llenan en pedidos nuevos.
        nombreDestinatario: z.string().min(2, 'Nombre del destinatario requerido').max(150),
        nombreDestinatarioPila: z.string().max(100).optional().nullable(),
        apellidoPaterno: z.string().max(100).optional().nullable(),
        apellidoMaterno: z.string().max(100).optional().nullable(),
        telefonoContacto: z
            .string()
            .min(7, 'Teléfono inválido')
            .max(20)
            .regex(/^[0-9+\s()-]+$/, 'Teléfono contiene caracteres inválidos'),
        telefonoAlternativo: z
            .string()
            .max(20)
            .regex(/^[0-9+\s()-]+$/, 'Teléfono alternativo contiene caracteres inválidos')
            .optional()
            .nullable()
            .or(z.literal('')),
        calle: z.string().min(2, 'Calle requerida').max(200),
        numeroExterior: z.string().min(1, 'Número exterior requerido').max(20),
        numeroInterior: z.string().max(20).optional().nullable(),
        entreCalles: z.string().max(200).optional().nullable(),
        colonia: z.string().min(2, 'Colonia requerida').max(150),
        alcaldiaMunicipio: z.string().max(100).optional().nullable(),
        ciudad: z.string().min(2, 'Ciudad requerida').max(100),
        estadoEnvio: z.string().min(2, 'Estado requerido').max(100),
        codigoPostal: z
            .string()
            .min(4, 'Código postal inválido')
            .max(10)
            .regex(/^[0-9A-Za-z\s-]+$/, 'Código postal inválido'),
        pais: z.string().min(2, 'País requerido').max(80),
        tipoVivienda: tipoViviendaEnum.optional().nullable(),
        referenciasEnvio: z.string().max(300).optional().nullable(),
    })
    .refine((data) => data.configuracionId || (data.componenteIds && data.componenteIds.length > 0), {
        message: 'Debes proporcionar configuracionId o una lista de componenteIds',
        path: ['configuracionId'],
    });

/**
 * Schema para actualizar estado de pedido
 */
export const estadoPedidoSchema = z.object({
    estado: z.enum(['PENDIENTE', 'PAGADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO']),
});

/**
 * Schema para filtros de búsqueda de componentes
 */
export const filtrosComponenteSchema = z.object({
    tipo: tipoComponenteEnum.optional(),
    precioMin: z.coerce.number().positive().optional(),
    precioMax: z.coerce.number().positive().optional(),
    enStock: z.coerce.boolean().optional(),
    busqueda: z.string().max(200).optional(),
    pagina: z.coerce.number().int().positive().optional().default(1),
    porPagina: z.coerce.number().int().positive().max(100).optional().default(20),
});
