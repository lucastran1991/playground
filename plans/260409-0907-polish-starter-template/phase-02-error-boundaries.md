---
phase: 2
title: "Error Boundaries"
status: completed
priority: P2
effort: 30m
---

# Phase 2: Error Boundaries

## Overview

Add glass-themed error.tsx, loading.tsx, not-found.tsx to `frontend/src/app/`. Consistent with existing glassmorphism design system.

## Related Files

- Create: `frontend/src/app/error.tsx`
- Create: `frontend/src/app/loading.tsx`
- Create: `frontend/src/app/not-found.tsx`

## Key Design Tokens (from globals.css)

- Glass card: `glass-card` utility class (rgba bg + backdrop-filter + border)
- Primary purple: `text-primary` (#8b84e2 in dark)
- Muted text: `text-muted-foreground`
- Gradient text: `gradient-text` utility
- Gradient button: `gradient-btn` utility
- Background: `bg-gradient-glass` for full-page backgrounds

## Implementation Steps

### 1. `error.tsx` (client component)
- `"use client"` directive (required by Next.js)
- Glass card centered on page
- Show `error.message` with retry button
- Props: `{ error: Error & { digest?: string }; reset: () => void }`
- Use shadcn `Button` for reset action
- Keep under 40 lines

### 2. `loading.tsx`
- Simple glass skeleton/spinner centered
- Use existing `glass-card` utility
- Animated pulse or spin using `glass-pulse` keyframe from globals.css
- Keep under 20 lines

### 3. `not-found.tsx`
- Glass card with "Page not found" heading
- Link back to `/dashboard` (or `/`)
- Use shadcn `Button` as link
- Keep under 30 lines

## Todo

- [x] Create error.tsx with glass card + retry
- [x] Create loading.tsx with glass spinner
- [x] Create not-found.tsx with home link
- [x] Verify `pnpm build` still passes

## Success Criteria

- All 3 files render correctly in dark mode with glass styling
- Build passes without errors
- error.tsx correctly resets on retry click
