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
        MONITOR: 'Monitor',
        TECLADO: 'Teclado',
        MOUSE: 'Mouse',
        AUDIFONOS: 'Audífonos',
        SILLA: 'Silla',
        MOUSEPAD: 'Mousepad',
        WEBCAM: 'Cámara web',
        MICROFONO: 'Micrófono',
        BOCINAS: 'Bocinas',
    };
    return traducciones[tipo] || tipo;
};

/**
 * Traduce el tipo de vivienda a un texto legible.
 */
export const traducirTipoVivienda = (tipo: string): string => {
    const traducciones: Record<string, string> = {
        CASA: 'Casa',
        DEPARTAMENTO: 'Departamento',
        OFICINA: 'Oficina',
        OTRO: 'Otro',
    };
    return traducciones[tipo] || tipo;
};

/**
 * Etiquetas legibles para las llaves de atributos crudos del JSON.
 * Convierte "longitudMM" → "Longitud (mm)", "tipoRAM" → "Tipo de RAM", etc.
 */
export const LABELS_ATRIBUTOS: Record<string, string> = {
    socket: 'Socket',
    consumo: 'Consumo (W)',
    tipoRAM: 'Tipo de RAM',
    formato: 'Formato',
    factorForma: 'Factor de forma',
    vram: 'VRAM',
    longitudMM: 'Longitud (mm)',
    tipo: 'Tipo',
    velocidad: 'Velocidad (MT/s)',
    capacidad_gb: 'Capacidad (GB)',
    capacidad_tb: 'Capacidad (TB)',
    capacidadGB: 'Capacidad (GB)',
    capacidadTB: 'Capacidad (TB)',
    potenciaW: 'Potencia (W)',
    certificacion: 'Certificación',
    maxLongitudGPUMM: 'Largo máx. GPU (mm)',
    // Periféricos clásicos
    tamanoPulgadas: 'Tamaño (pulgadas)',
    resolucion: 'Resolución',
    tasaRefresco: 'Tasa de refresco (Hz)',
    panel: 'Tipo de panel',
    conectores: 'Conectores',
    layout: 'Distribución',
    conexion: 'Conexión',
    rgb: 'Iluminación RGB',
    dpi: 'DPI',
    botones: 'Botones',
    microfono: 'Micrófono',
    surround: 'Sonido',
    // Silla
    material: 'Material',
    pesoMaxKg: 'Peso máximo (kg)',
    reposacabezas: 'Reposacabezas',
    apoyabrazos: 'Apoyabrazos',
    reclinable: 'Reclinable',
    // Mousepad
    tamano: 'Tamaño',
    largoMM: 'Largo (mm)',
    anchoMM: 'Ancho (mm)',
    // Webcam
    fps: 'FPS',
    microfonoIntegrado: 'Micrófono integrado',
    enfoqueAutomatico: 'Enfoque automático',
    // Micrófono
    patronPolar: 'Patrón polar',
    frecuenciaMuestreoKHz: 'Frecuencia de muestreo (kHz)',
    incluyeTripode: 'Incluye trípode',
    // Bocinas
    configuracion: 'Configuración',
    subwoofer: 'Subwoofer',
};

export const traducirAtributo = (key: string): string => LABELS_ATRIBUTOS[key] || key;

/**
 * Formatea el valor de un atributo de forma legible.
 * Booleanos → "Sí"/"No", resto en string.
 */
export const formatearAtributo = (value: unknown): string => {
    if (value === true) return 'Sí';
    if (value === false) return 'No';
    if (value === null || value === undefined) return '—';
    return String(value);
};

/**
 * Formatea la dirección de envío desglosada en un texto legible.
 */
export const formatearDireccion = (p: {
    nombreDestinatario?: string | null;
    nombreDestinatarioPila?: string | null;
    apellidoPaterno?: string | null;
    apellidoMaterno?: string | null;
    telefonoContacto?: string | null;
    telefonoAlternativo?: string | null;
    calle?: string | null;
    numeroExterior?: string | null;
    numeroInterior?: string | null;
    entreCalles?: string | null;
    colonia?: string | null;
    alcaldiaMunicipio?: string | null;
    ciudad?: string | null;
    estadoEnvio?: string | null;
    codigoPostal?: string | null;
    pais?: string | null;
    tipoVivienda?: string | null;
    referenciasEnvio?: string | null;
}): string => {
    // Si hay nombre desglosado, lo preferimos sobre el legacy.
    const nombreCompleto =
        [p.nombreDestinatarioPila, p.apellidoPaterno, p.apellidoMaterno].filter(Boolean).join(' ').trim() ||
        p.nombreDestinatario ||
        '';

    const linea1 = [p.calle, p.numeroExterior && `#${p.numeroExterior}`, p.numeroInterior && `Int. ${p.numeroInterior}`]
        .filter(Boolean)
        .join(' ');
    const lineaEntre = p.entreCalles ? `Entre: ${p.entreCalles}` : '';
    const linea2 = [p.colonia, p.alcaldiaMunicipio, p.ciudad, p.estadoEnvio].filter(Boolean).join(', ');
    const linea3 = [p.codigoPostal, p.pais].filter(Boolean).join(' · ');
    return [nombreCompleto, linea1, lineaEntre, linea2, linea3]
        .filter((l) => l && l.trim())
        .join('\n');
};
