# Phase 5: Deployment Scripts

## Context
- [Brainstorm: Deployment](../reports/brainstorm-260404-2342-deployment-scripts.md)
- Depends on: Phase 1 (clean backend) + Phase 4 (clean root files)
- Current: `start.sh` has domain-specific code (ingestion, tracer URL, Postgres setup)

## Overview
- **Priority:** P1
- **Status:** completed
- **Description:** Create deployment scripts for local dev and production (EC2). PM2 for process management, Caddy for reverse proxy.

## Key Decisions
- PM2 for both dev and prod (team familiarity)
- Caddy for auto HTTPS reverse proxy
- SSH + git pull deploy flow (no CI/CD)
- Rollback via server.bak binary swap

## Requirements

### Functional
- `start.sh` works for local dev (PM2 dev mode)
- `deploy.sh` handles production deploy on EC2
- `scripts/setup-server.sh` bootstraps fresh EC2 instance
- `Caddyfile` template for reverse proxy
- Health check after deploy with rollback

### Non-functional
- Scripts portable across macOS (local) and Linux (EC2)
- No domain-specific references
- Clear error messages on missing deps

## Related Code Files

### Modify
- `start.sh` -- strip domain code (ingestion, tracer URL, Postgres), keep dev-only
- `ecosystem.config.cjs` -- clean env profiles, remove domain references

### Create
- `deploy.sh` -- production deploy script
- `scripts/setup-server.sh` -- one-time EC2 bootstrap
- `Caddyfile` -- reverse proxy template

### Delete
- None (start.sh gets refactored, not deleted)

## Implementation Steps

### 1. Refactor `start.sh`
- Remove `--ingest` flag and ingestion logic
- Remove `--with-postgres` flag and Postgres setup (SQLite now)
- Remove tracer URL from output
- Keep: config sync, env validation, PM2 dev mode, stop/restart/logs/status
- Update port defaults to match template config
- Replace project-specific references with `myapp`

### 2. Update `ecosystem.config.cjs`
- Remove domain-specific env vars
- Add dev/prod profiles:
  - Dev: `go run ./cmd/server` + `pnpm dev`
  - Prod: `./server` (binary) + `pnpm start`
- Set `max_memory_restart: '512M'` for prod

### 3. Create `deploy.sh`
```
#!/usr/bin/env bash
# Production deployment script
# Usage: ./deploy.sh [--skip-frontend] [--rollback]

Flow:
1. git pull origin main
2. Backup current binary: cp backend/server backend/server.bak
3. Build Go binary: cd backend && go build -o server ./cmd/server
4. Install frontend deps: cd frontend && pnpm install --frozen-lockfile
5. Build frontend: pnpm build
6. Sync config from system.cfg.json to .env files
7. PM2 restart (or start if first run)
8. Health check: curl -sf http://localhost:$BE_PORT/health
9. If health check fails: rollback (cp server.bak server, PM2 restart)
```

Flags:
- `--skip-frontend`: skip frontend build (backend-only changes)
- `--rollback`: manually rollback to previous binary

### 4. Create `scripts/setup-server.sh`
One-time EC2 bootstrap:
```
1. Update system packages
2. Install Go (latest stable)
3. Install Node.js 20+ via nvm or nodesource
4. Install pnpm globally
5. Install PM2 globally
6. Install Caddy via official repo
7. Clone project repo
8. Copy .env.example to .env / .env.local
9. Run first deploy (deploy.sh)
10. Configure Caddy (copy Caddyfile, systemctl enable caddy)
11. Configure PM2 startup (pm2 startup)
```

### 5. Create `Caddyfile`
```
# Replace yourdomain.com with your actual domain
# Caddy auto-provisions HTTPS via Let's Encrypt

yourdomain.com {
    handle /api/* {
        reverse_proxy localhost:8889
    }
    handle /health {
        reverse_proxy localhost:8889
    }
    handle {
        reverse_proxy localhost:8089
    }
}
```

### 6. Update `system.cfg.json`
- Remove domain-specific endpoints
- Keep backend/frontend port config
- Add prod environment overrides

## Todo List
- [x] Refactor start.sh (strip domain code)
- [x] Update ecosystem.config.cjs (clean profiles)
- [x] Create deploy.sh (git pull + build + restart + health check + rollback)
- [x] Create scripts/setup-server.sh (EC2 bootstrap)
- [x] Create Caddyfile template
- [x] Update system.cfg.json (generic config)
- [x] Test start.sh locally (dev mode)

## Success Criteria
- `./start.sh` starts dev servers without errors
- `./start.sh stop/restart/logs/status` all work
- `deploy.sh` can build and restart in prod mode
- `deploy.sh --rollback` restores previous binary
- Health check detects failed deploy and auto-rollbacks
- No domain-specific references in any script

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| PM2 not installed on EC2 | Deploy fails | setup-server.sh installs it |
| SQLite file permissions on EC2 | DB errors | setup-server.sh sets correct permissions |
| Caddy domain not pointed | HTTPS fails | Document DNS setup in README |
| ~10s downtime during deploy | Brief unavailability | Acceptable for template scope |

## Security Considerations
- .env files never committed (already in .gitignore)
- Caddy auto-HTTPS (no manual cert management)
- PM2 runs as app user, not root
- setup-server.sh creates dedicated user
