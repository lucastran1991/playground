# Phase 1: Docker Containerization

## Context Links

- [Backend entry point](../../backend/cmd/server/main.go)
- [Backend config](../../backend/internal/config/config.go) -- env vars: `DB_PATH`, `JWT_SECRET`, `SERVER_PORT`, `CORS_ORIGIN`
- [Frontend package.json](../../frontend/package.json) -- scripts: `build`, `start`
- [Frontend next.config.ts](../../frontend/next.config.ts) -- needs `output: "standalone"`
- [Frontend .env.example](../../frontend/.env.example) -- env vars: `NEXT_PUBLIC_API_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- [system.cfg.json](../../system.cfg.json) -- port config (backend: 8080, frontend: 3000)
- [Caddyfile](../../Caddyfile) -- reverse proxy template
- [Makefile](../../Makefile) -- add docker targets here

## Overview

- **Priority**: P2
- **Status**: Complete
- **Description**: Create multi-stage Dockerfiles for backend (Go/scratch) and frontend (Next.js/alpine), docker-compose orchestration, and Makefile targets.

## Key Insights

- Backend uses SQLite via `glebarez/sqlite` (pure Go, no CGO) -- `scratch` base is viable
- Backend loads `.env` via godotenv but falls back to env vars -- Docker `environment:` works directly
- Frontend uses `NEXT_PUBLIC_API_URL` which is baked at build time -- must be set as build arg
- Go module is `myapp`, Go version 1.25.0
- Frontend uses pnpm, Next.js 16.2.2

## Data Flow

```
Host request → Caddy (:80/:443)
  → /api/*, /health, /swagger/* → backend container (:8080)
  → everything else             → frontend container (:3000)

Backend container:
  ENV vars → config.Load() → Gin server on :8080
  Volume mount → /app/data/myapp.db (SQLite persistence)

Frontend container:
  Build args (NEXT_PUBLIC_API_URL) → baked into .next/standalone
  ENV vars (NEXTAUTH_SECRET, NEXTAUTH_URL) → runtime
  node server.js on :3000
```

## Files to Create

| File | Purpose |
|------|---------|
| `backend/Dockerfile` | Multi-stage Go build → scratch runtime |
| `backend/.dockerignore` | Exclude unnecessary files from build context |
| `frontend/Dockerfile` | Multi-stage Next.js build → node:20-alpine runtime |
| `frontend/.dockerignore` | Exclude node_modules, .next from build context |
| `docker-compose.yml` | Orchestrate backend + frontend + optional Caddy |

## Files to Modify

| File | Change |
|------|--------|
| `frontend/next.config.ts` | Add `output: "standalone"` |
| `Makefile` | Add `docker-build`, `docker-up`, `docker-down`, `docker-logs` targets |

## Implementation Steps

### Step 1: Update `frontend/next.config.ts`

Add `output: "standalone"` to enable Next.js standalone build mode. This creates a self-contained `server.js` that doesn't need `node_modules`.

```ts
const nextConfig: NextConfig = {
  output: "standalone",
};
```

### Step 2: Create `backend/Dockerfile`

Multi-stage build:

```dockerfile
# Stage 1: Build
FROM golang:1.25-alpine AS builder
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /server ./cmd/server

# Stage 2: Runtime
FROM scratch
COPY --from=builder /server /server
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
EXPOSE 8080
ENTRYPOINT ["/server"]
```

Key details:
- `CGO_ENABLED=0` -- pure Go SQLite driver makes this possible
- `-ldflags="-s -w"` -- strip debug info, reduces binary ~30%
- Copy CA certs for any outbound HTTPS calls
- No `.env` file copied -- all config via env vars in compose

### Step 3: Create `backend/.dockerignore`

```
*.db
*.db-journal
server
server.bak
.env
docs/
tmp/
.git
```

### Step 4: Create `frontend/Dockerfile`

Multi-stage build:

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Stage 2: Build
FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_API_URL=http://localhost:8080
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN pnpm build

# Stage 3: Runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
```

Key details:
- Separate deps stage for layer caching
- `NEXT_PUBLIC_API_URL` as build arg (baked at build time)
- Non-root user `nextjs` for security
- `HOSTNAME="0.0.0.0"` required for Docker networking

### Step 5: Create `frontend/.dockerignore`

```
node_modules
.next
.env
.env.local
out
coverage
playwright-report
```

### Step 6: Create `docker-compose.yml`

```yaml
services:
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - SERVER_PORT=8080
      - DB_PATH=/app/data/myapp.db
      - JWT_SECRET=${JWT_SECRET:?Set JWT_SECRET in .env}
      - CORS_ORIGIN=http://localhost:3000
    volumes:
      - db-data:/app/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:8080/health"]
      interval: 10s
      timeout: 3s
      retries: 3

  frontend:
    build:
      context: ./frontend
      args:
        NEXT_PUBLIC_API_URL: http://localhost:8080
    ports:
      - "3000:3000"
    environment:
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET:?Set NEXTAUTH_SECRET in .env}
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      backend:
        condition: service_healthy
    restart: unless-stopped

volumes:
  db-data:
```

**Failure mode -- healthcheck on scratch**: `scratch` has no shell, no `wget`, no `curl`. Options:
- Option A: Add a tiny static binary (e.g., copy `wget` from alpine) -- adds complexity
- Option B: Skip healthcheck in compose, rely on Docker restart policy
- **Decision**: Remove healthcheck from backend service. Use `restart: unless-stopped` + frontend `depends_on` without condition. The backend starts in <1s; race condition risk is negligible. If health gating needed later, add a small Go healthcheck binary (YAGNI now).

**Revised backend service** (no healthcheck):

```yaml
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - SERVER_PORT=8080
      - DB_PATH=/app/data/myapp.db
      - JWT_SECRET=${JWT_SECRET:?Set JWT_SECRET in .env}
      - CORS_ORIGIN=http://localhost:3000
    volumes:
      - db-data:/app/data
    restart: unless-stopped
```

And frontend `depends_on` simplified to just `backend` (no condition).

### Step 7: Add Makefile targets

Append to existing Makefile:

```makefile
.PHONY: docker-build docker-up docker-down docker-logs

docker-build:
	docker compose build

docker-up:
	docker compose up -d

docker-down:
	docker compose down

docker-logs:
	docker compose logs -f
```

## Todo List

- [x] Update `frontend/next.config.ts` with `output: "standalone"`
- [x] Create `backend/Dockerfile` (multi-stage, scratch runtime)
- [x] Create `backend/.dockerignore`
- [x] Create `frontend/Dockerfile` (multi-stage, node:20-alpine runtime)
- [x] Create `frontend/.dockerignore`
- [x] Create `docker-compose.yml` at project root
- [x] Add docker targets to `Makefile`
- [x] Test: `make docker-build` succeeds
- [x] Test: `make docker-up` starts both services, backend responds on :8080/health
- [x] Test: Frontend accessible on :3000, can reach backend API

## Success Criteria

1. `docker compose build` completes without errors
2. `docker compose up -d` starts both containers
3. `curl http://localhost:8080/health` returns 200 from backend container
4. Frontend loads at `http://localhost:3000` and can call backend API
5. SQLite data persists across `docker compose down && docker compose up`
6. Backend image < 20MB, frontend image < 200MB
7. Existing `make dev`, `make build`, `make test` still work unchanged

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| SQLite file locking in Docker volume | Low | High | Named volume (not bind mount) avoids POSIX lock issues |
| `NEXT_PUBLIC_API_URL` wrong at build time | Medium | High | Default to `http://localhost:8080`; override via compose build args |
| Go 1.25 Docker image not yet available | Low | Medium | Fall back to `golang:1.24-alpine` if needed |
| `scratch` container debugging is hard | Low | Low | Accept trade-off; use `docker logs` for troubleshooting |
| pnpm version mismatch in Docker | Low | Medium | Use `corepack prepare pnpm@latest`; `--frozen-lockfile` catches drift |

## Security Considerations

- Backend runs as PID 1 in scratch -- no shell to exploit
- Frontend runs as non-root `nextjs` user
- No `.env` files copied into images -- secrets via env vars only
- `JWT_SECRET` and `NEXTAUTH_SECRET` required at runtime (compose enforces with `?` syntax)
- Docker volume for SQLite -- not exposed to host filesystem by default

## Rollback

- Delete created files, revert `next.config.ts` and `Makefile`
- All existing dev/deploy workflows remain functional regardless
