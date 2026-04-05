import React from "react"
import { cn } from "@/lib/utils"

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl"

const sizeMap: Record<AvatarSize, { px: number; fontSize: number }> = {
  xs: { px: 24, fontSize: 9 },
  sm: { px: 32, fontSize: 11 },
  md: { px: 40, fontSize: 13 },
  lg: { px: 52, fontSize: 16 },
  xl: { px: 68, fontSize: 22 },
}

// Online indicator dot size relative to avatar
const dotSize = 9

export interface GlassAvatarProps {
  size?: AvatarSize
  src?: string
  fallback?: string
  online?: boolean
  square?: boolean
  bg?: string
  className?: string
  alt?: string
}

export function GlassAvatar({
  size = "md",
  src,
  fallback,
  online = false,
  square = false,
  bg = "rgba(127,119,221,0.3)",
  className,
  alt = "",
}: GlassAvatarProps) {
  const { px, fontSize } = sizeMap[size]
  const borderRadius = square ? 10 : "50%"

  return (
    <div
      className={cn("relative inline-flex items-center justify-center shrink-0", className)}
      style={{ width: px, height: px }}
    >
      {/* Avatar image or fallback */}
      <div
        className="flex items-center justify-center overflow-hidden font-medium text-white"
        style={{
          width: px,
          height: px,
          borderRadius,
          background: src ? "transparent" : bg,
          fontSize,
        }}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius }}
          />
        ) : (
          <span>{fallback ?? "?"}</span>
        )}
      </div>

      {/* Online indicator */}
      {online && (
        <span
          aria-label="online"
          className="absolute block rounded-full"
          style={{
            width: dotSize,
            height: dotSize,
            background: "#5dcaa5",
            border: "2px solid #1a1535",
            bottom: 0,
            right: 0,
          }}
        />
      )}
    </div>
  )
}

export interface GlassAvatarStackProps {
  avatars: GlassAvatarProps[]
  size?: AvatarSize
  className?: string
}

export function GlassAvatarStack({
  avatars,
  size = "md",
  className,
}: GlassAvatarStackProps) {
  return (
    <div className={cn("flex items-center", className)}>
      {avatars.map((avatarProps, idx) => (
        <div
          key={idx}
          style={{
            marginLeft: idx === 0 ? 0 : -10,
            border: "2px solid rgba(15,12,41,0.9)",
            borderRadius: "50%",
            lineHeight: 0,
          }}
        >
          <GlassAvatar {...avatarProps} size={size} />
        </div>
      ))}
    </div>
  )
}
