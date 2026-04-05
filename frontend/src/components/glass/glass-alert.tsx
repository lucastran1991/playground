import { cn } from "@/lib/utils"
import { HTMLAttributes, ReactNode } from "react"

// Alert type styles
const typeMap = {
  info: {
    bg: "bg-[rgba(127,119,221,0.15)]",
    border: "border-[rgba(127,119,221,0.3)]",
    text: "text-[#afa9ec]",
    iconColor: "#afa9ec",
  },
  success: {
    bg: "bg-[rgba(29,158,117,0.15)]",
    border: "border-[rgba(29,158,117,0.3)]",
    text: "text-[#5dcaa5]",
    iconColor: "#5dcaa5",
  },
  warning: {
    bg: "bg-[rgba(239,159,39,0.12)]",
    border: "border-[rgba(239,159,39,0.3)]",
    text: "text-[#fac775]",
    iconColor: "#fac775",
  },
  error: {
    bg: "bg-[rgba(216,90,48,0.15)]",
    border: "border-[rgba(216,90,48,0.3)]",
    text: "text-[#f0997b]",
    iconColor: "#f0997b",
  },
} as const

type AlertType = keyof typeof typeMap

// Default SVG icons per alert type
function DefaultIcon({ type, color }: { type: AlertType; color: string }) {
  if (type === "success") {
    return (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
        <circle cx="7.5" cy="7.5" r="6.5" stroke={color} strokeWidth="1.2" />
        <path d="M4.5 7.5l2 2 4-4" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  if (type === "warning") {
    return (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
        <path d="M7.5 1.5L13.5 13H1.5L7.5 1.5z" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M7.5 6v3" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="7.5" cy="10.5" r="0.6" fill={color} />
      </svg>
    )
  }
  if (type === "error") {
    return (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
        <circle cx="7.5" cy="7.5" r="6.5" stroke={color} strokeWidth="1.2" />
        <path d="M5 5l5 5M10 5l-5 5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    )
  }
  // info
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <circle cx="7.5" cy="7.5" r="6.5" stroke={color} strokeWidth="1.2" />
      <path d="M7.5 6.5v4" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="7.5" cy="4.5" r="0.6" fill={color} />
    </svg>
  )
}

interface GlassAlertProps extends HTMLAttributes<HTMLDivElement> {
  type?: AlertType
  title?: string
  onDismiss?: () => void
  icon?: ReactNode
}

export function GlassAlert({
  type = "info",
  title,
  onDismiss,
  icon,
  className,
  children,
  ...props
}: GlassAlertProps) {
  const t = typeMap[type]

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-[11px] px-[15px] py-[13px] rounded-[12px] border text-[12.5px]",
        t.bg,
        t.border,
        t.text,
        className
      )}
      {...props}
    >
      {/* Icon */}
      <span className="shrink-0 mt-px">
        {icon ?? <DefaultIcon type={type} color={t.iconColor} />}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <p className="text-[12.5px] font-medium mb-[2px]">{title}</p>
        )}
        {children && (
          <div className="text-[11.5px] opacity-70">{children}</div>
        )}
      </div>

      {/* Dismiss button */}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="ml-auto shrink-0 opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <path d="M1 1l11 11M12 1L1 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  )
}
