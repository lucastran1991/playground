# Phase 01 — Cleanup & Legacy Drop

## Context Links
- Brainstorm: `plans/reports/brainstorm-260412-1429-template-stabilization.md`
- Overview: `plan.md`

## Overview
- **Priority:** P1
- **Status:** pending
- **Effort:** 2h
- **Description:** Remove tracked cruft, drop legacy PM2-prod deploy artifacts, relocate Caddy into compose stack as a container. Result: single dev path (start.sh) + single prod path (docker compose with embedded caddy).

## Key Insights
- User memory rule "always use start.sh" stays — now explicitly scoped to dev only
- `deploy.sh` replaced by CI deploy job (already landed in `260410-2318-docker-and-cicd`)
- `system.cfg.json` purpose unclear/unused — safe to drop
- Caddy-in-compose removes host-level config, makes stack portable across VPS providers
- `.next/` in repo root is stale (frontend builds into `frontend/.next/`, root leak is ancient)

## Requirements

### Functional
- `.gitignore` covers `.next/`, `*.db`, `*.db-journal`, `.claude/agent-memory/`, `.DS_Store`
- `docker-compose.yml` includes `caddy` service with TLS auto-HTTPS + reverse proxy to backend + frontend
- CI deploy job syncs caddy config alongside compose file
- `README.md` clarifies: dev → `./start.sh`, prod → `docker compose`

### Non-Functional
- Fresh clone: `git status` clean
- `docker compose up -d` still works end-to-end
- No breaking change to `./start.sh` dev flow

## Architecture

```
compose stack (prod):
  caddy (:80, :443)  →  frontend (:3000)
                     →  backend  (:8080)
  volumes: caddy_data, caddy_config, db-data
```

Caddyfile lives in `compose/caddy/Caddyfile`, mounted into caddy container. CI deploy scp's both `docker-compose.yml` and `compose/caddy/Caddyfile` to VPS.

## Related Code Files

### Delete (tracked)
- `deploy.sh`
- `Caddyfile` (root)
- `system.cfg.json`
- `backend/myapp.db`
- `backend/.claude/agent-memory/` (whole dir)
- `.next/` (root, if tracked)
- Any `.DS_Store` files tracked

### Create
- `compose/caddy/Caddyfile` — reverse proxy + TLS config
- `.dockerignore` entries if needed

### Modify
- `.gitignore` — add stale-artifact patterns
- `docker-compose.yml` — add caddy service + named volumes
- `.github/workflows/ci.yml` — deploy job syncs `compose/caddy/Caddyfile`
- `README.md` — dev vs prod section rewrite
- `/Users/mac/.claude/projects/-Users-mac-studio-playground/memory/feedback_use_start_sh.md` — scope to dev only

## Implementation Steps

1. **Extend `.gitignore`**
   ```
   .next/
   *.db
   *.db-journal
   .claude/agent-memory/
   .DS_Store
   ```

2. **Remove tracked cruft**
   ```bash
   git rm -rf --cached .next/ 2>/dev/null || true
   git rm --cached backend/myapp.db 2>/dev/null || true
   git rm -rf --cached backend/.claude/agent-memory 2>/dev/null || true
   find . -name .DS_Store -exec git rm --cached {} \; 2>/dev/null || true
   ```

3. **Delete legacy files**
   ```bash
   git rm deploy.sh system.cfg.json
   ```

4. **Relocate Caddyfile**
   - `mkdir -p compose/caddy`
   - `git mv Caddyfile compose/caddy/Caddyfile`
   - Edit contents to target compose service names (`backend:8080`, `frontend:3000`) instead of localhost
   - Enable auto-HTTPS: config block with `email` directive, site block with domain (use `{$DOMAIN}` env var)

5. **Add caddy service to `docker-compose.yml`**
   ```yaml
   caddy:
     image: caddy:2-alpine
     restart: unless-stopped
     ports:
       - "80:80"
       - "443:443"
     volumes:
       - ./compose/caddy/Caddyfile:/etc/caddy/Caddyfile:ro
       - caddy_data:/data
       - caddy_config:/config
     environment:
       - DOMAIN=${DOMAIN:-localhost}
     depends_on:
       - backend
       - frontend

   volumes:
     db-data:
     caddy_data:
     caddy_config:
   ```

6. **Update CI deploy job** (`.github/workflows/ci.yml`)
   - Extend scp-action source list to include `compose/caddy/Caddyfile`
   - Preserve directory structure on VPS (target = `${DEPLOY_PATH}`)

7. **Update README.md**
   - "Running Locally" → `./start.sh` (PM2, hot reload)
   - "Production Deployment" → `docker compose up -d` (with `DOMAIN` env var note)
   - Remove any reference to `deploy.sh`, host-level Caddy, `system.cfg.json`

8. **Update memory rule**
   - File: `~/.claude/projects/-Users-mac-studio-playground/memory/feedback_use_start_sh.md`
   - Scope explicitly: "Use start.sh for LOCAL DEV only. Prod uses docker compose."

## Todo List

- [ ] Extend `.gitignore`
- [ ] `git rm --cached` stale artifacts
- [ ] Delete `deploy.sh`, `system.cfg.json`
- [ ] Relocate `Caddyfile` → `compose/caddy/Caddyfile` + rewrite for container targets
- [ ] Add `caddy` service + volumes to `docker-compose.yml`
- [ ] Extend CI deploy scp to sync caddy config
- [ ] Rewrite README dev/prod section
- [ ] Update `feedback_use_start_sh.md` memory scope
- [ ] Run `docker compose config` to validate YAML
- [ ] Run `./start.sh` to smoke-test dev flow

## Success Criteria

- `git status` on fresh clone = clean
- `docker compose config` parses without error
- `docker compose up -d` boots caddy + backend + frontend
- `curl http://localhost` (or configured DOMAIN) hits frontend through caddy
- `./start.sh` still starts PM2 dev servers
- Memory file updated; no Claude agent confusion on prod path

## Risk Assessment

| Risk | Mitigation |
|---|---|
| Caddy container fails to pick domain | Default `DOMAIN=localhost`, document `.env` override for prod |
| CI deploy breaks (missing compose/caddy on server) | Test deploy job with dry-run branch; add caddy config sync before switching to prod |
| Removing `myapp.db` breaks running dev server | User runs fresh `go run ./cmd/server` — creates new SQLite |
| Caddy ports 80/443 conflict on VPS | Document host port prerequisites in README |

## Security Considerations

- Auto-HTTPS via Let's Encrypt (caddy handles ACME)
- `DOMAIN` comes from env, not hardcoded
- Caddy runs as non-root by default
- `myapp.db` removal eliminates accidental dev-data leak to git history (already in history, note it)

## Next Steps

- Unblocks Phase 2 (stability infra — no file conflicts)
- Unblocks Phase 3 (DX polish)
