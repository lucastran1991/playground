# Code Review: Template Conversion

**Score: 8/10**

## Scope
- Files: 22 (backend: 10, frontend: 3, root/scripts: 9)
- Focus: Full review of template conversion from domain-specific app
- Scout: Checked for leftover domain refs, hardcoded secrets, deployment edge cases

## Overall Assessment

Clean, well-structured starter template. Good separation of concerns, proper DI wiring, sensible defaults. The conversion is thorough — no domain-specific code remains in source files (only in old plan/report files which are expected). Two issues need attention before this is production-ready.

---

## Critical Issues

### C1. ecosystem.config.cjs uses `go run` — deploy.sh builds binary but never uses it

**File:** `ecosystem.config.cjs:9`

The PM2 config runs `go run ./cmd/server` which recompiles on every restart. But `deploy.sh` builds a binary at `backend/server`. In production, PM2 should run the compiled binary, not `go run`.

**Impact:** Production deploys waste CPU recompiling. Rollback (`server.bak`) also breaks because PM2 never runs the binary.

**Fix:** Add a production ecosystem config or parameterize the existing one:

```js
// For production, change backend app to:
{
  name: `${cfg.app_name}-backend`,
  cwd: cfg.backend.cwd,
  script: './server',  // compiled binary
  env: { ... }
}
```

Or create `ecosystem.prod.cjs` and update `deploy.sh` to use it.

### C2. No JWT_SECRET in ecosystem.config.cjs env block

**File:** `ecosystem.config.cjs:11-14`

The PM2 env block sets `SERVER_PORT`, `DB_PATH`, `CORS_ORIGIN` but not `JWT_SECRET`. If the user relies on PM2 to set env vars (instead of .env file), the app will crash on startup since `config.Load()` requires JWT_SECRET.

**Impact:** Confusing startup failure if .env file is missing/not in CWD.

**Fix:** Either document that .env must exist, or add a comment in the config:

```js
env: {
  SERVER_PORT: cfg.backend.port,
  DB_PATH: 'myapp.db',
  CORS_ORIGIN: `http://localhost:${cfg.frontend.port}`,
  // JWT_SECRET: loaded from backend/.env -- do not hardcode here
},
```

---

## High Priority

### H1. go.mod declares `go 1.25.1` — does not exist

**File:** `backend/go.mod:3`

Go 1.25.1 is not a released version (latest stable as of writing is 1.24.x). This was likely auto-set by the toolchain. May cause issues for users who clone the template.

**Fix:** Set to `go 1.22` (matches README prereqs) or `go 1.24`.

### H2. Password returned in Register/Login JSON response

**File:** `backend/internal/service/auth_service.go:62-63, 88-89`

`Register()` and `Login()` return the full `*model.User` which is then serialized to JSON. The `Password` field has `json:"-"` tag so it won't appear in output — this is correct. But the hashed password is still passed through the handler layer unnecessarily. Not a vulnerability thanks to `json:"-"`, but worth noting for awareness.

### H3. Swagger exposed in production Caddyfile

**File:** `Caddyfile:20-22`

The Caddyfile template proxies `/swagger/*` in production. Swagger UI should typically be disabled or auth-gated in production.

**Fix:** Add a comment warning users to remove or protect this block in production, or conditionally enable Swagger based on `GIN_MODE`.

---

## Medium Priority

### M1. setup-server.sh Go version mismatch

`GO_VERSION="1.22.5"` in setup script vs `go 1.25.1` in go.mod. These should be consistent.

### M2. `start.sh` auto-copies .env.example with insecure JWT_SECRET

**File:** `start.sh:41-43`

If `backend/.env` doesn't exist, it copies from `.env.example` which has `JWT_SECRET=change-me-to-a-random-string-min-32-chars`. The warning says "edit JWT_SECRET" but the server will start with this weak value. Consider generating a random secret automatically or refusing to start.

### M3. No rate limiting on auth endpoints

The auth endpoints (register, login, refresh) have no rate limiting. For a starter template this is acceptable but worth documenting as a TODO.

### M4. Inline SVG icons in sidebar-nav.tsx

**File:** `frontend/src/components/dashboard/sidebar-nav.tsx:22-39`

Inline SVG definitions make the component harder to maintain. Consider using `lucide-react` icons (already a dependency).

```tsx
import { LayoutDashboard, Settings } from "lucide-react"
// ...
icon: <LayoutDashboard className="h-4 w-4" />,
```

### M5. deploy.sh removes backup after successful deploy

**File:** `deploy.sh:102`

`rm -f backend/server.bak` after health check passes. If the app fails after 10 seconds (after health check window), there's no rollback binary. Consider keeping the backup until the next deploy.

---

## Low Priority

- `Makefile` `build` target outputs to `server` — consider naming it `myapp` to match the project name
- `system.cfg.json` hardcodes `"myapp"` — the customization section in README doesn't mention updating this file
- Sidebar header says "App" not "MyApp" — minor inconsistency
- `backend/docs/` (Swagger generated) should be in .gitignore if regenerated on build, or committed if needed for deploy without swag CLI

---

## Positive Observations

- Clean DI wiring in main.go — easy to extend
- Proper error sentinel pattern (`ErrUserExists`, `ErrInvalidCredentials`)
- Password correctly excluded from JSON via `json:"-"` tag
- JWT token type validation prevents access/refresh token confusion
- Good use of `set -euo pipefail` in all scripts
- `.env.example` files are clear and well-documented
- Rollback mechanism in deploy.sh is thoughtful
- README customization guide is genuinely helpful for template users
- CORS config is parameterized via env var

---

## Recommended Actions (Priority Order)

1. **Fix ecosystem.config.cjs** for production: use compiled binary, not `go run` (C1)
2. **Fix go.mod** version to match a real Go release (H1)
3. **Add Swagger production warning** in Caddyfile (H3)
4. **Align Go version** across go.mod, setup-server.sh, and README (M1)
5. **Add `system.cfg.json`** to README customization checklist (Low)
6. **Switch sidebar SVGs** to lucide-react icons (M4)

---

## Unresolved Questions

- Should the template include a production ecosystem config separate from dev?
- Should Swagger be gated behind `GIN_MODE=debug` by default?
- Are the old plan/report files (containing domain references) intended to ship with the template, or should they be cleaned out?
