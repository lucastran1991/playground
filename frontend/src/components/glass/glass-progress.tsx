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
type ProgressVariant = "bar" | "circular"

// Height map for bar variant
const heightMap: Record<ProgressSize, string> = {
  sm: "h-1",
  md: "h-[6px]",
  lg: "h-2",
}

// Diameter map for circular variant (px)
const diameterMap: Record<ProgressSize, number> = {
  sm: 40,
  md: 60,
  lg: 80,
}

interface GlassProgressProps {
  value?: number
  variant?: ProgressVariant
  size?: ProgressSize
  color?: ProgressColor
  label?: string
  showValue?: boolean
  className?: string
}

// --- Bar variant ---

function ProgressBar({
  value = 0,
  size = "md",
  color = "purple",
  label,
  showValue,
  className,
}: GlassProgressProps) {
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

// --- Circular variant ---

function ProgressCircular({
  value = 0,
  size = "md",
  color = "purple",
  showValue,
  className,
}: GlassProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value))
  const diameter = diameterMap[size]
  const strokeWidth = size === "sm" ? 3 : size === "md" ? 4 : 5
  const radius = (diameter - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (clampedValue / 100) * circumference
  const fillColor = colorMap[color]
  const center = diameter / 2

  return (
    <div
      className={cn("inline-flex items-center justify-center relative", className)}
      style={{ width: diameter, height: diameter }}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg width={diameter} height={diameter} style={{ transform: "rotate(-90deg)" }}>
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        {/* Fill */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={fillColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.3s ease" }}
        />
      </svg>
      {showValue && (
        <span className="absolute text-[12px] font-medium text-white">
          {clampedValue}%
        </span>
      )}
    </div>
  )
}

// --- Public component ---

export function GlassProgress({ variant = "bar", ...props }: GlassProgressProps) {
  if (variant === "circular") return <ProgressCircular {...props} />
  return <ProgressBar {...props} />
}
