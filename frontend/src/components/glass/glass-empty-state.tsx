import React from "react"
import { cn } from "@/lib/utils"

export interface GlassEmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

// Default icon: inbox/empty box SVG
function DefaultIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="21 8 21 21 3 21 3 8" />
      <rect x="1" y="3" width="22" height="5" />
      <line x1="10" y1="12" x2="14" y2="12" />
    </svg>
  )
}

export function GlassEmptyState({
  icon,
  title,
  description,
  action,
  className,
}: GlassEmptyStateProps) {
  return (
    <div
      className={cn(className)}
      style={{ textAlign: "center", padding: "44px 20px" }}
    >
      {/* Icon box */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 18,
          background: "rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 18px",
        }}
      >
        {icon ?? <DefaultIcon />}
      </div>

      <p style={{ fontSize: 15, fontWeight: 500, color: "rgba(255,255,255,0.75)", marginBottom: 6 }}>
        {title}
      </p>

      {description && (
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", lineHeight: 1.6, marginBottom: 20 }}>
          {description}
        </p>
      )}

      {action && <div>{action}</div>}
    </div>
  )
}
