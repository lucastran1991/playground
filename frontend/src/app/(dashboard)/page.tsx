"use client"

import { useCurrentUser } from "@/hooks/use-api"
import { GlassSkeleton } from "@/components/glass/glass-skeleton"
import { StatsGrid } from "@/components/dashboard/stats-grid"
import { BarChartCard } from "@/components/dashboard/bar-chart-card"
import { DonutChartCard } from "@/components/dashboard/donut-chart-card"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { UserListCard } from "@/components/dashboard/user-list-card"

export default function DashboardPage() {
  const { data: user, isLoading } = useCurrentUser()

  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        {isLoading ? (
          <GlassSkeleton height={36} width={256} />
        ) : (
          <h1 className="text-3xl font-bold text-white">
            Welcome back,{" "}
            <span className="gradient-text">{user?.name ?? "User"}</span>
          </h1>
        )}
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>
          {dateStr}
        </p>
      </div>

      {/* Stats row */}
      <StatsGrid />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-[14px]">
        <BarChartCard />
        <DonutChartCard />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[14px]">
        <ActivityFeed />
        <UserListCard />
      </div>
    </div>
  )
}
