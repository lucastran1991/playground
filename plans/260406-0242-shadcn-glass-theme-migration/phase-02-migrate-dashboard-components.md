---
phase: 2
title: "Migrate Dashboard Components"
status: pending
priority: P1
effort: 2.5h
depends_on: [phase-01]
---

# Phase 2: Migrate Dashboard Components

## Context Links
- [dashboard/page.tsx](../../frontend/src/app/(dashboard)/dashboard/page.tsx)
- [stats-grid.tsx](../../frontend/src/components/dashboard/stats-grid.tsx)
- [bar-chart-card.tsx](../../frontend/src/components/dashboard/bar-chart-card.tsx)
- [donut-chart-card.tsx](../../frontend/src/components/dashboard/donut-chart-card.tsx)
- [activity-feed.tsx](../../frontend/src/components/dashboard/activity-feed.tsx)
- [user-list-card.tsx](../../frontend/src/components/dashboard/user-list-card.tsx)
- [user-menu.tsx](../../frontend/src/components/dashboard/user-menu.tsx)
- [topbar.tsx](../../frontend/src/components/dashboard/topbar.tsx)
- [theme-toggle.tsx](../../frontend/src/components/dashboard/theme-toggle.tsx)

## Overview

Replace all 7 glass component imports in dashboard files with shadcn equivalents + glass CSS utility classes.

## Key Insights

### Import Map (glass -> shadcn)

| File | Glass Import | Replacement |
|------|-------------|-------------|
| bar-chart-card.tsx | `GlassCard` | shadcn `Card` + `className="glass-card"` |
| activity-feed.tsx | `GlassCard` | shadcn `Card` + `className="glass-card"` |
| donut-chart-card.tsx | `GlassCard` | shadcn `Card` + `className="glass-card"` |
| user-list-card.tsx | `GlassCard`, `GlassAvatar`, `GlassProgress` | shadcn Card+Avatar, keep Progress custom |
| stats-grid.tsx | `GlassStatCard` | Move StatCard to `dashboard/stat-card.tsx` |
| user-menu.tsx | `GlassAvatar` | shadcn `Avatar` |
| topbar.tsx | `GlassBreadcrumb` | shadcn `Breadcrumb` |
| theme-toggle.tsx | `GlassButton` | shadcn `Button` variant="ghost" |
| dashboard/page.tsx | `GlassSkeleton` | shadcn `Skeleton` |

### GlassCard -> shadcn Card Differences

| Property | GlassCard | shadcn Card |
|----------|-----------|-------------|
| Background | `rgba(255,255,255,0.07)` | `bg-card` = `rgba(255,255,255,0.06)` -- close enough |
| Backdrop filter | `blur(16px)` | None -- add via `glass-card` utility class |
| Border | `rgba(255,255,255,0.12)` | `ring-1 ring-foreground/10` -- similar |
| Border radius | `rounded-[16px]` | `rounded-xl` (12px) -- add `rounded-2xl` override |
| Padding | `p-[20px]` (md default) | Padding on CardContent, not Card itself |

**Action**: When replacing GlassCard, use `<Card className="glass-card p-5">` or use Card + CardContent.

### GlassAvatar -> shadcn Avatar Differences

| Property | GlassAvatar | shadcn Avatar |
|----------|-------------|---------------|
| Sizes | xs/sm/md/lg/xl with px map | Fixed size via className |
| Fallback bg | Custom `bg` prop | AvatarFallback component |
| Online dot | Built-in `online` prop | Must add manually |

**Action**: shadcn Avatar uses `Avatar > AvatarImage + AvatarFallback` pattern. For the online dot in user-menu, add a relative positioned span.

### GlassProgress -- KEEP AS CUSTOM

shadcn Progress is a simple bar. GlassProgress has:
- Circular variant (used? check: not directly, but UserListCard uses bar only)
- Color variants (purple/teal/coral/amber)
- Label + showValue

**Decision**: Extract GlassProgress to `components/ui/glass-progress.tsx` as standalone (no glass/ dependency). Only bar variant + color prop are used in user-list-card.

### GlassStatCard -- MOVE TO DASHBOARD

StatCard is app-specific (icon, value, label, change indicator). No shadcn equivalent. Move to `components/dashboard/stat-card.tsx`, rewrite to use shadcn Card internally.

### GlassSkeleton -> shadcn Skeleton

GlassSkeleton uses inline styles with glass-shimmer animation. shadcn Skeleton uses `animate-pulse`. Visual difference is minor. Accept the shimmer->pulse tradeoff or add glass-shimmer class to shadcn Skeleton.

**Decision**: Use shadcn Skeleton as-is. Add `style` overrides at call site if exact shimmer needed.

## Requirements

### Functional
- All dashboard pages render identically (or near-identical) after migration
- No glass/ imports remain in dashboard/ or app/(dashboard)/

### Non-functional
- All components under 200 lines
- Build passes

## Implementation Steps

### Step 1: Create stat-card.tsx (move from glass)
1. Create `frontend/src/components/dashboard/stat-card.tsx`
2. Copy GlassStatCard logic, replace glass styling with shadcn Card + `glass-card` class
3. Keep ArrowUp/ArrowDown SVGs inline (small)
4. Export as `StatCard` (drop "Glass" prefix)

### Step 2: Extract progress component
1. Create `frontend/src/components/ui/color-progress.tsx`
2. Copy only the bar variant from GlassProgress (circular unused outside glass/)
3. Keep color prop (purple/teal/coral/amber)
4. Remove circular variant (YAGNI)

### Step 3: Migrate bar-chart-card.tsx
1. Replace `import { GlassCard } from "@/components/glass"` with `import { Card } from "@/components/ui/card"`
2. Replace `<GlassCard padding="md">` with `<Card className="glass-card p-5">`

### Step 4: Migrate activity-feed.tsx
1. Same pattern as Step 3

### Step 5: Migrate donut-chart-card.tsx
1. Same pattern as Step 3

### Step 6: Migrate user-list-card.tsx
1. Replace GlassCard with shadcn Card
2. Replace GlassAvatar with shadcn Avatar + AvatarFallback
3. Replace GlassProgress with new ColorProgress from `ui/color-progress.tsx`
4. Match avatar bg colors via AvatarFallback className

### Step 7: Migrate stats-grid.tsx
1. Replace `import { GlassStatCard } from "@/components/glass"` with `import { StatCard } from "@/components/dashboard/stat-card"`
2. Update component name in JSX

### Step 8: Migrate user-menu.tsx
1. Replace GlassAvatar with shadcn Avatar + AvatarFallback
2. Keep DropdownMenu usage as-is (already shadcn)

### Step 9: Migrate topbar.tsx
1. Replace GlassBreadcrumb with shadcn Breadcrumb components
2. Map `items` prop to `BreadcrumbList > BreadcrumbItem > BreadcrumbLink` pattern
3. Keep SidebarTrigger as-is

### Step 10: Migrate theme-toggle.tsx
1. Replace GlassButton with shadcn Button variant="ghost"
2. Add glass styling: `className="bg-white/[0.07] border border-white/[0.12]"`

### Step 11: Migrate dashboard/page.tsx
1. Replace GlassSkeleton with shadcn Skeleton
2. Add `className="h-9 w-64"` to match original dimensions

### Step 12: Verify
1. Run `pnpm build`
2. Visual check dashboard in browser

## Todo List
- [ ] Create `dashboard/stat-card.tsx` from GlassStatCard
- [ ] Create `ui/color-progress.tsx` (bar-only, with color prop)
- [ ] Migrate bar-chart-card.tsx
- [ ] Migrate activity-feed.tsx
- [ ] Migrate donut-chart-card.tsx
- [ ] Migrate user-list-card.tsx
- [ ] Migrate stats-grid.tsx
- [ ] Migrate user-menu.tsx
- [ ] Migrate topbar.tsx (GlassBreadcrumb -> shadcn Breadcrumb)
- [ ] Migrate theme-toggle.tsx (GlassButton -> shadcn Button)
- [ ] Migrate dashboard/page.tsx (GlassSkeleton -> shadcn Skeleton)
- [ ] Build passes
- [ ] Visual verification

## Success Criteria
- Zero imports from `@/components/glass` in dashboard/ and app/(dashboard)/
- Dashboard renders with glass appearance
- Build passes

## Risk Assessment
- **Medium**: Card padding model differs (GlassCard has `padding` prop, shadcn uses CardContent). Must manually add `p-5` class.
- **Low**: Avatar size differences -- shadcn Avatar uses `h-X w-X` classes instead of pixel sizes
- **Low**: Breadcrumb API differs significantly (GlassBreadcrumb takes `items[]` array, shadcn uses composition pattern)

## Related Code Files

### Create
- `frontend/src/components/dashboard/stat-card.tsx`
- `frontend/src/components/ui/color-progress.tsx`

### Modify
- `frontend/src/components/dashboard/bar-chart-card.tsx`
- `frontend/src/components/dashboard/activity-feed.tsx`
- `frontend/src/components/dashboard/donut-chart-card.tsx`
- `frontend/src/components/dashboard/user-list-card.tsx`
- `frontend/src/components/dashboard/stats-grid.tsx`
- `frontend/src/components/dashboard/user-menu.tsx`
- `frontend/src/components/dashboard/topbar.tsx`
- `frontend/src/components/dashboard/theme-toggle.tsx`
- `frontend/src/app/(dashboard)/dashboard/page.tsx`
