# Phase 2: CI/CD Pipeline Enhancement

## Context Links

- [Existing CI workflow](../../.github/workflows/ci.yml) -- backend + frontend build/test/lint jobs
- [Phase 1: Docker](phase-01-docker-containerization.md) -- Dockerfiles this phase builds
- [deploy.sh](../../deploy.sh) -- existing bare-metal deploy (kept as fallback)
- [system.cfg.json](../../system.cfg.json) -- port config reference

## Overview

- **Priority**: P2
- **Status**: Complete
- **Depends on**: Phase 1 (Dockerfiles must exist) - COMPLETE
- **Description**: Extend existing CI to build Docker images, push to ghcr.io, and add a deploy job triggered on `main` push.

## Key Insights

- Existing CI has two independent jobs: `backend` and `frontend` -- both must pass before Docker steps
- ghcr.io is free for public repos, uses `GITHUB_TOKEN` (no extra secrets for push)
- Deploy job needs SSH access to target server -- requires `SSH_HOST`, `SSH_USER`, `SSH_KEY` secrets
- Keep existing jobs as-is; add new jobs that depend on them

## Data Flow

```
PR push / main push
  ├── [existing] backend job: go build + go test
  ├── [existing] frontend job: pnpm install + lint + build + test
  │
  └── [new] docker job (needs: backend, frontend)
        ├── Build backend image
        ├── Build frontend image
        ├── (main only) Push to ghcr.io
        │
        └── [new] deploy job (needs: docker, main only)
              └── SSH → pull images → docker compose up
```

## Files to Modify

| File | Change |
|------|--------|
| `.github/workflows/ci.yml` | Add `docker` job + `deploy` job |

## Files NOT Modified

- `backend/Dockerfile`, `frontend/Dockerfile` -- created in Phase 1, read-only here
- `docker-compose.yml` -- used on server, not modified
- `deploy.sh` -- kept as bare-metal fallback, not modified

## Implementation Steps

### Step 1: Add `docker` job to CI workflow

Appended after existing `backend` and `frontend` jobs. Runs on every push/PR but only pushes images on `main`.

```yaml
  docker:
    needs: [backend, frontend]
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to ghcr.io
        if: github.ref == 'refs/heads/main'
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Docker meta (backend)
        id: meta-backend
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/${{ github.repository }}/backend
          tags: |
            type=sha
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build & push backend
        uses: docker/build-push-action@v6
        with:
          context: ./backend
          push: ${{ github.ref == 'refs/heads/main' }}
          tags: ${{ steps.meta-backend.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Docker meta (frontend)
        id: meta-frontend
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/${{ github.repository }}/frontend
          tags: |
            type=sha
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build & push frontend
        uses: docker/build-push-action@v6
        with:
          context: ./frontend
          push: ${{ github.ref == 'refs/heads/main' }}
          tags: ${{ steps.meta-frontend.outputs.tags }}
          build-args: |
            NEXT_PUBLIC_API_URL=${{ vars.NEXT_PUBLIC_API_URL || 'http://localhost:8080' }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

Key details:
- `needs: [backend, frontend]` -- existing test jobs are gates
- `permissions: packages: write` -- required for ghcr.io push
- `push` conditional on `main` branch -- PRs only verify build
- GHA cache (`cache-from/to`) for faster rebuilds (free, no external registry)
- `NEXT_PUBLIC_API_URL` from GitHub repo variable (falls back to localhost)

### Step 2: Add `deploy` job to CI workflow

Only runs on `main` push, after Docker images are pushed.

```yaml
  deploy:
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    needs: [docker]
    runs-on: ubuntu-latest
    environment: production
    concurrency:
      group: deploy-production
      cancel-in-progress: false
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd ${{ vars.DEPLOY_PATH || '~/app' }}
            docker compose pull
            docker compose up -d --remove-orphans
            docker image prune -f
```

Key details:
- `environment: production` -- enables GitHub environment protection rules (manual approval, etc.)
- `concurrency` -- prevents overlapping deploys
- Minimal SSH script: pull new images, restart, prune old images
- No rollback automation -- use `docker compose up -d --no-deps backend` to roll back a single service manually

### Step 3: Required GitHub Configuration

**Repository Secrets** (Settings > Secrets > Actions):

| Secret | Purpose |
|--------|---------|
| `SSH_HOST` | Deploy target server IP/hostname |
| `SSH_USER` | SSH username on deploy server |
| `SSH_KEY` | Private SSH key for deploy access |

**Repository Variables** (Settings > Variables > Actions):

| Variable | Purpose | Default |
|----------|---------|---------|
| `NEXT_PUBLIC_API_URL` | Backend URL baked into frontend build | `http://localhost:8080` |
| `DEPLOY_PATH` | App directory on deploy server | `~/app` |

**Note**: `GITHUB_TOKEN` is automatic -- no setup needed for ghcr.io push.

### Step 4: Final CI workflow structure

Complete file showing existing + new jobs:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  backend:
    # ... existing, unchanged ...

  frontend:
    # ... existing, unchanged ...

  docker:
    needs: [backend, frontend]
    # ... new, as defined in Step 1 ...

  deploy:
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    needs: [docker]
    # ... new, as defined in Step 2 ...
```

## Todo List

- [x] Add `docker` job to `.github/workflows/ci.yml` (build + conditional push)
- [x] Add `deploy` job to `.github/workflows/ci.yml` (SSH-based)
- [x] Document required GitHub secrets in README or deploy docs
- [x] Test: PR triggers backend + frontend + docker-build (no push)
- [x] Test: Main push triggers full pipeline including image push + deploy

## Success Criteria

1. PR builds: existing `backend` + `frontend` jobs pass, `docker` job builds images (no push)
2. Main push: all jobs pass, images pushed to `ghcr.io/<owner>/playground/backend:latest` and `.../frontend:latest`
3. Deploy job runs after image push, SSHs to server, pulls + restarts containers
4. Existing CI jobs (`backend`, `frontend`) unchanged in behavior
5. Pipeline fails fast: if tests fail, docker job never runs

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| SSH secrets not configured | High (first run) | High | Deploy job skipped gracefully; document setup steps |
| ghcr.io rate limits | Low | Medium | GHA cache reduces pulls; public repos have generous limits |
| `NEXT_PUBLIC_API_URL` misconfigured | Medium | High | Default fallback to localhost; document in setup guide |
| Deploy SSH timeout | Low | Medium | `concurrency` prevents overlap; SSH action has built-in timeout |
| Concurrent deploys corrupt state | Low | High | `concurrency.group` ensures single deploy at a time |

## Security Considerations

- SSH key stored as GitHub encrypted secret -- never logged
- `environment: production` enables optional approval gates
- `GITHUB_TOKEN` scoped to repo -- minimal permissions
- Images tagged with SHA for auditability (not just `latest`)
- `docker image prune -f` on server prevents disk bloat
- No secrets passed as build args -- only `NEXT_PUBLIC_API_URL` (public value)

## Rollback

- Revert CI changes: `git revert` the commit, existing jobs continue working
- Server rollback: `docker compose pull <previous-sha-tag> && docker compose up -d`
- Bare-metal fallback: `deploy.sh` still works independently of Docker pipeline
