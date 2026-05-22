import React, { useRef } from 'react'
import { useLiquidGlass, type LiquidGlassOptions } from './useLiquidGlass'

interface LiquidGlassCardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  onClick?: (e: React.MouseEvent) => void
  glassOptions?: LiquidGlassOptions
}

const LiquidGlassCard: React.FC<LiquidGlassCardProps> = ({
  children,
  className = '',
  style,
  onClick,
  glassOptions = {},
}) => {
  const ref = useRef<HTMLDivElement>(null)

  const options: LiquidGlassOptions = {
    borderRadius: 12,
    frost: 0.06,
    scale: -140,
    saturation: 1.15,
    ...glassOptions,
  }

  useLiquidGlass(ref, options)

  return (
    <div ref={ref} className={className} style={style} onClick={onClick}>
      {children}
    </div>
  )
}

export default LiquidGlassCard
