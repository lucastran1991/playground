# Phase 03 — DX Polish

## Context Links
- Brainstorm: `plans/reports/brainstorm-260412-1429-template-stabilization.md`
- Overview: `plan.md`
- Depends on: `phase-02-stability-infrastructure.md` (migrations must exist before seed)

## Overview
- **Priority:** P2
- **Status:** pending
- **Effort:** 3h
- **Description:** Generate TypeScript types from backend Swagger (kill FE/BE drift). Add seed binary for dev data. Add create-admin binary for first-user bootstrap.

## Key Insights
- Backend already emits Swagger JSON via swaggo at `backend/docs/swagger.json`
- `openapi-typescript` = mature, zero-runtime, pure type gen (no runtime client)
- Typed-client retrofit should be gradual: start with auth endpoints only, migrate rest later
- Seed + create-admin as sibling binaries in `backend/cmd/` match existing layout
- Drift protection: pre-push hook or CI job runs `make generate-api` and fails on `git diff --exit-code`

## Requirements

### Functional
- `make generate-api` produces `frontend/src/types/api.ts` from `backend/docs/swagger.json`
- Frontend auth fetch calls use generated types (at minimum: request/response shapes)
- `make seed` populates dev DB with sample users
- `make create-admin email=x@y.com password=secret` creates admin user in prod DB
- Generated types check in pre-push hook (or CI) to prevent drift

### Non-Functional
- Type generation is idempotent (same input → same output, stable diff)
- Seed + create-admin binaries compile without touching main server code
- Create-admin is safe in prod (idempotent, prompts or requires explicit env vars)

## Architecture

```
swagger.json (source of truth)
    │
    ▼ make swagger (regen from Go comments)
backend/docs/swagger.json
    │
    ▼ make generate-api (openapi-typescript)
frontend/src/types/api.ts
    │
    ▼ imported by
frontend/src/lib/api-client.ts (fetch wrapper)
frontend/src/hooks/use-auth.ts
```

Binaries:
```
backend/cmd/
  server/       ← main API server
  seed/         ← dev data loader
  create-admin/ ← first-user bootstrap
```

## Related Code Files

### Create
- `backend/cmd/seed/main.go`
- `backend/cmd/create-admin/main.go`
- `frontend/src/types/api.ts` (generated)
- `frontend/src/lib/api-client.ts` — typed fetch wrapper

### Modify
- `frontend/package.json` — add `openapi-typescript` devDep + `generate-api` script
- `Makefile` — `generate-api`, `seed`, `create-admin` targets
- Existing FE auth code (`frontend/src/app/(auth)/**`, `frontend/src/hooks/use-*.ts`) — use typed shapes
- `lefthook.yml` — optional `pre-push` check: regen types, fail on diff
- `README.md` — seed / create-admin / generate-api docs

## Implementation Steps

1. **Install openapi-typescript**
   ```bash
   cd frontend && pnpm add -D openapi-typescript
   ```

2. **Add FE script** (`frontend/package.json`)
   ```json
   "scripts": {
     "generate-api": "openapi-typescript ../backend/docs/swagger.json -o src/types/api.ts"
   }
   ```

3. **Add Makefile target**
   ```make
   generate-api:
   	cd backend && swag init -g cmd/server/main.go -o docs
   	cd frontend && pnpm generate-api
   ```

4. **First generation + commit baseline**
   - Run `make generate-api`
   - Inspect `frontend/src/types/api.ts` — confirm `paths`, `components.schemas` populated
   - Commit as baseline

5. **Typed fetch wrapper** (`frontend/src/lib/api-client.ts`)
   ```typescript
   import type { paths } from "@/types/api";

   type LoginBody = paths["/api/auth/login"]["post"]["requestBody"]["content"]["application/json"];
   type LoginResponse = paths["/api/auth/login"]["post"]["responses"]["200"]["content"]["application/json"];

   export async function login(body: LoginBody): Promise<LoginResponse> {
     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(body),
     });
     if (!res.ok) throw new Error(`Login failed: ${res.status}`);
     return res.json();
   }
   ```
   (Repeat pattern for register, me, refresh)

6. **Retrofit FE auth calls**
   - Replace any manual type defs in `frontend/src/app/(auth)/login/` + `register/`
   - Replace hook typings in `frontend/src/hooks/use-auth.ts` (if exists)
   - Keep changes minimal — goal is prove pattern, not full rewrite

7. **Seed binary** (`backend/cmd/seed/main.go`)
   - Open DB, verify schema exists (migrations ran)
   - Insert 3 sample users (alice, bob, charlie) with hashed password
   - Idempotent: skip if email already exists
   - Use existing `internal/service` + `internal/repository` for DRY

8. **Create-admin binary** (`backend/cmd/create-admin/main.go`)
   - Accept flags: `-email`, `-password` (or env vars `ADMIN_EMAIL`, `ADMIN_PASSWORD`)
   - Exit with error if missing
   - Hash password, insert user with `role=admin` (add role column in migration if needed — otherwise flag for follow-up)
   - Idempotent: update password if user exists

9. **Makefile extensions**
   ```make
   seed:
   	cd backend && go run ./cmd/seed

   create-admin:
   	cd backend && go run ./cmd/create-admin -email=$(email) -password=$(password)
   ```

10. **Drift check** (optional but recommended)
    - Extend `lefthook.yml` pre-push:
      ```yaml
      generate-api-drift:
        run: make generate-api && git diff --exit-code frontend/src/types/api.ts
      ```
    - Or add CI step in `.github/workflows/ci.yml`

11. **README**
    - Add "Development Workflow" section: `make generate-api` after API changes
    - Add "Seeding data": `make migrate-up && make seed`
    - Add "First admin user" (prod): `make create-admin email=... password=...`

## Todo List

- [ ] `pnpm add -D openapi-typescript` in frontend
- [ ] Add `generate-api` script + Makefile target
- [ ] Generate baseline `api.ts`, commit
- [ ] Build `lib/api-client.ts` typed wrapper for auth endpoints
- [ ] Retrofit FE login/register pages to use typed client
- [ ] Write `cmd/seed/main.go` (3 sample users)
- [ ] Write `cmd/create-admin/main.go` (flag-driven)
- [ ] Add Makefile `seed` + `create-admin` targets
- [ ] Add drift check to lefthook or CI
- [ ] README onboarding rewrite
- [ ] Smoke test: full flow from fresh clone

## Success Criteria

- `make generate-api` regenerates types, diff is stable on re-run
- FE auth pages compile using `paths[...]` types (no manual type duplication)
- `make seed` creates 3 users, idempotent on second run
- `make create-admin email=x password=y` creates admin, idempotent update on re-run
- Lefthook/CI catches drift if swagger changes without regeneration
- README onboarding works end-to-end on fresh clone

## Risk Assessment

| Risk | Mitigation |
|---|---|
| Swagger JSON out of sync with Go code | `make generate-api` runs `swag init` first; document after-api-change workflow |
| openapi-typescript generates union types FE code can't narrow | Use `z.infer`-style runtime validation with zod (already in deps); fall back to manual types for edge cases |
| Create-admin creates duplicate if idempotency check fails | Wrap in transaction; SELECT then INSERT OR UPDATE |
| Seed overwrites real user data in prod | Guard: refuse to run if `APP_ENV=production` |
| Retrofit breaks existing auth flow | Keep retrofit minimal (one endpoint), run FE tests after each file change |

## Security Considerations

- `create-admin` password never logged (mask in debug output)
- Seed uses bcrypt same as service layer (no plain-text)
- Admin role field addition (if needed) = separate migration, no auto-grant
- `APP_ENV` guard on seed prevents prod data pollution

## Next Steps

- Consider follow-up: full FE client retrofit (all endpoints) if typed-auth pattern proves solid
- Consider: admin role + RBAC middleware (out of scope for this phase)
