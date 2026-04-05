"use client"

import React, { useId } from "react"
import { cn } from "@/lib/utils"

export interface GlassCheckboxProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: string
  disabled?: boolean
  className?: string
}

/** Checkmark SVG icon shown when checked */
function CheckIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M1.5 5L4 7.5L8.5 2.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * GlassCheckbox — custom accessible checkbox with glass styling.
 * Uses role="checkbox" + aria-checked. Keyboard: Space to toggle.
 */
export function GlassCheckbox({
  checked = false,
  onCheckedChange,
  label,
  disabled = false,
  className,
}: GlassCheckboxProps) {
  const id = useId()

  function handleToggle() {
    if (!disabled) onCheckedChange?.(!checked)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === " ") {
      e.preventDefault()
      handleToggle()
    }
  }

  return (
    <div className={cn("flex items-center gap-[8px]", className)}>
      <button
        id={id}
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-disabled={disabled}
        disabled={disabled}
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={cn(
          "inline-flex items-center justify-center shrink-0",
          "w-[17px] h-[17px] rounded-[5px]",
          "border-[1.5px] transition-all duration-200 cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7f77dd] focus-visible:ring-offset-2",
          checked
            ? "bg-[rgba(127,119,221,0.55)] border-[#7f77dd]"
            : "bg-white/[0.06] border-white/[0.25]",
          disabled && "opacity-40 cursor-not-allowed"
        )}
      >
        {checked && <CheckIcon />}
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
