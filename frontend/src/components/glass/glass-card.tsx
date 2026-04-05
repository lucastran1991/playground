import React from "react"
import { cn } from "@/lib/utils"

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default"
  padding?: "none" | "sm" | "md" | "lg"
}

const paddingStyles: Record<NonNullable<GlassCardProps["padding"]>, string> = {
  none: "p-0",
  sm: "p-[14px]",
  md: "p-[20px]",
  lg: "p-[28px]",
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ variant = "default", padding = "md", className, children, ...props }, ref) => {
    void variant // reserved for future variants
    return (
      <div
        ref={ref}
        className={cn(
          "[background:rgba(255,255,255,0.07)]",
          "[backdrop-filter:blur(16px)] [-webkit-backdrop-filter:blur(16px)]",
          "border border-[rgba(255,255,255,0.12)] rounded-[16px]",
          paddingStyles[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

GlassCard.displayName = "GlassCard"
