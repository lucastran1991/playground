#!/usr/bin/env bash
set -euo pipefail

# MyApp - Server Setup Script (Ubuntu/Debian)
# Run once on a fresh EC2 instance to bootstrap the environment
# Usage: curl -sSL <raw-github-url>/scripts/setup-server.sh | bash

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

log() { echo -e "${GREEN}[setup]${NC} $1"; }
err() { echo -e "${RED}[setup]${NC} $1" >&2; }

# Must run as root or with sudo
if [ "$EUID" -ne 0 ]; then
    err "Please run as root: sudo bash setup-server.sh"
    exit 1
fi

APP_USER="${1:-deploy}"
APP_DIR="/home/${APP_USER}/myapp"
GO_VERSION="1.24.2"
NODE_VERSION="20"

log "Setting up server for MyApp..."

# Update system
log "Updating system packages..."
apt-get update -qq && apt-get upgrade -y -qq

# Install essentials
apt-get install -y -qq git curl wget build-essential

# Install Go
if ! command -v go &>/dev/null; then
    log "Installing Go ${GO_VERSION}..."
    wget -q "https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz" -O /tmp/go.tar.gz
    rm -rf /usr/local/go
    tar -C /usr/local -xzf /tmp/go.tar.gz
    rm /tmp/go.tar.gz
    echo 'export PATH=$PATH:/usr/local/go/bin' >> /etc/profile.d/go.sh
    source /etc/profile.d/go.sh
fi

# Install Node.js
if ! command -v node &>/dev/null; then
    log "Installing Node.js ${NODE_VERSION}..."
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
    apt-get install -y -qq nodejs
fi

# Install pnpm
if ! command -v pnpm &>/dev/null; then
    log "Installing pnpm..."
    npm install -g pnpm
fi

# Install PM2
if ! command -v pm2 &>/dev/null; then
    log "Installing PM2..."
    npm install -g pm2
fi

# Install Caddy
if ! command -v caddy &>/dev/null; then
    log "Installing Caddy..."
    apt-get install -y -qq debian-keyring debian-archive-keyring apt-transport-https
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
    apt-get update -qq
    apt-get install -y -qq caddy
fi

# Create app user
if ! id "$APP_USER" &>/dev/null; then
    log "Creating user ${APP_USER}..."
    useradd -m -s /bin/bash "$APP_USER"
fi

# Setup PM2 startup
pm2 startup systemd -u "$APP_USER" --hp "/home/${APP_USER}"

log ""
log "=== Setup complete ==="
log ""
log "Next steps:"
log "  1. Switch to app user:  su - ${APP_USER}"
log "  2. Clone your repo:     git clone <your-repo-url> myapp"
log "  3. Configure env:       cd myapp && cp backend/.env.example backend/.env"
log "  4. Edit secrets:        nano backend/.env"
log "  5. Configure frontend:  cp frontend/.env.example frontend/.env.local"
log "  6. First deploy:        ./deploy.sh"
log "  7. Copy Caddyfile:      sudo cp Caddyfile /etc/caddy/Caddyfile"
log "  8. Edit domain:         sudo nano /etc/caddy/Caddyfile"
log "  9. Restart Caddy:       sudo systemctl restart caddy"
log " 10. Save PM2:            pm2 save"
