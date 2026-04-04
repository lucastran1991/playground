## Phase 1: Backend Cleanup

### Context Links
- [plan.md](plan.md)
- [Brainstorm](../reports/brainstorm-260404-2332-template-conversion.md)
- Current module: `github.com/user/app`
- Target module: `myapp`

### Overview
- **Priority:** P1
- **Status:** completed
- **Description:** Remove all domain-specific Go code (blueprint, tracer, CSV ingestion, model rules). Switch DB from PostgreSQL to SQLite. Rename module to `myapp`. Keep only auth + health check.

### Key Insights
- Current DB is PostgreSQL with 8 models; template needs only `User` model on SQLite
- Config has domain-specific fields (`BlueprintDir`, `ModelDir`) to remove
- `system.cfg.json` port-loading logic should be replaced with simple env defaults
- Router wires 3 handlers; template needs only `authHandler`

### Requirements
**Functional:**
- Only `User` model remains in database
- Auth endpoints (register, login, refresh, me) work as before
- Health check endpoint works
- SQLite database auto-created on first run

**Non-functional:**
- `go build` succeeds with zero warnings
- `go mod tidy` leaves no unused deps
- No references to blueprint/tracer/model anywhere in backend

### Architecture
Same clean architecture layers, just thinner:
```
cmd/server/main.go      -- wire auth only
internal/config/        -- simplified (DB_PATH + JWT_SECRET + SERVER_PORT + CORS_ORIGIN)
internal/database/      -- SQLite via GORM, migrate User only
internal/handler/       -- auth_handler.go only
internal/middleware/     -- auth_middleware.go (unchanged)
internal/model/         -- user.go only
internal/repository/    -- user_repository.go only
internal/service/       -- auth_service.go only
internal/router/        -- auth routes + health only
pkg/response/           -- unchanged
pkg/token/              -- unchanged
```

### Files to DELETE
```
backend/internal/handler/blueprint_handler.go
backend/internal/handler/tracer_handler.go
backend/internal/repository/blueprint_repository.go
backend/internal/repository/tracer_repository.go
backend/internal/model/blueprint_type.go
backend/internal/model/blueprint_type_test.go
backend/internal/model/blueprint_node.go
backend/internal/model/blueprint_node_test.go
backend/internal/model/blueprint_edge.go
backend/internal/model/blueprint_node_membership.go
backend/internal/model/capacity_node_type.go
backend/internal/model/dependency_rule.go
backend/internal/model/impact_rule.go
backend/internal/service/blueprint_ingestion_service.go
backend/internal/service/blueprint_csv_parser.go
backend/internal/service/blueprint_csv_parser_test.go
backend/internal/service/model_ingestion_service.go
backend/internal/service/model_csv_parser.go
backend/internal/service/model_csv_parser_test.go
backend/internal/service/dependency_tracer.go
backend/internal/service/dependency_tracer_helpers.go
backend/internal/service/dependency_tracer_helpers_test.go
backend/testdata/                          (entire directory)
backend/coverage.html
backend/coverage.out
backend/server                             (compiled binary)
```

### Files to MODIFY

**1. `backend/go.mod`**
- Change module from `github.com/user/app` to `myapp`
- After all code changes, run `go mod tidy` to drop unused deps (pgx, postgres driver, etc.)
- Add `github.com/glebarez/sqlite` (pure-Go SQLite driver for GORM, no CGO needed)
- Remove `gorm.io/driver/postgres` and all `jackc/pgx` deps

**2. `backend/internal/config/config.go`**
- Remove fields: `DBHost`, `DBPort`, `DBUser`, `DBPassword`, `DBName`, `DBSSLMode`, `BlueprintDir`, `ModelDir`
- Add field: `DBPath string` (default `"myapp.db"`)
- Remove `systemCfg` struct and `loadSystemCfg()` function
- Remove `DSN()` method
- Simplify `Load()`: only needs `DB_PATH`, `JWT_SECRET`, `SERVER_PORT`, `CORS_ORIGIN`
- Validation: only `JWT_SECRET` required

**3. `backend/internal/database/database.go`**
- Replace `gorm.io/driver/postgres` import with `github.com/glebarez/sqlite`
- Change `Connect()` to accept `dbPath string` instead of full config
- Open with `sqlite.Open(dbPath)` instead of `postgres.Open(cfg.DSN())`
- `Migrate()`: only `&model.User{}`

**4. `backend/internal/router/router.go`**
- Remove `blueprintHandler` and `tracerHandler` params from `Setup()`
- Remove blueprint routes group (`/api/blueprints/*`)
- Remove model routes group (`/api/models/*`)
- Remove trace routes group (`/api/trace/*`)
- Keep: health check, auth public routes, protected `/api/auth/me`

**5. `backend/cmd/server/main.go`**
- Remove all blueprint/tracer wiring (repos, services, handlers)
- Pass `cfg.DBPath` to `database.Connect()` instead of full config
- Call `router.Setup(authHandler, cfg.JWTSecret, cfg.CORSOrigin)`
- Update all imports from `github.com/user/app` to `myapp`

**6. `backend/.env.example`**
Replace contents with:
```
DB_PATH=myapp.db
JWT_SECRET=change-me-to-a-random-string-min-32-chars
SERVER_PORT=8080
CORS_ORIGIN=http://localhost:3000
```

**7. `backend/.env`** (if exists, update similarly or delete -- gitignored)

**8. `backend/.gitignore`**
- Add `*.db` to ignore SQLite files

### Implementation Steps

1. Delete all files listed in "Files to DELETE"
2. Update `go.mod` module name to `myapp`
3. Find-and-replace `github.com/user/app` with `myapp` in ALL `.go` files
4. Rewrite `config.go` -- remove PG fields, add `DBPath`, remove `systemCfg`/`DSN()`
5. Rewrite `database.go` -- SQLite driver, simplified Connect, User-only Migrate
6. Rewrite `router.go` -- auth-only signature and routes
7. Rewrite `main.go` -- auth-only wiring
8. Update `.env.example` with SQLite config
9. Update `.gitignore` to add `*.db`
10. Run `go mod tidy` to clean dependencies
11. Run `go build ./cmd/server` to verify compilation

### Todo List
- [x] Delete domain files (blueprint, tracer, model, testdata)
- [x] Rename module to `myapp`
- [x] Update all Go imports
- [x] Simplify config (SQLite + JWT + port + CORS only)
- [x] Switch database to SQLite
- [x] Simplify router (auth + health only)
- [x] Simplify main.go wiring
- [x] Update .env.example
- [x] Update .gitignore
- [x] Run `go mod tidy`
- [x] Verify `go build ./cmd/server` succeeds

### Success Criteria
- `go build ./cmd/server` succeeds
- No references to blueprint/tracer/model/pgx/postgres in codebase
- Only `User` table created when server starts
- Auth endpoints respond correctly
- Server starts with just `DB_PATH` + `JWT_SECRET` env vars

### Risk Assessment
- **SQLite driver choice**: `github.com/glebarez/sqlite` is pure Go (no CGO). If issues, fallback to `gorm.io/driver/sqlite` (requires CGO/gcc).
- **Import rename**: Must catch ALL files. Use `grep -r "github.com/user/app"` to verify zero remaining refs.

### Security Considerations
- JWT secret validation stays (must be set)
- bcrypt password hashing unchanged
- Auth middleware unchanged
