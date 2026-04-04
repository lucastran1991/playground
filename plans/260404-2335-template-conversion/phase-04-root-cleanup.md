## Phase 4: Root-level Cleanup

### Context Links
- [plan.md](plan.md)
- Depends on: Phase 1 + Phase 2 (final file list known)

### Overview
- **Priority:** P1
- **Status:** completed
- **Description:** Remove project-specific root files, create root Makefile, write new README with quickstart + rename checklist, clean docs/ directory, update .gitignore.

### Key Insights
- Root has several project-specific files: `system.cfg.json`, `ecosystem.config.cjs`, `start.sh`, `scripts/`, `repomix-output.xml`, `plans/`
- Current `docs/` has domain-specific content (wireframes, PDR, etc.) -- replace with template-appropriate docs
- Current `CLAUDE.md` at root has Vietnamese language rule + project-specific config -- replace with generic
- `.gitignore` needs SQLite + cleanup

### Files to DELETE
```
system.cfg.json                    # PM2/port config, replaced by env vars
ecosystem.config.cjs               # PM2 config
start.sh                           # Project-specific startup script
scripts/                           # Domain-specific scripts (entire directory)
  ensure-blueprint-ingested.sh
  register-dev-users.sh
  restart-and-test-login.sh
  verify-api.sh
repomix-output.xml                 # Generated file
plans/                             # Implementation plans (not for template)
docs/wireframes/                   # Domain wireframes
docs/project-overview-pdr.md       # Domain-specific PDR
docs/codebase-summary.md           # Will be outdated
docs/system-architecture.md        # Will be rewritten
docs/tech-stack.md                 # Will be merged into README
docs/design-guidelines.md          # Domain-specific design
docs/code-standards.md             # Keep + update
CLAUDE.md                          # Project-specific AI config (root)
frontend/CLAUDE.md                 # Project-specific AI config
frontend/AGENTS.md                 # Project-specific AI config
```

### Files to CREATE

**1. `Makefile` (root)**
```makefile
.PHONY: dev dev-backend dev-frontend build test swagger clean

# Start both servers
dev:
	@echo "Starting backend and frontend..."
	@make -j2 dev-backend dev-frontend

dev-backend:
	cd backend && go run ./cmd/server

dev-frontend:
	cd frontend && pnpm dev

build:
	cd backend && go build -o server ./cmd/server
	cd frontend && pnpm build

test:
	cd backend && go test ./...
	cd frontend && pnpm lint

swagger:
	cd backend && swag init -g cmd/server/main.go -o docs/

clean:
	rm -f backend/server
	rm -rf frontend/.next
	rm -f backend/*.db
```

**2. `README.md` (root -- full rewrite)**
Structure:
- Title: `# MyApp`
- One-liner: Fullstack starter template (Go Gin + Next.js 16)
- Tech stack bullet list
- Prerequisites (Go 1.22+, Node 20+, pnpm)
- Quickstart (3 steps: backend .env + go run, frontend pnpm install + pnpm dev)
- Project structure tree (matching brainstorm target)
- API endpoints table (auth only + health + swagger)
- Rename checklist (from brainstorm: go.mod, package.json, layout.tsx, README, .env, Makefile)
- Customization guide (add models, add routes, switch to Postgres)
- License placeholder

**3. `docs/README.md`**
Brief index of template documentation.

**4. `docs/code-standards.md`** (update existing)
Keep coding standards but remove domain-specific references.

**5. `frontend/.env.example`** (create or update)
```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXTAUTH_SECRET=change-me-to-a-random-string
NEXTAUTH_URL=http://localhost:3000
```

### Files to MODIFY

**1. `.gitignore` (root)**
Update to clean template version:
```gitignore
# Binaries
*.exe
*.dll
*.so
*.dylib
backend/server

# Test/coverage
*.test
*.out
coverage.*

# Go
go.work
go.work.sum

# Node / Frontend
node_modules/
.next/
*.tsbuildinfo

# Database
*.db

# Environment
.env
.env.local

# Editor
.idea/
.vscode/
*.swp
*~

# OS
.DS_Store
Thumbs.db

# Generated
repomix-output.*
```

### Implementation Steps

1. Delete all files listed in "Files to DELETE"
2. Create root `Makefile`
3. Write new `README.md` with quickstart + rename checklist
4. Clean `docs/` directory -- remove domain files, update code-standards.md, add index README
5. Create/update `frontend/.env.example`
6. Update `.gitignore`
7. Remove `.DS_Store` files: `find . -name .DS_Store -delete`
8. Verify `make dev-backend` starts the server
9. Verify `make dev-frontend` starts Next.js

### Todo List
- [x] Delete system.cfg.json, ecosystem.config.cjs, start.sh
- [x] Delete scripts/ directory
- [x] Delete repomix-output.xml
- [x] Delete plans/ directory
- [x] Delete CLAUDE.md, frontend/CLAUDE.md, frontend/AGENTS.md
- [x] Clean docs/ (remove domain files, update code-standards)
- [x] Create root Makefile
- [x] Write new README.md
- [x] Create frontend/.env.example
- [x] Update .gitignore
- [x] Remove .DS_Store files
- [x] Verify make commands work

### Success Criteria
- `make dev-backend` starts Go server
- `make dev-frontend` starts Next.js
- README has clear quickstart (copy-paste commands work)
- Rename checklist in README covers all `myapp` references
- No domain-specific files remain at root
- `git status` shows clean working tree after staging

### Risk Assessment
- **Plans deletion**: This plan itself lives in `plans/`. Delete AFTER implementation complete, or exclude this plan until final commit.
- **docs/ cleanup**: If code-standards.md has useful generic content, preserve it. Only remove domain references.
- **CLAUDE.md removal**: Only removes project-specific AI configs. User's global `~/.claude/` configs are untouched.

### Security Considerations
- `.env.example` files must NOT contain real secrets -- only placeholder values
- `.gitignore` must cover `.env`, `.env.local`, `*.db` to prevent accidental commits
