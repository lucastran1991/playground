import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export interface GlassBreadcrumbItem {
  label: string
  href?: string
}

export interface GlassBreadcrumbProps {
  items: GlassBreadcrumbItem[]
  separator?: React.ReactNode
  className?: string
}

export function GlassBreadcrumb({
  items,
  separator = "/",
  className,
}: GlassBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol
        className={cn(className)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12.5,
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <React.Fragment key={index}>
              <li>
                {isLast || !item.href ? (
                  <span
                    style={{
                      color: isLast ? "#fff" : "rgba(255,255,255,0.4)",
                    }}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    style={{
                      color: "#afa9ec",
                      textDecoration: "none",
                    }}
                  >
                    {item.label}
                  </Link>
                )}
              </li>

              {!isLast && (
                <li
                  aria-hidden="true"
                  style={{ color: "rgba(255,255,255,0.2)", userSelect: "none" }}
                >
                  {separator}
                </li>
              )}
            </React.Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
