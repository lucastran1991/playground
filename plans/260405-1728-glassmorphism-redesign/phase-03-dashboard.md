# Phase 3: Dashboard

## Context
- Design HTML: `design/glassmorphism_login_page.html` (glass styles reference)
- Phase 1 must be complete (glass utilities available)

## Overview
- **Priority:** P1
- **Status:** pending
- **Description:** Apply glassmorphism styling to dashboard layout, sidebar, topbar, and stat cards. Nexus branding in sidebar header.

## Key Insights
- Dashboard has no direct design reference -- extrapolate glass style from login page
- Sidebar: use `glass-sidebar` utility (blur 24px, white/6 bg, white/8 border-right)
- Topbar: use `glass-topbar` utility (blur 20px, black/20 bg, white/8 border-bottom)
- Stat cards: use `glass-card` utility
- Keep existing shadcn Sidebar primitives, just override styles
- Replace "App" branding with "Nexus" + logo icon

## Requirements

### Functional
- Glass sidebar with Nexus branding
- Glass topbar with blur effect
- Glass stat cards on dashboard page
- Updated nav item active state: purple accent (`rgba(127,119,221,0.15)` bg, `#afa9ec` text)
- Welcome heading with gradient text for user name

### Non-functional
- Maintain shadcn SidebarProvider behavior
- Keep existing responsive sidebar collapse

## Related Code Files
- **Modify:** `frontend/src/app/(dashboard)/layout.tsx`
- **Modify:** `frontend/src/components/dashboard/sidebar-nav.tsx`
- **Modify:** `frontend/src/components/dashboard/topbar.tsx`
- **Modify:** `frontend/src/app/(dashboard)/page.tsx`

## Implementation Steps

### Step 1: Update `(dashboard)/layout.tsx`
Add gradient background to the dashboard wrapper:

```tsx
export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-glass relative overflow-hidden">
      {/* Subtle orbs for dashboard (smaller, more transparent) */}
      <div className="orb w-[400px] h-[400px] bg-[#7f77dd] -top-32 -left-24 absolute opacity-20" />
      <div className="orb w-[300px] h-[300px] bg-[#1d9e75] -bottom-20 -right-16 absolute opacity-20" />

      <SidebarProvider>
        <SidebarNav />
        <SidebarInset>
          <Topbar />
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
```

### Step 2: Update `sidebar-nav.tsx`
Change the Sidebar wrapper to use glass styling:

```tsx
<Sidebar className="glass-sidebar border-r-0">
  <SidebarHeader className="border-b border-white/8 px-6 py-4">
    <Link href="/dashboard" className="flex items-center gap-3">
      {/* Nexus logo icon - same as auth left panel */}
      <div className="w-[32px] h-[32px] rounded-[9px] flex items-center justify-center"
           style={{ background: "linear-gradient(135deg, #7f77dd, #1d9e75)" }}>
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
          <path d="M10 2L18 7V13L10 18L2 13V7L10 2Z" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/>
          <circle cx="10" cy="10" r="2.5" fill="#fff"/>
        </svg>
      </div>
      <span className="text-base font-medium text-white">Nexus</span>
    </Link>
  </SidebarHeader>
  ...
</Sidebar>
```

Nav item active state override -- add className to SidebarMenuButton:
- Active: `data-[active=true]:bg-[rgba(127,119,221,0.15)] data-[active=true]:text-[#afa9ec]`
- Hover: `hover:bg-white/8 hover:text-white`
- Default text: `text-white/55`

### Step 3: Update `topbar.tsx`
Replace `bg-background` and `border-b` with glass topbar:

```tsx
<header className="sticky top-0 z-10 flex h-16 items-center justify-between glass-topbar px-4">
```

Remove the existing `border-b bg-background` classes. The `glass-topbar` utility handles bg, blur, and border.

### Step 4: Update `(dashboard)/page.tsx`
Glass stat cards:

```tsx
<h1 className="text-3xl font-bold text-white">
  Welcome back, <span className="gradient-text">{user?.name ?? "User"}</span>
</h1>

// Stat cards: replace <Card> with glass-styled div
{stats.map((stat) => (
  <div key={stat.title} className="glass-card p-6">
    <p className="text-sm font-medium text-white/45 mb-2">{stat.title}</p>
    <p className="text-2xl font-bold text-white">{stat.value}</p>
  </div>
))}
```

Alternative: keep `<Card>` component -- the CSS var overrides from Phase 1 (`--card: rgba(255,255,255,0.06)`) should already make cards semi-transparent. Add `backdrop-filter: blur(16px)` via `glass-card` class on the Card.

Decision: use `<Card className="glass-card">` to keep shadcn semantics while adding glass effect.

## Todo List
- [ ] Update dashboard layout with gradient bg and subtle orbs
- [ ] Update sidebar-nav with glass-sidebar, Nexus branding, purple active states
- [ ] Update topbar with glass-topbar utility
- [ ] Update dashboard page with gradient text welcome and glass stat cards
- [ ] Verify sidebar collapse still works
- [ ] Verify breadcrumb/user-menu still visible against glass topbar

## Success Criteria
- Dashboard has gradient background with glass panels
- Sidebar shows Nexus logo + name
- Active nav item highlighted in purple
- Stat cards have glass effect
- All existing functionality preserved (sidebar toggle, user menu, theme toggle)

## Risk Assessment
- **shadcn Sidebar internals:** Glass classes may conflict with internal shadcn styles. Fix: use CSS specificity or override via `className` prop.
- **Theme toggle:** Currently shows light/dark toggle. Since we're dark-only, consider hiding it. Decision: keep for now, hide in Phase 5 if needed.

## Security Considerations
- No auth/data changes

## Next Steps
- Depends on Phase 1 completion
- Can run parallel with Phases 2, 4
