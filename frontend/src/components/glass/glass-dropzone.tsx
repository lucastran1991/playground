"use client"

import React, { useCallback, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export interface GlassDropzoneProps {
  accept?: string
  maxSize?: number
  multiple?: boolean
  onFilesSelected?: (files: File[]) => void
  className?: string
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function GlassDropzone({
  accept,
  maxSize,
  multiple = false,
  onFilesSelected,
  className,
}: GlassDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback(
    (newFiles: File[]) => {
      const filtered = maxSize ? newFiles.filter((f) => f.size <= maxSize) : newFiles
      const updated = multiple ? [...files, ...filtered] : filtered.slice(0, 1)
      setFiles(updated)
      onFilesSelected?.(updated)
    },
    [files, maxSize, multiple, onFilesSelected]
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    addFiles(Array.from(e.dataTransfer.files))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files))
  }

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index)
    setFiles(updated)
    onFilesSelected?.(updated)
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Drop area */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: `1.5px dashed ${isDragging ? "rgba(127,119,221,0.5)" : "rgba(255,255,255,0.18)"}`,
          background: isDragging ? "rgba(127,119,221,0.06)" : "transparent",
          borderRadius: 14,
          padding: 28,
          textAlign: "center",
          cursor: "pointer",
          transition: "border-color .2s, background .2s",
        }}
      >
        {/* Upload icon */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "rgba(127,119,221,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(127,119,221,0.8)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 16 12 12 8 16" />
            <line x1="12" y1="12" x2="12" y2="21" />
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
          </svg>
        </div>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", marginBottom: 4 }}>
          Drag & drop files here
        </p>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
          {accept ? `Accepts: ${accept}` : "Any file type"}{maxSize ? ` · Max ${formatBytes(maxSize)}` : ""}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          style={{ display: "none" }}
        />
      </div>

      {/* File list */}
      {files.map((file, i) => (
        <div
          key={`${file.name}-${i}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: 10,
            marginTop: 10,
          }}
        >
          <div style={{ width: 30, height: 30, borderRadius: 7, background: "rgba(127,119,221,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(127,119,221,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.8)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {file.name}
          </span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>
            {formatBytes(file.size)}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); removeFile(i) }}
            style={{ marginLeft: "auto", color: "rgba(255,255,255,0.25)", background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex", alignItems: "center" }}
            aria-label="Remove file"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}
