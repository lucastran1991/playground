---
title: "Convert Fullstack App to Reusable Starter Template"
description: "Strip domain code, switch to SQLite, add Swagger, produce clean myapp template"
status: completed
priority: P1
effort: 7.5h
branch: main
tags: [template, cleanup, refactor]
created: 2026-04-04
---

## Overview

Convert existing Go+Next.js fullstack app into a reusable starter template (`myapp`).
Primary work: deletion of domain code (blueprint/tracer/DAG), DB swap to SQLite, Swagger setup, new README.

## Phases

| # | Phase | Status | Effort | File |
|---|-------|--------|--------|------|
| 1 | Backend cleanup | completed | 2h | [phase-01](phase-01-backend-cleanup.md) |
| 2 | Frontend cleanup | completed | 1.5h | [phase-02](phase-02-frontend-cleanup.md) |
| 3 | Swagger setup | completed | 1h | [phase-03](phase-03-swagger-setup.md) |
| 4 | Root-level cleanup | completed | 1h | [phase-04](phase-04-root-cleanup.md) |
| 5 | Deployment scripts | completed | 1.5h | [phase-05](phase-05-deployment-scripts.md) |
| 6 | Verification | completed | 0.5h | [phase-06](phase-06-verification.md) |

## Dependencies

- Phase 2 can run parallel to Phase 1
- Phase 3 depends on Phase 1 (needs clean handler signatures)
- Phase 4 depends on Phases 1+2 (needs final file list)
- Phase 5 depends on Phases 1+4 (needs clean start.sh + final project structure)
- Phase 6 depends on all prior phases

## Key Decisions

- Module name: `myapp` (find-and-replace documented in README)
- DB: SQLite via GORM (zero-setup, Postgres upgrade path documented)
- Auth: Full JWT + NextAuth + UI stays
- No Docker/CI in template (YAGNI)
- TanStack Query stays for data fetching pattern
- Deployment: PM2 (dev+prod), Caddy reverse proxy, SSH+git pull flow
- Rollback: keep server.bak, swap if health check fails

## Reports

- [Brainstorm: Template](../reports/brainstorm-260404-2332-template-conversion.md)
- [Brainstorm: Deployment](../reports/brainstorm-260404-2342-deployment-scripts.md)
- [Research](../reports/researcher-260404-2327-template-best-practices.md)
