---
phase: 1
title: "Install shadcn Components"
status: pending
priority: P1
effort: 1h
---

# Phase 1: Install shadcn Components

## Context Links
- [globals.css](../../frontend/src/app/globals.css) -- glass CSS vars already in `.dark {}`
- [components.json](../../frontend/components.json) -- shadcn config (style: base-nova)
- [Existing ui/](../../frontend/src/components/ui/) -- already has button, card, input, label, skeleton, separator, sheet, sidebar, tooltip, dropdown-menu

## Overview

Install additional shadcn components needed to replace glass/ imports. Verify they pick up glass theme automatically from CSS variables.

## Key Insights

- shadcn is already configured (components.json exists, style: base-nova)
- `Card` already exists in ui/ -- just needs glass styling override
- `Skeleton` already exists in ui/
- `Button` already exists in ui/
- Need to ADD: `Avatar`, `Breadcrumb`, `Progress` (evaluate if useful)
- shadcn CSS var mapping: `--card` = `rgba(255,255,255,0.06)` in dark mode -- already glass-colored
- Missing from CSS vars: `backdrop-filter`, glass border glow -- must add via utility class

## Requirements

### Functional
- Install shadcn Avatar, Breadcrumb via CLI
- Verify dark mode renders glass colors correctly
- Ensure no conflicts with existing ui/ components

### Non-functional
- Zero visual regression on sidebar (uses existing shadcn components)
- Build must pass after install

## Implementation Steps

1. Run shadcn add commands:
   ```bash
   cd frontend
   npx shadcn@latest add avatar breadcrumb
   ```

2. Verify `globals.css` was not overwritten (shadcn CLI sometimes modifies it)

3. Add glass-card override to shadcn Card -- modify `ui/card.tsx`:
   - Add `glass-card` CSS class by default in dark mode, OR
   - Better: create a `className` convention where consumers add `glass-card`
   - Decision: Do NOT bake glass-card into Card component itself (YAGNI for non-glass pages). Instead, add at call sites.

4. Run `pnpm build` to verify no errors

## Todo List
- [ ] Install shadcn Avatar
- [ ] Install shadcn Breadcrumb
- [ ] Verify dark mode glass colors on new components
- [ ] Verify build passes
- [ ] Verify existing sidebar/sheet still works

## Success Criteria
- New shadcn components installed in `ui/`
- `pnpm build` succeeds
- Dark mode renders correct glass colors via CSS vars

## Risk Assessment
- **Low**: shadcn CLI may overwrite globals.css -- check diff after install
- **Low**: base-nova style may have different component structure than expected

## Related Code Files
### Modify
- None (CLI generates new files)

### Create (via shadcn CLI)
- `frontend/src/components/ui/avatar.tsx`
- `frontend/src/components/ui/breadcrumb.tsx`

### Verify (no changes)
- `frontend/src/components/ui/card.tsx`
- `frontend/src/components/ui/button.tsx`
- `frontend/src/components/ui/skeleton.tsx`
- `frontend/src/app/globals.css`
