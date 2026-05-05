import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './slices/auth.slice';
import configuracionReducer from './slices/configuracion.slice';
import carritoReducer from './slices/carrito.slice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        configuracion: configuracionReducer,
        carrito: carritoReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
