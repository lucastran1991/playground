"use client"

import React, { useId } from "react"
import { cn } from "@/lib/utils"

export interface GlassToggleProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  color?: "purple" | "green"
  label?: string
  disabled?: boolean
  className?: string
}

/**
 * GlassToggle — accessible switch with purple/green color variants.
 * Uses role="switch" + aria-checked. Keyboard: Space/Enter to toggle.
 */
export function GlassToggle({
  checked = false,
  onCheckedChange,
  color = "purple",
  label,
  disabled = false,
  className,
}: GlassToggleProps) {
  const id = useId()

  function handleToggle() {
    if (!disabled) onCheckedChange?.(!checked)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault()
      handleToggle()
    }
  }

  const trackOn =
    color === "green"
      ? "bg-[rgba(29,158,117,0.7)] border-[#1d9e75]"
      : "bg-[rgba(127,119,221,0.7)] border-[#7f77dd]"

  return (
    <div className={cn("flex items-center gap-[10px]", className)}>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
        disabled={disabled}
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={cn(
          // track
          "relative inline-flex shrink-0 cursor-pointer",
          "w-[38px] h-[20px] rounded-[10px]",
          "border transition-all duration-[250ms]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7f77dd] focus-visible:ring-offset-2",
          checked
            ? trackOn
            : "bg-white/[0.12] border-white/[0.18]",
          disabled && "opacity-40 cursor-not-allowed"
        )}
      >
        {/* thumb */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white",
            "transition-[left] duration-[250ms]",
            checked ? "left-[20px]" : "left-[2px]"
          )}
        />
      </button>

      {label && (
        <label
          htmlFor={id}
          className={cn(
            "text-[13px] text-white/70 select-none",
            disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
          )}
          onClick={handleToggle}
        >
          {label}
        </label>
      )}
    </div>
  )
}
