"use client"

import { createContext, useContext, useState, useCallback } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Two dark variants: "deep" = default purple gradient, "midnight" = softer navy gradient
type DarkVariant = "deep" | "midnight"

const DarkVariantContext = createContext<{
  variant: DarkVariant
  toggleVariant: () => void
}>({ variant: "deep", toggleVariant: () => {} })

export function useThemeVariant() {
  return useContext(DarkVariantContext)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [variant, setVariant] = useState<DarkVariant>("deep")

  const toggleVariant = useCallback(() => {
    setVariant((v) => (v === "deep" ? "midnight" : "deep"))
  }, [])

  return (
    <NextThemesProvider attribute="class" forcedTheme="dark">
      <DarkVariantContext.Provider value={{ variant, toggleVariant }}>
        {/* .theme-midnight on wrapper div so it doesn't fight next-themes on <html> */}
        <div className={variant === "midnight" ? "theme-midnight" : ""}>
          {children}
        </div>
      </DarkVariantContext.Provider>
    </NextThemesProvider>
  )
}
