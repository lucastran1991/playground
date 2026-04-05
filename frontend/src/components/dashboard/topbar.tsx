"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { GlassBreadcrumb } from "@/components/glass/glass-breadcrumb"
import { UserMenu } from "./user-menu"
import { ThemeToggle } from "./theme-toggle"

export function Topbar() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between glass-topbar px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.12)" }} aria-hidden="true" />
        <GlassBreadcrumb items={[{ label: "Dashboard" }]} />
      </div>
      <div className="flex items-center gap-2">
        {/* Search placeholder — hidden on mobile */}
        <div
          className="hidden md:flex items-center"
          style={{
            gap: 8,
            padding: "8px 14px",
            borderRadius: 20,
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <circle cx="6" cy="6" r="4.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.4" />
            <path d="M9.5 9.5L12 12" stroke="rgba(255,255,255,0.4)" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Search...</span>
        </div>

        {/* Notification bell */}
        <div className="relative">
          <button
            aria-label="Notifications"
            className="flex items-center justify-center"
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M8 2a4.5 4.5 0 0 0-4.5 4.5v2.25L2 10.25V11h12v-.75l-1.5-1.5V6.5A4.5 4.5 0 0 0 8 2z"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="1.3"
                strokeLinejoin="round"
              />
              <path d="M6.5 11.5a1.5 1.5 0 0 0 3 0" stroke="rgba(255,255,255,0.6)" strokeWidth="1.3" />
            </svg>
          </button>
          {/* Red dot indicator */}
          <span
            className="absolute"
            style={{
              top: 2,
              right: 2,
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#d85a30",
              border: "1.5px solid rgba(15,12,41,0.9)",
            }}
          />
        </div>

        {/* Pro pill */}
        <span
          style={{
            padding: "6px 14px",
            borderRadius: 20,
            fontSize: 12,
            background: "rgba(127,119,221,0.2)",
            color: "#afa9ec",
            border: "1px solid rgba(127,119,221,0.3)",
            fontWeight: 500,
          }}
        >
          Pro
        </span>

        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}
