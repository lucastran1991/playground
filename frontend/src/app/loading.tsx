export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-glass">
      <div className="glass-card p-8">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-3 w-3 rounded-full bg-primary"
              style={{
                animation: "glass-pulse 1.2s ease-in-out infinite",
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
