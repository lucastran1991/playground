---
phase: 5
title: "Overlay & Advanced Components"
status: completed
priority: P2
effort: 3h
depends_on: [2]
parallel_with: [4]
---

# Phase 5: Overlay & Advanced Components

## Context
- [design/nexus-glass-ui.html](../../design/nexus-glass-ui.html) -- dropdown (lines 416-436), command palette (lines 438-454), steps (lines 368-378), timeline (lines 406-414), tooltip (lines 433-436)

## Components to Create

### 1. glass-dropdown.tsx
Glass styled dropdown menu. Reuse Radix primitives from shadcn's DropdownMenu for a11y (focus trap, keyboard nav) but restyle.

Design CSS:
```
.dropdown: bg rgba(12,10,35,0.9), border 1px solid rgba(255,255,255,0.13), border-radius 13px, padding 6px, backdrop-filter blur(24px), min-width 180px, box-shadow 0 16px 40px rgba(0,0,0,0.4)
.dd-item: flex, padding 8px 11px, border-radius 8px, font-size 12.5px, color rgba(255,255,255,0.6)
.dd-item:hover: bg rgba(255,255,255,0.08), color #fff
.dd-item.active: bg rgba(127,119,221,0.15), color #afa9ec
.dd-item.danger:hover: bg rgba(216,90,48,0.12), color #f0997b
.dd-sep: height 1px, bg rgba(255,255,255,0.07), margin 4px 0
.dd-label: font-size 9.5px, uppercase, color rgba(255,255,255,0.2)
.dd-item-r: margin-left auto, font-size 10px (keyboard shortcut display)
```

**Approach:** Style shadcn's existing DropdownMenu with glass classes. Don't rebuild the interaction logic.

### 2. glass-context-menu.tsx
Same approach as dropdown but triggered by right-click. Design: `.ctx-menu` -- similar to dropdown but slightly different border-radius (12px).

**Approach:** Style shadcn's ContextMenu or build a lightweight version.

### 3. glass-tooltip.tsx
Design CSS:
```
.tt-box: bg rgba(10,8,30,0.9), border 1px solid rgba(255,255,255,0.13), border-radius 8px, padding 6px 11px, font-size 11.5px, color rgba(255,255,255,0.85), backdrop-filter blur(10px)
```

**Approach:** Style shadcn's existing Tooltip component with glass classes. Simple CSS override.

### 4. glass-command-palette.tsx
Search-driven command palette with categorized items.

Design CSS:
```
.cmd-palette: bg rgba(12,10,35,0.95), border 1px solid rgba(255,255,255,0.13), border-radius 16px, backdrop-filter blur(30px), box-shadow 0 32px 80px rgba(0,0,0,0.6)
.cmd-input-wrap: flex, padding 14px 16px, border-bottom 1px solid rgba(255,255,255,0.07)
.cmd-input: bg transparent, font-size 14px, color #fff
.cmd-section: font-size 10px, uppercase, color rgba(255,255,255,0.25)
.cmd-item: flex, padding 9px 14px; hover/sel: bg rgba(127,119,221,0.15)
.cmd-icon: 28x28px, border-radius 7px
.cmd-kbd: font-size 10px, bg rgba(255,255,255,0.07), border-radius 5px, monospace
.cmd-footer: padding 10px 14px, border-top
```

**Props:**
```ts
interface GlassCommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  groups: {
    label: string
    items: {
      icon?: React.ReactNode
      name: string
      description?: string
      shortcut?: string
      onSelect: () => void
    }[]
  }[]
  placeholder?: string
}
```

Consider using Cmd+K keyboard shortcut to open.

### 5. glass-steps.tsx
Step indicator. Design:
```
.step-circle: 32x32px, border-radius 50%, font-size 12px
.step-circle.done: bg rgba(29,158,117,0.3), border 2px solid #1d9e75, color #5dcaa5
.step-circle.active: bg rgba(127,119,221,0.3), border 2px solid #7f77dd, color #afa9ec
.step-circle.pending: bg rgba(255,255,255,0.06), border 2px solid rgba(255,255,255,0.15)
.step-line: height 1px between steps; .done = rgba(29,158,117,0.4)
.step-label: font-size 11px, color rgba(255,255,255,0.5)
```

**Props:**
```ts
interface GlassStepsProps {
  steps: { label: string }[]
  current: number // 0-indexed active step
}
```

### 6. glass-timeline.tsx
Vertical timeline. Design:
```
.tl-item: flex, gap 14px, padding-bottom 22px, vertical line via ::before
.tl-dot: 28x28px circle with icon
.tl-title: font-size 13px, color #fff
.tl-sub: font-size 11.5px, color rgba(255,255,255,0.4)
.tl-time: font-size 10.5px, color rgba(255,255,255,0.25)
```

**Props:**
```ts
interface GlassTimelineProps {
  items: {
    icon?: React.ReactNode
    iconBg?: string
    title: string
    description?: string
    time?: string
  }[]
}
```

## Related Code Files
- **Modify:** `frontend/src/components/ui/dropdown-menu.tsx` (add glass styling) OR create `glass-dropdown.tsx`
- **Modify:** `frontend/src/components/ui/tooltip.tsx` (add glass styling) OR create `glass-tooltip.tsx`
- **Create:** `frontend/src/components/glass/glass-command-palette.tsx`
- **Create:** `frontend/src/components/glass/glass-steps.tsx`
- **Create:** `frontend/src/components/glass/glass-timeline.tsx`
- **Update:** `frontend/src/components/glass/index.ts`

## Implementation Steps
1. Glass-style existing shadcn DropdownMenu + Tooltip (modify CSS in ui/ files)
2. Implement glass-command-palette.tsx (search + categorized items + keyboard)
3. Implement glass-steps.tsx (horizontal step indicator)
4. Implement glass-timeline.tsx (vertical timeline)
5. Update barrel exports
6. Build verification

## A11y
- Command palette: trap focus when open, Escape to close, arrow keys to navigate items
- Steps: `aria-current="step"` on active, `role="list"` container
- Timeline: semantic `<ol>` or `role="list"`

## Todo
- [x] Glass-style dropdown menu
- [x] Glass-style tooltip
- [x] glass-command-palette.tsx
- [x] glass-steps.tsx
- [x] glass-timeline.tsx
- [x] Update index.ts
- [x] Build verification

## Success Criteria
- Dropdown renders with glass blur + dark bg
- Command palette opens with Cmd+K, search filters items
- Steps show done/active/pending states correctly
- Timeline renders vertical line between items
- All files < 200 lines

## Risk Assessment
- Command palette is the most complex component here; may need to split into subfiles
- Dropdown/tooltip: modifying shadcn files vs creating new -- decide based on how much glass styling differs from base
