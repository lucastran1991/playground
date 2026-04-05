import { GlassCard } from "@/components/glass"

interface ActivityItem {
  icon: string
  iconBg: string
  name: string
  time: string
  status: string
  statusColor: string
}

const ACTIVITY: ActivityItem[] = [
  {
    icon: "✓",
    iconBg: "rgba(29,158,117,0.2)",
    name: "Pipeline #2847 completed",
    time: "2 min ago",
    status: "+94.2%",
    statusColor: "#5dcaa5",
  },
  {
    icon: "⬡",
    iconBg: "rgba(127,119,221,0.2)",
    name: "Agent 'Reviewer' deployed",
    time: "15 min ago",
    status: "Active",
    statusColor: "#afa9ec",
  },
  {
    icon: "✕",
    iconBg: "rgba(216,90,48,0.2)",
    name: "Pipeline #2846 failed",
    time: "1 hour ago",
    status: "Failed",
    statusColor: "#d85a30",
  },
  {
    icon: "⟳",
    iconBg: "rgba(29,158,117,0.15)",
    name: "Schema migration ran",
    time: "3 hours ago",
    status: "Success",
    statusColor: "#5dcaa5",
  },
  {
    icon: "+",
    iconBg: "rgba(239,159,39,0.2)",
    name: "New agent registered",
    time: "5 hours ago",
    status: "Pending",
    statusColor: "#ef9f27",
  },
]

export function ActivityFeed() {
  return (
    <GlassCard padding="md">
      <p style={{ fontSize: 14, fontWeight: 500, color: "#fff", marginBottom: 14 }}>
        Recent Activity
      </p>

      <div>
        {ACTIVITY.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center"
            style={{
              gap: 12,
              padding: "10px 0",
              borderBottom:
                idx < ACTIVITY.length - 1
                  ? "1px solid rgba(255,255,255,0.06)"
                  : "none",
            }}
          >
            {/* Icon circle */}
            <div
              className="flex items-center justify-center shrink-0 rounded-full"
              style={{
                width: 32,
                height: 32,
                background: item.iconBg,
                fontSize: 13,
                color: "#fff",
              }}
            >
              {item.icon}
            </div>

            {/* Name + time */}
            <div className="flex-1 min-w-0">
              <p
                className="truncate"
                style={{ fontSize: 12.5, color: "rgba(255,255,255,0.85)", lineHeight: 1.3 }}
              >
                {item.name}
              </p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
                {item.time}
              </p>
            </div>

            {/* Status */}
            <span
              className="shrink-0"
              style={{ fontSize: 12.5, color: item.statusColor, fontWeight: 500 }}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
