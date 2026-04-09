---
phase: 4
title: "Cleanup and Polish"
status: pending
priority: P1
effort: 1.5h
depends_on: [phase-02, phase-03]
---

# Phase 4: Cleanup and Polish

## Context Links
- [glass/ directory](../../frontend/src/components/glass/)
- [globals.css](../../frontend/src/app/globals.css)
- [README.md](../../README.md)

## Overview

Delete the entire glass/ component library, verify zero remaining imports, polish glass theme on shadcn components, update documentation.

## Key Insights

- After Phases 2+3, zero files should import from `@/components/glass`
- 34 glass component files + index.ts = 35 files to delete
- Glass CSS utilities in globals.css MUST be preserved (glass-light, glass-dark, glass-card, etc.)
- Glass CSS variables in `.dark {}` block MUST be preserved
- Animation keyframes MUST be preserved
- README and docs need updating to reflect shadcn-primary architecture

## Requirements

### Functional
- Zero files reference `@/components/glass`
- `components/glass/` directory deleted
- All pages render correctly

### Non-functional
- Build passes
- No dead CSS (check if any glass-specific CSS is no longer needed)
- Documentation updated

## Implementation Steps

### Step 1: Verify zero glass imports
```bash
grep -r "@/components/glass" frontend/src/ --include="*.tsx" --include="*.ts"
```
Must return empty. If not, fix remaining imports first.

### Step 2: Delete glass/ directory
```bash
rm -rf frontend/src/components/glass/
```

### Step 3: Verify build
```bash
cd frontend && pnpm build
```

### Step 4: Polish glass theme on shadcn components
Review each shadcn component used in dark mode and check if it needs glass styling:

1. **Card** -- consumers add `glass-card` class. Verify `glass-card` utility in globals.css includes `backdrop-filter`, border, border-radius.
2. **Avatar** -- uses `bg-muted` fallback in dark mode. Should look fine with existing CSS vars.
3. **Skeleton** -- shadcn uses `animate-pulse bg-primary/10`. Consider adding `bg-[rgba(255,255,255,0.06)]` for glass consistency.
4. **Breadcrumb** -- uses `text-muted-foreground`. Should work with existing vars.
5. **Button ghost** -- verify hover state looks glassy.

### Step 5: Clean up globals.css (if needed)
- Check if `glass-shimmer` keyframe is still referenced (was used by GlassSkeleton)
- If no longer used anywhere, consider keeping anyway (low cost, may be useful)
- Keep all glass utility classes -- they're used in auth pages and dashboard

### Step 6: Update README.md
Replace:
```
- **Nexus Glass Component Library** -- 34 custom glassmorphism components (replaces most shadcn/ui)
- **shadcn/ui** -- Sidebar, Sheet, DropdownMenu, Tooltip (complex behavior)
```
With:
```
- **shadcn/ui** -- Full component library with glassmorphism theme
```

Update project structure section:
- Remove `glass/` from tree
- Remove glass component descriptions

### Step 7: Update docs/
- Update `docs/codebase-summary.md` if it references glass components
- Update `docs/design-guidelines.md` if it references glass component usage

### Step 8: Final verification
1. `pnpm build` -- passes
2. `pnpm lint` -- passes
3. Visual check: dashboard, login, register pages
4. Verify dark mode glass appearance intact
5. Verify light mode not broken

## Todo List
- [ ] Verify zero glass/ imports remain
- [ ] Delete `components/glass/` directory
- [ ] Build passes after deletion
- [ ] Polish shadcn component glass styling where needed
- [ ] Review globals.css for dead glass CSS
- [ ] Update README.md
- [ ] Update docs/ files
- [ ] Final build + lint + visual check

## Success Criteria
- `components/glass/` directory gone
- Zero references to glass components in codebase
- Build + lint pass
- Dashboard and auth pages render correctly with glass theme
- README and docs updated

## Risk Assessment
- **Medium**: Some CSS in globals.css may have been specifically for glass components (e.g. `glass-shimmer` keyframe). Verify before removing.
- **Low**: Other pages or components we missed might import from glass/. The grep check in Step 1 catches this.

## Related Code Files

### Delete
- `frontend/src/components/glass/` (entire directory -- 35 files)

### Modify
- `README.md`
- `docs/codebase-summary.md`
- `docs/design-guidelines.md`

### Verify (no changes)
- `frontend/src/app/globals.css` -- keep all glass utilities
