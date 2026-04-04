# Brainstorm: Template Conversion
**Date:** 2026-04-04 | **Status:** Approved

## Problem
Convert current fullstack app (Go Gin + Next.js 16) into reusable starter template. Strip domain-specific code, keep infrastructure.

## Decisions
| Decision | Choice | Rationale |
|----------|--------|-----------|
| Auth | Full (JWT + NextAuth + UI) | Core value, saves setup time |
| Database | SQLite via GORM | Zero setup, swappable |
| Demo content | Landing + Dashboard layout | Shows patterns without domain logic |
| Extras | Makefile + Swagger API docs | Minimal overhead, high value |
| Domain code | Strip all | Clean slate for new projects |
| Naming | Placeholder `myapp` | Simple find-and-replace, documented in README |
| Data fetching | TanStack Query | Already configured, industry standard |

## What Stays
- Full auth flow (JWT + NextAuth + login/register)
- Dashboard layout (sidebar + topbar + theme toggle + user menu)
- Landing page
- API client + TanStack Query + providers
- React Hook Form + Zod patterns
- Backend clean architecture (config/database/middleware/router/pkg)
- User model + repository + service + handler as example

## What Gets Stripped
- All blueprint code (models, repos, services, handlers, tests)
- All tracer/DAG code (service, repo, handler, frontend components)
- CSV ingestion logic
- `@xyflow/react`, `@dagrejs/dagre` dependencies
- `testdata/`, `plans/`, `repomix-output.xml`, `system.cfg.json`, `ecosystem.config.cjs`

## What Gets Added
- Swagger setup (`swaggo/swag` + `gin-swagger`)
- Root Makefile (dev/build/test/swagger)
- Clean README with quickstart + rename checklist
- Well-documented `.env.example` files
- Generic `docs/` directory

## Target Structure
```
myapp/
├── backend/
│   ├── cmd/server/main.go
│   ├── internal/
│   │   ├── config/
│   │   ├── database/          # GORM + SQLite
│   │   ├── handler/           # auth_handler only
│   │   ├── middleware/        # JWT auth
│   │   ├── model/             # user only
│   │   ├── repository/        # user_repository only
│   │   ├── service/           # auth_service only
│   │   └── router/
│   ├── pkg/response/ + token/
│   ├── docs/                  # Swagger
│   ├── go.mod, Makefile, .env.example
├── frontend/
│   ├── src/app/               # Landing + (auth) + (dashboard)
│   ├── src/components/        # ui/ + auth/ + dashboard/
│   ├── src/hooks/ + lib/ + providers/ + types/
│   ├── package.json, .env.example
├── docs/                      # Template docs
├── Makefile, .gitignore, README.md
```

## Risks
- NextAuth 5 beta: API may change, pin version
- SQLite concurrency: document Postgres upgrade path
- shadcn/ui: copied code, keep minimal component set

## Rename Checklist
1. `backend/go.mod` -- module name
2. `frontend/package.json` -- name
3. `README.md` -- title/description
4. `frontend/src/app/layout.tsx` -- metadata
5. `.env.example` files -- DB name, JWT secret
6. `Makefile` -- project name variable
