#!/usr/bin/env bash
set -euo pipefail

# MyApp - Local Development Script
# Usage: ./start.sh [command]
# Commands: start (default), stop, restart, logs, status, init

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

APP_NAME="myapp"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[${APP_NAME}]${NC} $1"; }
warn() { echo -e "${YELLOW}[${APP_NAME}]${NC} $1"; }
err() { echo -e "${RED}[${APP_NAME}]${NC} $1" >&2; }

# Check dependencies
check_deps() {
    local missing=()
    command -v go &>/dev/null || missing+=("go")
    command -v node &>/dev/null || missing+=("node")
    command -v pnpm &>/dev/null || missing+=("pnpm")
    command -v pm2 &>/dev/null || missing+=("pm2 (npm install -g pm2)")

    if [ ${#missing[@]} -gt 0 ]; then
        err "Missing dependencies: ${missing[*]}"
        exit 1
    fi
}

# Ensure .env files exist
ensure_env() {
    if [ ! -f backend/.env ]; then
        if [ -f backend/.env.example ]; then
            cp backend/.env.example backend/.env
            warn "Created backend/.env from .env.example -- edit JWT_SECRET!"
        else
            err "backend/.env.example not found"
            exit 1
        fi
    fi
    if [ ! -f frontend/.env.local ]; then
        if [ -f frontend/.env.example ]; then
            cp frontend/.env.example frontend/.env.local
            warn "Created frontend/.env.local from .env.example"
        fi
    fi
}

# Install frontend deps if needed
ensure_deps() {
    if [ ! -d frontend/node_modules ]; then
        log "Installing frontend dependencies..."
        (cd frontend && pnpm install)
    fi
}

cmd_start() {
    check_deps
    ensure_env
    ensure_deps

    log "Starting development servers..."
    pm2 start ecosystem.config.cjs

    local be_port
    local fe_port
    be_port=$(node -e "console.log(require('./system.cfg.json').backend.port)")
    fe_port=$(node -e "console.log(require('./system.cfg.json').frontend.port)")

    echo ""
    log "Backend:  http://localhost:${be_port}"
    log "Frontend: http://localhost:${fe_port}"
    log "Swagger:  http://localhost:${be_port}/swagger/index.html"
    echo ""
    log "Run './start.sh logs' to view logs"
    log "Run './start.sh stop' to stop all"
}

cmd_stop() {
    log "Stopping all services..."
    pm2 stop ecosystem.config.cjs 2>/dev/null || true
    pm2 delete ecosystem.config.cjs 2>/dev/null || true
    log "Stopped."
}

cmd_restart() {
    cmd_stop
    cmd_start
}

cmd_logs() {
    pm2 logs --lines 50
}

cmd_status() {
    pm2 status
}

cmd_init() {
    log "Initializing project for first-time setup..."

    # Check all required tools
    check_deps

    # Create .env files
    ensure_env

    # Install frontend dependencies
    log "Installing frontend dependencies..."
    (cd frontend && pnpm install)

    # Build backend to verify Go setup
    log "Verifying backend build..."
    (cd backend && go build -o /dev/null ./cmd/server)

    echo ""
    log "Init complete! Run './start.sh' to start dev servers."
}

# Main
case "${1:-start}" in
    start)   cmd_start ;;
    stop)    cmd_stop ;;
    restart) cmd_restart ;;
    logs)    cmd_logs ;;
    status)  cmd_status ;;
    init)    cmd_init ;;
    *)
        echo "Usage: ./start.sh [start|stop|restart|logs|status|init]"
        exit 1
        ;;
esac
