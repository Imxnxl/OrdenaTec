// ============================================
// OrdenaTEC — Prearmada Service (Frontend)
// API calls for pre-built PCs.
// ============================================

import api from './api';
import { Configuracion } from '../types';

export const prearmadaService = {
    async listar(categoria?: string): Promise<Configuracion[]> {
        const params: any = {};
        if (categoria) params.categoria = categoria;
        const { data } = await api.get('/prearmadas', { params });
        return data;
    },

    async obtenerPorId(id: string): Promise<Configuracion> {
        const { data } = await api.get(`/prearmadas/${id}`);
        return data;
    },
};
