import { StatCard } from "@/components/dashboard/stat-card"

// Pipeline SVG icon
function PipelineIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M2 5h14M2 9h10M2 13h6" stroke="#afa9ec" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="14" cy="13" r="2.5" stroke="#afa9ec" strokeWidth="1.5" />
    </svg>
  )
}

// Check circle icon
function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="7" stroke="#5dcaa5" strokeWidth="1.5" />
      <path d="M5.5 9l2.5 2.5 5-5" stroke="#5dcaa5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Users icon
function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="7" cy="6" r="2.5" stroke="#ef9f27" strokeWidth="1.5" />
      <path d="M2 15c0-3 2-4.5 5-4.5s5 1.5 5 4.5" stroke="#ef9f27" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="13" cy="6" r="2" stroke="#ef9f27" strokeWidth="1.3" />
      <path d="M16 15c0-2.5-1.3-4-3-4.5" stroke="#ef9f27" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

// Clock icon
function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="7" stroke="#d4537e" strokeWidth="1.5" />
      <path d="M9 5.5V9l2.5 2" stroke="#d4537e" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

const STATS = [
  {
    icon: <PipelineIcon />,
    iconBg: "rgba(127,119,221,0.2)",
    value: "2,847",
    label: "Total Pipelines",
    change: { value: "+12.5%", direction: "up" as const },
  },
  {
    icon: <CheckIcon />,
    iconBg: "rgba(29,158,117,0.2)",
    value: "94.2%",
    label: "Success Rate",
    change: { value: "+3.1%", direction: "up" as const },
  },
  {
    icon: <UsersIcon />,
    iconBg: "rgba(239,159,39,0.2)",
    value: "14",
    label: "Active Agents",
    change: { value: "-2", direction: "down" as const },
  },
  {
    icon: <ClockIcon />,
    iconBg: "rgba(212,83,126,0.2)",
    value: "3m 42s",
    label: "Avg Duration",
    change: { value: "-8.3%", direction: "up" as const },
  },
]

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[14px]">
      {STATS.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}
