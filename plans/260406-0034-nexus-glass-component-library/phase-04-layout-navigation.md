---
phase: 4
title: "Layout & Navigation Components"
status: completed
priority: P2
effort: 3h
depends_on: [2]
parallel_with: [5]
---

# Phase 4: Layout & Navigation Components

## Context
- [design/nexus-glass-ui.html](../../design/nexus-glass-ui.html) -- cards (lines 123-167), tabs (lines 347-353), accordion (lines 397-404), table (lines 381-394), avatars (lines 276-288)

## Components to Create

### 1. glass-card.tsx
**Variants:** default, stat, profile, pricing, feature

Default: `.glass` class -- bg rgba(255,255,255,0.07), backdrop-filter blur(16px), border 1px solid rgba(255,255,255,0.12), border-radius 16px.

Stat card (from dashboard):
```
.stat-card: padding 18px 20px, border-radius 14px
.stat-icon: 38x38px, border-radius 10px
.stat-val: font-size 26px, font-weight 500
.stat-lbl: font-size 12px, color rgba(255,255,255,0.4)
.stat-change: font-size 11px (.up = #5dcaa5, .down = #f0997b)
```

**Props:**
```ts
interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "stat" | "profile" | "pricing" | "feature"
  padding?: "none" | "sm" | "md" | "lg"
}

// Stat card convenience component
interface GlassStatCardProps {
  icon: React.ReactNode
  iconBg: string
  value: string | number
  label: string
  change?: { value: string; direction: "up" | "down" }
}
```

### 2. glass-tabs.tsx
**Variants:** pill (default), underline

Pill tabs design:
```
.tabs: flex, gap 2px, bg rgba(255,255,255,0.06), border-radius 12px, padding 4px
.tab: padding 7px 16px, border-radius 9px, font-size 12.5px, color rgba(255,255,255,0.4)
.tab.active: bg rgba(127,119,221,0.3), color #fff, border 1px solid rgba(127,119,221,0.35)
```

Underline tabs design:
```
.tabs-underline: flex, border-bottom 1px solid rgba(255,255,255,0.08)
.tab-ul: padding 10px 18px, font-size 13px, color rgba(255,255,255,0.4)
.tab-ul.active: color #afa9ec, border-bottom 2px solid #7f77dd
```

**Props:**
```ts
interface GlassTabsProps {
  tabs: { label: string; value: string }[]
  value: string
  onValueChange: (value: string) => void
  variant?: "pill" | "underline"
}
```

### 3. glass-accordion.tsx
Design CSS:
```
.acc-item: border-bottom 1px solid rgba(255,255,255,0.06)
.acc-header: flex, padding 13px 16px, font-size 13px, color rgba(255,255,255,0.8)
.acc-icon: 18x18px, transition transform 0.2s; rotates 180deg when open
.acc-body: padding 0 16px 14px, font-size 12.5px, color rgba(255,255,255,0.4)
```

**Props:**
```ts
interface GlassAccordionProps {
  items: { title: string; content: React.ReactNode }[]
  type?: "single" | "multiple" // single = only one open at a time
  defaultOpen?: string[] // item indices
}
```

### 4. glass-table.tsx
Design CSS:
```
.tbl th: font-size 10.5px, color rgba(255,255,255,0.3), uppercase, letter-spacing 0.07em, padding 9px 13px
.tbl td: font-size 12.5px, color rgba(255,255,255,0.7), padding 11px 13px
.tbl tr:hover td: bg rgba(255,255,255,0.025)
.tbl-striped tr:nth-child(even) td: bg rgba(255,255,255,0.02)
```

**Props:**
```ts
interface GlassTableProps<T> {
  columns: { key: string; header: string; render?: (row: T) => React.ReactNode }[]
  data: T[]
  striped?: boolean
}
```

### 5. glass-list.tsx
Rich list items. Design: `.list-item` -- flex, padding 11px 14px, hover bg rgba(255,255,255,0.04).
Each item: icon (34x34px rounded), title, subtitle, right-side content.

### 6. glass-avatar.tsx
**Sizes (5):** xs (24px), sm (32px), md (40px), lg (52px), xl (68px)
**Features:** online indicator, square variant, stacked group

Design CSS:
```
.av: border-radius 50%, flex-shrink 0
.av-xs: 24x24px, font-size 9px
.av-sm: 32x32px, font-size 11px
.av-md: 40x40px, font-size 13px
.av-lg: 52x52px, font-size 16px
.av-xl: 68x68px, font-size 22px
.av-online::after: 9x9px green dot (#5dcaa5) at bottom-right
.av-sq: border-radius 10px
.av-stack .av: border 2px solid rgba(15,12,41,0.9), margin-left -10px
```

**Props:**
```ts
interface GlassAvatarProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  src?: string
  fallback: string // initials
  online?: boolean
  square?: boolean
  bg?: string // gradient or color string
}

interface GlassAvatarStackProps {
  children: React.ReactNode
  max?: number // show "+N" for overflow
}
```

## Related Code Files
- **Create:** `frontend/src/components/glass/glass-card.tsx`
- **Create:** `frontend/src/components/glass/glass-stat-card.tsx` (if glass-card.tsx > 200 lines)
- **Create:** `frontend/src/components/glass/glass-tabs.tsx`
- **Create:** `frontend/src/components/glass/glass-accordion.tsx`
- **Create:** `frontend/src/components/glass/glass-table.tsx`
- **Create:** `frontend/src/components/glass/glass-list.tsx`
- **Create:** `frontend/src/components/glass/glass-avatar.tsx`
- **Update:** `frontend/src/components/glass/index.ts`

## Implementation Steps
1. Implement glass-card.tsx (default wrapper + stat card convenience)
2. Implement glass-tabs.tsx (pill + underline variants)
3. Implement glass-accordion.tsx (single/multiple expand modes)
4. Implement glass-table.tsx (generic typed table with striped option)
5. Implement glass-list.tsx (rich list items)
6. Implement glass-avatar.tsx (sizes, online, square, stack)
7. Update barrel index.ts
8. Build verification

## Todo
- [x] glass-card.tsx + glass-stat-card.tsx
- [x] glass-tabs.tsx (pill + underline)
- [x] glass-accordion.tsx
- [x] glass-table.tsx
- [x] glass-list.tsx
- [x] glass-avatar.tsx + glass-avatar-stack
- [x] Update index.ts
- [x] Build verification

## Success Criteria
- Card variants match design reference exactly
- Tabs switch smoothly, active state visible
- Accordion animates open/close
- Table renders with hover + optional striping
- Avatar sizes match pixel-perfect
- All files < 200 lines
