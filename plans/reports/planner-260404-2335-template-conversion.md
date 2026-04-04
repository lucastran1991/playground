# Planner Report: Template Conversion

**Date:** 2026-04-04 | **Plan:** `plans/260404-2335-template-conversion/`

## Summary

Created 5-phase implementation plan to convert fullstack Go+Next.js app into reusable `myapp` starter template. Work is primarily deletion and cleanup (~80%), with Swagger setup being the only new code addition.

## Phase Breakdown

| Phase | Effort | Description |
|-------|--------|-------------|
| 1. Backend cleanup | 2h | Delete 20+ domain files, switch PG->SQLite, rename module to `myapp`, simplify config/router/main |
| 2. Frontend cleanup | 1.5h | Delete tracer/DAG code (8 files), remove 3 heavy deps, clean sidebar, update metadata |
| 3. Swagger setup | 1h | Add swaggo/swag, annotate 5 endpoints, serve UI at /swagger/* |
| 4. Root cleanup | 1h | Delete project files (system.cfg, scripts/, plans/), create Makefile, write README, clean docs/ |
| 5. Verification | 0.5h | Build both, test auth flow, verify swagger, grep sweep for domain refs |

## Parallelization

- Phase 1 + Phase 2 can run in parallel (no file overlap)
- Phase 3 depends on Phase 1
- Phase 4 depends on Phase 1 + 2
- Phase 5 depends on all

## Key Specifics in Plan

- Every file to delete is explicitly listed with paths
- Every file to modify has exact changes described (fields to remove, imports to change, code patterns)
- Backend: 20 files to delete, 7 files to modify
- Frontend: 8 files to delete, 4 files to modify, 3 deps to remove
- Root: 10+ files to delete, 3 to create, 2 to modify

## Files

- `/Users/mac/studio/playground/plans/260404-2335-template-conversion/plan.md`
- `/Users/mac/studio/playground/plans/260404-2335-template-conversion/phase-01-backend-cleanup.md`
- `/Users/mac/studio/playground/plans/260404-2335-template-conversion/phase-02-frontend-cleanup.md`
- `/Users/mac/studio/playground/plans/260404-2335-template-conversion/phase-03-swagger-setup.md`
- `/Users/mac/studio/playground/plans/260404-2335-template-conversion/phase-04-root-cleanup.md`
- `/Users/mac/studio/playground/plans/260404-2335-template-conversion/phase-05-verification.md`
