"use client"

import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-glass p-4">
      <div className="glass-card max-w-md w-full p-8 text-center space-y-4">
        <div className="text-4xl font-bold gradient-text">Oops</div>
        <p className="text-muted-foreground">
          {error.message || "Something went wrong"}
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground/60 font-mono">
            {error.digest}
          </p>
        )}
        <Button onClick={reset} className="gradient-btn text-white">
          Try again
        </Button>
      </div>
    </div>
  )
}
