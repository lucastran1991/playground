# Fullstack Template Best Practices Report
**Go (Gin + SQLite/GORM) + Next.js 16 (React 19 + shadcn/ui + Tailwind v4)**

**Date:** 2026-04-04 | **Research Period:** April 2026

---

## 1. Go + Next.js Monorepo Structure

### Recommended Top-Level Layout
```
project-root/
├── backend/                  # Go service (Gin + GORM + SQLite)
│   ├── cmd/
│   │   └── server/          # Entry point
│   ├── internal/
│   │   ├── api/             # HTTP handlers/routes (Gin)
│   │   ├── domain/          # Business logic (no frameworks)
│   │   ├── usecase/         # Application logic
│   │   ├── repository/      # Data access (GORM)
│   │   ├── middleware/      # Auth, CORS, logging
│   │   └── models/          # Domain entities
│   ├── pkg/                 # Shared internal packages
│   ├── migrations/          # GORM migrations
│   ├── go.mod
│   └── Dockerfile
├── frontend/                # Next.js 16 + React 19
│   ├── src/
│   │   ├── app/            # App Router routes
│   │   ├── components/
│   │   │   ├── ui/         # shadcn/ui copied components
│   │   │   ├── layout/     # Header, footer, sidebar
│   │   │   ├── forms/      # Reusable forms
│   │   │   └── shared/     # General reusable
│   │   ├── lib/
│   │   │   ├── api-client.ts      # Backend communication
│   │   │   ├── utils.ts           # cn() and helpers
│   │   │   └── validators/        # Zod schemas
│   │   ├── hooks/          # Custom React hooks
│   │   └── styles/         # Global styles
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── next.config.ts
├── docs/                    # Shared documentation
├── scripts/                 # Root-level scripts
│   ├── dev.sh              # Start both backend & frontend
│   └── build.sh            # Build both
├── docker-compose.yml      # Local development
├── Makefile                # Common tasks
└── README.md
```

**Key Principle:** Each service owns its directory completely; Go's `/internal` pattern keeps backend code private; Next.js `/src` is idiomatic.

---

## 2. Go Project Best Practices (Gin + GORM + SQLite)

### Layered Architecture (Clean Architecture)
- **Domain Layer** (`internal/domain/`): Business logic, no imports from outer layers
- **Usecase Layer** (`internal/usecase/`): Application logic, pure functions, no Gin/SQL deps
- **Repository Layer** (`internal/repository/`): Data access with GORM, implements domain interfaces
- **Handler Layer** (`internal/api/handlers/`): HTTP handlers, Gin bindings, minimal logic

**Why:** Enables testing without HTTP/database, improves maintainability, clear dependency flow.

### Database Setup (GORM + SQLite)
```go
// Pattern: connection pooling + context support
db, err := gorm.Open(sqlite.Open("app.db"), &gorm.Config{})

// Essential: set connection pool
sqlDB, _ := db.DB()
sqlDB.SetMaxIdleConns(10)
sqlDB.SetMaxOpenConns(25)
```

**Key Points:**
- Use context.Context for all DB operations (supports cancellation/timeouts)
- Auto-migrations for schema: `db.AutoMigrate(&User{})`
- Convert GORM errors to domain-specific errors in repository layer
- Structure models with GORM tags: `gorm:"primaryKey"`, `json:"..."`

### HTTP API Patterns (Gin)
- **Standardized Response Format:**
  ```json
  { "success": true, "data": {...}, "error": null }
  { "success": false, "data": null, "error": "message" }
  ```
- **Request Validation:** Bind to DTOs, validate with struct tags or explicit validation
- **Middleware Stack:** Auth → Logging → CORS → Panic Recovery
- **Error Handling:** Centralized error handler, return typed errors (not just strings)

### JWT Authentication Pattern
- Token generation: 3-hour expiry (refresh tokens for longer sessions)
- Validation in middleware: extract from `Authorization: Bearer <token>`
- Refresh endpoint: swap expired token for new one
- Store user context in `gin.Context` for downstream handlers

### Code Organization - Avoid These Anti-Patterns
❌ Generic package names: `utils`, `helpers`, `common`, `base`  
✅ Descriptive: `validator`, `auth`, `storage`, `cache`

❌ Excessive nesting: `internal/services/user/handlers/http/v1/`  
✅ Shallow: `internal/user/handler.go`

❌ Creating interface for every struct  
✅ Only create interface if: (a) multiple implementations exist, (b) testing needs mocking, (c) future flexibility is needed

❌ Circular dependencies (A imports B, B imports A)  
✅ Use dependency injection, invert dependencies toward domain layer

---

## 3. Next.js 16 + React 19 Best Practices

### Project Structure
```
src/
├── app/
│   ├── layout.tsx              # Root layout (Server Component default)
│   ├── page.tsx                # Home page
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── api/                    # Next.js API routes (optional, BFF layer)
│       └── [...proxy]/route.ts # Backend proxy if needed
├── components/
│   ├── ui/                     # shadcn/ui copied components
│   ├── layout/                 # Reusable layout pieces
│   ├── forms/                  # Form components
│   └── shared/
├── lib/
│   ├── api-client.ts           # Fetch wrapper for backend
│   ├── validators.ts           # Zod schemas
│   └── utils.ts                # cn() helper
├── hooks/                      # Custom React hooks
└── styles/                     # Global CSS, Tailwind config
```

### Data Fetching Strategy
- **Server Components (Default):** Fetch data directly in `page.tsx` or `layout.tsx`
- **Client Components:** Use `'use client'` only when:
  - Interactivity needed (forms, buttons, real-time updates)
  - Browser APIs required (localStorage, hooks)
- **Avoid waterfall:** Initiate all requests in parallel with `Promise.all()`
- **Pattern:** Client → Next.js Server Component → Go backend (secure API keys never exposed)

### React 19 & shadcn/ui Integration
- **React 19 Changes:** `ref` now a regular prop (no `forwardRef` needed)
- **shadcn/ui Approach:** Copy-paste components into `src/components/ui/` (full ownership)
- **Package Managers:**
  - pnpm/yarn/bun: no special flags needed
  - npm: use `--legacy-peer-deps` during shadcn add (peer dependency conflicts)

### Form & Validation Pattern
- Use React Hook Form + Zod:
  ```typescript
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });
  
  type FormData = z.infer<typeof schema>;
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  ```

### Styling with Tailwind v4 + shadcn/ui
- **Mobile-first:** Unprefixed = mobile, `sm:/md:/lg:` = breakpoints
- **CSS Variables:** shadcn/ui uses CSS vars in `globals.css` (automatic setup)
- **Theme Management:** Use `next-themes` for dark mode (recommended)

### API Client Pattern
```typescript
// lib/api-client.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });
  
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
```

---

## 4. Monorepo Setup & Scripts

### Root package.json Scripts
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev -w backend\" \"npm run dev -w frontend\"",
    "build": "npm run build -w backend && npm run build -w frontend",
    "test": "npm run test -w backend && npm run test -w frontend",
    "lint": "npm run lint -w backend && npm run lint -w frontend"
  },
  "devDependencies": {
    "concurrently": "^8.0.0"
  }
}
```

### Makefile (Alternative, More Portable)
```makefile
.PHONY: dev build test clean

dev:
	@echo "Starting dev servers..."
	@concurrently "make -C backend dev" "make -C frontend dev"

build:
	make -C backend build
	make -C frontend build

test:
	make -C backend test
	make -C frontend test

clean:
	make -C backend clean
	make -C frontend clean
	rm -rf node_modules
```

### Docker Compose for Local Development
```yaml
version: '3.9'
services:
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      DATABASE_URL: "sqlite:///app.db"
    volumes:
      - ./backend:/app

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: "http://localhost:8080"
    depends_on:
      - backend
```

---

## 5. Popular Template Patterns to Emulate

### create-t3-app (TypeScript Stack)
- **Modularity:** Each piece optional, CLI generates based on needs
- **Typesafety:** Core focus across stack (TypeScript, tRPC, Prisma)
- **Opinionated Defaults:** Includes best practices pre-configured
- **Scalability Reference:** Cal.com monorepo shows production patterns (40k+ stars)

### Key Ideas to Borrow:
1. **Optional features:** Offer auth/database toggles during setup
2. **Clear onboarding:** Include setup guide, example code, demo page
3. **Shared typing:** Define API types in shared location (Go + TS)
4. **Turbo/Nx:** Consider tool for task orchestration in monorepo

---

## 6. Common Template Mistakes to Avoid

### Project Structure
❌ Unnecessary nesting (more than 2 levels in `internal/`)  
❌ Mixed concerns (handlers + models + DB logic in same file)  
❌ Generic package names that hide purpose

### Go-Specific
❌ No error wrapping (lose context when debugging)  
❌ Database connections without pooling  
❌ No middleware for logging/auth  
❌ API responses without standardized format  
❌ Hardcoded database path (use env vars + migrations)

### Next.js-Specific
❌ Client-side only data fetching (expose API URLs, lose SEO benefits)  
❌ Too many dependencies in `package.json` (bloat, security surface)  
❌ Inconsistent component organization (search becomes hard)  
❌ No input validation (security + UX issue)  
❌ Tight coupling to backend (hard to mock for testing)

### Monorepo-Specific
❌ No clear ownership (shared files edited by multiple services)  
❌ Circular dependencies between backend and frontend  
❌ No shared Makefile/script for common tasks  
❌ Missing .gitignore for each service  
❌ No clear dependency version management strategy

---

## 7. Minimal Setup Checklist

### Backend (Go)
- [ ] Clean architecture layers (`domain`, `usecase`, `repository`, `api`)
- [ ] GORM connection with pooling
- [ ] Standardized error/response types
- [ ] JWT middleware
- [ ] CORS middleware
- [ ] Database migration scripts
- [ ] Makefile with dev/build/test targets
- [ ] `.env.example` with all required vars
- [ ] `go.mod` with minimal dependencies (only essential)

### Frontend (Next.js)
- [ ] App Router structure (no Pages Router)
- [ ] TypeScript strict mode enabled
- [ ] Tailwind v4 configured with CSS vars
- [ ] shadcn/ui with at least Button + Input components
- [ ] API client wrapper in `lib/`
- [ ] Zod validators for forms
- [ ] React Hook Form for auth flow
- [ ] Environment variables documented (`.env.example`)
- [ ] ESLint configured

### Monorepo
- [ ] Root `package.json` with dev script
- [ ] Makefile at root
- [ ] `docker-compose.yml` for local dev
- [ ] `.gitignore` with node_modules, .env, build artifacts
- [ ] README with setup instructions
- [ ] CI/CD config (GitHub Actions, etc.)

---

## 8. Unresolved Questions & Gaps

1. **State Management:** Should template include TanStack Query (React Query) by default for server state, or keep it optional?
2. **Database Seeding:** Should template include seed scripts for development data?
3. **Testing Approach:** Go unit tests (testify) vs integration tests? Frontend E2E (Playwright/Cypress) or unit tests only?
4. **Auth Strategy:** JWT in localStorage vs HttpOnly cookies? Session-based with Redis?
5. **Deployment:** Should template include Dockerfile/docker-compose examples for production?
6. **API Documentation:** OpenAPI/Swagger for Go backend?
7. **Code Generation:** TypeScript types from Go models automatically? (codegen tools)
8. **Rate Limiting:** Built into template or documented as optional add-on?

---

## Sources

### Go Architecture & Templates
- [Clean Gin (GitHub)](https://github.com/dipeshdulal/clean-gin)
- [Go Backend Clean Architecture](https://www.blog.brightcoding.dev/2026/03/24/go-backend-clean-architecture-the-essential-template-for-modern-apis)
- [Go Project Structure & Patterns (Medium)](https://medium.com/@rosgluk/go-project-structure-practices-patterns-7bd5accdfd93)
- [Common Go Anti-Patterns (Three Dots Labs)](https://threedots.tech/post/common-anti-patterns-in-go-web-applications/)
- [Go REST API with Gin (LogRocket)](https://blog.logrocket.com/rest-api-golang-gin-gorm/)

### Go Project Layout
- [Standard Go Project Layout (GitHub)](https://github.com/golang-standards/project-layout)
- [Go Monorepo (Earthly Blog)](https://earthly.dev/blog/golang-monorepo/)
- [Full-stack Monorepo Part I (Medium)](https://medium.com/burak-tasci/full-stack-monorepo-part-i-go-services-967bb3527bb8)

### GORM & SQLite
- [GORM Documentation (gorm.io)](https://gorm.io/docs/index.html)
- [How to Use GORM Effectively (Oneuptime)](https://oneuptime.com/blog/post/2026-01-07-go-gorm-orm/)
- [SQLite with GORM (sqliz.com)](https://www.sqliz.com/posts/golang-gorm-sqlite/)

### Next.js 16 & React 19
- [Next.js 16 Documentation (nextjs.org)](https://nextjs.org/docs/app)
- [Next.js App Router Project Structure (MakerKit)](https://makerkit.dev/blog/tutorials/nextjs-app-router-project-structure)
- [Next.js App Router 2026 Guide (DEV Community)](https://dev.to/teguh_coding/nextjs-app-router-the-patterns-that-actually-matter-in-2026-146)
- [React 19 with shadcn/ui (shadcn/ui docs)](https://ui.shadcn.com/docs/react-19)

### shadcn/ui & Tailwind
- [shadcn/ui Next.js Installation (shadcn/ui)](https://ui.shadcn.com/docs/installation/next)
- [shadcn/ui Best Practices (Medium)](https://insight.akarinti.tech/best-practices-for-using-shadcn-ui-in-next-js-2134108553ae)
- [Tailwind v4 Mobile-first (Tailwind Docs)](https://tailwindcss.com/docs)

### Data Fetching & API Patterns
- [Next.js Data Fetching Patterns (nextjs.org)](https://nextjs.org/docs/14/app/building-your-application/data-fetching/patterns)
- [Next.js Backend for Frontend (nextjs.org)](https://nextjs.org/docs/app/guides/backend-for-frontend)

### Monorepo Setup
- [Master Full-Stack Monorepos (DEV Community)](https://dev.to/hardikidea/master-full-stack-monorepos-a-step-by-step-guide-2196)
- [Monorepo Setup with npm Workspaces (GitHub)](https://github.com/wixplosives/sample-monorepo)

### Open Source References
- [create-t3-app (GitHub)](https://github.com/t3-oss/create-t3-app)
- [Cal.com Production App (GitHub)](https://github.com/calcom/cal.com)
