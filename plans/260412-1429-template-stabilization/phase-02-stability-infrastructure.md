# Phase 02 — Stability Infrastructure

## Context Links
- Brainstorm: `plans/reports/brainstorm-260412-1429-template-stabilization.md`
- Overview: `plan.md`
- Depends on: `phase-01-cleanup-and-legacy-drop.md`

## Overview
- **Priority:** P1
- **Status:** pending
- **Effort:** 3h
- **Description:** Replace GORM AutoMigrate with `golang-migrate` versioned schema. Add Dependabot for weekly dep updates. Add `lefthook` pre-commit/pre-push hooks for lint + test.

## Key Insights
- GORM AutoMigrate is fine for prototyping, unsafe for prod schema evolution (no rollback, silent drift)
- `golang-migrate` = de-facto Go migrations tool, plain SQL files, reversible
- `lefthook` beats husky: single binary, no node dep, faster, language-agnostic
- Dependabot native to GitHub, zero-config for gomod/npm/docker/gh-actions

## Requirements

### Functional
- Versioned SQL migrations under `backend/migrations/`
- `make migrate-up`, `make migrate-down`, `make migrate-create name=xxx` work
- `cmd/server` boots cleanly without calling `AutoMigrate`
- `golangci-lint` runs on staged Go files on commit
- `pnpm lint` runs on staged FE files on commit
- Go + FE tests run on push
- Dependabot PRs arrive weekly for gomod, npm, docker, gh-actions

### Non-Functional
- Migration runner = `go run github.com/golang-migrate/migrate/v4/cmd/migrate` (no external binary install)
- Lefthook install is 1 command, documented in README

## Architecture

```
backend/
  migrations/
    0001_init.up.sql       ← initial schema (users table)
    0001_init.down.sql
  cmd/server/main.go       ← no AutoMigrate, expects pre-migrated DB
  internal/database/
    database.go            ← open only, no schema management
```

Migration flow:
- Dev: `make migrate-up` before first `go run`
- Prod (docker): init container or entrypoint script runs migrations before backend starts

## Related Code Files

### Create
- `backend/migrations/0001_init.up.sql`
- `backend/migrations/0001_init.down.sql`
- `backend/scripts/migrate.sh` — wraps `go run` migrate CLI
- `.github/dependabot.yml`
- `lefthook.yml`

### Modify
- `backend/cmd/server/main.go` — remove AutoMigrate call
- `backend/internal/database/database.go` — drop schema responsibilities
- `backend/go.mod` — add `github.com/golang-migrate/migrate/v4` as tool dep
- `Makefile` — add `migrate-up`, `migrate-down`, `migrate-create`, `lefthook-install`
- `backend/Dockerfile` — multi-stage: build migrate binary into runtime or run migrate in entrypoint
- `docker-compose.yml` — optional: `command: ["sh", "-c", "migrate && server"]` or init container
- `README.md` — onboarding: `lefthook install`, `make migrate-up`

## Implementation Steps

1. **Scaffold migrations**
   ```bash
   mkdir -p backend/migrations
   ```
   - `0001_init.up.sql`: create `users` table matching current GORM model (id, email, password_hash, created_at, updated_at, deleted_at)
   - `0001_init.down.sql`: `DROP TABLE users;`
   - Inspect `backend/internal/model/user.go` to get exact columns, indexes, constraints

2. **Add golang-migrate dep**
   ```bash
   cd backend && go get -tool github.com/golang-migrate/migrate/v4/cmd/migrate
   ```
   (Go 1.24+ tools directive; else use `tools.go` pattern)

3. **Remove AutoMigrate**
   - Locate `db.AutoMigrate(...)` in `internal/database/database.go` or `cmd/server/main.go`
   - Delete call + any schema-management imports
   - Ensure `database.New()` only opens connection

4. **Create migrate wrapper**
   - `backend/scripts/migrate.sh`:
     ```sh
     #!/usr/bin/env sh
     set -e
     DB_PATH="${DB_PATH:-./myapp.db}"
     go run github.com/golang-migrate/migrate/v4/cmd/migrate \
       -path ./migrations \
       -database "sqlite3://${DB_PATH}" \
       "$@"
     ```

5. **Extend Makefile**
   ```make
   migrate-up:
   	cd backend && ./scripts/migrate.sh up

   migrate-down:
   	cd backend && ./scripts/migrate.sh down 1

   migrate-create:
   	cd backend && go run github.com/golang-migrate/migrate/v4/cmd/migrate create -ext sql -dir migrations -seq $(name)
   ```

6. **Docker migration hook**
   - Option A (recommended): extend backend Dockerfile final stage with `migrate` binary + entrypoint script that runs `migrate up` then `exec ./server`
   - Option B: separate compose `backend-migrate` service that runs once, `depends_on` gate for backend
   - Pick A for simpler compose file

7. **Dependabot config** (`.github/dependabot.yml`)
   ```yaml
   version: 2
   updates:
     - package-ecosystem: gomod
       directory: /backend
       schedule: { interval: weekly }
     - package-ecosystem: npm
       directory: /frontend
       schedule: { interval: weekly }
     - package-ecosystem: docker
       directory: /backend
       schedule: { interval: weekly }
     - package-ecosystem: docker
       directory: /frontend
       schedule: { interval: weekly }
     - package-ecosystem: github-actions
       directory: /
       schedule: { interval: weekly }
   ```

8. **Lefthook config** (`lefthook.yml`)
   ```yaml
   pre-commit:
     parallel: true
     commands:
       backend-lint:
         glob: "backend/**/*.go"
         run: cd backend && golangci-lint run ./...
       frontend-lint:
         glob: "frontend/**/*.{ts,tsx}"
         run: cd frontend && pnpm lint

   pre-push:
     commands:
       backend-test:
         run: cd backend && go test ./...
       frontend-test:
         run: cd frontend && pnpm test
   ```

9. **README additions**
   - Getting Started: `lefthook install` (after clone)
   - Database: `make migrate-up` before first run
   - Contributing: Dependabot PRs auto-merge policy (if any)

## Todo List

- [ ] Write `0001_init.up.sql` + `down.sql` matching current user model
- [ ] Add golang-migrate tool dep
- [ ] Remove AutoMigrate from backend startup
- [ ] Create `backend/scripts/migrate.sh`
- [ ] Add Makefile migrate targets
- [ ] Update backend Dockerfile to run migrations on boot
- [ ] Add `.github/dependabot.yml`
- [ ] Add `lefthook.yml`
- [ ] Update README: lefthook install, migrate workflow
- [ ] Smoke test: `rm myapp.db && make migrate-up && go run ./cmd/server`
- [ ] Smoke test: commit/push triggers hooks

## Success Criteria

- Fresh `make migrate-up` creates schema, backend boots, auth register/login works
- `make migrate-down` reverses cleanly
- `go run ./cmd/server` does NOT call AutoMigrate
- `git commit` runs lint on staged files
- `git push` runs tests
- Dependabot config validates (`actionlint` or GH UI)
- Docker backend image runs migrations then starts server

## Risk Assessment

| Risk | Mitigation |
|---|---|
| SQLite driver differences (`sqlite3://` vs `sqlite://`) | Match `golang-migrate/v4` docs exactly; test locally |
| Existing dev DBs have implicit GORM schema → migration state mismatch | README: `rm myapp.db && make migrate-up` on cutover |
| Lefthook slows commits if golangci-lint is slow | Use `staged_files` filter + `parallel: true`; users can `LEFTHOOK=0 git commit` to skip |
| Docker entrypoint added to distroless = no shell | Use `gcr.io/distroless/base-debian12:nonroot` (has sh) or compile migrate into same binary via Go init |

## Security Considerations

- Migrations version-controlled = auditable schema history
- `golang-migrate` uses file checksums to detect tampering
- Dependabot PRs = timely CVE patches
- Pre-commit lint catches common bugs before CI

## Next Steps

- Unblocks Phase 3 (seed binary relies on migration-created tables)
