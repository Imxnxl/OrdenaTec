// ============================================
// OrdenaTEC — IA Service (Frontend)
// API calls for the AI PC builder.
// ============================================

import api from './api';
import { Componente, ResultadoCompatibilidad } from '../types';

export interface IAResponse {
    mensaje: string;
    componentes: Componente[];
    precioTotal: number;
    consumoEstimado: number;
    compatibilidad: ResultadoCompatibilidad;
    explicacion: string;
}

export const iaService = {
    async configurar(prompt: string): Promise<IAResponse> {
        const { data } = await api.post('/ia/configurar', { prompt });
        return data;
    },
};
