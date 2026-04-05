"use client"

import { useThemeVariant } from "@/providers/theme-provider"
import { Button } from "@/components/ui/button"

// Toggles between "deep" (default purple gradient) and "midnight" (softer navy gradient)
export function ThemeToggle() {
  const { variant, toggleVariant } = useThemeVariant()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="bg-white/[0.07] border border-white/[0.12] hover:bg-white/[0.13]"
      onClick={toggleVariant}
      aria-label={`Switch to ${variant === "deep" ? "midnight" : "deep"} theme`}
    >
      {variant === "deep" ? (
        // Moon icon — click to switch to midnight
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        // Star icon — click to switch back to deep
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      )}
    </Button>
  )
}
