// ============================================
// OrdenaTEC — Axios API Instance
// Configured with baseURL and JWT interceptor.
// ============================================

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Instancia de Axios preconfigurada para la API.
 * Incluye interceptor para adjuntar el token JWT.
 */
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor: adjuntar token JWT a cada petición
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('ordenatec_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor: manejar errores de respuesta (e.g. 401 = session expired)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expirado o inválido: limpiar sesión
            localStorage.removeItem('ordenatec_token');
            localStorage.removeItem('ordenatec_user');
            // Redirigir al login si no estamos ya ahí
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
