// ============================================
// OrdenaTEC — Componente Service
// ============================================

import api from './api';
import { Componente, RespuestaPaginada, TipoComponente } from '../types';

export interface FiltrosComponente {
    tipo?: TipoComponente;
    precioMin?: number;
    precioMax?: number;
    enStock?: boolean;
    busqueda?: string;
    pagina?: number;
    porPagina?: number;
}

export const componenteService = {
    /** Listar componentes con filtros */
    async listar(filtros: FiltrosComponente = {}): Promise<RespuestaPaginada<Componente>> {
        const params = new URLSearchParams();
        if (filtros.tipo) params.set('tipo', filtros.tipo);
        if (filtros.precioMin) params.set('precioMin', String(filtros.precioMin));
        if (filtros.precioMax) params.set('precioMax', String(filtros.precioMax));
        if (filtros.enStock) params.set('enStock', 'true');
        if (filtros.busqueda) params.set('busqueda', filtros.busqueda);
        if (filtros.pagina) params.set('pagina', String(filtros.pagina));
        if (filtros.porPagina) params.set('porPagina', String(filtros.porPagina));

        const response = await api.get<RespuestaPaginada<Componente>>(
            `/componentes?${params.toString()}`
        );
        return response.data;
    },

    /** Obtener componente por ID */
    async obtenerPorId(id: string): Promise<Componente> {
        const response = await api.get<Componente>(`/componentes/${id}`);
        return response.data;
    },

    /** Crear componente (admin) */
    async crear(data: Partial<Componente>): Promise<Componente> {
        const response = await api.post('/componentes', data);
        return response.data.componente;
    },

    /** Actualizar componente (admin) */
    async actualizar(id: string, data: Partial<Componente>): Promise<Componente> {
        const response = await api.put(`/componentes/${id}`, data);
        return response.data.componente;
    },

    /** Eliminar/desactivar componente (admin) */
    async eliminar(id: string): Promise<void> {
        await api.delete(`/componentes/${id}`);
    },

    /**
     * Lista componentes de un tipo, filtrando los incompatibles con los
     * componentes ya seleccionados por el usuario. Si `seleccionados` está
     * vacío, se comporta como un listar normal.
     */
    async listarCompatibles(
        tipo: TipoComponente,
        seleccionados: string[] = [],
        incluirSinStock = false
    ): Promise<{ datos: Componente[]; total: number }> {
        const params = new URLSearchParams();
        params.set('tipo', tipo);
        if (seleccionados.length > 0) {
            params.set('seleccionados', seleccionados.join(','));
        }
        if (incluirSinStock) {
            params.set('incluirSinStock', 'true');
        }

        const response = await api.get<{ datos: Componente[]; total: number }>(
            `/componentes/compatibles?${params.toString()}`
        );
        return response.data;
    },
};
