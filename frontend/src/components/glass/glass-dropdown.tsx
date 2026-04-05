"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"

export interface DropdownItem {
  label: string
  icon?: React.ReactNode
  shortcut?: string
  onClick?: () => void
  variant?: "default" | "danger"
}

export interface DropdownSeparator {
  type: "separator"
}

export interface DropdownLabel {
  type: "label"
  text: string
}

export type DropdownEntry = DropdownItem | DropdownSeparator | DropdownLabel

export interface GlassDropdownProps {
  trigger: React.ReactNode
  items: DropdownEntry[]
  open?: boolean
  onOpenChange?: (open: boolean) => void
  align?: "left" | "right"
  className?: string
}

function isSeparator(e: DropdownEntry): e is DropdownSeparator {
  return "type" in e && e.type === "separator"
}

function isLabel(e: DropdownEntry): e is DropdownLabel {
  return "type" in e && e.type === "label"
}

export function GlassDropdown({
  trigger,
  items,
  open: controlledOpen,
  onOpenChange,
  align = "left",
  className,
}: GlassDropdownProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  const setOpen = useCallback(
    (val: boolean) => {
      if (!isControlled) setInternalOpen(val)
      onOpenChange?.(val)
    },
    [isControlled, onOpenChange]
  )

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open, setOpen])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [open, setOpen])

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)}>
      {/* Trigger */}
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Menu */}
      {open && (
        <div
          className="absolute z-50 mt-2"
          style={{
            [align === "right" ? "right" : "left"]: 0,
            background: "rgba(12,10,35,0.9)",
            border: "1px solid rgba(255,255,255,0.13)",
            borderRadius: 13,
            padding: 6,
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            minWidth: 180,
            boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
          }}
        >
          {items.map((entry, index) => {
            if (isSeparator(entry)) {
              return (
                <div
                  key={index}
                  style={{
                    height: 1,
                    background: "rgba(255,255,255,0.07)",
                    margin: "4px 0",
                  }}
                />
              )
            }

            if (isLabel(entry)) {
              return (
                <div
                  key={index}
                  className="uppercase tracking-[0.06em]"
                  style={{
                    fontSize: 9.5,
                    color: "rgba(255,255,255,0.2)",
                    padding: "4px 11px 2px",
                  }}
                >
                  {entry.text}
                </div>
              )
            }

            const item = entry as DropdownItem
            const isDanger = item.variant === "danger"

            return (
              <button
                key={index}
                className={cn(
                  "w-full flex items-center gap-[9px] transition-colors cursor-pointer text-left",
                  "rounded-[8px]",
                  isDanger
                    ? "hover:[background:rgba(216,90,48,0.12)] hover:!text-[#f0997b]"
                    : "hover:[background:rgba(255,255,255,0.08)] hover:!text-white"
                )}
                style={{
                  padding: "8px 11px",
                  fontSize: 12.5,
                  color: isDanger ? "rgba(240,153,123,0.7)" : "rgba(255,255,255,0.6)",
                  border: "none",
                  background: "transparent",
                }}
                onClick={() => {
                  item.onClick?.()
                  setOpen(false)
                }}
              >
                {item.icon && (
                  <span className="flex items-center shrink-0" style={{ width: 14, height: 14 }}>
                    {item.icon}
                  </span>
                )}
                <span className="flex-1">{item.label}</span>
                {item.shortcut && (
                  <span
                    className="ml-auto font-mono shrink-0"
                    style={{
                      fontSize: 10,
                      color: "rgba(255,255,255,0.2)",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 4,
                      padding: "1px 5px",
                    }}
                  >
                    {item.shortcut}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
