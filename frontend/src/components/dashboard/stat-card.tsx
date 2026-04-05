import React from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface StatCardChange {
  value: string
  direction: "up" | "down"
}

export interface StatCardProps {
  icon: React.ReactNode
  iconBg?: string
  value: string
  label: string
  change?: StatCardChange
  className?: string
}

function ArrowUp() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M5 8V2M5 2L2 5M5 2L8 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ArrowDown() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M5 2V8M5 8L2 5M5 8L8 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function StatCard({ icon, iconBg, value, label, change, className }: StatCardProps) {
  return (
    <Card className={cn("glass-card p-[18px_20px] rounded-[14px] gap-0", className)}>
      {/* Icon */}
      <div
        className="flex items-center justify-center rounded-[10px] mb-3"
        style={{
          width: 38,
          height: 38,
          background: iconBg ?? "rgba(127,119,221,0.25)",
        }}
      >
        {icon}
      </div>

      {/* Value */}
      <div
        className="font-medium text-white leading-none mb-1"
        style={{ fontSize: 26 }}
      >
        {value}
      </div>

      {/* Label + Change row */}
      <div className="flex items-center gap-2">
        <span
          className="leading-none"
          style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}
        >
          {label}
        </span>

        {change && (
          <span
            className="flex items-center gap-0.5 leading-none"
            style={{
              fontSize: 11,
              color: change.direction === "up" ? "#5dcaa5" : "#f0997b",
            }}
          >
            {change.direction === "up" ? <ArrowUp /> : <ArrowDown />}
            {change.value}
          </span>
        )}
      </div>
    </Card>
  )
}
