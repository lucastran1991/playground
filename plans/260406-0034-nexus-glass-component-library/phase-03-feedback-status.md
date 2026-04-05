---
phase: 3
title: "Feedback & Status Components"
status: completed
priority: P1
effort: 3h
depends_on: [1]
parallel_with: [2]
---

# Phase 3: Feedback & Status Components

## Context
- [design/nexus-glass-ui.html](../../design/nexus-glass-ui.html) -- badges (lines 196-274), alerts (lines 314-325), toast (lines 327-334), progress (lines 291-295), skeleton (lines 456-473)

## Components to Create

### 1. glass-badge.tsx
**Colors (6):** purple, teal, coral, pink, amber, gray
**Modifiers:** pill shape, large size, with dot indicator

Design CSS:
```
.badge: inline-flex, padding 3px 8px, border-radius 6px, font-size 11px, font-weight 500
.bdg-purple: bg rgba(127,119,221,0.2), color #afa9ec, border 1px solid rgba(127,119,221,0.3)
.bdg-teal: bg rgba(29,158,117,0.2), color #5dcaa5, border 1px solid rgba(29,158,117,0.3)
.bdg-coral: bg rgba(216,90,48,0.2), color #f0997b, border 1px solid rgba(216,90,48,0.3)
.bdg-pink: bg rgba(212,83,126,0.2), color #ed93b1, border 1px solid rgba(212,83,126,0.3)
.bdg-amber: bg rgba(186,117,23,0.2), color #fac775, border 1px solid rgba(186,117,23,0.3)
.bdg-gray: bg rgba(255,255,255,0.08), color rgba(255,255,255,0.45), border 1px solid rgba(255,255,255,0.12)
.bdg-pill: border-radius 20px, padding 3px 10px
.bdg-lg: font-size 12.5px, padding 5px 12px, border-radius 8px
```

**Props:**
```ts
interface GlassBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: "purple" | "teal" | "coral" | "pink" | "amber" | "gray"
  pill?: boolean
  size?: "sm" | "lg"
  dot?: boolean
}
```

### 2. glass-chip.tsx
Removable tag. Design: `.chip` -- padding 4px 10px, border-radius 20px, with close button.
Colors: purple (default), teal, coral, amber, pink.

**Props:**
```ts
interface GlassChipProps {
  color?: "purple" | "teal" | "coral" | "amber" | "pink"
  onRemove?: () => void
  children: React.ReactNode
}
```

### 3. glass-alert.tsx
**Types (4):** info, success, warning, error
With optional dismiss button.

Design CSS:
```
.alert: flex, padding 13px 15px, border-radius 12px, font-size 12.5px
.a-info: bg rgba(127,119,221,0.15), border 1px solid rgba(127,119,221,0.3), color #afa9ec
.a-success: bg rgba(29,158,117,0.15), border 1px solid rgba(29,158,117,0.3), color #5dcaa5
.a-warn: bg rgba(239,159,39,0.12), border 1px solid rgba(239,159,39,0.3), color #fac775
.a-error: bg rgba(216,90,48,0.15), border 1px solid rgba(216,90,48,0.3), color #f0997b
```

**Props:**
```ts
interface GlassAlertProps {
  type: "info" | "success" | "warning" | "error"
  title?: string
  children: React.ReactNode
  onDismiss?: () => void
  icon?: React.ReactNode
}
```

### 4. glass-toast.tsx
Floating notification card. Design: `.toast` -- bg rgba(10,8,30,0.85), border 1px solid rgba(255,255,255,0.12), backdrop-filter blur(20px), border-radius 14px, box-shadow 0 16px 40px rgba(0,0,0,0.4).

Needs a toast provider/context for positioning and auto-dismiss.

**Props:**
```ts
interface GlassToastProps {
  type?: "info" | "success" | "warning" | "error"
  title: string
  description?: string
  onClose?: () => void
  duration?: number // auto-dismiss ms
}
```

Consider a simple `useGlassToast()` hook + `<GlassToastProvider>` pattern.

### 5. glass-progress.tsx
**Variants:** bar, circular

Bar design:
```
.prog-bg: bg rgba(255,255,255,0.08), border-radius 6px
.prog-fill: height 100%, border-radius 6px
Heights: 4px (sm), 6px (md), 8px (lg)
```

Circular design (from `.circ-prog`): SVG circle with stroke-dasharray animation.

**Props:**
```ts
interface GlassProgressProps {
  value: number // 0-100
  variant?: "bar" | "circular"
  size?: "sm" | "md" | "lg"
  color?: "purple" | "teal" | "coral" | "amber"
  label?: string
  showValue?: boolean
}
```

### 6. glass-skeleton.tsx
Shimmer loading placeholder. Design: `.skel` -- linear-gradient shimmer animation, border-radius 6px.

**Props:**
```ts
interface GlassSkeletonProps {
  width?: string | number
  height?: string | number
  rounded?: "sm" | "md" | "lg" | "full"
  className?: string
}
```

### 7. glass-spinner.tsx
**Variants:** ring, dots, bars

Design:
```
.spin-ring: 32x32px, border 2.5px, border-top purple, animation spin 0.8s
.spin-dots: 3 dots, 8px each, pulse animation staggered
.spin-bars: 4 bars, bounce animation staggered
```

## Related Code Files
- **Create:** `frontend/src/components/glass/glass-badge.tsx`
- **Create:** `frontend/src/components/glass/glass-chip.tsx`
- **Create:** `frontend/src/components/glass/glass-alert.tsx`
- **Create:** `frontend/src/components/glass/glass-toast.tsx`
- **Create:** `frontend/src/components/glass/glass-progress.tsx`
- **Create:** `frontend/src/components/glass/glass-skeleton.tsx`
- **Create:** `frontend/src/components/glass/glass-spinner.tsx`
- **Update:** `frontend/src/components/glass/index.ts` (add exports)

## Implementation Steps
1. Implement glass-badge.tsx with 6 color variants
2. Implement glass-chip.tsx with remove callback
3. Implement glass-alert.tsx with 4 types + dismiss
4. Implement glass-toast.tsx + useGlassToast hook + provider
5. Implement glass-progress.tsx (bar + circular variants)
6. Implement glass-skeleton.tsx with shimmer animation
7. Implement glass-spinner.tsx (ring, dots, bars variants)
8. Update barrel index.ts
9. Build verification

## Todo
- [x] glass-badge.tsx
- [x] glass-chip.tsx
- [x] glass-alert.tsx
- [x] glass-toast.tsx + provider + hook
- [x] glass-progress.tsx (bar + circular)
- [x] glass-skeleton.tsx
- [x] glass-spinner.tsx
- [x] Update index.ts
- [x] Build verification

## Success Criteria
- All feedback components render with correct glass styling
- Toast auto-dismisses, stacks multiple toasts
- Progress bar and circular both animate smoothly
- Skeleton shimmer animation works
- Each file < 200 lines
