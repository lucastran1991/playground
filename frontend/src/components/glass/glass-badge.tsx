import { cn } from "@/lib/utils"
import { HTMLAttributes } from "react"

// Color token map for badge variants
const colorMap = {
  purple: {
    bg: "bg-[rgba(127,119,221,0.2)]",
    text: "text-[#afa9ec]",
    border: "border-[rgba(127,119,221,0.3)]",
    dot: "bg-[#afa9ec]",
  },
  teal: {
    bg: "bg-[rgba(29,158,117,0.2)]",
    text: "text-[#5dcaa5]",
    border: "border-[rgba(29,158,117,0.3)]",
    dot: "bg-[#5dcaa5]",
  },
  coral: {
    bg: "bg-[rgba(216,90,48,0.2)]",
    text: "text-[#f0997b]",
    border: "border-[rgba(216,90,48,0.3)]",
    dot: "bg-[#f0997b]",
  },
  pink: {
    bg: "bg-[rgba(212,83,126,0.2)]",
    text: "text-[#ed93b1]",
    border: "border-[rgba(212,83,126,0.3)]",
    dot: "bg-[#ed93b1]",
  },
  amber: {
    bg: "bg-[rgba(186,117,23,0.2)]",
    text: "text-[#fac775]",
    border: "border-[rgba(186,117,23,0.3)]",
    dot: "bg-[#fac775]",
  },
  gray: {
    bg: "bg-[rgba(255,255,255,0.08)]",
    text: "text-[rgba(255,255,255,0.45)]",
    border: "border-[rgba(255,255,255,0.12)]",
    dot: "bg-[rgba(255,255,255,0.45)]",
  },
} as const

type BadgeColor = keyof typeof colorMap
type BadgeSize = "sm" | "md" | "lg"

interface GlassBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor
  pill?: boolean
  size?: BadgeSize
  dot?: boolean
}

export function GlassBadge({
  color = "purple",
  pill = false,
  size = "md",
  dot = false,
  className,
  children,
  ...props
}: GlassBadgeProps) {
  const c = colorMap[color]

  const sizeClasses =
    size === "lg"
      ? "text-[12.5px] px-3 py-[5px] rounded-lg"
      : "text-[11px] px-2 py-[3px] rounded-[6px]"

  const shapeClass = pill ? "!rounded-[20px] px-[10px]" : ""

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium border",
        c.bg,
        c.text,
        c.border,
        sizeClasses,
        shapeClass,
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn("w-[5px] h-[5px] rounded-full shrink-0", c.dot)}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}
