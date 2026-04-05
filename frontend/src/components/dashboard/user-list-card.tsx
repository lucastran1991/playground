import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ColorProgress } from "@/components/ui/color-progress"

interface TeamMember {
  name: string
  role: string
  progress: number
  color: "purple" | "teal" | "amber" | "coral"
  avatarBg: string
  fallback: string
}

const TEAM: TeamMember[] = [
  {
    name: "Alex Chen",
    role: "Lead",
    progress: 87,
    color: "purple",
    avatarBg: "rgba(127,119,221,0.35)",
    fallback: "AC",
  },
  {
    name: "Sarah Kim",
    role: "Developer",
    progress: 64,
    color: "teal",
    avatarBg: "rgba(29,158,117,0.35)",
    fallback: "SK",
  },
  {
    name: "Mike Torres",
    role: "DevOps",
    progress: 92,
    color: "amber",
    avatarBg: "rgba(239,159,39,0.35)",
    fallback: "MT",
  },
  {
    name: "Lisa Park",
    role: "Analyst",
    progress: 45,
    color: "coral",
    avatarBg: "rgba(212,83,126,0.35)",
    fallback: "LP",
  },
]

export function UserListCard() {
  return (
    <Card className="glass-card p-5 gap-0">
      <p style={{ fontSize: 14, fontWeight: 500, color: "#fff", marginBottom: 14 }}>
        Team Members
      </p>

      <div>
        {TEAM.map((member, idx) => (
          <div
            key={member.name}
            className="flex items-center"
            style={{
              gap: 10,
              marginBottom: idx < TEAM.length - 1 ? 14 : 0,
            }}
          >
            {/* Avatar: sm = h-8 w-8 */}
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback
                className="text-xs text-white font-medium"
                style={{ background: member.avatarBg }}
              >
                {member.fallback}
              </AvatarFallback>
            </Avatar>

            {/* Name + role */}
            <div style={{ width: 90, flexShrink: 0 }}>
              <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.85)", lineHeight: 1.3 }}>
                {member.name}
              </p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>
                {member.role}
              </p>
            </div>

            {/* Progress bar */}
            <div className="flex-1">
              <ColorProgress
                value={member.progress}
                color={member.color}
                size="sm"
              />
            </div>

            {/* Percentage */}
            <span
              className="shrink-0"
              style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", width: 32, textAlign: "right" }}
            >
              {member.progress}%
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
