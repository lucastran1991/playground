---
phase: 8
title: "Integration & Migration"
status: completed
priority: P2
effort: 1.5h
depends_on: [1, 2, 3, 4, 5, 6, 7]
---

# Phase 8: Integration & Migration

## Context
- Current shadcn imports: Button, Input, Label, Card, Avatar, DropdownMenu, Separator, Breadcrumb, Tooltip, Skeleton, Sheet, Sidebar
- Auth pages: already use inline glass styling (no shadcn Button/Input/Label)
- Dashboard: uses shadcn Sidebar, Card, Skeleton + glass CSS overlay classes

## Overview
Replace shadcn component imports with glass equivalents across all pages. Remove unused shadcn component files. Keep shadcn for Sidebar, Sheet (complex behavioral components).

## Migration Map

| shadcn Component | Glass Replacement | Files to Update |
|-----------------|-------------------|-----------------|
| `ui/button` | `glass/glass-button` | auth forms (already inline, formalize), dashboard |
| `ui/input` | `glass/glass-input` | auth forms (already inline, formalize) |
| `ui/label` | Remove (use `glass-input` label prop or plain `<label>`) | auth forms |
| `ui/card` | `glass/glass-card` | dashboard page |
| `ui/avatar` | `glass/glass-avatar` | dashboard topbar, user menu |
| `ui/skeleton` | `glass/glass-skeleton` | dashboard loading states |
| `ui/breadcrumb` | `glass/glass-breadcrumb` | if used anywhere |
| `ui/tooltip` | Glass-styled `ui/tooltip` (modified in Phase 5) | dashboard |
| `ui/separator` | `glass/glass-divider` | if used anywhere |
| `ui/dropdown-menu` | Glass-styled (modified in Phase 5) | user menu |
| `ui/sidebar` | **KEEP** -- style with glass classes | sidebar-nav.tsx |
| `ui/sheet` | **KEEP** -- style with glass classes | mobile sidebar |

## Files to Keep in `ui/`
- `sidebar.tsx` -- complex, many subcomponents, used extensively
- `sheet.tsx` -- animation, portal, a11y
- `dropdown-menu.tsx` -- Radix primitives (glass-styled in Phase 5)
- `tooltip.tsx` -- Radix primitives (glass-styled in Phase 5)

## Files to Remove from `ui/` (after migration)
- `button.tsx` -- replaced by glass-button
- `input.tsx` -- replaced by glass-input
- `label.tsx` -- no longer needed
- `card.tsx` -- replaced by glass-card
- `avatar.tsx` -- replaced by glass-avatar
- `skeleton.tsx` -- replaced by glass-skeleton
- `breadcrumb.tsx` -- replaced by glass-breadcrumb
- `separator.tsx` -- replaced by glass-divider

## Related Code Files
- **Modify:** `frontend/src/components/auth/login-form.tsx` -- use GlassButton, GlassInput
- **Modify:** `frontend/src/components/auth/register-form.tsx` -- use GlassButton, GlassInput
- **Modify:** `frontend/src/components/auth/social-login-buttons.tsx` -- use GlassButton ghost variant
- **Modify:** `frontend/src/components/dashboard/user-menu.tsx` -- use GlassAvatar
- **Modify:** `frontend/src/components/dashboard/topbar.tsx` -- use glass components
- **Modify:** `frontend/src/app/(dashboard)/dashboard/page.tsx` -- use GlassCard
- **Delete:** `frontend/src/components/ui/button.tsx`
- **Delete:** `frontend/src/components/ui/input.tsx`
- **Delete:** `frontend/src/components/ui/label.tsx`
- **Delete:** `frontend/src/components/ui/card.tsx`
- **Delete:** `frontend/src/components/ui/avatar.tsx`
- **Delete:** `frontend/src/components/ui/skeleton.tsx`
- **Delete:** `frontend/src/components/ui/breadcrumb.tsx`
- **Delete:** `frontend/src/components/ui/separator.tsx`

## Implementation Steps
1. Search all imports of shadcn components to identify every usage: `grep -r "from.*@/components/ui/" frontend/src/`
2. Update auth pages (login-form, register-form, social-login-buttons) to import from glass/
3. Update dashboard components to import from glass/
4. Update any other pages referencing shadcn components being replaced
5. Verify no remaining imports of deleted shadcn files
6. Delete unused shadcn component files
7. Run `pnpm build` to verify no broken imports
8. Manual visual check of all pages

## Pre-Migration Checklist
- [x] All glass components from phases 2-6 are built and build-passing
- [x] Glass component props are compatible with current usage patterns
- [x] No circular dependencies between glass/ and ui/ directories

## Todo
- [x] Grep all shadcn imports to map usage
- [x] Update auth page imports
- [x] Update dashboard imports
- [x] Update any other page imports
- [x] Delete unused shadcn files
- [x] Full build verification
- [x] Visual regression check

## Success Criteria
- Zero imports from deleted shadcn files
- `pnpm build` passes cleanly
- All pages render correctly with glass components
- Sidebar/Sheet still work (kept from shadcn)
- No visual regressions on auth or dashboard pages

## Risk Assessment
- **Medium:** Some shadcn components may have props not covered by glass equivalents. Mitigate by checking prop usage before deleting.
- **Low:** Sidebar depends on other shadcn primitives (Sheet). Verify Sidebar still works after removing unrelated shadcn files.
- **Rollback:** Keep git history clean -- one commit per migration step so individual changes can be reverted.
