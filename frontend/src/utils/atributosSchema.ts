// ============================================
// OrdenaTEC — Esquema de atributos por tipo de componente
// Define qué campos pide el formulario de admin para cada tipo,
// evitando que el administrador tenga que escribir JSON a mano.
// ============================================

import { TipoComponente } from '../types';

export type TipoCampoAtributo = 'text' | 'number' | 'select' | 'boolean';

export interface CampoAtributo {
    key: string;
    label: string;
    tipo: TipoCampoAtributo;
    requerido?: boolean;
    placeholder?: string;
    opciones?: string[];        // para tipo select
    sufijo?: string;            // unidad mostrada junto al input (W, mm, Hz…)
    ayuda?: string;
    min?: number;
    max?: number;
}

export const ATRIBUTOS_POR_TIPO: Record<TipoComponente, CampoAtributo[]> = {
    [TipoComponente.CPU]: [
        { key: 'socket', label: 'Socket', tipo: 'select', requerido: true,
          opciones: ['AM4', 'AM5', 'LGA1200', 'LGA1700', 'LGA1851', 'SP5'],
          ayuda: 'Tipo de zócalo del procesador. Debe coincidir con el de la motherboard.' },
        { key: 'consumo', label: 'Consumo (TDP)', tipo: 'number', requerido: true, sufijo: 'W', min: 1,
          ayuda: 'Consumo eléctrico bajo carga, en Watts. Lo trae la caja del producto.' },
    ],
    [TipoComponente.MOTHERBOARD]: [
        { key: 'socket', label: 'Socket', tipo: 'select', requerido: true,
          opciones: ['AM4', 'AM5', 'LGA1200', 'LGA1700', 'LGA1851', 'SP5'],
          ayuda: 'Debe coincidir con el del procesador.' },
        { key: 'tipoRAM', label: 'Tipo de RAM soportado', tipo: 'select', requerido: true,
          opciones: ['DDR4', 'DDR5', 'DDR6'],
          ayuda: 'Generación de memoria RAM. La RAM debe ser del mismo tipo.' },
        { key: 'formato', label: 'Factor de forma', tipo: 'select', requerido: true,
          opciones: ['Mini-ITX', 'Micro-ATX', 'ATX', 'E-ATX'],
          ayuda: 'Tamaño físico de la placa. Debe caber en el gabinete.' },
    ],
    [TipoComponente.RAM]: [
        { key: 'tipo', label: 'Tipo', tipo: 'select', requerido: true,
          opciones: ['DDR4', 'DDR5', 'DDR6'],
          ayuda: 'Debe coincidir con el "Tipo de RAM soportado" de la motherboard.' },
        { key: 'velocidad', label: 'Velocidad', tipo: 'number', requerido: true, sufijo: 'MT/s', min: 1,
          ayuda: 'Frecuencia de transferencia, ej: 3200, 5600, 6000.' },
        { key: 'capacidad_gb', label: 'Capacidad', tipo: 'number', requerido: true, sufijo: 'GB', min: 1,
          ayuda: 'Total del kit (si es 2x16GB, escribe 32).' },
    ],
    [TipoComponente.GPU]: [
        { key: 'vram', label: 'VRAM', tipo: 'text', requerido: true, placeholder: 'Ej: 12GB',
          ayuda: 'Memoria de video. Escribir en formato "8GB", "12GB", etc.' },
        { key: 'consumo', label: 'Consumo', tipo: 'number', requerido: true, sufijo: 'W', min: 1,
          ayuda: 'TDP de la tarjeta gráfica.' },
        { key: 'longitudMM', label: 'Longitud', tipo: 'number', requerido: true, sufijo: 'mm', min: 1,
          ayuda: 'Largo total de la tarjeta. Debe caber en el gabinete.' },
    ],
    [TipoComponente.ALMACENAMIENTO]: [
        { key: 'tipo', label: 'Tipo', tipo: 'select', requerido: true,
          opciones: ['NVMe', 'SATA SSD', 'HDD', 'NVMe RAID'],
          ayuda: 'NVMe es el más rápido. HDD es disco mecánico tradicional.' },
        { key: 'capacidad_tb', label: 'Capacidad', tipo: 'number', requerido: true, sufijo: 'TB', min: 0,
          ayuda: 'En Terabytes. 500GB = 0.5, 1TB = 1, etc.' },
    ],
    [TipoComponente.PSU]: [
        { key: 'potenciaW', label: 'Potencia', tipo: 'number', requerido: true, sufijo: 'W', min: 1,
          ayuda: 'Potencia total que entrega la fuente. Debe ser mayor que la suma de consumos.' },
        { key: 'certificacion', label: 'Certificación 80+', tipo: 'select', requerido: true,
          opciones: ['White', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Titanium'],
          ayuda: 'Eficiencia energética. Gold y superior son recomendados.' },
    ],
    [TipoComponente.GABINETE]: [
        { key: 'factorForma', label: 'Factor de forma máx.', tipo: 'select', requerido: true,
          opciones: ['Mini-ITX', 'Micro-ATX', 'ATX', 'E-ATX'],
          ayuda: 'El tamaño máximo de motherboard que admite el gabinete.' },
        { key: 'maxLongitudGPUMM', label: 'Largo máximo de GPU', tipo: 'number', requerido: true, sufijo: 'mm', min: 1,
          ayuda: 'Longitud máxima de tarjeta gráfica que cabe dentro.' },
    ],
    [TipoComponente.MONITOR]: [
        { key: 'tamanoPulgadas', label: 'Tamaño', tipo: 'number', requerido: true, sufijo: '"', min: 1,
          ayuda: 'Diagonal de la pantalla en pulgadas.' },
        { key: 'resolucion', label: 'Resolución', tipo: 'select', requerido: true,
          opciones: ['1280x720', '1920x1080', '2560x1440', '3440x1440', '3840x2160'] },
        { key: 'tasaRefresco', label: 'Tasa de refresco', tipo: 'number', requerido: true, sufijo: 'Hz', min: 24,
          ayuda: 'Hz: cuántas veces por segundo refresca la imagen. 60 estándar, 144+ gaming.' },
        { key: 'panel', label: 'Tipo de panel', tipo: 'select', requerido: true,
          opciones: ['IPS', 'VA', 'TN', 'OLED'],
          ayuda: 'IPS: mejor color. VA: mejor contraste. TN: más rápido. OLED: premium.' },
        { key: 'conectores', label: 'Conectores', tipo: 'text', placeholder: 'Ej: HDMI 2.1, DisplayPort 1.4' },
    ],
    [TipoComponente.TECLADO]: [
        { key: 'tipo', label: 'Tipo', tipo: 'select', requerido: true,
          opciones: ['Mecánico', 'Membrana', 'Óptico', 'Híbrido'] },
        { key: 'layout', label: 'Distribución', tipo: 'select', requerido: true,
          opciones: ['Latinoamericano', 'US', 'Español (España)', 'Otro'] },
        { key: 'conexion', label: 'Conexión', tipo: 'select', requerido: true,
          opciones: ['USB', 'Inalámbrico', 'Bluetooth'] },
        { key: 'rgb', label: 'Iluminación RGB', tipo: 'boolean' },
    ],
    [TipoComponente.MOUSE]: [
        { key: 'dpi', label: 'DPI máximo', tipo: 'number', requerido: true, min: 100,
          ayuda: 'Sensibilidad del sensor. Mayor DPI = más rápido el cursor.' },
        { key: 'botones', label: 'Número de botones', tipo: 'number', requerido: true, min: 2 },
        { key: 'conexion', label: 'Conexión', tipo: 'select', requerido: true,
          opciones: ['USB', 'Inalámbrico', 'Bluetooth'] },
        { key: 'rgb', label: 'Iluminación RGB', tipo: 'boolean' },
    ],
    [TipoComponente.AUDIFONOS]: [
        { key: 'tipo', label: 'Tipo', tipo: 'select', requerido: true,
          opciones: ['Over-ear', 'On-ear', 'In-ear'],
          ayuda: 'Over-ear: rodean la oreja. On-ear: encima de la oreja. In-ear: dentro del canal.' },
        { key: 'conexion', label: 'Conexión', tipo: 'select', requerido: true,
          opciones: ['3.5mm', 'USB', 'Inalámbrico', 'Bluetooth'] },
        { key: 'microfono', label: 'Micrófono', tipo: 'boolean' },
        { key: 'surround', label: 'Sonido', tipo: 'select',
          opciones: ['Estéreo', '5.1', '7.1', 'Dolby Atmos'] },
    ],
    [TipoComponente.SILLA]: [
        { key: 'tipo', label: 'Tipo', tipo: 'select', requerido: true,
          opciones: ['Gamer', 'Oficina', 'Ergonómica', 'Racing'] },
        { key: 'material', label: 'Material', tipo: 'select', requerido: true,
          opciones: ['Tela', 'Piel', 'Mesh', 'Piel sintética'],
          ayuda: 'Mesh es la malla transpirable. Piel da look premium pero es más caliente.' },
        { key: 'pesoMaxKg', label: 'Peso máximo soportado', tipo: 'number', requerido: true, sufijo: 'kg', min: 50 },
        { key: 'reposacabezas', label: 'Reposacabezas', tipo: 'boolean' },
        { key: 'apoyabrazos', label: 'Apoyabrazos', tipo: 'select', requerido: true,
          opciones: ['Ninguno', 'Fijos', '2D', '3D', '4D'],
          ayuda: '2D/3D/4D indica los ejes de movimiento. Más ejes = mejor ergonomía.' },
        { key: 'reclinable', label: 'Reclinable', tipo: 'boolean' },
    ],
    [TipoComponente.MOUSEPAD]: [
        { key: 'tamano', label: 'Tamaño', tipo: 'select', requerido: true,
          opciones: ['Standard', 'L', 'XL', 'XXL'] },
        { key: 'largoMM', label: 'Largo', tipo: 'number', requerido: true, sufijo: 'mm', min: 100 },
        { key: 'anchoMM', label: 'Ancho', tipo: 'number', requerido: true, sufijo: 'mm', min: 100 },
        { key: 'material', label: 'Material', tipo: 'select', requerido: true,
          opciones: ['Tela', 'Plástico', 'Vidrio', 'Híbrido'] },
        { key: 'rgb', label: 'Iluminación RGB', tipo: 'boolean' },
    ],
    [TipoComponente.WEBCAM]: [
        { key: 'resolucion', label: 'Resolución', tipo: 'select', requerido: true,
          opciones: ['480p', '720p', '1080p', '2K', '4K'] },
        { key: 'fps', label: 'Cuadros por segundo', tipo: 'number', requerido: true, sufijo: 'FPS', min: 15,
          ayuda: 'A mayor FPS, video más fluido. 30 estándar, 60 ideal para streaming.' },
        { key: 'microfonoIntegrado', label: 'Micrófono integrado', tipo: 'boolean' },
        { key: 'enfoqueAutomatico', label: 'Enfoque automático', tipo: 'boolean' },
        { key: 'conexion', label: 'Conexión', tipo: 'select', requerido: true,
          opciones: ['USB-A', 'USB-C', 'Inalámbrico'] },
    ],
    [TipoComponente.MICROFONO]: [
        { key: 'tipo', label: 'Tipo', tipo: 'select', requerido: true,
          opciones: ['USB cardioide', 'Condensador XLR', 'Dinámico', 'Lavalier'],
          ayuda: 'USB es plug & play. XLR es profesional pero requiere interfaz. Lavalier es de solapa.' },
        { key: 'patronPolar', label: 'Patrón polar', tipo: 'select', requerido: true,
          opciones: ['Cardioide', 'Omnidireccional', 'Bidireccional', 'Multipatrón'],
          ayuda: 'Cardioide: capta lo que tiene enfrente. Omni: capta todo alrededor.' },
        { key: 'frecuenciaMuestreoKHz', label: 'Frecuencia de muestreo', tipo: 'number', sufijo: 'kHz', min: 8,
          ayuda: '44.1 o 48 kHz son estándar de audio profesional.' },
        { key: 'incluyeTripode', label: 'Incluye trípode', tipo: 'boolean' },
    ],
    [TipoComponente.BOCINAS]: [
        { key: 'configuracion', label: 'Configuración', tipo: 'select', requerido: true,
          opciones: ['2.0', '2.1', '5.1', '7.1', 'Soundbar'],
          ayuda: '2.0: dos bocinas. 2.1: dos bocinas + subwoofer. 5.1/7.1: surround.' },
        { key: 'potenciaW', label: 'Potencia (RMS)', tipo: 'number', requerido: true, sufijo: 'W', min: 1,
          ayuda: 'Potencia continua real, no la "potencia pico" del marketing.' },
        { key: 'conexion', label: 'Conexión', tipo: 'select', requerido: true,
          opciones: ['3.5mm', 'USB', 'Bluetooth', 'Inalámbrico', 'Óptico'] },
        { key: 'subwoofer', label: 'Incluye subwoofer', tipo: 'boolean' },
    ],
};
