"use client"

import React from "react"
import { cn } from "@/lib/utils"

export interface TimelineItem {
  icon?: React.ReactNode
  iconBg?: string
  title: string
  description?: string
  time?: string
}

export interface GlassTimelineProps {
  items: TimelineItem[]
  className?: string
}

export function GlassTimeline({ items, className }: GlassTimelineProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <div
            key={index}
            className="flex relative"
            style={{ gap: 14, paddingBottom: isLast ? 0 : 22 }}
          >
            {/* Vertical connector line */}
            {!isLast && (
              <div
                style={{
                  position: "absolute",
                  left: 13,
                  top: 28,
                  bottom: 0,
                  width: 1,
                  background: "rgba(255,255,255,0.07)",
                }}
              />
            )}

            {/* Dot */}
            <div
              className="flex items-center justify-center shrink-0 relative z-10"
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: item.iconBg ?? "rgba(127,119,221,0.2)",
              }}
            >
              {item.icon ? (
                <span className="flex items-center justify-center" style={{ width: 12, height: 12 }}>
                  {item.icon}
                </span>
              ) : (
                // Default dot
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.4)",
                  }}
                />
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col min-w-0 flex-1 pt-[4px]">
              <span style={{ fontSize: 13, color: "#fff", fontWeight: 500 }}>
                {item.title}
              </span>
              {item.description && (
                <span
                  style={{
                    fontSize: 11.5,
                    color: "rgba(255,255,255,0.4)",
                    lineHeight: 1.6,
                    marginTop: 2,
                  }}
                >
                  {item.description}
                </span>
              )}
              {item.time && (
                <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>
                  {item.time}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
