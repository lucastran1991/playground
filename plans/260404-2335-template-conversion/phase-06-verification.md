## Phase 5: Verification

### Context Links
- [plan.md](plan.md)
- Depends on: All prior phases (1-4)

### Overview
- **Priority:** P1
- **Status:** completed
- **Description:** Build both services, run tests, verify Swagger UI, do final grep sweep for domain references. Ensure template is ready for use.

### Requirements
- Backend compiles and starts
- Frontend compiles and starts
- Auth flow works end-to-end
- Swagger UI loads
- Zero domain references remain

### Verification Steps

**1. Backend build + start**
```bash
cd backend
go build -o server ./cmd/server
# Create minimal .env for testing:
echo 'JWT_SECRET=test-secret-key-minimum-32-characters-long' > .env
./server
# Expected: server starts on :8080, creates myapp.db
```

**2. Backend endpoints**
```bash
# Health check
curl http://localhost:8080/health
# Expected: {"status":"ok"}

# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123"}'
# Expected: 201 with user + tokens

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
# Expected: 200 with tokens

# Me (use access_token from login response)
curl http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer <token>"
# Expected: 200 with user data
```

**3. Swagger UI**
```bash
# Open in browser:
open http://localhost:8080/swagger/index.html
# Expected: Swagger UI with 5 endpoints listed
```

**4. Frontend build**
```bash
cd frontend
pnpm install
pnpm build
# Expected: Build succeeds, no errors
```

**5. Frontend dev**
```bash
pnpm dev
# Open http://localhost:3000
# Expected: Landing page renders
# Navigate to /login -- form renders
# Navigate to /dashboard -- redirects to login (or shows dashboard if authed)
```

**6. Domain reference sweep**
```bash
# From project root:
grep -ri "blueprint\|tracer\|dag\|capacity.node\|impact.rule\|dependency.rule\|csv.ingest\|xyflow\|dagre" \
  --include="*.go" --include="*.ts" --include="*.tsx" --include="*.json" --include="*.md" \
  backend/ frontend/ README.md Makefile docs/
# Expected: ZERO hits
```

**7. Unused import check**
```bash
cd backend && go vet ./...
# Expected: no errors

cd frontend && pnpm lint
# Expected: no errors (or only style warnings)
```

**8. Make commands**
```bash
# From project root:
make build
# Expected: backend binary created, frontend .next/ generated

make test
# Expected: backend tests pass (auth tests if any), frontend lint passes
```

### Todo List
- [x] `go build ./cmd/server` succeeds
- [x] Backend starts, creates SQLite DB
- [x] Health check responds 200
- [x] Register + Login + Me endpoints work
- [x] Swagger UI loads at /swagger/index.html
- [x] `pnpm build` succeeds
- [x] Frontend landing page renders
- [x] Auth pages render (login/register forms)
- [x] Dashboard layout renders
- [x] Domain reference grep returns zero hits
- [x] `go vet ./...` clean
- [x] `pnpm lint` clean
- [x] `make build` works from root
- [x] `make test` works from root

### Success Criteria
- ALL todo items checked
- Template is usable by running quickstart from README
- No domain-specific code, config, or references remain

### Post-Verification
After all checks pass:
1. Delete `backend/*.db` test databases
2. Delete `backend/server` binary
3. Optionally: create a fresh git commit as the template baseline
