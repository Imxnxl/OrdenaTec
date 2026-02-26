// ============================================
// OrdenaTEC — Formatters
// Utility functions for formatting display values.
// ============================================

/**
 * Formatea un número como moneda MXN.
 */
export const formatearPrecio = (precio: number): string => {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2,
    }).format(precio);
};

/**
 * Formatea consumo en watts.
 */
export const formatearConsumo = (watts: number): string => {
    return `${watts}W`;
};

/**
 * Formatea una fecha ISO a formato legible.
 */
export const formatearFecha = (fecha: string): string => {
    return new Intl.DateTimeFormat('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(fecha));
};

/**
 * Trunca un texto a un máximo de caracteres.
 */
export const truncar = (texto: string, max: number): string => {
    if (texto.length <= max) return texto;
    return texto.substring(0, max) + '...';
};

/**
 * Traduce el estado del pedido a español legible.
 */
export const traducirEstadoPedido = (estado: string): string => {
    const traducciones: Record<string, string> = {
        PENDIENTE: 'Pendiente',
        PAGADO: 'Pagado',
        ENVIADO: 'Enviado',
        ENTREGADO: 'Entregado',
        CANCELADO: 'Cancelado',
    };
    return traducciones[estado] || estado;
};

/**
 * Traduce el tipo de componente a español legible.
 */
export const traducirTipoComponente = (tipo: string): string => {
    const traducciones: Record<string, string> = {
        CPU: 'Procesador',
        MOTHERBOARD: 'Motherboard',
        RAM: 'Memoria RAM',
        GPU: 'Tarjeta Gráfica',
        ALMACENAMIENTO: 'Almacenamiento',
        PSU: 'Fuente de Poder',
        GABINETE: 'Gabinete',
    };
    return traducciones[tipo] || tipo;
};
