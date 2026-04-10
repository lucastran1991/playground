---
title: "Docker Containerization & CI/CD Pipeline"
description: "Add Docker multi-stage builds, compose orchestration, and extend CI/CD with image push + deploy"
status: complete
priority: P2
effort: 3h
branch: main
tags: [docker, cicd, devops, infrastructure]
created: 2026-04-10
---

# Docker Containerization & CI/CD Pipeline

## Phases

| # | Phase | Status | Effort | File |
|---|-------|--------|--------|------|
| 1 | Docker Containerization | Complete | 2h | [phase-01](phase-01-docker-containerization.md) |
| 2 | CI/CD Pipeline Enhancement | Complete | 1h | [phase-02](phase-02-cicd-pipeline-enhancement.md) |

## Dependencies

- Phase 2 depends on Phase 1 (CI/CD builds Docker images defined in Phase 1)
- `frontend/next.config.ts` must be updated in Phase 1 before Dockerfile works

## Key Decisions

- Go binary on `scratch` -- no shell, no debug tools, minimal attack surface (~15MB)
- Next.js `standalone` output on `node:20-alpine` (~150MB)
- Single `docker-compose.yml` -- no multi-env overrides (YAGNI)
- SQLite DB persisted via Docker volume mount
- ghcr.io for image registry (free for public repos, integrated with GitHub Actions)
- Deploy job SSH-based, mirrors existing `deploy.sh` pattern but pulls Docker images

## Backwards Compatibility

- All existing workflows unchanged: `make dev`, `make build`, `deploy.sh`, PM2
- Docker is additive -- new `make docker-*` targets, existing targets untouched
- CI existing jobs untouched -- new jobs added after existing ones
