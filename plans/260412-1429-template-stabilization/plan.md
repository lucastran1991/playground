---
title: "Template Stabilization"
description: "Drop legacy PM2 deploy cruft, consolidate dev/prod boundary, add migrations + typed API client + seed + dep updates + pre-commit"
status: complete
priority: P1
effort: 8h
branch: main
tags: [cleanup, devops, dx, infrastructure]
created: 2026-04-12
completed: 2026-04-12
blockedBy: []
blocks: []
---

# Template Stabilization

## Goal

Make Nexus a solid fork-ready starter. One dev path (`./start.sh`), one prod path (`docker compose`), no tracked cruft, shipped with migrations + typed API client + seed + Dependabot + pre-commit.

## Context

- Brainstorm: `plans/reports/brainstorm-260412-1429-template-stabilization.md`
- Builds on: `plans/260410-2318-docker-and-cicd/` (complete)
- User decisions: PM2 kept for dev, Docker for prod, Caddy moves into compose, drop deploy.sh + system.cfg.json

## Phases

| # | File | Effort | Status |
|---|---|---|---|
| 01 | [phase-01-cleanup-and-legacy-drop.md](phase-01-cleanup-and-legacy-drop.md) | 2h | complete |
| 02 | [phase-02-stability-infrastructure.md](phase-02-stability-infrastructure.md) | 3h | complete |
| 03 | [phase-03-dx-polish.md](phase-03-dx-polish.md) | 3h | complete |

## Dependencies

- Phase 1 must land before 2 (clean base)
- Phase 2 before 3 (migrations land before seed/create-admin)
- Each phase = independent PR

## Success Criteria

- `git status` clean on fresh clone — ✓
- `./start.sh` = only dev command — ✓ (PM2 flow untouched)
- `docker compose up -d` = only prod command (caddy+backend+frontend self-contained) — ✓
- `make migrate-up && make seed && make create-admin` work end-to-end — ✓ (smoke tested)
- FE generated types available via `make generate-api` — ✓ (retrofit deferred due to missing swagger response annotations; see Follow-ups)
- Dependabot + lefthook active — ✓

## Scope Deviations

1. **`system.cfg.json` NOT dropped** — it's read by `start.sh` and `ecosystem.config.cjs`. Kept.
2. **Stale tracked files** (`.next/`, `myapp.db`, `.DS_Store`) — NOT tracked anyway, already gitignored. Only added `.claude/agent-memory/`.
3. **Migration runner** — built a 100-line embedded runner (embed.FS + gorm transactions) instead of pulling in `golang-migrate` dep. YAGNI win.
4. **FE retrofit of typed client** — deferred. Generated types cover request schemas only; response schemas return `unknown` because handlers lack `@Success` swagger annotations.
5. **Backend Dockerfile** — no changes needed (migrations auto-run on boot via embed).

## Follow-ups (Not Blocking)

- Add `@Success 200 {object} ...` swagger annotations to handlers for full FE type coverage (M8 from review)
- Add healthchecks to backend + frontend services + `depends_on: condition: service_healthy` on caddy (M5)
- Verify `appleboy/scp-action` preserves `compose/caddy/` dir structure on first prod deploy (M6)
- Consider `len(password) >= 8` validation in `cmd/create-admin`
