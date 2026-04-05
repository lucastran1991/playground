"use client"

import React, { useMemo } from "react"
import { cn } from "@/lib/utils"

export interface GlassPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
  className?: string
}

function ChevronLeft() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function buildPageRange(current: number, total: number, siblings: number): (number | "...")[] {
  const totalShown = siblings * 2 + 5 // siblings + current + 2 edges + 2 dots

  if (total <= totalShown) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const leftSibling = Math.max(current - siblings, 2)
  const rightSibling = Math.min(current + siblings, total - 1)
  const showLeftDots = leftSibling > 2
  const showRightDots = rightSibling < total - 1

  if (!showLeftDots && showRightDots) {
    const leftRange = Array.from({ length: 3 + siblings * 2 }, (_, i) => i + 1)
    return [...leftRange, "...", total]
  }

  if (showLeftDots && !showRightDots) {
    const rightRange = Array.from({ length: 3 + siblings * 2 }, (_, i) => total - (3 + siblings * 2) + i + 1)
    return [1, "...", ...rightRange]
  }

  const middleRange = Array.from({ length: rightSibling - leftSibling + 1 }, (_, i) => leftSibling + i)
  return [1, "...", ...middleRange, "...", total]
}

interface PageButtonProps {
  active?: boolean
  disabled?: boolean
  onClick?: () => void
  children: React.ReactNode
}

function PageButton({ active, disabled, onClick, children }: PageButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        minWidth: 34,
        height: 34,
        borderRadius: 9,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        color: active ? "#fff" : "rgba(255,255,255,0.5)",
        cursor: disabled ? "not-allowed" : "pointer",
        border: `1px solid ${active ? "rgba(127,119,221,0.4)" : "transparent"}`,
        background: active ? "rgba(127,119,221,0.25)" : "transparent",
        opacity: disabled ? 0.3 : 1,
        transition: "background .2s, color .2s, border-color .2s",
        padding: "0 6px",
      }}
      onMouseEnter={(e) => {
        if (!active && !disabled) {
          const el = e.currentTarget as HTMLButtonElement
          el.style.background = "rgba(255,255,255,0.08)"
          el.style.color = "#fff"
        }
      }}
      onMouseLeave={(e) => {
        if (!active && !disabled) {
          const el = e.currentTarget as HTMLButtonElement
          el.style.background = "transparent"
          el.style.color = "rgba(255,255,255,0.5)"
        }
      }}
    >
      {children}
    </button>
  )
}

export function GlassPagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}: GlassPaginationProps) {
  const pages = useMemo(
    () => buildPageRange(currentPage, totalPages, siblingCount),
    [currentPage, totalPages, siblingCount]
  )

  if (totalPages <= 1) return null

  return (
    <div
      className={cn(className)}
      style={{ display: "flex", gap: 4, alignItems: "center" }}
    >
      <PageButton
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft />
      </PageButton>

      {pages.map((page, i) =>
        page === "..." ? (
          <span
            key={`dots-${i}`}
            style={{ padding: "0 6px", color: "rgba(255,255,255,0.2)", fontSize: 13 }}
          >
            ...
          </span>
        ) : (
          <PageButton
            key={page}
            active={page === currentPage}
            onClick={() => onPageChange(page as number)}
          >
            {page}
          </PageButton>
        )
      )}

      <PageButton
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight />
      </PageButton>
    </div>
  )
}
