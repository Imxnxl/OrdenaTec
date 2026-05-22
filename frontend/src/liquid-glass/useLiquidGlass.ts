import { useEffect, useRef, useState } from 'react'
import { createLiquidGlass } from './liquid-glass'

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

interface LiquidGlassInstance {
  isActive: boolean
  filterElement: SVGElement
  update: (opts: Partial<LiquidGlassOptions>) => void
  destroy: () => void
}

export function useLiquidGlass(
  ref: React.RefObject<HTMLElement | null>,
  options: LiquidGlassOptions = {},
): { isActive: boolean } {
  const [isActive, setIsActive] = useState(false)
  const instanceRef = useRef<LiquidGlassInstance | null>(null)

  useEffect(() => {
    if (!ref.current) return
    const instance = createLiquidGlass(ref.current, options)
    instanceRef.current = instance
    setIsActive(instance.isActive)
    return () => {
      instance.destroy()
      instanceRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current])

  useEffect(() => {
    instanceRef.current?.update(options)
  }, [
    options.width,
    options.height,
    options.borderRadius,
    options.scale,
    options.blur,
    options.border,
    options.lightness,
    options.alpha,
    options.frost,
    options.saturation,
    options.displaceBlur,
    options.aberration?.[0],
    options.aberration?.[1],
    options.aberration?.[2],
  ])

  return { isActive }
}

export type { LiquidGlassInstance }
