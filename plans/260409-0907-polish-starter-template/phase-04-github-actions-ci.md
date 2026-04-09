---
phase: 4
title: "GitHub Actions CI"
status: completed
priority: P2
effort: 1h
depends_on: [3]
---

# Phase 4: GitHub Actions CI

## Overview

Basic CI workflow: lint + build + test on push/PR. Shows template users the pattern.

## Related Files

- Create: `.github/workflows/ci.yml`

## Implementation Steps

### 1. Create CI Workflow

File: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-go@v5
        with:
          go-version: "1.22"
      - name: Build
        run: cd backend && go build ./cmd/server
      - name: Test
        run: cd backend && go test ./...

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - uses: pnpm/action-setup@v4
        with:
          version: latest
      - name: Install
        run: cd frontend && pnpm install --frozen-lockfile
      - name: Lint
        run: cd frontend && pnpm lint
      - name: Build
        run: cd frontend && pnpm build
      - name: Test
        run: cd frontend && pnpm test
```

Notes:
- Two parallel jobs (backend + frontend) for faster runs
- Skip Playwright E2E in CI initially (needs both servers + browser setup)
- Can add E2E later with `pnpm test:e2e` when needed
- Use `--frozen-lockfile` to catch lockfile drift

### 2. Verify Locally

Before committing, simulate the CI steps:
```bash
cd backend && go build ./cmd/server && go test ./...
cd frontend && pnpm install && pnpm lint && pnpm build && pnpm test
```

## Todo

- [x] Create .github/workflows/ci.yml
- [x] Verify all CI steps pass locally
- [ ] Push and verify workflow runs green (awaiting user push)

## Risk

- Low: pnpm lockfile must be committed or `--frozen-lockfile` fails
- E2E excluded from CI to keep it simple

## Success Criteria

- CI workflow runs on push to main
- Both backend and frontend jobs pass
- Template users see the CI pattern and can extend
