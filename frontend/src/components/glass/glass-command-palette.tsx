"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"

export interface CommandItem {
  icon?: React.ReactNode
  name: string
  description?: string
  shortcut?: string
  onSelect?: () => void
}

export interface CommandGroup {
  label: string
  items: CommandItem[]
}

export interface GlassCommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  groups: CommandGroup[]
  placeholder?: string
}

// Search icon SVG
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export function GlassCommandPalette({
  open,
  onOpenChange,
  groups,
  placeholder = "Search commands…",
}: GlassCommandPaletteProps) {
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Flatten filtered items for keyboard nav
  const filteredGroups = groups
    .map((g) => ({
      ...g,
      items: g.items.filter(
        (item) =>
          !query ||
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.description?.toLowerCase().includes(query.toLowerCase())
      ),
    }))
    .filter((g) => g.items.length > 0)

  const flatItems = filteredGroups.flatMap((g) => g.items)

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("")
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 10)
    }
  }, [open])

  // Cmd+K / Ctrl+K global shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, onOpenChange])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false)
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, flatItems.length - 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === "Enter") {
        flatItems[selectedIndex]?.onSelect?.()
        onOpenChange(false)
      }
    },
    [flatItems, selectedIndex, onOpenChange]
  )

  if (!open) return null

  let flatIndex = 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={() => onOpenChange(false)}
      onKeyDown={handleKeyDown}
    >
      {/* Card */}
      <div
        className="w-[calc(100vw-32px)] max-w-[560px] overflow-hidden"
        style={{
          background: "rgba(12,10,35,0.95)",
          border: "1px solid rgba(255,255,255,0.13)",
          borderRadius: 16,
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div
          className="flex items-center gap-[10px] px-4"
          style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <span style={{ color: "rgba(255,255,255,0.3)" }}>
            <SearchIcon />
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent border-none outline-none text-white text-[14px]"
            style={{ color: "#fff", fontSize: 14 }}
          />
        </div>

        {/* Results */}
        <div className="max-h-[360px] overflow-y-auto">
          {filteredGroups.length === 0 && (
            <div className="py-8 text-center text-[12px]" style={{ color: "rgba(255,255,255,0.25)" }}>
              No results
            </div>
          )}
          {filteredGroups.map((group) => (
            <div key={group.label}>
              <div
                className="uppercase tracking-[0.1em]"
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.25)",
                  padding: "10px 14px 4px",
                }}
              >
                {group.label}
              </div>
              {group.items.map((item) => {
                const idx = flatIndex++
                const isSelected = idx === selectedIndex
                return (
                  <div
                    key={item.name}
                    className={cn("flex items-center gap-[10px] cursor-pointer transition-colors")}
                    style={{
                      padding: "9px 14px",
                      background: isSelected ? "rgba(127,119,221,0.15)" : "transparent",
                    }}
                    onClick={() => {
                      item.onSelect?.()
                      onOpenChange(false)
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    {item.icon && (
                      <span
                        className="flex items-center justify-center shrink-0"
                        style={{ width: 28, height: 28, borderRadius: 7 }}
                      >
                        {item.icon}
                      </span>
                    )}
                    <span className="flex flex-col min-w-0 flex-1">
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>{item.name}</span>
                      {item.description && (
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{item.description}</span>
                      )}
                    </span>
                    {item.shortcut && (
                      <span
                        className="ml-auto shrink-0 font-mono"
                        style={{
                          fontSize: 10,
                          background: "rgba(255,255,255,0.07)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 5,
                          padding: "2px 6px",
                          color: "rgba(255,255,255,0.4)",
                        }}
                      >
                        {item.shortcut}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Footer hints */}
        <div
          className="flex gap-4"
          style={{
            padding: "10px 14px",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            fontSize: 10.5,
            color: "rgba(255,255,255,0.2)",
          }}
        >
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  )
}
