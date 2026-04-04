## Phase 2: Frontend Cleanup

### Context Links
- [plan.md](plan.md)
- [Brainstorm](../reports/brainstorm-260404-2332-template-conversion.md)
- Current package name: `frontend`
- Target package name: `myapp`

### Overview
- **Priority:** P1
- **Status:** completed
- **Description:** Remove all domain-specific frontend code (tracer, DAG components). Remove heavy domain deps (@xyflow/react, @dagrejs/dagre). Clean sidebar nav. Update metadata. Simplify dev scripts (remove system.cfg.json dependency).

### Key Insights
- Tracer page + 6 DAG components are the only domain-specific frontend code
- `@xyflow/react` and `@dagrejs/dagre` + `@types/dagre` are only used by tracer
- Sidebar nav has a "Tracer" link to remove
- `package.json` dev/start scripts reference `../system.cfg.json` for port -- simplify to hardcoded 3000
- `proxy.ts` at `src/proxy.ts` may contain domain-specific proxy config -- check and clean
- Types file (`src/types/index.ts`) only has `User` + `AuthResponse` -- already clean

### Requirements
**Functional:**
- Dashboard renders with welcome message + placeholder stats
- Auth flow (login/register) works unchanged
- Sidebar shows Dashboard + Settings only (no Tracer)
- Landing page works

**Non-functional:**
- `pnpm build` succeeds with zero errors
- No references to tracer/blueprint/DAG in codebase
- No unused heavy deps in package.json

### Files to DELETE
```
frontend/src/app/tracer/                   (entire directory -- layout.tsx + page.tsx)
frontend/src/components/tracer/            (entire directory -- 6 files)
  dag-node.tsx
  dag-detail-popup.tsx
  dag-types.ts
  dag-helpers.tsx
  dependency-impact-dag.tsx
  dag-search.tsx
  dag-edge.tsx
frontend/src/proxy.ts                      (domain-specific proxy, if present)
```

### Files to MODIFY

**1. `frontend/package.json`**
- Change `"name"` from `"frontend"` to `"myapp"`
- Remove dependencies:
  - `@dagrejs/dagre`
  - `@types/dagre`
  - `@xyflow/react`
- Simplify scripts -- remove `system.cfg.json` port logic:
  ```json
  "dev": "next dev --port 3000",
  "start": "next start --port 3000"
  ```

**2. `frontend/src/components/dashboard/sidebar-nav.tsx`**
- Remove `{ Network }` import from `lucide-react`
- Remove the Tracer nav item from `navItems` array (the object with `href: "/tracer"`)
- Keep Dashboard + Settings

**3. `frontend/src/app/layout.tsx`**
- Change metadata title from `"Playwright Demo"` to `"MyApp"`
- Change description to `"Fullstack Go + Next.js starter template"`

**4. `frontend/src/app/page.tsx`** (landing page)
- Check for domain-specific content. If references blueprints/tracer, simplify to generic landing.
- Update any project-specific copy to generic template messaging.

**5. `frontend/src/app/(dashboard)/page.tsx`**
- Already generic (welcome + stats cards). Keep as-is.
- Optionally update stat labels to be more template-appropriate (e.g., "Example Metric" instead of "Total Users" if desired). Low priority.

**6. `frontend/.env.example`** (if exists, or `frontend/.env.local.example`)
- Ensure API URL points to `http://localhost:8080` (matching new backend default port)
- Verify NEXTAUTH vars are documented

### Dependencies to REMOVE (via pnpm)
```bash
cd frontend
pnpm remove @dagrejs/dagre @types/dagre @xyflow/react
```

### Implementation Steps

1. Delete `frontend/src/app/tracer/` directory
2. Delete `frontend/src/components/tracer/` directory
3. Delete `frontend/src/proxy.ts` (if domain-specific)
4. Remove domain deps: `pnpm remove @dagrejs/dagre @types/dagre @xyflow/react`
5. Update `package.json` name + simplify dev/start scripts
6. Update `sidebar-nav.tsx` -- remove Tracer nav item + Network import
7. Update `layout.tsx` metadata (title + description)
8. Review + clean `page.tsx` (landing page) if needed
9. Check for any remaining tracer/blueprint imports: `grep -r "tracer\|blueprint\|dag" frontend/src/`
10. Run `pnpm build` to verify compilation

### Todo List
- [x] Delete tracer app route directory
- [x] Delete tracer components directory
- [x] Delete proxy.ts if domain-specific
- [x] Remove @xyflow/react, @dagrejs/dagre, @types/dagre
- [x] Update package.json name + scripts
- [x] Remove Tracer from sidebar nav
- [x] Update layout.tsx metadata
- [x] Review landing page for domain references
- [x] Verify no remaining domain references in frontend
- [x] Run `pnpm build` succeeds

### Success Criteria
- `pnpm build` succeeds
- Zero grep hits for `tracer`, `blueprint`, `dag`, `xyflow`, `dagre` in `frontend/src/`
- Sidebar shows only Dashboard + Settings
- Landing page renders without errors
- Auth flow works (login form renders, form submission works)

### Risk Assessment
- **Proxy removal**: `src/proxy.ts` may be imported elsewhere. Grep for imports before deleting.
- **Lucide tree-shaking**: Removing `Network` import is cosmetic but prevents dead code.
- **Landing page**: May need light rewrite if heavily domain-branded.

### Security Considerations
- No security changes in this phase
- NextAuth config unchanged
- API client unchanged
