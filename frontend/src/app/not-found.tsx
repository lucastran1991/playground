import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-glass p-4">
      <div className="glass-card max-w-md w-full p-8 text-center space-y-4">
        <div className="text-6xl font-bold gradient-text">404</div>
        <p className="text-muted-foreground">Page not found</p>
        <Link
          href="/"
          className="inline-block gradient-btn text-white px-6 py-2 rounded-lg transition-all"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
