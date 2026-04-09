---
title: "Migrate from Glass Components to shadcn/ui + Glass Theme"
description: "Replace 34 custom glass components with themed shadcn/ui, keep glass CSS utilities"
status: pending
priority: P1
effort: 6h
branch: main
tags: [frontend, migration, shadcn, glassmorphism, cleanup]
created: 2026-04-06
---

# Migrate from Glass Components to shadcn/ui + Glass Theme

## Goal

Replace the custom `components/glass/` library (34 components) with shadcn/ui components themed via existing glass CSS variables. Only 7 glass components are actually imported outside `glass/` -- the migration surface is small.

## Key Insight

The `.dark {}` block in `globals.css` already maps shadcn CSS variables to glass colors. shadcn components will automatically render with glass palette. We only need to add `backdrop-filter` + glass borders where needed via utility classes.

## Actually Used Glass Components (7 total)

| Glass Component | Used In | Replacement |
|----------------|---------|-------------|
| `GlassCard` | bar-chart-card, activity-feed, donut-chart-card, user-list-card | shadcn `Card` + `glass-card` class |
| `GlassStatCard` | stats-grid | Custom `StatCard` in dashboard/ using shadcn Card |
| `GlassAvatar` | user-menu, user-list-card | shadcn `Avatar` |
| `GlassProgress` | user-list-card | Custom (shadcn Progress lacks circular + color variants) |
| `GlassSkeleton` | dashboard/page.tsx | shadcn `Skeleton` |
| `GlassButton` | theme-toggle | shadcn `Button` ghost variant |
| `GlassBreadcrumb` | topbar | shadcn `Breadcrumb` |

**27 glass components are NEVER imported outside glass/ -- pure dead code.**

## Phases

| # | Phase | Status | Effort | Deps |
|---|-------|--------|--------|------|
| 1 | [Install shadcn components](phase-01-install-shadcn-components.md) | pending | 1h | - |
| 2 | [Migrate dashboard components](phase-02-migrate-dashboard-components.md) | pending | 2.5h | Phase 1 |
| 3 | [Migrate auth pages](phase-03-migrate-auth-pages.md) | pending | 1h | Phase 1 |
| 4 | [Cleanup + polish](phase-04-cleanup-and-polish.md) | pending | 1.5h | Phases 2, 3 |

## Execution Order

```
Phase 1 (foundation) -> Phase 2 + 3 (parallel) -> Phase 4
```

## Risk

- **Low risk**: Only 7 components to swap, all within dashboard + auth
- shadcn Card uses `bg-card` which maps to `rgba(255,255,255,0.06)` in dark mode -- close to glass but missing `backdrop-filter`
- GlassProgress has circular variant + color props -- shadcn Progress lacks these. Keep as custom component.
