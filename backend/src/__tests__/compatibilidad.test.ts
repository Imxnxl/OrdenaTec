import { CompatibilidadService } from '../services/compatibilidad.service';
import { Componente } from '@prisma/client';

function makeComponente(overrides: Partial<Componente> = {}): Componente {
    return {
        id: 'test-id',
        sku: 'TEST-SKU',
        nombre: 'Test Component',
        tipo: 'CPU',
        precio: 100,
        stock: 5,
        activo: true,
        atributos: {},
        imagenUrl: null,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides,
    };
}

describe('CompatibilidadService', () => {
    describe('validarCPU_Motherboard', () => {
        it('debe aceptar socket coincidente', () => {
            const cpu = makeComponente({ tipo: 'CPU', atributos: { socket: 'AM5', consumo: 105 } });
            const mb = makeComponente({ tipo: 'MOTHERBOARD', atributos: { socket: 'AM5', tipoRAM: 'DDR5' } });
            const res = CompatibilidadService.validarCPU_Motherboard(cpu, mb);
            expect(res.compatible).toBe(true);
            expect(res.error).toBeUndefined();
        });

        it('debe rechazar socket diferente', () => {
            const cpu = makeComponente({ tipo: 'CPU', atributos: { socket: 'AM5', consumo: 105 } });
            const mb = makeComponente({ tipo: 'MOTHERBOARD', atributos: { socket: 'LGA1700', tipoRAM: 'DDR5' } });
            const res = CompatibilidadService.validarCPU_Motherboard(cpu, mb);
            expect(res.compatible).toBe(false);
            expect(res.error).toContain('Socket incompatible');
        });

        it('debe fallar si falta información de socket', () => {
            const cpu = makeComponente({ tipo: 'CPU', atributos: { consumo: 105 } });
            const mb = makeComponente({ tipo: 'MOTHERBOARD', atributos: { tipoRAM: 'DDR5' } });
            const res = CompatibilidadService.validarCPU_Motherboard(cpu, mb);
            expect(res.compatible).toBe(false);
            expect(res.error).toContain('socket no disponible');
        });

        it('debe ser case-insensitive con sockets', () => {
            const cpu = makeComponente({ tipo: 'CPU', atributos: { socket: 'am5', consumo: 105 } });
            const mb = makeComponente({ tipo: 'MOTHERBOARD', atributos: { socket: 'AM5', tipoRAM: 'DDR5' } });
            const res = CompatibilidadService.validarCPU_Motherboard(cpu, mb);
            expect(res.compatible).toBe(true);
        });
    });

    describe('validarRAM_Motherboard', () => {
        it('debe aceptar RAM y Motherboard con el mismo tipo DDR', () => {
            const ram = makeComponente({ tipo: 'RAM', atributos: { tipo: 'DDR5', capacidadGB: 32, consumo: 10 } });
            const mb = makeComponente({ tipo: 'MOTHERBOARD', atributos: { socket: 'AM5', tipoRAM: 'DDR5' } });
            const res = CompatibilidadService.validarRAM_Motherboard(ram, mb);
            expect(res.compatible).toBe(true);
        });

        it('debe rechazar tipos DDR diferentes', () => {
            const ram = makeComponente({ tipo: 'RAM', atributos: { tipo: 'DDR4', capacidadGB: 16, consumo: 8 } });
            const mb = makeComponente({ tipo: 'MOTHERBOARD', atributos: { socket: 'AM5', tipoRAM: 'DDR5' } });
            const res = CompatibilidadService.validarRAM_Motherboard(ram, mb);
            expect(res.compatible).toBe(false);
            expect(res.error).toContain('RAM incompatible');
        });
    });

    describe('validarConsumo', () => {
        it('debe aprobar si hay suficiente wattage', () => {
            const cpu = makeComponente({ tipo: 'CPU', atributos: { socket: 'AM5', consumo: 105 } });
            const gpu = makeComponente({ tipo: 'GPU', atributos: { consumo: 250, longitudMM: 300 } });
            const psu = makeComponente({ tipo: 'PSU', atributos: { potenciaW: 750 } });
            const res = CompatibilidadService.validarConsumo([cpu, gpu], psu);
            expect(res.compatible).toBe(true);
            expect(res.consumoTotal).toBe(355);
            expect(res.potenciaPSU).toBe(750);
        });

        it('debe rechazar si el consumo excede la PSU', () => {
            const cpu = makeComponente({ tipo: 'CPU', atributos: { socket: 'AM5', consumo: 300 } });
            const gpu = makeComponente({ tipo: 'GPU', atributos: { consumo: 500, longitudMM: 300 } });
            const psu = makeComponente({ tipo: 'PSU', atributos: { potenciaW: 650 } });
            const res = CompatibilidadService.validarConsumo([cpu, gpu], psu);
            expect(res.compatible).toBe(false);
            expect(res.error).toContain('excede');
        });

        it('debe emitir advertencia si se excede el margen del 20%', () => {
            const cpu = makeComponente({ tipo: 'CPU', atributos: { socket: 'AM5', consumo: 300 } });
            const gpu = makeComponente({ tipo: 'GPU', atributos: { consumo: 300, longitudMM: 300 } });
            const psu = makeComponente({ tipo: 'PSU', atributos: { potenciaW: 650 } });
            const res = CompatibilidadService.validarConsumo([cpu, gpu], psu);
            expect(res.compatible).toBe(true);
            expect(res.error).toContain('Advertencia');
        });

        it('debe fallar si no hay información de potencia de PSU', () => {
            const cpu = makeComponente({ tipo: 'CPU', atributos: { socket: 'AM5', consumo: 105 } });
            const psu = makeComponente({ tipo: 'PSU', atributos: {} });
            const res = CompatibilidadService.validarConsumo([cpu], psu);
            expect(res.compatible).toBe(false);
            expect(res.error).toContain('no disponible');
        });
    });

    describe('validarDimensiones', () => {
        it('debe aceptar GPU que quepa en el gabinete', () => {
            const gpu = makeComponente({ tipo: 'GPU', atributos: { longitudMM: 280, consumo: 250 } });
            const gabinete = makeComponente({ tipo: 'GABINETE', atributos: { maxLongitudGPUMM: 350 } });
            const res = CompatibilidadService.validarDimensiones(gpu, gabinete);
            expect(res.compatible).toBe(true);
        });

        it('debe rechazar GPU muy larga para el gabinete', () => {
            const gpu = makeComponente({ tipo: 'GPU', atributos: { longitudMM: 380, consumo: 250 } });
            const gabinete = makeComponente({ tipo: 'GABINETE', atributos: { maxLongitudGPUMM: 320 } });
            const res = CompatibilidadService.validarDimensiones(gpu, gabinete);
            expect(res.compatible).toBe(false);
            expect(res.error).toContain('excede');
        });
    });

    describe('validarConfiguracion', () => {
        it('debe detectar configuracion totalmente compatible', () => {
            const componentes = [
                makeComponente({ tipo: 'CPU', atributos: { socket: 'AM5', consumo: 105 } }),
                makeComponente({ tipo: 'MOTHERBOARD', atributos: { socket: 'AM5', tipoRAM: 'DDR5' } }),
                makeComponente({ tipo: 'RAM', atributos: { tipo: 'DDR5', capacidadGB: 32, consumo: 10 } }),
                makeComponente({ tipo: 'GPU', atributos: { consumo: 250, longitudMM: 280 } }),
                makeComponente({ tipo: 'PSU', atributos: { potenciaW: 750 } }),
                makeComponente({ tipo: 'GABINETE', atributos: { maxLongitudGPUMM: 350 } }),
            ];
            const res = CompatibilidadService.validarConfiguracion(componentes);
            expect(res.compatible).toBe(true);
            expect(res.errores).toHaveLength(0);
        });

        it('debe detectar socket incompatible entre CPU y Motherboard', () => {
            const componentes = [
                makeComponente({ tipo: 'CPU', atributos: { socket: 'AM5', consumo: 105 } }),
                makeComponente({ tipo: 'MOTHERBOARD', atributos: { socket: 'LGA1700', tipoRAM: 'DDR5' } }),
            ];
            const res = CompatibilidadService.validarConfiguracion(componentes);
            expect(res.compatible).toBe(false);
            expect(res.errores.some((e) => e.includes('Socket'))).toBe(true);
        });

        it('debe advertir sobre componentes agotados', () => {
            const componentes = [
                makeComponente({ tipo: 'CPU', stock: 0, atributos: { socket: 'AM5', consumo: 105 } }),
            ];
            const res = CompatibilidadService.validarConfiguracion(componentes);
            expect(res.advertencias.some((a) => a.includes('agotado'))).toBe(true);
        });
    });

    describe('calcularPrecioTotal', () => {
        it('debe sumar precios correctamente', () => {
            const c1 = makeComponente({ precio: 5000 });
            const c2 = makeComponente({ precio: 3000 });
            expect(CompatibilidadService.calcularPrecioTotal([c1, c2])).toBe(8000);
        });

        it('debe retornar 0 para array vacío', () => {
            expect(CompatibilidadService.calcularPrecioTotal([])).toBe(0);
        });
    });

    describe('calcularConsumoTotal', () => {
        it('debe sumar consumos excluyendo PSU, gabinete y periféricos', () => {
            const cpu = makeComponente({ tipo: 'CPU', atributos: { consumo: 105 } });
            const gpu = makeComponente({ tipo: 'GPU', atributos: { consumo: 250 } });
            const psu = makeComponente({ tipo: 'PSU', atributos: { potenciaW: 750 } });
            const gabinete = makeComponente({ tipo: 'GABINETE', atributos: { maxLongitudGPUMM: 350 } });
            expect(CompatibilidadService.calcularConsumoTotal([cpu, gpu, psu, gabinete])).toBe(355);
        });
    });

    describe('filtrarCompatibles', () => {
        it('debe retornar solo candidatos compatibles', () => {
            const cpu = makeComponente({ tipo: 'CPU', id: 'cpu-1', atributos: { socket: 'AM5', consumo: 105 } });
            const mbCompat = makeComponente({ tipo: 'MOTHERBOARD', id: 'mb-1', atributos: { socket: 'AM5', tipoRAM: 'DDR5' } });
            const mbIncomp = makeComponente({ tipo: 'MOTHERBOARD', id: 'mb-2', atributos: { socket: 'LGA1700', tipoRAM: 'DDR5' } });

            const compatibles = CompatibilidadService.filtrarCompatibles([mbCompat, mbIncomp], [cpu]);
            expect(compatibles).toHaveLength(1);
            expect(compatibles[0].id).toBe('mb-1');
        });
    });
});
