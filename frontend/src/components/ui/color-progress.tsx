import { cn } from "@/lib/utils"

// Color map for progress fill
const colorMap = {
  purple: "#7f77dd",
  teal:   "#1d9e75",
  coral:  "#d85a30",
  amber:  "#ef9f27",
} as const

type ProgressColor = keyof typeof colorMap
type ProgressSize = "sm" | "md" | "lg"

// Height map for bar sizes
const heightMap: Record<ProgressSize, string> = {
  sm: "h-1",
  md: "h-[6px]",
  lg: "h-2",
}

interface ColorProgressProps {
  value?: number
  size?: ProgressSize
  color?: ProgressColor
  label?: string
  showValue?: boolean
  className?: string
}

export function ColorProgress({
  value = 0,
  size = "md",
  color = "purple",
  label,
  showValue,
  className,
}: ColorProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value))
  const fillColor = colorMap[color]

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex justify-between mb-1.5 text-[11.5px] text-[rgba(255,255,255,0.4)]">
          {label && <span>{label}</span>}
          {showValue && <span>{clampedValue}%</span>}
        </div>
      )}
      <div
        className={cn("w-full rounded-[6px] overflow-hidden bg-[rgba(255,255,255,0.08)]", heightMap[size])}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-[6px] transition-[width] duration-300"
          style={{ width: `${clampedValue}%`, background: fillColor }}
        />
      </div>
    </div>
  )
}
