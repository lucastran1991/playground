import React, { useId } from "react"
import { cn } from "@/lib/utils"

export interface GlassTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  state?: "default" | "success" | "error"
  hint?: string
  error?: string
  label?: string
}

const stateStyles: Record<NonNullable<GlassTextareaProps["state"]>, string> = {
  default: [
    "border-white/[0.12] bg-white/[0.07]",
    "focus:border-[rgba(127,119,221,0.6)] focus:bg-[rgba(127,119,221,0.08)]",
    "focus:shadow-[0_0_0_3px_rgba(127,119,221,0.15)]",
  ].join(" "),
  success: "border-[rgba(29,158,117,0.6)] bg-[rgba(29,158,117,0.07)]",
  error: "border-[rgba(216,90,48,0.6)] bg-[rgba(216,90,48,0.07)]",
}

export const GlassTextarea = React.forwardRef<HTMLTextAreaElement, GlassTextareaProps>(
  ({ state = "default", hint, error, label, className, id, ...props }, ref) => {
    const autoId = useId()
    const textareaId = id ?? autoId
    const hintId = hint ? `${textareaId}-hint` : undefined
    const errorId = error ? `${textareaId}-error` : undefined
    const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined
    const resolvedState = error ? "error" : state

    return (
      <div className="flex flex-col gap-[6px] w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-[12px] font-medium text-white/60 uppercase tracking-wide"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={resolvedState === "error" ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "w-full border rounded-[10px] text-white outline-none transition-all duration-200",
            "text-[13.5px] py-[11px] px-[14px]",
            "placeholder:text-white/[0.22]",
            "resize-y min-h-[80px]",
            stateStyles[resolvedState],
            className
          )}
          {...props}
        />

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

GlassTextarea.displayName = "GlassTextarea"
