import React from "react"
import { cn } from "@/lib/utils"

export interface GlassDividerProps {
  variant?: "plain" | "label" | "gradient"
  label?: string
  className?: string
}

export function GlassDivider({ variant = "plain", label, className }: GlassDividerProps) {
  if (variant === "label") {
    return (
      <div
        className={cn(className)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          margin: "16px 0",
        }}
      >
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
        {label && (
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", whiteSpace: "nowrap" }}>
            {label}
          </span>
        )}
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
      </div>
    )
  }

  if (variant === "gradient") {
    return (
      <div
        className={cn(className)}
        style={{
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(127,119,221,0.4), transparent)",
          margin: "16px 0",
        }}
      />
    )
  }

  // plain (default)
  return (
    <div
      className={cn(className)}
      style={{
        height: 1,
        background: "rgba(255,255,255,0.07)",
        margin: "16px 0",
      }}
    />
  )
}
