---
title: "Polish Nexus Starter Template"
status: completed
priority: P1
effort: 4h
branch: main
tags: [cleanup, testing, ci, frontend, backend]
created: 2026-04-09
---

# Polish Nexus Starter Template

## Goal

Add smoke tests, GitHub Actions CI, error boundaries, and clean up git artifacts. Make the template production-ready for forking.

## Context

- Brainstorm: `plans/reports/brainstorm-260409-0907-polish-starter-template.md`
- Both backend and frontend compile/build clean
- Zero test files exist, no CI, no error boundaries
- ~30 untracked artifacts polluting git status
- Client-only logout already works (no backend endpoint needed)

## Phases

| # | Phase | Status | Effort | Deps |
|---|-------|--------|--------|------|
| 1 | [Cleanup & gitignore](phase-01-cleanup-and-gitignore.md) | completed | 30m | - |
| 2 | [Error boundaries](phase-02-error-boundaries.md) | completed | 30m | - |
| 3 | [Test infrastructure](phase-03-test-infrastructure.md) | completed | 2h | - |
| 4 | [GitHub Actions CI](phase-04-github-actions-ci.md) | completed | 1h | Phase 3 |

## Execution Order

```
Phase 1 + 2 + 3 (parallel) -> Phase 4
```

## Excluded (YAGNI)

- Backend logout endpoint
- Additional docs beyond existing 4 + README
- Full test coverage
- Docker CI builds
- Rate limiting, password change, profile update
