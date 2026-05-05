import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/auth.service';
import { Usuario } from '../../types';

interface AuthState {
    usuario: Usuario | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

const storedToken = localStorage.getItem('ordenatec_token');
const storedUser = localStorage.getItem('ordenatec_user');

const initialState: AuthState = {
    usuario: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken,
    loading: false,
    error: null,
};

export const registrarUsuario = createAsyncThunk(
    'auth/registrar',
    async (data: { email: string; nombre: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await authService.register(data);
            localStorage.setItem('ordenatec_token', response.token);
            localStorage.setItem('ordenatec_user', JSON.stringify(response.usuario));
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.mensaje || 'Error al registrar usuario'
            );
        }
    }
);

export const loginUsuario = createAsyncThunk(
    'auth/login',
    async (data: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await authService.login(data);
            localStorage.setItem('ordenatec_token', response.token);
            localStorage.setItem('ordenatec_user', JSON.stringify(response.usuario));
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.mensaje || 'Credenciales inválidas'
            );
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.usuario = null;
            state.token = null;
            state.error = null;
            localStorage.removeItem('ordenatec_token');
            localStorage.removeItem('ordenatec_user');
        },
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registrarUsuario.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registrarUsuario.fulfilled, (state, action) => {
                state.loading = false;
                state.usuario = action.payload.usuario;
                state.token = action.payload.token;
            })
            .addCase(registrarUsuario.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(loginUsuario.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUsuario.fulfilled, (state, action) => {
                state.loading = false;
                state.usuario = action.payload.usuario;
                state.token = action.payload.token;
            })
            .addCase(loginUsuario.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
