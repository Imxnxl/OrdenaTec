// ============================================
// OrdenaTEC — Shared Types
// Type definitions used across the backend.
// ============================================

import { Request } from 'express';

/**
 * Roles de usuario
 */
export enum Rol {
    CLIENTE = 'CLIENTE',
    ADMIN = 'ADMIN',
}

/**
 * Tipos de componentes de PC
 */
export enum TipoComponente {
    CPU = 'CPU',
    MOTHERBOARD = 'MOTHERBOARD',
    RAM = 'RAM',
    GPU = 'GPU',
    ALMACENAMIENTO = 'ALMACENAMIENTO',
    PSU = 'PSU',
    GABINETE = 'GABINETE',
}

/**
 * Estados de un pedido
 */
export enum EstadoPedido {
    PENDIENTE = 'PENDIENTE',
    PAGADO = 'PAGADO',
    ENVIADO = 'ENVIADO',
    ENTREGADO = 'ENTREGADO',
    CANCELADO = 'CANCELADO',
}

/**
 * Payload del JWT decodificado
 */
export interface JwtPayload {
    userId: string;
    email: string;
    rol: Rol;
}

/**
 * Request autenticado (con usuario adjunto)
 */
export interface AuthRequest extends Request {
    user?: JwtPayload;
}

/**
 * Atributos específicos por tipo de componente.
 * Se almacenan como JSON en la BD.
 */
export interface AtributosCPU {
    socket: string;        // e.g. "AM5", "LGA1700"
    nucleos: number;
    hilos: number;
    frecuenciaBase: number; // GHz
    frecuenciaBoost?: number;
    consumo: number;       // Watts (TDP)
    generacion?: string;
}

export interface AtributosMotherboard {
    socket: string;
    chipset: string;
    factorForma: string;   // "ATX", "Micro-ATX", "Mini-ITX"
    tipoRAM: string;       // "DDR4", "DDR5"
    ranurasPCIe: number;
    slotsRAM: number;
    slotsM2: number;
}

export interface AtributosRAM {
    tipo: string;           // "DDR4", "DDR5"
    capacidadGB: number;
    velocidadMHz: number;
    modulos: number;        // e.g. 2 (para kit 2x8GB)
    consumo: number;        // Watts
}

export interface AtributosGPU {
    chipset: string;
    memoriaGB: number;
    tipoMemoria: string;    // "GDDR6", "GDDR6X"
    consumo: number;        // Watts (TDP)
    longitudMM: number;     // Longitud en mm
    slotsPCIe: number;
}

export interface AtributosPSU {
    potenciaW: number;      // Watts totales
    certificacion: string;  // "80+ Bronze", "80+ Gold", etc.
    modular: boolean;
}

export interface AtributosGabinete {
    factorForma: string;    // Factores de forma soportados (ATX, M-ATX, etc.)
    maxLongitudGPUMM: number; // Longitud máxima de GPU en mm
    bahias35: number;
    bahias25: number;
    ventiladores: number;
}

export interface AtributosAlmacenamiento {
    tipo: string;           // "SSD", "HDD", "NVMe"
    capacidadGB: number;
    interfaz: string;       // "SATA", "PCIe 4.0", "PCIe 5.0"
    consumo: number;        // Watts
}

/**
 * Resultado de una validación de compatibilidad
 */
export interface ResultadoCompatibilidad {
    compatible: boolean;
    errores: string[];
    advertencias: string[];
}

/**
 * Filtros para la búsqueda de componentes
 */
export interface FiltrosComponente {
    tipo?: TipoComponente;
    precioMin?: number;
    precioMax?: number;
    enStock?: boolean;
    busqueda?: string;
    pagina?: number;
    porPagina?: number;
}

/**
 * Respuesta paginada genérica
 */
export interface RespuestaPaginada<T> {
    datos: T[];
    total: number;
    pagina: number;
    porPagina: number;
    totalPaginas: number;
}
