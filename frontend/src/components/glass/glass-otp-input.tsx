"use client"

import React, { useRef, useId } from "react"
import { cn } from "@/lib/utils"

export interface GlassOtpInputProps {
  length?: number
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  className?: string
}

/**
 * GlassOtpInput — row of individual digit inputs for OTP codes.
 * Auto-advances on input, backtracks on Backspace, handles paste.
 */
export function GlassOtpInput({
  length = 6,
  value = "",
  onChange,
  disabled = false,
  className,
}: GlassOtpInputProps) {
  const baseId = useId()
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Pad or trim value to match length
  const digits = Array.from({ length }, (_, i) => value[i] ?? "")

  function focusAt(index: number) {
    inputRefs.current[index]?.focus()
  }

  function updateValue(index: number, char: string) {
    const next = digits.map((d, i) => (i === index ? char : d)).join("")
    onChange?.(next)
  }

  function handleChange(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "") // digits only
    if (!raw) return
    const char = raw[raw.length - 1] // take last digit on paste-like input
    updateValue(index, char)
    if (index < length - 1) focusAt(index + 1)
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      e.preventDefault()
      if (digits[index]) {
        updateValue(index, "")
      } else if (index > 0) {
        updateValue(index - 1, "")
        focusAt(index - 1)
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      focusAt(index - 1)
    } else if (e.key === "ArrowRight" && index < length - 1) {
      focusAt(index + 1)
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length)
    const next = Array.from({ length }, (_, i) => pasted[i] ?? digits[i] ?? "").join("")
    onChange?.(next)
    const lastFilled = Math.min(pasted.length, length - 1)
    focusAt(lastFilled)
  }

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    e.target.select()
  }

  return (
    <div
      className={cn("flex items-center gap-[8px]", className)}
      role="group"
      aria-label="One-time password input"
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el }}
          id={`${baseId}-${index}`}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          disabled={disabled}
          autoComplete={index === 0 ? "one-time-code" : "off"}
          aria-label={`Digit ${index + 1} of ${length}`}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={handleFocus}
          className={cn(
            "w-[44px] h-[48px] text-center",
            "border rounded-[10px] outline-none transition-all duration-200",
            "text-[18px] font-medium text-white",
            "bg-white/[0.07] border-white/[0.12]",
            "placeholder:text-white/[0.22]",
            "focus:border-[rgba(127,119,221,0.6)] focus:bg-[rgba(127,119,221,0.08)]",
            "focus:shadow-[0_0_0_3px_rgba(127,119,221,0.15)]",
            disabled && "opacity-40 cursor-not-allowed"
          )}
        />
      ))}
    </div>
  )
}
