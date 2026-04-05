"use client"

import { createContext, useContext, useState, useCallback } from "react"

// Two dark variants: "deep" = default purple gradient, "midnight" = softer navy gradient
type DarkVariant = "deep" | "midnight"

const DarkVariantContext = createContext<{
  variant: DarkVariant
  toggleVariant: () => void
}>({ variant: "deep", toggleVariant: () => {} })

export function useThemeVariant() {
  return useContext(DarkVariantContext)
}

// Dark mode is forced via `dark` class on <html> in layout.tsx.
// No next-themes needed -- we only toggle between two dark variants.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [variant, setVariant] = useState<DarkVariant>("deep")

  const toggleVariant = useCallback(() => {
    setVariant((v) => (v === "deep" ? "midnight" : "deep"))
  }, [])

  return (
    <DarkVariantContext.Provider value={{ variant, toggleVariant }}>
      <div
        className={variant === "midnight" ? "theme-midnight" : undefined}
        suppressHydrationWarning
      >
        {children}
      </div>
    </DarkVariantContext.Provider>
  )
}
