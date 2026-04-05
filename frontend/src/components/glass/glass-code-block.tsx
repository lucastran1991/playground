"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"

export interface GlassCodeBlockProps {
  code: string
  language?: string
  showHeader?: boolean
  copyable?: boolean
  className?: string
}

export function GlassCodeBlock({
  code,
  language = "plain",
  showHeader = true,
  copyable = true,
  className,
}: GlassCodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: ignore
    }
  }

  return (
    <div
      className={cn(className)}
      style={{
        background: "rgba(0,0,0,0.45)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      {showHeader && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 14px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Traffic light dots */}
          <div style={{ display: "flex", gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
          </div>

          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>
            {language}
          </span>

          {copyable && (
            <button
              onClick={handleCopy}
              style={{
                fontSize: 11,
                color: copied ? "rgba(40,200,64,0.8)" : "rgba(127,119,221,0.7)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "color .2s",
              }}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          )}
        </div>
      )}

      <pre
        style={{
          padding: "16px 18px",
          fontFamily: "monospace",
          fontSize: 12.5,
          lineHeight: 1.8,
          overflowX: "auto",
          color: "rgba(255,255,255,0.7)",
          margin: 0,
          whiteSpace: "pre",
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  )
}
