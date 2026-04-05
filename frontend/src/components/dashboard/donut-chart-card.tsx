import { GlassCard } from "@/components/glass"

// Donut segment data: label, percentage, color
const SEGMENTS = [
  { label: "Orchestration", value: 40, color: "#7f77dd" },
  { label: "Testing",        value: 25, color: "#1d9e75" },
  { label: "Deployment",     value: 20, color: "#ef9f27" },
  { label: "Analysis",       value: 15, color: "#d4537e" },
]

const TOTAL = "2,847"
const SVG_SIZE = 120
const STROKE_WIDTH = 14
const RADIUS = (SVG_SIZE - STROKE_WIDTH * 2) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const CENTER = SVG_SIZE / 2

// Build stroke-dasharray segments from percentage list
function buildSegments() {
  let offset = 0
  return SEGMENTS.map(({ value, color }) => {
    const dash = (value / 100) * CIRCUMFERENCE
    // Small gap between segments
    const gap = 3
    const result = { color, dash: dash - gap, offset, total: CIRCUMFERENCE }
    offset += dash
    return result
  })
}

export function DonutChartCard() {
  const segments = buildSegments()

  return (
    <GlassCard padding="md">
      <p style={{ fontSize: 14, fontWeight: 500, color: "#fff", marginBottom: 16 }}>
        Distribution
      </p>

      {/* SVG donut + center label */}
      <div className="flex justify-center" style={{ marginBottom: 18 }}>
        <div className="relative" style={{ width: SVG_SIZE, height: SVG_SIZE }}>
          <svg
            width={SVG_SIZE}
            height={SVG_SIZE}
            style={{ transform: "rotate(-90deg)" }}
          >
            {/* Track */}
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth={STROKE_WIDTH}
            />
            {/* Colored segments */}
            {segments.map((seg, i) => (
              <circle
                key={i}
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                fill="none"
                stroke={seg.color}
                strokeWidth={STROKE_WIDTH}
                strokeDasharray={`${seg.dash} ${seg.total - seg.dash}`}
                strokeDashoffset={-seg.offset}
                strokeLinecap="butt"
              />
            ))}
          </svg>
          {/* Center text */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ pointerEvents: "none" }}
          >
            <span style={{ fontSize: 18, fontWeight: 600, color: "#fff", lineHeight: 1 }}>
              {TOTAL}
            </span>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 3 }}>
              total
            </span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col" style={{ gap: 8 }}>
        {SEGMENTS.map(({ label, value, color }) => (
          <div key={label} className="flex items-center" style={{ gap: 8 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: color,
                flexShrink: 0,
                display: "inline-block",
              }}
            />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", flex: 1 }}>
              {label}
            </span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginLeft: "auto" }}>
              {value}%
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
