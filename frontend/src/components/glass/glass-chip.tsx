import { cn } from "@/lib/utils"
import { HTMLAttributes } from "react"

// Color token map for chip variants
const colorMap = {
  purple: {
    bg: "bg-[rgba(127,119,221,0.15)]",
    text: "text-[#afa9ec]",
    border: "border-[rgba(127,119,221,0.25)]",
  },
  teal: {
    bg: "bg-[rgba(29,158,117,0.15)]",
    text: "text-[#5dcaa5]",
    border: "border-[rgba(29,158,117,0.25)]",
  },
  coral: {
    bg: "bg-[rgba(216,90,48,0.15)]",
    text: "text-[#f0997b]",
    border: "border-[rgba(216,90,48,0.25)]",
  },
  amber: {
    bg: "bg-[rgba(186,117,23,0.15)]",
    text: "text-[#fac775]",
    border: "border-[rgba(186,117,23,0.25)]",
  },
  pink: {
    bg: "bg-[rgba(212,83,126,0.15)]",
    text: "text-[#ed93b1]",
    border: "border-[rgba(212,83,126,0.25)]",
  },
} as const

type ChipColor = keyof typeof colorMap

interface GlassChipProps extends HTMLAttributes<HTMLSpanElement> {
  color?: ChipColor
  onRemove?: () => void
}

export function GlassChip({
  color = "purple",
  onRemove,
  className,
  children,
  ...props
}: GlassChipProps) {
  const c = colorMap[color]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-[6px] px-[10px] py-1 rounded-[20px] text-[12px] border",
        c.bg,
        c.text,
        c.border,
        className
      )}
      {...props}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove"
          className="w-[14px] h-[14px] rounded-full flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity cursor-pointer shrink-0"
        >
          {/* X icon */}
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
            <path
              d="M1 1l6 6M7 1L1 7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </span>
  )
}
