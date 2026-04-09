# Codebase Summary - Nexus

Complete fullstack application built with Go (backend) + Next.js (frontend) with shadcn/ui components themed using glassmorphism CSS utilities.

## Project Overview

**Nexus** is a modern starter template demonstrating:
- Clean architecture with layered backend (Go/Gin + GORM)
- Next.js 16 frontend with React 19 Server Components
- shadcn/ui components with glassmorphism theming
- JWT authentication with session management
- SQLite (or PostgreSQL-ready) database
- Dark-mode-only glassmorphism design system

## Directory Structure

```
nexus/
├── backend/                    # Go application
│   ├── cmd/server/            # Entry point
│   ├── internal/
│   │   ├── config/            # Environment config loading
│   │   ├── database/          # GORM + SQLite setup, migrations
│   │   ├── handler/           # HTTP handlers (auth, users, etc.)
│   │   ├── middleware/        # Auth, CORS, error handling
│   │   ├── model/             # GORM data models
│   │   ├── repository/        # Data access layer
│   │   ├── service/           # Business logic
│   │   └── router/            # Route definitions
│   ├── pkg/
│   │   ├── response/          # Standard response helpers
│   │   └── token/             # JWT utilities
│   ├── docs/                  # Swagger generated docs
│   ├── main.go               # Application entry
│   ├── go.mod, go.sum        # Dependencies
│   └── Dockerfile            # Container config
│
├── frontend/                   # Next.js application
│   ├── src/
│   │   ├── app/              # Next.js App Router
│   │   │   ├── (auth)/       # Auth pages (login, register)
│   │   │   ├── (dashboard)/  # Protected dashboard
│   │   │   ├── api/auth/     # NextAuth route handler
│   │   │   ├── error.tsx     # Error boundary with glass card
│   │   │   ├── loading.tsx   # Loading fallback with glass spinner
│   │   │   ├── not-found.tsx # 404 page with glass card
│   │   │   ├── layout.tsx    # Root layout
│   │   │   └── globals.css   # Glass utilities, theme tokens
│   │   ├── components/
│   │   │   ├── auth/         # LoginForm, RegisterForm
│   │   │   ├── dashboard/    # DashboardLayout, Topbar, StatsGrid, Charts
│   │   │   └── ui/           # shadcn/ui (Button, Input, Card, Avatar, Sidebar, etc.)
│   │   ├── hooks/            # useAuth, useApi custom hooks
│   │   ├── lib/              # Auth config, API client, Zod schemas
│   │   ├── providers/        # SessionProvider, ThemeProvider, QueryProvider
│   │   ├── types/            # TypeScript interfaces
│   │   └── middleware.ts     # NextAuth middleware
│   ├── public/               # Static assets
│   ├── package.json          # Dependencies
│   ├── tsconfig.json         # TypeScript config
│   ├── next.config.js        # Next.js config
│   ├── tailwind.config.js    # Tailwind config (v4)
│   └── eslint.config.mjs     # ESLint config
│
├── Makefile                   # Dev/build/test commands
├── start.sh                   # Local dev with PM2
├── deploy.sh                  # Production deployment
├── Caddyfile                 # Reverse proxy template
├── docker-compose.yml        # Local dev with containers
├── .env.example              # Backend env template
├── .gitignore                # Git exclusions
└── README.md                 # Setup instructions
```

## Backend Architecture

### Layers (Clean Architecture)

```
HTTP Handler (Gin)
    ↓
Service (Business Logic)
    ↓
Repository (Data Access)
    ↓
Model (GORM, Database Schema)
```

### Key Files

| Component | Purpose | Location |
|-----------|---------|----------|
| **Router** | HTTP route definitions | `internal/router/router.go` |
| **Auth Handler** | Login, register, refresh endpoints | `internal/handler/auth_handler.go` |
| **Auth Service** | Token generation, credential validation | `internal/service/auth_service.go` |
| **Auth Repository** | User CRUD, password hashing | `internal/repository/auth_repository.go` |
| **User Model** | GORM struct, database schema | `internal/model/user.go` |
| **JWT Middleware** | Token validation, auth check | `internal/middleware/auth_middleware.go` |
| **Database** | GORM connection, migrations | `internal/database/database.go` |
| **Config** | Environment loading (dotenv) | `internal/config/config.go` |

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | No | Health check |
| POST | `/api/auth/register` | No | Create user account |
| POST | `/api/auth/login` | No | Get JWT tokens |
| POST | `/api/auth/refresh` | No | Refresh access token |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/swagger/*` | No | Swagger documentation |

## Frontend Architecture

### Page Structure

**Auth Pages** (`app/(auth)/`)
- Login form with email/password validation
- Register form with password confirmation
- Error messages and loading states
- Redirect to dashboard on success

**Dashboard** (`app/(dashboard)/`)
- Protected route (requires valid session)
- DashboardLayout with Sidebar + Topbar
- Stats grid (4 KPI cards with trends)
- Bar chart (monthly data)
- Donut chart (distribution)
- Activity feed (recent events)
- User list with avatars

**Error Boundaries & Fallbacks**
- `error.tsx` – Client error boundary with glass card + retry button
- `loading.tsx` – Loading skeleton with glass card + spinner animation
- `not-found.tsx` – 404 page with glass card + home link

### Component Categories

**shadcn/ui** – Base component library with glassmorphism theming

**Core Components:**
- Forms: Button, Input, Label, Textarea, Select, Checkbox, Radio, Toggle
- Layout: Card, Separator, Accordion, Tabs
- Navigation: Sidebar, Sheet, DropdownMenu, Breadcrumb
- Data: Avatar, Skeleton
- Feedback: Tooltip

**App-Specific Components:**
- StatCard – KPI display with trend indicator
- ColorProgress – Custom progress visualization

### State Management

**Session** – NextAuth.js v5
- JWT tokens stored in session
- Server-side validation via middleware
- `useAuth()` hook for client access

**Data Fetching** – TanStack Query v5
- `useQuery()` for GET requests
- `useMutation()` for POST/PATCH/DELETE
- Automatic caching and refetching

**Form Validation** – React Hook Form + Zod
- Client-side validation with Zod schemas
- Server-side validation in backend
- Error messages from both layers

### Styling

**Tailwind CSS v4**
- Mobile-first breakpoints (`sm:`, `md:`, `lg:`)
- Custom color palette (dark-only)
- Glass utility classes (`.glass-light`, `.glass-card`, etc.)

**CSS Variables** (dark mode)
- `--primary` (purple #7f77dd)
- `--accent` (teal #1d9e75)
- `--destructive` (coral #f0997b)
- `--background` (#0f0c29)
- `--foreground` (near-white with opacity)
- `--border` (subtle white with opacity)

## Key Technologies

### Backend
- **Go 1.22+** – Language
- **Gin** – Web framework (lightweight, fast)
- **GORM** – ORM (migrations, hooks)
- **SQLite** – Default database (PostgreSQL-ready)
- **JWT** – Authentication tokens
- **Swagger** – API documentation

### Frontend
- **Next.js 16** – Framework (App Router, Turbopack)
- **React 19** – Library (Server Components default)
- **TypeScript** – Type safety
- **Tailwind CSS v4** – Utility CSS
- **TanStack Query v5** – Data fetching/caching
- **React Hook Form** – Form management
- **Zod** – Schema validation
- **NextAuth.js v5** – Session/auth
- **next-themes** – Dark mode toggle

## Authentication Flow

### Registration
1. User submits email + password on register page
2. Frontend validates with Zod
3. POST `/api/auth/register` to backend
4. Backend hashes password (bcrypt), creates user
5. Returns JWT tokens + user data
6. Frontend stores tokens in session
7. Redirect to dashboard

### Login
1. User submits email + password on login page
2. Frontend validates with Zod
3. POST `/api/auth/login` to backend
4. Backend verifies credentials, generates tokens
5. Returns JWT tokens + user data
6. Frontend stores tokens in session
7. Redirect to dashboard

### Session Refresh
- Access token expires after 15 minutes
- POST `/api/auth/refresh` with refresh token
- Backend returns new access token
- Frontend updates session automatically

### Protected Routes
- NextAuth middleware checks valid session
- Redirects to login if not authenticated
- Dashboard only accessible with valid token

## Development Workflow

### Local Setup

```bash
# Backend
cd backend
cp .env.example .env
go run ./cmd/server

# Frontend (separate terminal)
cd frontend
cp .env.example .env.local
pnpm install
pnpm dev
```

### Using Makefile

```bash
make dev       # Start both servers
make build     # Build for production
make test      # Run tests + lint
make swagger   # Regenerate API docs
make clean     # Remove artifacts
```

### Using PM2 (Production-like)

```bash
./start.sh     # Starts backend + frontend with PM2
```

## Testing

### Backend
- Unit tests: `*_test.go` files (e.g., `auth_handler_test.go`)
- Test function pattern: `TestFunctionName(t *testing.T)`
- Table-driven tests for multiple cases
- In-memory SQLite for test isolation
- Run with `go test ./...`

### Frontend
- Component tests: Vitest + React Testing Library
- E2E tests: Playwright
- Run with `pnpm test` and `pnpm test:e2e`
- Config: `vitest.config.ts`, `playwright.config.ts`

### CI/CD
- GitHub Actions workflow: `.github/workflows/ci.yml`
- Runs on push to main and pull requests
- Backend: build + test (Go 1.22)
- Frontend: lint + build + test (Node 20, pnpm)
- Parallel jobs for faster feedback

## Deployment

### Docker
```bash
docker-compose up
```

### Manual (with Caddy reverse proxy)
```bash
./deploy.sh
```

- Backend serves on port 8080
- Frontend builds to static export
- Caddy reverse proxies both on port 443

## Configuration

### Backend (.env)
```env
JWT_SECRET=your-random-string-32-chars-minimum
DATABASE_URL=sqlite:test.db
PORT=8080
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-string
```

## Code Standards

### Go
- File naming: `snake_case.go`
- Type/function naming: `PascalCase` (exported), `camelCase` (private)
- Error handling: Explicit error checks
- Comments: Doc comments for exported symbols

### TypeScript/React
- File naming: `kebab-case.tsx`
- Function/type naming: `PascalCase` (types/components), `camelCase` (functions/hooks)
- Use `"use client"` for interactivity
- Props: TypeScript interfaces

See `./docs/code-standards.md` for complete conventions.

## Important Files & Patterns

### Backend Key Patterns
- **Middleware**: JWT validation on protected routes
- **Service layer**: Business logic, validation before DB
- **Error handling**: Service errors mapped to HTTP status codes
- **Dependency injection**: Wired in `main.go`

### Frontend Key Patterns
- **Server components**: Async data fetching in `page.tsx`
- **Client components**: Forms, hooks, event listeners
- **API layer**: `lib/api-client.ts` with bearer token
- **Component imports**: `import { Button } from "@/components/ui/button"`

## Performance Considerations

- Next.js Turbopack for fast dev builds
- GORM connection pooling for database
- TanStack Query caching for API calls
- Server Components reduce JavaScript bundle
- Tailwind v4 with CSS variables (no runtime)

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Glassmorphism requires `backdrop-filter` support
- Fallback colors for older browsers via `@supports`

## Next Steps for Customization

1. **Rename project**: Update `go.mod`, `package.json`, README
2. **Add features**: Create new models, handlers, pages
3. **Change colors**: Edit CSS variables in `globals.css`
4. **Switch database**: Replace SQLite with PostgreSQL in `config.go`
5. **Deploy**: Use `deploy.sh` or Docker

See `/docs` directory for detailed guides on design, code standards, and architecture.
