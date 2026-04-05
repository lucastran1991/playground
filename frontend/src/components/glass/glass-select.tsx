import React, { useId } from "react"
import { cn } from "@/lib/utils"

export interface GlassSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  hint?: string
  error?: string
  options?: { value: string; label: string }[]
}

/**
 * GlassSelect — styled <select> with glass input appearance and a custom dropdown arrow.
 * Supports label, hint, error similar to GlassInput.
 */
export const GlassSelect = React.forwardRef<HTMLSelectElement, GlassSelectProps>(
  ({ label, hint, error, options, className, id, children, ...props }, ref) => {
    const autoId = useId()
    const selectId = id ?? autoId
    const hintId = hint ? `${selectId}-hint` : undefined
    const errorId = error ? `${selectId}-error` : undefined
    const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined

    const borderStyle = error
      ? "border-[rgba(216,90,48,0.6)] bg-[rgba(216,90,48,0.07)]"
      : "border-white/[0.12] bg-white/[0.07] focus:border-[rgba(127,119,221,0.6)] focus:bg-[rgba(127,119,221,0.08)] focus:shadow-[0_0_0_3px_rgba(127,119,221,0.15)]"

    return (
      <div className="flex flex-col gap-[6px] w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="text-[12px] font-medium text-white/60 uppercase tracking-wide"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(
              "w-full border rounded-[10px] text-white outline-none transition-all duration-200",
              "text-[13.5px] py-[11px] pl-[14px] pr-[36px]",
              "appearance-none cursor-pointer",
              // option background for dark theme
              "[&>option]:bg-[#1a1a2e] [&>option]:text-white",
              borderStyle,
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          {/* Custom chevron arrow */}
          <span className="pointer-events-none absolute right-[12px] top-1/2 -translate-y-1/2 text-white/40">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
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

GlassSelect.displayName = "GlassSelect"
