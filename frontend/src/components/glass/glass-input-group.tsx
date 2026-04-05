import React from "react"
import { cn } from "@/lib/utils"

export interface GlassInputGroupProps {
  /** Text or element shown before the input field */
  prefix?: React.ReactNode
  /** Text or element appended after the input field */
  append?: React.ReactNode
  className?: string
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}

/**
 * GlassInputGroup — flex row: optional prefix label + glass input + optional append button/element.
 * Prefix and append share the same border radius treatment as a unified group.
 */
export function GlassInputGroup({
  prefix,
  append,
  className,
  inputProps = {},
}: GlassInputGroupProps) {
  const { className: inputClassName, ...restInputProps } = inputProps

  return (
    <div className={cn("flex items-stretch w-full", className)}>
      {prefix && (
        <span
          className={cn(
            "flex items-center px-[12px] text-[13px] text-white/50 whitespace-nowrap",
            "bg-white/[0.05] border border-r-0 border-white/[0.12]",
            "rounded-l-[10px]"
          )}
        >
          {prefix}
        </span>
      )}

      <input
        className={cn(
          "flex-1 min-w-0 outline-none transition-all duration-200",
          "bg-white/[0.07] border border-white/[0.12] text-white",
          "text-[13.5px] py-[11px] px-[14px]",
          "placeholder:text-white/[0.22]",
          "focus:border-[rgba(127,119,221,0.6)] focus:bg-[rgba(127,119,221,0.08)]",
          "focus:shadow-[0_0_0_3px_rgba(127,119,221,0.15)]",
          // adjust border radius based on prefix/append presence
          prefix && append && "rounded-none",
          prefix && !append && "rounded-r-[10px]",
          !prefix && append && "rounded-l-[10px]",
          !prefix && !append && "rounded-[10px]",
          inputClassName
        )}
        {...restInputProps}
      />

      {append && (
        <div
          className={cn(
            "flex items-center",
            "border border-l-0 border-white/[0.12]",
            "rounded-r-[10px] overflow-hidden"
          )}
        >
          {append}
        </div>
      )}
    </div>
  )
}
