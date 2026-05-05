// ============================================
// OrdenaTEC — Benchmark Service
// Estimación de FPS y rendimiento para builds.
// Usa datos curados + fallback a Groq AI.
// ============================================

import Groq from 'groq-sdk';
import prisma from '../lib/prisma';
import benchmarkData from '../data/benchmarks.json';

interface FPSData {
    low: number;
    medium: number;
    high: number;
    ultra: number;
}

interface JuegoBenchmark {
    nombre: string;
    fps: {
        '1080p': FPSData;
        '1440p': FPSData;
        '4K': FPSData;
    };
}

interface CreativoBenchmark {
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

/**
 * Busca la clave del combo GPU+CPU en los datos locales.
 */
function findComboKey(gpuNombre: string, cpuNombre: string): string | null {
    const data = benchmarkData as any;
    const gpuKeywords = data.gpuKeywords as Record<string, string[]>;
    const cpuKeywords = data.cpuKeywords as Record<string, string[]>;

    let gpuMatch: string | null = null;
    let cpuMatch: string | null = null;

    for (const [gpuKey, keywords] of Object.entries(gpuKeywords)) {
        if (keywords.some((kw: string) => gpuNombre.includes(kw))) {
            gpuMatch = gpuKey;
            break;
        }
    }

    for (const [cpuKey, keywords] of Object.entries(cpuKeywords)) {
        if (keywords.some((kw: string) => cpuNombre.includes(kw))) {
            cpuMatch = cpuKey;
            break;
        }
    }

    if (!gpuMatch || !cpuMatch) return null;

    const comboKey = `${gpuMatch}|${cpuMatch}`;
    if (data.combos[comboKey]) return comboKey;

    return null;
}

/**
 * Genera benchmarks con Groq AI cuando no hay datos locales.
 */
async function generarConIA(gpuNombre: string, cpuNombre: string): Promise<BenchmarkResult> {
    if (!process.env.GROQ_API_KEY) {
        throw new Error('Groq API no configurada para estimaciones de benchmark');
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const prompt = `Eres un experto en hardware de PC y benchmarks de videojuegos. Estima los FPS aproximados para la combinación GPU: "${gpuNombre}" + CPU: "${cpuNombre}".

Responde ÚNICAMENTE con un JSON válido con esta estructura exacta (sin texto adicional):

{
    "juegos": [
        {
            "nombre": "Fortnite",
            "fps": { "1080p": { "low": 0, "medium": 0, "high": 0, "ultra": 0 }, "1440p": { "low": 0, "medium": 0, "high": 0, "ultra": 0 }, "4K": { "low": 0, "medium": 0, "high": 0, "ultra": 0 } }
        }
    ],
    "creative": [
        { "programa": "Blender (Render Cycles)", "score": 0, "descripcion": "..." }
    ]
}

Incluye EXACTAMENTE estos 10 juegos: Fortnite, CS2, Valorant, Cyberpunk 2077, GTA V, Minecraft, Apex Legends, Call of Duty Warzone, Elden Ring, Red Dead Redemption 2.
Y estos 3 programas creativos: Blender (Render Cycles), DaVinci Resolve, Adobe Premiere Pro.
Los scores creativos van del 1 al 100. Las descripciones en español.
Basa tus estimaciones en benchmarks reales conocidos. Sé realista.`;

    const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.2,
        max_tokens: 4096,
        response_format: { type: 'json_object' },
    });

    const responseText = completion.choices[0]?.message?.content || '{}';
    let parsed: any;

    try {
        parsed = JSON.parse(responseText);
    } catch {
        throw new Error('La IA no generó benchmarks válidos');
    }

    return {
        fuente: 'ia',
        gpu: gpuNombre,
        cpu: cpuNombre,
        juegos: parsed.juegos || [],
        creative: parsed.creative || [],
    };
}

/**
 * Estima los benchmarks para un combo CPU + GPU.
 */
export async function estimarBenchmarks(cpuId: string, gpuId: string): Promise<BenchmarkResult> {
    // 1. Obtener componentes de la BD
    const [cpu, gpu] = await Promise.all([
        prisma.componente.findUnique({ where: { id: cpuId } }),
        prisma.componente.findUnique({ where: { id: gpuId } }),
    ]);

    if (!cpu || !gpu) {
        throw new Error('CPU o GPU no encontrados');
    }

    if (cpu.tipo !== 'CPU' || gpu.tipo !== 'GPU') {
        throw new Error('Los IDs proporcionados no corresponden a CPU y GPU');
    }

    // 2. Buscar en datos locales
    const comboKey = findComboKey(gpu.nombre, cpu.nombre);

    if (comboKey) {
        const data = (benchmarkData as any).combos[comboKey];
        return {
            fuente: 'local',
            gpu: gpu.nombre,
            cpu: cpu.nombre,
            juegos: data.juegos,
            creative: data.creative,
        };
    }

    // 3. Fallback a IA
    return generarConIA(gpu.nombre, cpu.nombre);
}
