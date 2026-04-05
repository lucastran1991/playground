import React, { useId } from "react"
import { cn } from "@/lib/utils"

export interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  state?: "default" | "success" | "error"
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  hint?: string
  error?: string
  label?: string
}

const stateStyles: Record<NonNullable<GlassInputProps["state"]>, string> = {
  default: "border-white/[0.12] bg-white/[0.07] focus:border-[rgba(127,119,221,0.6)] focus:bg-[rgba(127,119,221,0.08)] focus:shadow-[0_0_0_3px_rgba(127,119,221,0.15)]",
  success: "border-[rgba(29,158,117,0.6)] bg-[rgba(29,158,117,0.07)]",
  error: "border-[rgba(216,90,48,0.6)] bg-[rgba(216,90,48,0.07)]",
}

export const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  (
    {
      state = "default",
      iconLeft,
      iconRight,
      hint,
      error,
      label,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const autoId = useId()
    const inputId = id ?? autoId
    const hintId = hint ? `${inputId}-hint` : undefined
    const errorId = error ? `${inputId}-error` : undefined
    const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined
    const resolvedState = error ? "error" : state

    return (
      <div className="flex flex-col gap-[6px] w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[12px] font-medium text-white/60 uppercase tracking-wide"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {iconLeft && (
            <span className="absolute left-[12px] flex items-center text-white/40 pointer-events-none">
              {iconLeft}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-invalid={resolvedState === "error" ? true : undefined}
            aria-describedby={describedBy}
            className={cn(
              "w-full border rounded-[10px] text-white outline-none transition-all duration-200",
              "text-[13.5px] py-[11px] px-[14px]",
              "placeholder:text-white/[0.22]",
              stateStyles[resolvedState],
              iconLeft && "pl-[38px]",
              iconRight && "pr-[38px]",
              className
            )}
            {...props}
          />

          {iconRight && (
            <span className="absolute right-[12px] flex items-center text-white/40 pointer-events-none">
              {iconRight}
            </span>
          )}
        </div>

        {hint && !error && (
          <p id={hintId} className="text-[12px] text-white/40">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} className="text-[12px] text-[rgba(216,90,48,0.9)]">
            {error}
          </p>
        )}
      </div>
    )
  }
)

GlassInput.displayName = "GlassInput"
