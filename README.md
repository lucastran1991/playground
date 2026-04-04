# MyApp

Fullstack starter template with Go (Gin + GORM + SQLite) backend and Next.js 16 (React 19 + shadcn/ui + Tailwind v4) frontend.

## Tech Stack

### Backend (`/backend`)
- **Go** with Gin web framework
- **GORM** ORM with SQLite (swappable to PostgreSQL)
- **JWT** authentication
- **Swagger** API documentation

### Frontend (`/frontend`)
- **Next.js 16** (App Router, TypeScript)
- **React 19** with Server Components
- **shadcn/ui** + Tailwind CSS v4
- **TanStack Query v5** for data fetching
- **React Hook Form** + Zod validation
- **NextAuth.js v5** for session management
- **next-themes** for dark/light mode

## Prerequisites

- Go 1.22+
- Node.js 20+
- pnpm

## Getting Started

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env: set JWT_SECRET to a random 32+ char string
go run ./cmd/server
```

Server starts on `http://localhost:8080`.
Swagger UI at `http://localhost:8080/swagger/index.html`.

### 2. Frontend

```bash
cd frontend
cp .env.example .env.local
pnpm install
pnpm dev
```

App starts on `http://localhost:3000`.

### 3. Using Makefile

```bash
make dev          # Start both servers
make build        # Build both for production
make test         # Run tests + lint
make swagger      # Regenerate Swagger docs
make clean        # Remove build artifacts
```

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
myapp/
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
│   │   ├── (dashboard)/    Dashboard (protected)
│   │   └── api/auth/       NextAuth route handler
│   ├── components/
│   │   ├── auth/           Auth form components
│   │   ├── dashboard/      Sidebar, topbar, menus
│   │   └── ui/             shadcn/ui components
│   ├── hooks/              useAuth, useApi
│   ├── lib/                Auth config, API client
│   ├── providers/          Theme, Query, Session
│   └── types/              TypeScript types
├── Makefile                Dev/build/test commands
├── start.sh                Local dev script (PM2)
├── deploy.sh               Production deploy script
└── Caddyfile               Reverse proxy template
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
