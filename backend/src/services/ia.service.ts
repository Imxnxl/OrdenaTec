// ============================================
// OrdenaTEC — IA Service (Groq)
// Integración con Groq API para generar
// configuraciones de PC con inteligencia artificial.
// ============================================

import Groq from 'groq-sdk';
import prisma from '../lib/prisma';
import { CompatibilidadService } from './compatibilidad.service';
import { Componente } from '@prisma/client';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

interface IAResponse {
    componentes: Componente[];
    precioTotal: number;
    consumoEstimado: number;
    compatibilidad: {
        compatible: boolean;
        errores: string[];
        advertencias: string[];
    };
    explicacion: string;
}

/**
 * Genera una configuración de PC basada en la descripción del usuario.
 */
export async function generarConfiguracion(prompt: string): Promise<IAResponse> {
    // 1. Obtener todos los componentes activos del catálogo
    const componentes = await prisma.componente.findMany({
        where: { activo: true, stock: { gt: 0 } },
    });

    // 2. Agrupar por tipo para el prompt
    const catalogo = componentes.map((c) => ({
        id: c.id,
        nombre: c.nombre,
        tipo: c.tipo,
        precio: c.precio,
        stock: c.stock,
        atributos: c.atributos,
    }));

    // 3. Construir system prompt
    const systemPrompt = `Eres un experto en hardware de PC que trabaja para OrdenaTEC, una tienda de componentes de computadora en México. Los precios están en pesos mexicanos (MXN).

Tu tarea es armar la mejor configuración de PC posible basándote en lo que el usuario pide. DEBES seleccionar componentes ÚNICAMENTE del catálogo proporcionado.

## CATÁLOGO DE COMPONENTES DISPONIBLES:
${JSON.stringify(catalogo, null, 2)}

## REGLAS DE COMPATIBILIDAD:
1. CPU y Motherboard deben tener el mismo socket (AM5 o LGA1700)
2. RAM y Motherboard deben usar el mismo tipo (DDR4 o DDR5)
3. El consumo total de los componentes NO debe exceder la potencia de la PSU
4. La longitud de la GPU (longitudMM) NO debe exceder maxLongitudGPUMM del gabinete

## INSTRUCCIONES:
- Selecciona EXACTAMENTE un componente de cada tipo: CPU, MOTHERBOARD, RAM, GPU, ALMACENAMIENTO, PSU, GABINETE
- Respeta el presupuesto del usuario si lo menciona
- Prioriza rendimiento equilibrado
- Responde ÚNICAMENTE con un JSON válido con esta estructura exacta:

{
    "componenteIds": ["id1", "id2", "id3", "id4", "id5", "id6", "id7"],
    "explicacion": "Explicación breve en español de por qué elegiste estos componentes y cómo se ajustan a lo que el usuario pidió."
}

NO incluyas texto adicional fuera del JSON. Solo el objeto JSON.`;

    // 4. Llamar a Groq API
    const chatCompletion = await groq.chat.completions.create({
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.3,
        max_tokens: 1024,
        response_format: { type: 'json_object' },
    });

    const responseText = chatCompletion.choices[0]?.message?.content || '{}';

    // 5. Parsear respuesta
    let parsed: { componenteIds: string[]; explicacion: string };
    try {
        parsed = JSON.parse(responseText);
    } catch {
        throw new Error('La IA no generó una respuesta válida. Intenta de nuevo.');
    }

    if (!parsed.componenteIds || !Array.isArray(parsed.componenteIds)) {
        throw new Error('La IA no seleccionó componentes válidos. Intenta de nuevo.');
    }

    // 6. Obtener los componentes seleccionados
    const componentesSeleccionados = await prisma.componente.findMany({
        where: { id: { in: parsed.componenteIds } },
    });

    if (componentesSeleccionados.length === 0) {
        throw new Error('No se encontraron los componentes sugeridos por la IA.');
    }

    // 7. Validar compatibilidad
    const compatibilidad = CompatibilidadService.validarConfiguracion(componentesSeleccionados);
    const precioTotal = CompatibilidadService.calcularPrecioTotal(componentesSeleccionados);
    const consumoEstimado = CompatibilidadService.calcularConsumoTotal(componentesSeleccionados);

    return {
        componentes: componentesSeleccionados,
        precioTotal,
        consumoEstimado,
        compatibilidad,
        explicacion: parsed.explicacion || 'Configuración generada por IA.',
    };
}
