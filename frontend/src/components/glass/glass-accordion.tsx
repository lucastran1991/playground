"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"

export interface GlassAccordionItem {
  value: string
  header: string
  body: React.ReactNode
}

export interface GlassAccordionProps {
  items: GlassAccordionItem[]
  type?: "single" | "multiple"
  defaultOpen?: string[]
  className?: string
}

// Chevron icon — rotates 180deg when open
function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.2s ease",
        flexShrink: 0,
      }}
    >
      <path
        d="M4.5 6.75L9 11.25L13.5 6.75"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function GlassAccordion({
  items,
  type = "single",
  defaultOpen = [],
  className,
}: GlassAccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen)

  function toggle(value: string) {
    if (type === "single") {
      setOpenItems((prev) => (prev.includes(value) ? [] : [value]))
    } else {
      setOpenItems((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      )
    }
  }

  return (
    <div className={cn("w-full", className)}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.value)
        return (
          <div
            key={item.value}
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            {/* Header */}
            <button
              type="button"
              onClick={() => toggle(item.value)}
              aria-expanded={isOpen}
              className={cn(
                "w-full flex items-center justify-between cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7f77dd] focus-visible:ring-inset"
              )}
              style={{
                padding: "13px 16px",
                fontSize: 13,
                color: "rgba(255,255,255,0.8)",
                background: "transparent",
                border: "none",
                textAlign: "left",
              }}
            >
              <span>{item.header}</span>
              <Chevron open={isOpen} />
            </button>

            {/* Body */}
            {isOpen && (
              <div
                style={{
                  padding: "0 16px 14px",
                  fontSize: 12.5,
                  color: "rgba(255,255,255,0.4)",
                  lineHeight: 1.7,
                }}
              >
                {item.body}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
