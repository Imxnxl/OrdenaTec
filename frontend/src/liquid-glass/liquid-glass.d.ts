export interface LiquidGlassOptions {
    width?: number
    height?: number
    borderRadius?: number
    scale?: number
    border?: number
    lightness?: number
    alpha?: number
    blur?: number
    aberration?: [number, number, number]
    frost?: number
    saturation?: number
    displaceBlur?: number
    filterId?: string
    fallbackFilter?: string
}

export interface LiquidGlassInstance {
    isActive: boolean
    filterElement: SVGElement
    update: (opts: Partial<LiquidGlassOptions>) => void
    destroy: () => void
}

export function createLiquidGlass(
    element: HTMLElement,
    options?: LiquidGlassOptions
): LiquidGlassInstance

export const isChromium: boolean
