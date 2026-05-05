import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Configuracion } from '../../types';

export interface ItemCarrito {
    id: string;
    configuracion: Configuracion;
    cantidad: number;
}

interface CarritoState {
    items: ItemCarrito[];
    total: number;
}

const storedCart = localStorage.getItem('ordenatec_carrito');

const calcularTotal = (items: ItemCarrito[]): number => {
    return items.reduce(
        (sum, item) => sum + item.configuracion.precioTotal * item.cantidad,
        0
    );
};

const persistirCarrito = (items: ItemCarrito[]) => {
    localStorage.setItem('ordenatec_carrito', JSON.stringify(items));
};

const parsedItems: ItemCarrito[] = storedCart ? JSON.parse(storedCart) : [];

const initialState: CarritoState = {
    items: parsedItems,
    total: calcularTotal(parsedItems),
};

const carritoSlice = createSlice({
    name: 'carrito',
    initialState,
    reducers: {
        agregarAlCarrito(state, action: PayloadAction<Configuracion>) {
            const existente = state.items.find(
                (item) => item.configuracion.id === action.payload.id
            );

            if (existente) {
                existente.cantidad += 1;
            } else {
                state.items.push({
                    id: `cart-${Date.now()}`,
                    configuracion: action.payload,
                    cantidad: 1,
                });
            }

            state.total = calcularTotal(state.items);
            persistirCarrito(state.items);
        },

        removerDelCarrito(state, action: PayloadAction<string>) {
            state.items = state.items.filter((item) => item.id !== action.payload);
            state.total = calcularTotal(state.items);
            persistirCarrito(state.items);
        },

        actualizarCantidad(
            state,
            action: PayloadAction<{ id: string; cantidad: number }>
        ) {
            const item = state.items.find((i) => i.id === action.payload.id);
            if (item && action.payload.cantidad > 0) {
                item.cantidad = action.payload.cantidad;
                state.total = calcularTotal(state.items);
                persistirCarrito(state.items);
            }
        },

        vaciarCarrito(state) {
            state.items = [];
            state.total = 0;
            localStorage.removeItem('ordenatec_carrito');
        },
    },
});

export const {
    agregarAlCarrito,
    removerDelCarrito,
    actualizarCantidad,
    vaciarCarrito,
} = carritoSlice.actions;
export default carritoSlice.reducer;
