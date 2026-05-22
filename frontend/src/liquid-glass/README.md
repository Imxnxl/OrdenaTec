## Liquid Glass

Efecto de refracción óptica realista para las tarjetas del proyecto. Va más allá del simple `backdrop-filter: blur()` (frosted glass): el contenido detrás del elemento se distorsiona como a través de una lente real, con aberración cromática (halo arcoíris) en los bordes.

### Archivos

| Archivo | Propósito |
|---|---|
| `liquid-glass.js` | Librería central — genera mapas de desplazamiento vía Canvas 2D y filtros SVG `feDisplacementMap` |
| `liquid-glass.d.ts` | Tipos TypeScript para la librería |
| `useLiquidGlass.ts` | Hook React: `useLiquidGlass(ref, options)` |
| `LiquidGlassCard.tsx` | Componente wrapper `<LiquidGlassCard>` con valores por defecto optimizados para el diseño del proyecto |
| `index.ts` | Barrel export |

### Componentes que usan LiquidGlassCard

| Componente | Clase CSS | glassOptions |
|---|---|---|
| `PasoComponente.tsx` | `.componente-card` | radius: 12, scale: -140, frost: 0.06, sat: 1.15 |
| `Perifericos.page.tsx` | `.componente-card` | radius: 12, scale: -140, frost: 0.06, sat: 1.15 |
| `Prearmadas.page.tsx` | `.prearmada-card` | radius: 16, scale: -160, frost: 0.06, sat: 1.15 |
| `IAConfigurador.page.tsx` | `.ia-componente-card` | radius: 12, scale: -100, frost: 0.04, sat: 1.1 |
| `App.tsx` | `.feature-card` | radius: 12, scale: -120, frost: 0.05, sat: 1.1 |
| `Login.page.tsx` | `.auth-card` | radius: 16, scale: -160, frost: 0.06, sat: 1.15 |
| `Register.page.tsx` | `.auth-card` | radius: 16, scale: -160, frost: 0.06, sat: 1.15 |

### Opciones (LiquidGlassOptions)

| Opción | Default | Efecto |
|---|---|---|
| `borderRadius` | 50 | Radio del borde en px (debe coincidir con el CSS) |
| `scale` | -180 | Fuerza del desplazamiento. Negativo = refracción hacia adentro |
| `frost` | 0 | Oscurecimiento del centro (0-1). 0 = cristal claro |
| `saturation` | 1 | Saturación del contenido detrás del vidrio |
| `aberration` | [0,10,20] | Aberración cromática por canal RGB |
| `blur` | 11 | Desenfoque del borde de neutralización |
| `lightness` | 50 | Luminosidad del centro (0-100) |
| `alpha` | 0.93 | Opacidad del centro (0-1) |
| `displaceBlur` | 0 | Desenfoque post-desplazamiento |

### Notas

- **Chromium**: el efecto completo solo funciona en navegadores Chromium (Chrome, Edge, Brave)
- **Fallback**: Safari y Firefox usan `backdrop-filter: blur(12px)` automáticamente
- Los `glassOptions` se pasan por prop a `<LiquidGlassCard>`. Cada tipo de tarjeta tiene valores ajustados para su tamaño y rol visual
