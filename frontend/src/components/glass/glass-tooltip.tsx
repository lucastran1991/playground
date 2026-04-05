"use client"

import React, { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

export interface GlassTooltipProps {
  content: string
  children: React.ReactNode
  side?: "top" | "bottom"
  className?: string
}

export function GlassTooltip({ content, children, side = "top", className }: GlassTooltipProps) {
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!visible || !triggerRef.current || !tooltipRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const gap = 8

    let x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
    let y =
      side === "top"
        ? triggerRect.top - tooltipRect.height - gap
        : triggerRect.bottom + gap

    // Keep within viewport horizontally
    x = Math.max(8, Math.min(x, window.innerWidth - tooltipRect.width - 8))

    setPos({ x, y })
  }, [visible, side])

  return (
    <>
      <div
        ref={triggerRef}
        className={cn("inline-flex", className)}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
      >
        {children}
      </div>

      {visible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          style={{
            position: "fixed",
            left: pos.x,
            top: pos.y,
            zIndex: 9999,
            background: "rgba(10,8,30,0.9)",
            border: "1px solid rgba(255,255,255,0.13)",
            borderRadius: 8,
            padding: "6px 11px",
            fontSize: 11.5,
            color: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {content}
        </div>
      )}
    </>
  )
}
