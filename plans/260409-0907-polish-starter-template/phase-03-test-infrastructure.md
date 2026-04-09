---
phase: 3
title: "Test Infrastructure"
status: completed
priority: P1
effort: 2h
---

# Phase 3: Test Infrastructure

## Overview

Add smoke tests proving test infra works. Template users extend from here.

## Related Files

### Backend
- Create: `backend/internal/handler/auth_handler_test.go`

### Frontend
- Modify: `frontend/package.json` (add test scripts + devDependencies)
- Create: `frontend/vitest.config.ts`
- Create: `frontend/src/components/__tests__/button.test.tsx`
- Create: `frontend/playwright.config.ts`
- Create: `frontend/e2e/login.spec.ts`

### Root
- Modify: `Makefile` (update test target)

## Implementation Steps

### 1. Backend: Auth Handler Test

File: `backend/internal/handler/auth_handler_test.go`

Test the health endpoint and register endpoint using `httptest` + Gin test mode:
- `TestHealthEndpoint` -- GET /health returns 200 + `{"status":"ok"}`
- `TestRegisterEndpoint` -- POST /api/auth/register with valid payload returns 201

Requires setting up test database (in-memory SQLite). Look at `backend/internal/database/database.go` for setup pattern. Wire handler via same DI pattern as `main.go`.

### 2. Frontend: Vitest + Component Test

Install devDependencies:
```bash
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

Create `frontend/vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: [],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
})
```

Create smoke test for Button component:
- Renders without crashing
- Renders with children text
- Applies variant classes

Add scripts to package.json:
```json
"test": "vitest run",
"test:watch": "vitest",
"test:e2e": "playwright test"
```

### 3. Frontend: Playwright E2E

Install:
```bash
pnpm add -D @playwright/test
npx playwright install chromium
```

Create `frontend/playwright.config.ts`:
- Base URL: `http://localhost:3000`
- webServer: start `pnpm dev` automatically
- Single project: chromium only (template, users add more)

Create `frontend/e2e/login.spec.ts`:
- Navigate to /login
- Verify login form renders (email input, password input, submit button)
- Submit empty form -> see validation errors
- Note: Don't test actual login (requires running backend)

### 4. Update Makefile

Update test target to run frontend tests:
```makefile
test:
	cd backend && go test ./...
	cd frontend && pnpm test
	cd frontend && pnpm lint
```

## Todo

- [x] Create auth_handler_test.go with health + register tests
- [x] Install Vitest + RTL in frontend
- [x] Create vitest.config.ts
- [x] Create button.test.tsx smoke test
- [x] Install Playwright
- [x] Create playwright.config.ts
- [x] Create login.spec.ts E2E test
- [x] Add test/test:e2e scripts to package.json
- [x] Update Makefile test target
- [x] Verify all tests pass: `make test`

## Risk

- Backend test needs in-memory SQLite -- check if `glebarez/sqlite` supports `:memory:`
- Playwright needs chromium installed -- CI must handle this
- E2E test only checks form rendering (no backend needed)

## Success Criteria

- `cd backend && go test ./...` passes
- `cd frontend && pnpm test` passes
- `cd frontend && pnpm test:e2e` passes
- `make test` passes all three
