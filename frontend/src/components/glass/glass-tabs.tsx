"use client"

import React from "react"
import { cn } from "@/lib/utils"

export interface GlassTab {
  value: string
  label: string
}

export interface GlassTabsProps {
  tabs: GlassTab[]
  value: string
  onValueChange: (value: string) => void
  variant?: "pill" | "underline"
  className?: string
}

function PillTabs({ tabs, value, onValueChange, className }: Omit<GlassTabsProps, "variant">) {
  return (
    <div
      className={cn("inline-flex gap-[2px] rounded-[12px] p-[4px]", className)}
      style={{ background: "rgba(255,255,255,0.06)" }}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = tab.value === value
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onValueChange(tab.value)}
            className={cn(
              "px-[16px] py-[7px] rounded-[9px] transition-all duration-200 cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7f77dd]",
              isActive
                ? "text-white border border-[rgba(127,119,221,0.35)] [background:rgba(127,119,221,0.3)]"
                : "text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.7)] border border-transparent"
            )}
            style={{ fontSize: 12.5 }}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

function UnderlineTabs({ tabs, value, onValueChange, className }: Omit<GlassTabsProps, "variant">) {
  return (
    <div
      className={cn("flex", className)}
      style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = tab.value === value
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onValueChange(tab.value)}
            className={cn(
              "px-[18px] py-[10px] transition-all duration-200 cursor-pointer -mb-px",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7f77dd]",
              isActive
                ? "text-[#afa9ec] border-b-2 border-[#7f77dd]"
                : "text-[rgba(255,255,255,0.4)] border-b-2 border-transparent hover:text-[rgba(255,255,255,0.7)]"
            )}
            style={{ fontSize: 13 }}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

export function GlassTabs({ variant = "pill", ...props }: GlassTabsProps) {
  if (variant === "underline") return <UnderlineTabs {...props} />
  return <PillTabs {...props} />
}
