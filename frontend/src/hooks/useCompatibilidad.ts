// ============================================
// OrdenaTEC — useCompatibilidad Hook
// Triggers backend compatibility validation
// whenever selected components change.
// ============================================

import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { validarCompatibilidad } from '../store/slices/configuracion.slice';

/**
 * Custom hook que dispara la validación de compatibilidad
 * cada vez que cambian los componentes seleccionados.
 */
export const useCompatibilidad = () => {
    const dispatch = useAppDispatch();
    const { componentesSeleccionados, compatibilidad, validando } = useAppSelector(
        (state) => state.configuracion
    );

    const componenteIds = Object.values(componentesSeleccionados)
        .filter(Boolean)
        .map((c) => c!.id);

    // Validar cuando cambian los componentes seleccionados
    useEffect(() => {
        if (componenteIds.length >= 2) {
            dispatch(validarCompatibilidad());
        }
    }, [componenteIds.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

    // Función manual para forzar re-validación
    const revalidar = useCallback(() => {
        dispatch(validarCompatibilidad());
    }, [dispatch]);

    return {
        compatibilidad,
        validando,
        revalidar,
        tieneErrores: compatibilidad ? !compatibilidad.compatible : false,
        errores: compatibilidad?.errores || [],
        advertencias: compatibilidad?.advertencias || [],
    };
};
