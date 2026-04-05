import { cn } from "@/lib/utils"
import { CSSProperties } from "react"

interface GlassSkeletonProps {
  width?: string | number
  height?: string | number
  rounded?: boolean | string
  className?: string
}

// Shimmer skeleton using glass-shimmer keyframe defined in globals.css
export function GlassSkeleton({
  width,
  height,
  rounded,
  className,
}: GlassSkeletonProps) {
  const style: CSSProperties = {
    width: width !== undefined ? (typeof width === "number" ? `${width}px` : width) : undefined,
    height: height !== undefined ? (typeof height === "number" ? `${height}px` : height) : undefined,
    background:
      "linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.06) 75%)",
    backgroundSize: "800px 100%",
    animation: "glass-shimmer 1.6s infinite",
    borderRadius:
      rounded === true
        ? "9999px"
        : typeof rounded === "string"
        ? rounded
        : "6px",
  }

  return (
    <div
      role="status"
      aria-label="Loading..."
      className={cn("block", className)}
      style={style}
    />
  )
}
