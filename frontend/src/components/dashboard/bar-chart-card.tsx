import { Card } from "@/components/ui/card"

const BAR_DATA = [
  { label: "Mon", success: 60, failed: 20 },
  { label: "Tue", success: 75, failed: 15 },
  { label: "Wed", success: 50, failed: 30 },
  { label: "Thu", success: 85, failed: 10 },
  { label: "Fri", success: 70, failed: 25 },
  { label: "Sat", success: 45, failed: 15 },
  { label: "Sun", success: 65, failed: 20 },
]

const CHART_HEIGHT = 140

export function BarChartCard() {
  return (
    <Card className="glass-card p-5 gap-0">
      {/* Header */}
      <p style={{ fontSize: 14, fontWeight: 500, color: "#fff", marginBottom: 4 }}>
        Pipeline Runs
      </p>
      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 18 }}>
        Last 7 days
      </p>

      {/* Chart */}
      <div
        className="flex items-end"
        style={{ gap: 10, height: CHART_HEIGHT }}
      >
        {BAR_DATA.map(({ label, success, failed }) => (
          <div key={label} className="flex-1 flex flex-col items-center justify-end" style={{ height: "100%" }}>
            {/* Bars side by side */}
            <div className="flex items-end w-full" style={{ gap: 2, flex: 1 }}>
              <div
                className="flex-1"
                style={{
                  height: `${success}%`,
                  background: "#1d9e75",
                  borderRadius: "6px 6px 0 0",
                  minHeight: 4,
                }}
              />
              <div
                className="flex-1"
                style={{
                  height: `${failed}%`,
                  background: "#d85a30",
                  borderRadius: "6px 6px 0 0",
                  minHeight: 4,
                }}
              />
            </div>
            {/* Day label */}
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 6 }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center" style={{ gap: 16, marginTop: 14 }}>
        <div className="flex items-center" style={{ gap: 6 }}>
          <span
            style={{ width: 8, height: 8, borderRadius: "50%", background: "#1d9e75", display: "inline-block" }}
          />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>Success</span>
        </div>
        <div className="flex items-center" style={{ gap: 6 }}>
          <span
            style={{ width: 8, height: 8, borderRadius: "50%", background: "#d85a30", display: "inline-block" }}
          />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>Failed</span>
        </div>
      </div>
    </Card>
  )
}
