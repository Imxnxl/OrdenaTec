// ============================================
// OrdenaTEC — Auth Service
// ============================================

import api from './api';
import { AuthResponse } from '../types';

export const authService = {
    /** Registrar nuevo usuario */
    async register(data: {
        email: string;
        nombre: string;
        password: string;
    }): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/register', data);
        return response.data;
    },

    /** Iniciar sesión */
    async login(data: {
        email: string;
        password: string;
    }): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/login', data);
        return response.data;
    },
};
