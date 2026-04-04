#!/usr/bin/env bash
set -euo pipefail

# MyApp - Production Deployment Script
# Usage: ./deploy.sh [--skip-frontend] [--rollback]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

APP_NAME="myapp"
BE_PORT=$(node -e "console.log(require('./system.cfg.json').backend.port)")

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[deploy]${NC} $1"; }
warn() { echo -e "${YELLOW}[deploy]${NC} $1"; }
err() { echo -e "${RED}[deploy]${NC} $1" >&2; }

SKIP_FRONTEND=false
ROLLBACK=false

for arg in "$@"; do
    case $arg in
        --skip-frontend) SKIP_FRONTEND=true ;;
        --rollback) ROLLBACK=true ;;
    esac
done

health_check() {
    local max_attempts=10
    local attempt=1
    while [ $attempt -le $max_attempts ]; do
        if curl -sf "http://localhost:${BE_PORT}/health" > /dev/null 2>&1; then
            return 0
        fi
        sleep 1
        attempt=$((attempt + 1))
    done
    return 1
}

do_rollback() {
    if [ -f backend/server.bak ]; then
        warn "Rolling back to previous binary..."
        cp backend/server.bak backend/server
        NODE_ENV=production pm2 restart ecosystem.config.cjs 2>/dev/null || NODE_ENV=production pm2 start ecosystem.config.cjs
        if health_check; then
            log "Rollback successful."
        else
            err "Rollback failed! Manual intervention required."
            exit 1
        fi
    else
        err "No backup binary found (backend/server.bak)."
        exit 1
    fi
}

if [ "$ROLLBACK" = true ]; then
    do_rollback
    exit 0
fi

log "Starting deployment..."

# Pull latest code
log "Pulling latest changes..."
git pull origin "$(git branch --show-current)"

# Backup current binary
if [ -f backend/server ]; then
    cp backend/server backend/server.bak
    log "Backed up current binary."
fi

# Build backend
log "Building backend..."
(cd backend && go build -o server ./cmd/server)

# Build frontend (unless skipped)
if [ "$SKIP_FRONTEND" = false ]; then
    log "Installing frontend dependencies..."
    (cd frontend && pnpm install --frozen-lockfile)
    log "Building frontend..."
    (cd frontend && pnpm build)
else
    warn "Skipping frontend build."
fi

# Restart services
log "Restarting services..."
NODE_ENV=production pm2 restart ecosystem.config.cjs 2>/dev/null || NODE_ENV=production pm2 start ecosystem.config.cjs

# Health check
log "Running health check..."
if health_check; then
    log "Deployment successful! Health check passed."
    log "Previous binary kept at backend/server.bak until next deploy."
else
    err "Health check failed!"
    do_rollback
fi
