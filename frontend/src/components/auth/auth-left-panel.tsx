// Left panel with Nexus branding for auth pages (desktop only)
export function AuthLeftPanel() {
  const features = [
    {
      label: "Intelligent Code Analysis",
      bg: "rgba(127,119,221,0.2)",
      stroke: "#afa9ec",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#afa9ec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
        </svg>
      ),
    },
    {
      label: "Automated Testing Suite",
      bg: "rgba(29,158,117,0.2)",
      stroke: "#5dcaa5",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5dcaa5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
    },
    {
      label: "Smart Deployment Pipeline",
      bg: "rgba(239,159,39,0.2)",
      stroke: "#fac775",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fac775" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
        </svg>
      ),
    },
    {
      label: "Real-time Collaboration",
      bg: "rgba(212,83,126,0.2)",
      stroke: "#ed93b1",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ed93b1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
  ]

  return (
    <div className="flex-1 glass-light p-[52px_48px] flex-col justify-between border-r border-white/[0.08] hidden md:flex">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-12">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #7f77dd, #1d9e75)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" />
          </svg>
        </div>
        <span className="text-white text-[17px] font-semibold tracking-tight">Nexus</span>
      </div>

      {/* Hero */}
      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-[32px] font-medium text-white leading-tight mb-4">
          Your AI-powered{" "}
          <span className="gradient-text">development team</span>{" "}
          awaits.
        </h2>
        <p className="text-[13px] leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.55)" }}>
          Orchestrate 14 specialized agents working in parallel to accelerate your software development lifecycle.
        </p>

        {/* Feature list */}
        <ul className="space-y-3.5">
          {features.map((f) => (
            <li key={f.label} className="flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: f.bg }}
              >
                {f.icon}
              </div>
              <span className="text-[13px] text-white/70">{f.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <p className="text-[11px] mt-10" style={{ color: "rgba(255,255,255,0.5)" }}>
        &copy; 2026 Nexus Inc.
      </p>
    </div>
  )
}
