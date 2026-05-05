// ============================================
// OrdenaTEC — useBenchmarks Hook
// Fetches benchmark data when CPU and GPU change.
// ============================================

import { useState, useEffect, useRef } from 'react';
import { useAppSelector } from '../store';
import { TipoComponente } from '../types';
import { benchmarkService, BenchmarkResult } from '../services/benchmark.service';

export function useBenchmarks() {
    const componentesSeleccionados = useAppSelector(
        (state) => state.configuracion.componentesSeleccionados
    );

    const cpu = componentesSeleccionados[TipoComponente.CPU];
    const gpu = componentesSeleccionados[TipoComponente.GPU];

    const [benchmarks, setBenchmarks] = useState<BenchmarkResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // Clear previous timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Only fetch when both CPU and GPU are selected
        if (!cpu || !gpu) {
            setBenchmarks(null);
            return;
        }

        // Debounce 500ms to avoid rapid API calls during selection changes
        timeoutRef.current = setTimeout(async () => {
            setLoading(true);
            setError(null);

            try {
                const result = await benchmarkService.estimar(cpu.id, gpu.id);
                setBenchmarks(result);
            } catch (err: any) {
                setError(err.response?.data?.mensaje || 'Error al estimar rendimiento');
                setBenchmarks(null);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [cpu?.id, gpu?.id]);

    return { benchmarks, loading, error, hasCpuGpu: !!cpu && !!gpu };
}
