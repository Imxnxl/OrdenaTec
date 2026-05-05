// ============================================
// OrdenaTEC — Benchmark Service (Frontend)
// API calls for FPS/benchmark estimation.
// ============================================

import api from './api';

export interface FPSData {
    low: number;
    medium: number;
    high: number;
    ultra: number;
}

export interface JuegoBenchmark {
    nombre: string;
    fps: {
        '1080p': FPSData;
        '1440p': FPSData;
        '4K': FPSData;
    };
}

export interface CreativoBenchmark {
    programa: string;
    score: number;
    descripcion: string;
}

export interface BenchmarkResult {
    fuente: 'local' | 'ia';
    gpu: string;
    cpu: string;
    juegos: JuegoBenchmark[];
    creative: CreativoBenchmark[];
}

export const benchmarkService = {
    async estimar(cpuId: string, gpuId: string): Promise<BenchmarkResult> {
        const { data } = await api.post('/benchmarks/estimar', { cpuId, gpuId });
        return data;
    },
};
