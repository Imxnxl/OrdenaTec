import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Componente, TipoComponente, ResultadoCompatibilidad } from '../../types';
import { configuracionService } from '../../services/configuracion.service';

interface ConfiguracionState {
    componentesSeleccionados: Partial<Record<TipoComponente, Componente>>;
    pasoActual: number;
    precioTotal: number;
    consumoEstimado: number;
    compatibilidad: ResultadoCompatibilidad | null;
    validando: boolean;
    guardando: boolean;
    error: string | null;
}

const initialState: ConfiguracionState = {
    componentesSeleccionados: {},
    pasoActual: 0,
    precioTotal: 0,
    consumoEstimado: 0,
    compatibilidad: null,
    validando: false,
    guardando: false,
    error: null,
};

export const validarCompatibilidad = createAsyncThunk(
    'configuracion/validar',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { configuracion: ConfiguracionState };
            const ids = Object.values(state.configuracion.componentesSeleccionados)
                .filter(Boolean)
                .map((c) => c!.id);

            if (ids.length < 2) {
                return {
                    compatibilidad: { compatible: true, errores: [], advertencias: [] } as ResultadoCompatibilidad,
                    precioTotal: Object.values(state.configuracion.componentesSeleccionados)
                        .filter(Boolean)
                        .reduce((sum, c) => sum + c!.precio, 0),
                    consumoEstimado: 0,
                };
            }

            return await configuracionService.validar(ids);
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.mensaje || 'Error al validar compatibilidad'
            );
        }
    }
);

export const guardarConfiguracion = createAsyncThunk(
    'configuracion/guardar',
    async (nombre: string | undefined, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { configuracion: ConfiguracionState };
            const ids = Object.values(state.configuracion.componentesSeleccionados)
                .filter(Boolean)
                .map((c) => c!.id);

            if (ids.length === 0) {
                return rejectWithValue('Debe seleccionar al menos un componente');
            }

            return await configuracionService.guardar({ nombre, componenteIds: ids });
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.mensaje || 'Error al guardar configuración'
            );
        }
    }
);

const configuracionSlice = createSlice({
    name: 'configuracion',
    initialState,
    reducers: {
        seleccionarComponente(state, action: PayloadAction<Componente>) {
            const componente = action.payload;
            state.componentesSeleccionados[componente.tipo] = componente;
            state.precioTotal = Object.values(state.componentesSeleccionados)
                .filter(Boolean)
                .reduce((sum, c) => sum + c!.precio, 0);
        },

        removerComponente(state, action: PayloadAction<TipoComponente>) {
            delete state.componentesSeleccionados[action.payload];
            state.precioTotal = Object.values(state.componentesSeleccionados)
                .filter(Boolean)
                .reduce((sum, c) => sum + c!.precio, 0);
        },

        setPaso(state, action: PayloadAction<number>) {
            state.pasoActual = action.payload;
        },

        siguientePaso(state) {
            if (state.pasoActual < 6) {
                state.pasoActual += 1;
            }
        },

        pasoAnterior(state) {
            if (state.pasoActual > 0) {
                state.pasoActual -= 1;
            }
        },

        resetearConfiguracion() {
            return initialState;
        },

        limpiarError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(validarCompatibilidad.pending, (state) => {
                state.validando = true;
            })
            .addCase(validarCompatibilidad.fulfilled, (state, action) => {
                state.validando = false;
                state.compatibilidad = action.payload.compatibilidad;
                state.precioTotal = action.payload.precioTotal;
                state.consumoEstimado = action.payload.consumoEstimado;
            })
            .addCase(validarCompatibilidad.rejected, (state, action) => {
                state.validando = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(guardarConfiguracion.pending, (state) => {
                state.guardando = true;
                state.error = null;
            })
            .addCase(guardarConfiguracion.fulfilled, (state) => {
                state.guardando = false;
            })
            .addCase(guardarConfiguracion.rejected, (state, action) => {
                state.guardando = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    seleccionarComponente,
    removerComponente,
    setPaso,
    siguientePaso,
    pasoAnterior,
    resetearConfiguracion,
    limpiarError,
} = configuracionSlice.actions;
export default configuracionSlice.reducer;
