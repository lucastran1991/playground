import React from "react"
import { cn } from "@/lib/utils"

export interface GlassListItem {
  icon?: React.ReactNode
  title: string
  subtitle?: string
  right?: React.ReactNode
  onClick?: () => void
}

export interface GlassListProps {
  items: GlassListItem[]
  className?: string
}

export function GlassList({ items, className }: GlassListProps) {
  return (
    <div className={cn("w-full", className)}>
      {items.map((item, idx) => (
        <div
          key={idx}
          role={item.onClick ? "button" : undefined}
          tabIndex={item.onClick ? 0 : undefined}
          onClick={item.onClick}
          onKeyDown={
            item.onClick
              ? (e) => {
                  if (e.key === "Enter" || e.key === " ") item.onClick!()
                }
              : undefined
          }
          className={cn(
            "flex items-center transition-colors duration-150",
            item.onClick &&
              "cursor-pointer hover:[background:rgba(255,255,255,0.04)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7f77dd] focus-visible:ring-inset"
          )}
          style={{
            gap: 12,
            padding: "11px 14px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          {/* Icon slot */}
          {item.icon && (
            <div
              className="flex items-center justify-center shrink-0 rounded-[9px]"
              style={{ width: 34, height: 34 }}
            >
              {item.icon}
            </div>
          )}

          {/* Text */}
          <div className="flex flex-col gap-[3px] min-w-0">
            <span
              className="truncate"
              style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}
            >
              {item.title}
            </span>
            {item.subtitle && (
              <span
                className="truncate"
                style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}
              >
                {item.subtitle}
              </span>
            )}
          </div>

          {/* Right content */}
          {item.right && (
            <div className="ml-auto shrink-0">{item.right}</div>
          )}
        </div>
      ))}
    </div>
  )
}
