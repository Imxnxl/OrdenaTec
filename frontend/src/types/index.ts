// ============================================
// OrdenaTEC Frontend — Shared Types
// ============================================

/** Roles de usuario */
export enum Rol {
    CLIENTE = 'CLIENTE',
    ADMIN = 'ADMIN',
}

/** Tipos de componentes */
export enum TipoComponente {
    CPU = 'CPU',
    MOTHERBOARD = 'MOTHERBOARD',
    RAM = 'RAM',
    GPU = 'GPU',
    ALMACENAMIENTO = 'ALMACENAMIENTO',
    PSU = 'PSU',
    GABINETE = 'GABINETE',
}

/** Estados de un pedido */
export enum EstadoPedido {
    PENDIENTE = 'PENDIENTE',
    PAGADO = 'PAGADO',
    ENVIADO = 'ENVIADO',
    ENTREGADO = 'ENTREGADO',
    CANCELADO = 'CANCELADO',
}

/** Modelo de Usuario (sin password) */
export interface Usuario {
    id: string;
    email: string;
    nombre: string;
    rol: Rol;
    createdAt: string;
}

/** Modelo de Componente */
export interface Componente {
    id: string;
    sku: string;
    nombre: string;
    tipo: TipoComponente;
    precio: number;
    stock: number;
    atributos: Record<string, unknown>;
    imagenUrl?: string | null;
    activo: boolean;
    createdAt: string;
    updatedAt: string;
}

/** Modelo de Configuración */
export interface Configuracion {
    id: string;
    nombre?: string;
    usuarioId?: string;
    precioTotal: number;
    consumoEstimado?: number;
    componentes: ConfiguracionComponente[];
    createdAt: string;
    updatedAt: string;
}

/** Relación Configuración-Componente */
export interface ConfiguracionComponente {
    configuracionId: string;
    componenteId: string;
    componente: Componente;
}

/** Modelo de Pedido */
export interface Pedido {
    id: string;
    usuarioId: string;
    configuracionId?: string;
    estado: EstadoPedido;
    total: number;
    direccionEnvio?: string;
    configuracion?: Configuracion;
    createdAt: string;
    updatedAt: string;
}

/** Resultado de validación de compatibilidad */
export interface ResultadoCompatibilidad {
    compatible: boolean;
    errores: string[];
    advertencias: string[];
}

/** Resultado de validación (incluye totales) */
export interface ResultadoValidacion {
    compatibilidad: ResultadoCompatibilidad;
    precioTotal: number;
    consumoEstimado: number;
}

/** Respuesta paginada */
export interface RespuestaPaginada<T> {
    datos: T[];
    total: number;
    pagina: number;
    porPagina: number;
    totalPaginas: number;
}

/** Respuesta de autenticación */
export interface AuthResponse {
    mensaje: string;
    usuario: Usuario;
    token: string;
}

/** Item del carrito */
export interface ItemCarrito {
    configuracion: Configuracion;
    cantidad: number;
}

/** Pasos del configurador */
export const PASOS_CONFIGURADOR = [
    { tipo: TipoComponente.CPU, nombre: 'Procesador', icono: '🔲' },
    { tipo: TipoComponente.MOTHERBOARD, nombre: 'Motherboard', icono: '🟩' },
    { tipo: TipoComponente.RAM, nombre: 'Memoria RAM', icono: '📊' },
    { tipo: TipoComponente.GPU, nombre: 'Tarjeta Gráfica', icono: '🎮' },
    { tipo: TipoComponente.ALMACENAMIENTO, nombre: 'Almacenamiento', icono: '💾' },
    { tipo: TipoComponente.PSU, nombre: 'Fuente de Poder', icono: '⚡' },
    { tipo: TipoComponente.GABINETE, nombre: 'Gabinete', icono: '🖥️' },
] as const;
