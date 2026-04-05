import { cn } from "@/lib/utils"

type SpinnerVariant = "ring" | "dots" | "bars"
type SpinnerSize = "sm" | "md" | "lg"
type SpinnerColor = "purple" | "teal"

interface GlassSpinnerProps {
  variant?: SpinnerVariant
  size?: SpinnerSize
  color?: SpinnerColor
  className?: string
}

// Ring dimensions per size
const ringSize = { sm: 24, md: 32, lg: 48 } as const
const ringBorder = { sm: 2, md: 2.5, lg: 3.5 } as const

// Color tokens
const colorTokens = {
  purple: { track: "rgba(127,119,221,0.2)", fill: "#7f77dd" },
  teal:   { track: "rgba(29,158,117,0.2)",  fill: "#1d9e75" },
} as const

// --- Ring ---
function RingSpinner({ size = "md", color = "purple", className }: GlassSpinnerProps) {
  const px = ringSize[size]
  const bw = ringBorder[size]
  const { track, fill } = colorTokens[color]

  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn("inline-block rounded-full", className)}
      style={{
        width: px,
        height: px,
        border: `${bw}px solid ${track}`,
        borderTopColor: fill,
        animation: "glass-spin 0.8s linear infinite",
      }}
    />
  )
}

// --- Dots ---
function DotsSpinner({ color = "purple", className }: GlassSpinnerProps) {
  const { fill } = colorTokens[color]
  const delays = ["0s", "0.2s", "0.4s"]

  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn("inline-flex items-center gap-[5px]", className)}
    >
      {delays.map((delay, i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full"
          style={{
            background: fill,
            animation: `glass-pulse 1.2s ease-in-out ${delay} infinite`,
          }}
        />
      ))}
    </span>
  )
}

// --- Bars ---
function BarsSpinner({ color = "purple", className }: GlassSpinnerProps) {
  const { fill } = colorTokens[color]
  const delays = ["0s", "0.15s", "0.3s", "0.45s"]

  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn("inline-flex items-end gap-[3px] h-5", className)}
    >
      {delays.map((delay, i) => (
        <span
          key={i}
          className="w-1 h-full rounded-sm"
          style={{
            background: fill,
            animation: `glass-bounce 1s ease-in-out ${delay} infinite`,
          }}
        />
      ))}
    </span>
  )
}

// --- Public component ---
export function GlassSpinner({ variant = "ring", ...props }: GlassSpinnerProps) {
  if (variant === "dots") return <DotsSpinner {...props} />
  if (variant === "bars") return <BarsSpinner {...props} />
  return <RingSpinner {...props} />
}
