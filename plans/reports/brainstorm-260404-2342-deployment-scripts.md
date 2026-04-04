# Brainstorm: Deployment Scripts for Template
**Date:** 2026-04-04 | **Status:** Approved

## Problem
Template needs deployment scripts for local dev and production (AWS EC2) without CI/CD.

## Decisions
| Decision | Choice | Rationale |
|----------|--------|-----------|
| Deploy flow | SSH + git pull + restart | Simplest, no extra tooling |
| Process manager | PM2 (dev + prod) | Already works, team knows it |
| Reverse proxy | Caddy | Auto HTTPS, zero-config TLS |
| CI/CD | None | Script-driven, add later if needed |

## Script Architecture
- `start.sh` -- local dev only (PM2 dev mode, config sync, env validation)
- `deploy.sh` -- production deploy (git pull + build + PM2 restart + health check + rollback)
- `scripts/setup-server.sh` -- one-time EC2 bootstrap (install Go, Node, pnpm, PM2, Caddy)
- `Caddyfile` -- reverse proxy template with placeholder domain
- `ecosystem.config.cjs` -- PM2 config with dev/prod profiles

## Rollback Strategy
Keep previous binary as `server.bak`, swap back if health check fails after deploy.

## Changes to Template Plan
Add deployment phase to plans/260404-2335-template-conversion/:
1. Refactor start.sh (strip domain code)
2. Create deploy.sh
3. Create scripts/setup-server.sh
4. Create Caddyfile template
5. Update ecosystem.config.cjs
6. Update README with deployment section
