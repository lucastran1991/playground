import React from "react"
import { cn } from "@/lib/utils"

export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "success" | "danger" | "warning" | "ghost" | "outline" | "link"
  size?: "xs" | "sm" | "md" | "lg"
  pill?: boolean
  iconOnly?: boolean
  fullWidth?: boolean
  loading?: boolean
  asChild?: boolean
}

// Spinner shown during loading state
function Spinner() {
  return (
    <svg
      className="animate-spin"
      style={{ width: 14, height: 14 }}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}

const variantStyles: Record<NonNullable<GlassButtonProps["variant"]>, string> = {
  primary: [
    "text-white border-0",
    "[background:linear-gradient(135deg,#7f77dd,#534ab7)]",
    "hover:[background:linear-gradient(135deg,#afa9ec,#7f77dd)]",
    "hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(127,119,221,0.35)]",
  ].join(" "),
  success: [
    "text-white border-0",
    "[background:linear-gradient(135deg,#1d9e75,#0f6e56)]",
    "hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(29,158,117,0.3)]",
  ].join(" "),
  danger: [
    "text-white border-0",
    "[background:linear-gradient(135deg,#d85a30,#993c1d)]",
    "hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(216,90,48,0.3)]",
  ].join(" "),
  warning: [
    "text-white border-0",
    "[background:linear-gradient(135deg,#ef9f27,#ba7517)]",
  ].join(" "),
  ghost: [
    "bg-white/[0.07] border border-white/[0.14] text-white/70",
    "hover:bg-white/[0.13] hover:text-white",
  ].join(" "),
  outline: [
    "bg-transparent text-[#afa9ec] border border-[rgba(127,119,221,0.5)]",
    "hover:bg-[rgba(127,119,221,0.1)]",
  ].join(" "),
  link: [
    "bg-transparent text-[#afa9ec] underline border-0",
    "!px-[4px]",
  ].join(" "),
}

const sizeStyles: Record<NonNullable<GlassButtonProps["size"]>, string> = {
  xs: "px-[9px] py-[4px] text-[10.5px] rounded-[6px]",
  sm: "px-[12px] py-[6px] text-[11.5px] rounded-[8px]",
  md: "px-[18px] py-[9px] text-[13px] rounded-[10px]",
  lg: "px-[26px] py-[12px] text-[14.5px] rounded-[12px]",
}

export const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      pill,
      iconOnly,
      fullWidth,
      loading,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading ? true : undefined}
        className={cn(
          // base styles
          "inline-flex items-center justify-center gap-[7px]",
          "font-medium transition-all duration-200 cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7f77dd] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
          // size
          iconOnly
            ? "p-[8px] w-[34px] h-[34px] rounded-[9px] bg-white/[0.07] border border-white/[0.12]"
            : sizeStyles[size],
          // variant (skip for iconOnly)
          !iconOnly && variantStyles[variant],
          // modifiers
          pill && "!rounded-[20px]",
          fullWidth && "w-full",
          isDisabled && "opacity-40 cursor-not-allowed pointer-events-none",
          className
        )}
        {...props}
      >
        {loading && <Spinner />}
        {children}
      </button>
    )
  }
)

GlassButton.displayName = "GlassButton"
