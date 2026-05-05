// ============================================
// OrdenaTEC Frontend — Shared Types
// ============================================

/** Roles de usuario */
export enum Rol {
    CLIENTE = 'CLIENTE',
    ADMIN = 'ADMIN',
}

/** Tipos de componentes (incluye periféricos) */
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

/** Tipo de vivienda registrada para la dirección de envío */
export enum TipoVivienda {
    CASA = 'CASA',
    DEPARTAMENTO = 'DEPARTAMENTO',
    OFICINA = 'OFICINA',
    OTRO = 'OTRO',
}

/** Tipos que son periféricos (no participan en compatibilidad interna) */
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

/** Dirección de envío desglosada en campos estructurados */
export interface DireccionEnvio {
    // Legacy (nombre completo en un solo campo).
    nombreDestinatario: string;
    // Desglose granular del nombre.
    nombreDestinatarioPila?: string | null;
    apellidoPaterno?: string | null;
    apellidoMaterno?: string | null;
    telefonoContacto: string;
    telefonoAlternativo?: string | null;
    calle: string;
    numeroExterior: string;
    numeroInterior?: string | null;
    entreCalles?: string | null;
    colonia: string;
    alcaldiaMunicipio?: string | null;
    ciudad: string;
    estadoEnvio: string;
    codigoPostal: string;
    pais: string;
    tipoVivienda?: TipoVivienda | null;
    referenciasEnvio?: string | null;
}

/** Modelo de Pedido */
export interface Pedido extends Partial<DireccionEnvio> {
    id: string;
    usuarioId: string;
    configuracionId?: string;
    estado: EstadoPedido;
    total: number;
    configuracion?: Configuracion;
    pagos?: Array<{
        id: string;
        monto: number;
        metodo: string;
        estado: string;
        fecha: string;
    }>;
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
