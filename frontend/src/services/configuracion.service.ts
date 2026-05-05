// ============================================
// OrdenaTEC — Configuración Service
// ============================================

import api from './api';
import { Configuracion, ResultadoValidacion } from '../types';

export const configuracionService = {
    /** Guardar configuración */
    async guardar(data: {
        nombre?: string;
        componenteIds: string[];
    }): Promise<Configuracion> {
        const response = await api.post('/configuraciones', data);
        return response.data.configuracion;
    },

    /** Obtener configuración por ID */
    async obtenerPorId(id: string): Promise<Configuracion> {
        const response = await api.get<Configuracion>(`/configuraciones/${id}`);
        return response.data;
    },

    /** Listar configuraciones del usuario */
    async listarMias(): Promise<Configuracion[]> {
        const response = await api.get<Configuracion[]>('/configuraciones/usuario');
        return response.data;
    },

    /** Validar compatibilidad de componentes */
    async validar(componenteIds: string[]): Promise<ResultadoValidacion> {
        const response = await api.post<ResultadoValidacion>(
            '/configuraciones/validar',
            { componenteIds }
        );
        return response.data;
    },
};
