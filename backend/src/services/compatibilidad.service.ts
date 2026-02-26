// ============================================
// OrdenaTEC — Servicio de Compatibilidad
// Reglas de negocio para validar compatibilidad
// entre componentes de PC.
// ============================================

import { Componente } from '@prisma/client';
import {
    AtributosCPU,
    AtributosMotherboard,
    AtributosRAM,
    AtributosGPU,
    AtributosPSU,
    AtributosGabinete,
    AtributosAlmacenamiento,
    ResultadoCompatibilidad,
} from '../types';

/**
 * Servicio estático de validación de compatibilidad.
 * Centraliza todas las reglas de negocio para que sean
 * reutilizables desde la API y potencialmente desde el frontend.
 */
export class CompatibilidadService {
    /**
     * Valida que CPU y Motherboard tengan el mismo socket.
     * HU-02: Validación automática de socket CPU-Motherboard.
     */
    static validarCPU_Motherboard(
        cpu: Componente,
        motherboard: Componente
    ): { compatible: boolean; error?: string } {
        const attrCPU = cpu.atributos as unknown as AtributosCPU;
        const attrMB = motherboard.atributos as unknown as AtributosMotherboard;

        if (!attrCPU.socket || !attrMB.socket) {
            return {
                compatible: false,
                error: 'Información de socket no disponible para CPU o Motherboard',
            };
        }

        if (attrCPU.socket.toUpperCase() !== attrMB.socket.toUpperCase()) {
            return {
                compatible: false,
                error: `Socket incompatible: CPU usa ${attrCPU.socket} pero Motherboard usa ${attrMB.socket}`,
            };
        }

        return { compatible: true };
    }

    /**
     * Valida que la RAM sea compatible con la Motherboard (generación DDR).
     * HU-03: Validación de generación de RAM.
     */
    static validarRAM_Motherboard(
        ram: Componente,
        motherboard: Componente
    ): { compatible: boolean; error?: string } {
        const attrRAM = ram.atributos as unknown as AtributosRAM;
        const attrMB = motherboard.atributos as unknown as AtributosMotherboard;

        if (!attrRAM.tipo || !attrMB.tipoRAM) {
            return {
                compatible: false,
                error: 'Información de tipo de RAM no disponible',
            };
        }

        if (attrRAM.tipo.toUpperCase() !== attrMB.tipoRAM.toUpperCase()) {
            return {
                compatible: false,
                error: `RAM incompatible: RAM es ${attrRAM.tipo} pero Motherboard soporta ${attrMB.tipoRAM}`,
            };
        }

        return { compatible: true };
    }

    /**
     * Valida que el consumo total de los componentes no exceda
     * la potencia de la PSU.
     * HU-04: Validación de consumo vs capacidad PSU.
     */
    static validarConsumo(
        componentes: Componente[],
        psu: Componente
    ): { compatible: boolean; consumoTotal: number; potenciaPSU: number; error?: string } {
        const attrPSU = psu.atributos as unknown as AtributosPSU;

        if (!attrPSU.potenciaW) {
            return {
                compatible: false,
                consumoTotal: 0,
                potenciaPSU: 0,
                error: 'Información de potencia de PSU no disponible',
            };
        }

        // Calcular consumo total de todos los componentes (excepto PSU y gabinete)
        let consumoTotal = 0;

        for (const comp of componentes) {
            if (comp.tipo === 'PSU' || comp.tipo === 'GABINETE') continue;

            const attrs = comp.atributos as Record<string, unknown>;
            const consumo = typeof attrs.consumo === 'number' ? attrs.consumo : 0;
            consumoTotal += consumo;
        }

        // Se recomienda un margen del 20% sobre el consumo total
        const margen = consumoTotal * 1.2;

        if (consumoTotal > attrPSU.potenciaW) {
            return {
                compatible: false,
                consumoTotal,
                potenciaPSU: attrPSU.potenciaW,
                error: `Consumo (${consumoTotal}W) excede la capacidad de la PSU (${attrPSU.potenciaW}W)`,
            };
        }

        const resultado: { compatible: boolean; consumoTotal: number; potenciaPSU: number; error?: string } = {
            compatible: true,
            consumoTotal,
            potenciaPSU: attrPSU.potenciaW,
        };

        if (margen > attrPSU.potenciaW) {
            resultado.error = `Advertencia: consumo (${consumoTotal}W) está cerca del límite de la PSU (${attrPSU.potenciaW}W). Se recomienda 20% de margen.`;
        }

        return resultado;
    }

    /**
     * Valida que la GPU quepa en el gabinete (longitud máxima).
     * HU-05: Validación de dimensiones GPU/Gabinete.
     */
    static validarDimensiones(
        gpu: Componente,
        gabinete: Componente
    ): { compatible: boolean; error?: string } {
        const attrGPU = gpu.atributos as unknown as AtributosGPU;
        const attrGab = gabinete.atributos as unknown as AtributosGabinete;

        if (!attrGPU.longitudMM || !attrGab.maxLongitudGPUMM) {
            return {
                compatible: false,
                error: 'Información de dimensiones no disponible para GPU o Gabinete',
            };
        }

        if (attrGPU.longitudMM > attrGab.maxLongitudGPUMM) {
            return {
                compatible: false,
                error: `GPU (${attrGPU.longitudMM}mm) excede la longitud máxima del gabinete (${attrGab.maxLongitudGPUMM}mm)`,
            };
        }

        return { compatible: true };
    }

    /**
     * Ejecuta TODAS las validaciones aplicables sobre un conjunto de componentes.
     * Retorna un resultado consolidado con errores y advertencias.
     */
    static validarConfiguracion(componentes: Componente[]): ResultadoCompatibilidad {
        const errores: string[] = [];
        const advertencias: string[] = [];

        // Agrupar componentes por tipo
        const porTipo = new Map<string, Componente>();
        for (const comp of componentes) {
            porTipo.set(comp.tipo, comp);
        }

        const cpu = porTipo.get('CPU');
        const motherboard = porTipo.get('MOTHERBOARD');
        const ram = porTipo.get('RAM');
        const gpu = porTipo.get('GPU');
        const psu = porTipo.get('PSU');
        const gabinete = porTipo.get('GABINETE');

        // 1. Validar CPU ↔ Motherboard
        if (cpu && motherboard) {
            const resultado = this.validarCPU_Motherboard(cpu, motherboard);
            if (!resultado.compatible && resultado.error) {
                errores.push(resultado.error);
            }
        }

        // 2. Validar RAM ↔ Motherboard
        if (ram && motherboard) {
            const resultado = this.validarRAM_Motherboard(ram, motherboard);
            if (!resultado.compatible && resultado.error) {
                errores.push(resultado.error);
            }
        }

        // 3. Validar consumo vs PSU
        if (psu && componentes.length > 1) {
            const resultado = this.validarConsumo(componentes, psu);
            if (!resultado.compatible && resultado.error) {
                errores.push(resultado.error);
            } else if (resultado.error) {
                // Es una advertencia, no un error bloqueante
                advertencias.push(resultado.error);
            }
        }

        // 4. Validar dimensiones GPU ↔ Gabinete
        if (gpu && gabinete) {
            const resultado = this.validarDimensiones(gpu, gabinete);
            if (!resultado.compatible && resultado.error) {
                errores.push(resultado.error);
            }
        }

        // Verificar stock
        for (const comp of componentes) {
            if (comp.stock <= 0) {
                advertencias.push(`${comp.nombre} (${comp.sku}) está agotado`);
            }
        }

        return {
            compatible: errores.length === 0,
            errores,
            advertencias,
        };
    }

    /**
     * Calcula el consumo total estimado de un conjunto de componentes (W).
     */
    static calcularConsumoTotal(componentes: Componente[]): number {
        let total = 0;
        for (const comp of componentes) {
            if (comp.tipo === 'PSU' || comp.tipo === 'GABINETE') continue;
            const attrs = comp.atributos as Record<string, unknown>;
            const consumo = typeof attrs.consumo === 'number' ? attrs.consumo : 0;
            total += consumo;
        }
        return total;
    }

    /**
     * Calcula el precio total de un conjunto de componentes.
     */
    static calcularPrecioTotal(componentes: Componente[]): number {
        return componentes.reduce((sum, comp) => sum + comp.precio, 0);
    }

    /**
     * Sugiere componentes alternativos compatibles.
     * HU-06: Sugerir alternativas cuando un componente está agotado o es incompatible.
     */
    static filtrarCompatibles(
        candidatos: Componente[],
        componentesActuales: Componente[]
    ): Componente[] {
        return candidatos.filter((candidato) => {
            // Crear una configuración simulada reemplazando el tipo correspondiente
            const simulada = componentesActuales
                .filter((c) => c.tipo !== candidato.tipo)
                .concat(candidato);

            const resultado = this.validarConfiguracion(simulada);
            return resultado.compatible;
        });
    }
}
