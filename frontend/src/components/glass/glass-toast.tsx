"use client"

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useState,
  ReactNode,
} from "react"
import { cn } from "@/lib/utils"

// --- Types ---

type ToastType = "info" | "success" | "warning" | "error"

interface ToastItem {
  id: string
  type: ToastType
  title: string
  description?: string
  duration: number
}

interface ToastContextValue {
  toast: (opts: Omit<ToastItem, "id">) => void
}

// --- Color map ---

const typeMap = {
  info:    { icon: "#afa9ec", bg: "rgba(127,119,221,0.25)" },
  success: { icon: "#5dcaa5", bg: "rgba(29,158,117,0.25)" },
  warning: { icon: "#fac775", bg: "rgba(239,159,39,0.25)" },
  error:   { icon: "#f0997b", bg: "rgba(216,90,48,0.25)" },
} as const

// --- Icon ---

function ToastIcon({ type }: { type: ToastType }) {
  const color = typeMap[type].icon
  const bg = typeMap[type].bg
  if (type === "success") return (
    <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: bg }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7l3 3 5-5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </span>
  )
  if (type === "warning") return (
    <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: bg }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2L13 12H1L7 2z" stroke={color} strokeWidth="1.2" strokeLinejoin="round" /><path d="M7 6v2.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" /><circle cx="7" cy="10" r=".5" fill={color} /></svg>
    </span>
  )
  if (type === "error") return (
    <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: bg }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 4l6 6M10 4l-6 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" /></svg>
    </span>
  )
  return (
    <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: bg }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke={color} strokeWidth="1.2" /><path d="M7 6v3.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" /><circle cx="7" cy="4.5" r=".5" fill={color} /></svg>
    </span>
  )
}

// --- Single Toast Card ---

interface GlassToastProps {
  type?: ToastType
  title: string
  description?: string
  onClose?: () => void
  duration?: number
}

export function GlassToast({ type = "info", title, description, onClose }: GlassToastProps) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-[13px] rounded-[14px] w-full max-w-[340px] pointer-events-auto"
      style={{
        background: "rgba(10,8,30,0.85)",
        border: "1px solid rgba(255,255,255,0.12)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
      }}
      role="status"
      aria-live="polite"
    >
      <ToastIcon type={type} />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-white leading-tight">{title}</p>
        {description && (
          <p className="text-[11.5px] text-[rgba(255,255,255,0.45)] mt-0.5 leading-tight">{description}</p>
        )}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="ml-auto shrink-0 text-[rgba(255,255,255,0.25)] hover:text-[rgba(255,255,255,0.6)] transition-colors cursor-pointer"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  )
}

// --- Context ---

const GlassToastContext = createContext<ToastContextValue | null>(null)

// --- Provider ---

export function GlassToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const baseId = useId()
  let counter = 0

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (opts: Omit<ToastItem, "id">) => {
      const id = `${baseId}-${Date.now()}-${counter++}`
      setToasts((prev) => [...prev, { ...opts, id }])
      setTimeout(() => dismiss(id), opts.duration ?? 4000)
    },
    [baseId, dismiss]
  )

  return (
    <GlassToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast stack — bottom-right */}
      <div
        aria-label="Notifications"
        className={cn(
          "fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 items-end pointer-events-none"
        )}
      >
        {toasts.map((t) => (
          <GlassToast
            key={t.id}
            type={t.type}
            title={t.title}
            description={t.description}
            onClose={() => dismiss(t.id)}
          />
        ))}
      </div>
    </GlassToastContext.Provider>
  )
}

// --- Hook ---

export function useGlassToast(): ToastContextValue {
  const ctx = useContext(GlassToastContext)
  if (!ctx) throw new Error("useGlassToast must be used within GlassToastProvider")
  return ctx
}
