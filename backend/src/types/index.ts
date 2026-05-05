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
 * Tipos de componentes de PC (incluye periféricos)
 */
export enum TipoComponente {
    CPU = 'CPU',
    MOTHERBOARD = 'MOTHERBOARD',
    RAM = 'RAM',
    GPU = 'GPU',
    ALMACENAMIENTO = 'ALMACENAMIENTO',
    PSU = 'PSU',
    GABINETE = 'GABINETE',
    MONITOR = 'MONITOR',
    TECLADO = 'TECLADO',
    MOUSE = 'MOUSE',
    AUDIFONOS = 'AUDIFONOS',
    SILLA = 'SILLA',
    MOUSEPAD = 'MOUSEPAD',
    WEBCAM = 'WEBCAM',
    MICROFONO = 'MICROFONO',
    BOCINAS = 'BOCINAS',
}

/**
 * Tipo de vivienda registrada para la dirección de envío.
 */
export enum TipoVivienda {
    CASA = 'CASA',
    DEPARTAMENTO = 'DEPARTAMENTO',
    OFICINA = 'OFICINA',
    OTRO = 'OTRO',
}

/**
 * Tipos que NO participan en las validaciones de compatibilidad
 * (los periféricos son independientes del build interno).
 */
export const TIPOS_PERIFERICOS: TipoComponente[] = [
    TipoComponente.MONITOR,
    TipoComponente.TECLADO,
    TipoComponente.MOUSE,
    TipoComponente.AUDIFONOS,
    TipoComponente.SILLA,
    TipoComponente.MOUSEPAD,
    TipoComponente.WEBCAM,
    TipoComponente.MICROFONO,
    TipoComponente.BOCINAS,
];

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

export interface AtributosMonitor {
    tamanoPulgadas: number;
    resolucion: string;       // "1920x1080", "2560x1440", "3840x2160"
    tasaRefresco: number;     // Hz
    panel: string;            // "IPS", "VA", "TN", "OLED"
    conectores?: string;
}

export interface AtributosTeclado {
    tipo: string;             // "Mecánico", "Membrana", "Óptico"
    layout: string;           // "Latinoamericano", "US"
    conexion: string;         // "USB", "Inalámbrico", "Bluetooth"
    rgb?: boolean;
}

export interface AtributosMouse {
    dpi: number;
    botones: number;
    conexion: string;         // "USB", "Inalámbrico", "Bluetooth"
    rgb?: boolean;
}

export interface AtributosAudifonos {
    tipo: string;             // "Over-ear", "On-ear", "In-ear"
    conexion: string;         // "3.5mm", "USB", "Inalámbrico", "Bluetooth"
    microfono: boolean;
    surround?: string;        // "Estéreo", "7.1"
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
