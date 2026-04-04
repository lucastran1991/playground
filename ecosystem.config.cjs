const cfg = require('./system.cfg.json');

// Detect environment: NODE_ENV=production uses compiled binary
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  apps: [
    {
      name: `${cfg.app_name}-backend`,
      cwd: cfg.backend.cwd,
      script: isProd ? './server' : 'go',
      args: isProd ? '' : 'run ./cmd/server',
      env: {
        SERVER_PORT: cfg.backend.port,
        DB_PATH: 'myapp.db',
        CORS_ORIGIN: `http://localhost:${cfg.frontend.port}`,
        // JWT_SECRET: loaded from backend/.env — do not hardcode here
      },
      max_memory_restart: isProd ? '512M' : undefined,
      watch: false,
    },
    {
      name: `${cfg.app_name}-frontend`,
      cwd: cfg.frontend.cwd,
      script: 'pnpm',
      args: isProd ? `start --port ${cfg.frontend.port}` : `dev --port ${cfg.frontend.port}`,
      watch: false,
    },
  ],
};
