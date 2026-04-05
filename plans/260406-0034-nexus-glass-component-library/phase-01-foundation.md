---
phase: 1
title: "Foundation -- CSS Variables & Keyframes"
status: completed
priority: P1
effort: 1h
---

# Phase 1: Foundation

## Context
- [design/nexus-glass-ui.html](../../design/nexus-glass-ui.html) -- `:root` block (lines 14-26), keyframes (lines 457-460)
- [frontend/src/app/globals.css](../../frontend/src/app/globals.css) -- current tokens

## Overview
Add missing color tokens, glass utility classes, and animation keyframes from the design reference to globals.css. The dark mode tokens are partially done; need to add the component-specific palette colors and keyframes.

## Key Insights
- globals.css already has `.dark` tokens, glass utilities (glass-light, glass-dark, glass-card, glass-input, gradient-btn)
- Missing: explicit named color vars (--purple, --teal, --coral, --pink, --amber, --blue), animation keyframes, component glass patterns
- Design uses raw color values; we need CSS custom properties for reuse across glass components

## Requirements

### CSS Variables to Add (inside `.dark` or `:root`)
From design `:root` (line 14-26):
```css
--glass-purple: #7f77dd;
--glass-purple-light: #afa9ec;
--glass-purple-dark: #534ab7;
--glass-teal: #1d9e75;
--glass-teal-light: #5dcaa5;
--glass-teal-dark: #0f6e56;
--glass-coral: #d85a30;
--glass-coral-light: #f0997b;
--glass-coral-dark: #993c1d;
--glass-pink: #d4537e;
--glass-pink-light: #ed93b1;
--glass-amber: #ef9f27;
--glass-amber-light: #fac775;
--glass-amber-dark: #ba7517;
--glass-blue: #378add;
--glass-blue-light: #85b7eb;
--glass-bg: rgba(255,255,255,0.07);
--glass-border: rgba(255,255,255,0.12);
--glass-bg-dark: rgba(0,0,0,0.28);
--glass-text: #ffffff;
--glass-text-muted: rgba(255,255,255,0.45);
--glass-text-hint: rgba(255,255,255,0.28);
```

### Keyframes to Add
From design (lines 457-460):
```css
@keyframes glass-spin { to { transform: rotate(360deg); } }
@keyframes glass-pulse { 0%,100% { opacity:1; } 50% { opacity:.3; } }
@keyframes glass-bounce { 0%,80%,100% { transform: scaleY(0.4); } 40% { transform: scaleY(1); } }
@keyframes glass-shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
```

### Tailwind v4 Theme Extension
Add glass colors to `@theme inline` block so they're available as Tailwind utilities:
```css
--color-glass-purple: var(--glass-purple);
--color-glass-teal: var(--glass-teal);
--color-glass-coral: var(--glass-coral);
--color-glass-pink: var(--glass-pink);
--color-glass-amber: var(--glass-amber);
--color-glass-blue: var(--glass-blue);
```

## Related Code Files
- **Modify:** `frontend/src/app/globals.css`
- **No new files** in this phase

## Implementation Steps
1. Read current globals.css fully
2. Add `--glass-*` color variables inside `.dark {}` block
3. Add keyframes in `@layer utilities` or at root level
4. Add Tailwind theme mappings in `@theme inline` block
5. Verify no conflicts with existing shadcn tokens
6. Run `pnpm build` to verify no CSS errors

## Todo
- [x] Add glass color CSS variables
- [x] Add animation keyframes
- [x] Add Tailwind v4 theme color mappings
- [x] Verify build passes

## Success Criteria
- All glass color vars available in dark mode
- `glass-spin`, `glass-pulse`, `glass-bounce`, `glass-shimmer` keyframes defined
- Tailwind utilities like `text-glass-purple`, `bg-glass-teal` work
- Existing styles unaffected

## Risk Assessment
- Low risk: additive CSS changes only
- Potential: Tailwind v4 theme syntax differences -- verify `@theme inline` accepts new vars
