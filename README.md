# Nexus

Fullstack starter template with Go (Gin + GORM + SQLite) backend and Next.js 16 (React 19 + shadcn/ui + Tailwind v4) frontend. Features a modern glassmorphism design system with dark-mode-only interface.

## Tech Stack

### Backend (`/backend`)
- **Go** with Gin web framework
- **GORM** ORM with SQLite (swappable to PostgreSQL)
- **JWT** authentication
- **Swagger** API documentation

### Frontend (`/frontend`)
- **Next.js 16** (App Router, TypeScript)
- **React 19** with Server Components
- **shadcn/ui** – Components themed with glassmorphism
- **Tailwind CSS v4** with glassmorphism utilities
- **TanStack Query v5** for data fetching
- **React Hook Form** + Zod validation
- **NextAuth.js v5** for session management
- **next-themes** for dark/light mode

## Prerequisites

- Go 1.22+
- Node.js 20+
- pnpm

## Getting Started

### Local Development (PM2)

One command starts both servers with hot reload:

```bash
./start.sh           # start backend + frontend via PM2
./start.sh logs      # tail logs
./start.sh stop      # stop all
./start.sh status    # check status
./start.sh init      # first-time setup (installs deps, builds once)
```

First run copies `.env.example` files — edit `backend/.env` and set `JWT_SECRET`.

- Backend: http://localhost:8080 (Swagger: /swagger/index.html)
- Frontend: http://localhost:3000

### Alternative: Makefile

```bash
make dev          # Start both servers (foreground, no PM2)
make build        # Build both for production
make test         # Run tests + lint
make swagger      # Regenerate Swagger docs
make generate-api # Regen swagger + TS types from Go handlers
make migrate-up   # Apply pending DB migrations
make migrate-down # Rollback last migration
make seed         # Insert sample dev users (alice/bob/charlie, password: password123)
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=secret make create-admin   # First admin user (prefer env vars over flags — flags show in `ps`)
make clean        # Remove build artifacts
```

### Optional: Git hooks (lefthook)

```bash
brew install lefthook    # or: go install github.com/evilmartians/lefthook@latest
lefthook install         # once after clone
```

Runs `go vet` + `pnpm lint` on commit, tests on push. Skip with `LEFTHOOK=0 git commit ...`.

### Production (Docker Compose)

Self-contained stack: backend + frontend + Caddy reverse proxy with auto-HTTPS.

```bash
# 1. Set env vars
cp .env.example .env
# edit .env: JWT_SECRET, NEXTAUTH_SECRET, DOMAIN (for TLS), NEXT_PUBLIC_API_URL

# 2. Boot
docker compose up -d --build

# 3. Manage
docker compose logs -f
docker compose down
```

- `DOMAIN=example.com` → Caddy auto-provisions TLS via Let's Encrypt on ports 80/443
- `DOMAIN=localhost` → HTTP only (testing)
- CI/CD pushes images to ghcr.io and SSH-deploys on main branch pushes

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | No | Health check |
| POST | `/api/auth/register` | No | Register user |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/refresh` | No | Refresh tokens |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/swagger/*` | No | Swagger UI |

## Project Structure

```
nexus/
├── backend/
│   ├── cmd/server/         Entry point
│   ├── internal/
│   │   ├── config/         Environment config
│   │   ├── database/       GORM + SQLite
│   │   ├── handler/        HTTP handlers
│   │   ├── middleware/      JWT auth middleware
│   │   ├── model/          Database models
│   │   ├── repository/     Data access layer
│   │   ├── service/        Business logic
│   │   └── router/         Route definitions
│   ├── pkg/
│   │   ├── response/       Standard JSON responses
│   │   └── token/          JWT utilities
│   └── docs/               Swagger generated docs
├── frontend/src/
│   ├── app/
│   │   ├── (auth)/         Login, register pages
│   │   ├── (dashboard)/    Dashboard (protected) with stats, charts, activity
│   │   └── api/auth/       NextAuth route handler
│   ├── components/
│   │   ├── auth/           Auth form components
│   │   ├── dashboard/      Dashboard widgets and layout
│   │   └── ui/             shadcn/ui components (Button, Input, Card, Avatar, etc.)
│   ├── hooks/              useAuth, useApi
│   ├── lib/                Auth config, API client
│   ├── providers/          Theme, Query, Session
│   └── types/              TypeScript types
├── compose/caddy/          Caddy reverse proxy config for prod
├── docker-compose.yml      Prod stack: backend + frontend + caddy
├── Makefile                Dev/build/test commands
└── start.sh                Local dev script (PM2)
```

## Customization

### Rename the project
Update these files when starting a new project:
1. `backend/go.mod` — module name
2. `frontend/package.json` — `name` field
3. `frontend/src/app/layout.tsx` — metadata title
4. `README.md` — project title and description
5. `.env.example` files — database name

### Add a new model
1. Create model in `backend/internal/model/`
2. Add to migration in `backend/internal/database/database.go`
3. Create repository in `backend/internal/repository/`
4. Create service in `backend/internal/service/`
5. Create handler in `backend/internal/handler/`
6. Add routes in `backend/internal/router/router.go`

### Switch to PostgreSQL
1. Replace `github.com/glebarez/sqlite` with `gorm.io/driver/postgres` in `go.mod`
2. Update `database.go` to use `postgres.Open(dsn)`
3. Add PostgreSQL connection fields to `config.go`

## License

MIT
