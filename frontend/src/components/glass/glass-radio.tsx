"use client"

import React, { useId } from "react"
import { cn } from "@/lib/utils"

export interface GlassRadioProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: string
  name?: string
  value?: string
  disabled?: boolean
  className?: string
}

/**
 * GlassRadio — custom radio button with glass styling.
 * Uses role="radio" + aria-checked. Keyboard: Space to select.
 */
export function GlassRadio({
  checked = false,
  onCheckedChange,
  label,
  name,
  value,
  disabled = false,
  className,
}: GlassRadioProps) {
  const id = useId()

  function handleSelect() {
    if (!disabled && !checked) onCheckedChange?.(true)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === " ") {
      e.preventDefault()
      handleSelect()
    }
  }

  return (
    <div className={cn("flex items-center gap-[8px]", className)}>
      <button
        id={id}
        type="button"
        role="radio"
        aria-checked={checked}
        aria-disabled={disabled}
        data-name={name}
        data-value={value}
        disabled={disabled}
        tabIndex={0}
        onClick={handleSelect}
        onKeyDown={handleKeyDown}
        className={cn(
          "inline-flex items-center justify-center shrink-0",
          "w-[17px] h-[17px] rounded-full",
          "border-[1.5px] transition-all duration-200 cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7f77dd] focus-visible:ring-offset-2",
          checked
            ? "border-[#7f77dd] bg-white/[0.06]"
            : "border-white/[0.25] bg-white/[0.06]",
          disabled && "opacity-40 cursor-not-allowed"
        )}
      >
        {/* Inner dot shown when selected */}
        {checked && (
          <span
            aria-hidden="true"
            className="w-[7px] h-[7px] rounded-full bg-[#7f77dd]"
          />
        )}
      </button>

      {label && (
        <label
          htmlFor={id}
          className={cn(
            "text-[13px] text-white/70 select-none",
            disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
          )}
          onClick={handleSelect}
        >
          {label}
        </label>
      )}
    </div>
  )
}
