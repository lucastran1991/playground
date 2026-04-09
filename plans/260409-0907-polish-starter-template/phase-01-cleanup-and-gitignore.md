---
phase: 1
title: "Cleanup & Gitignore"
status: completed
priority: P1
effort: 30m
---

# Phase 1: Cleanup & Gitignore

## Overview

Remove untracked artifacts and update .gitignore so template users start with clean git status.

## Related Files

- Modify: `.gitignore`
- Delete: `Users/` dir, `design/` dir, `frontend/test-e2e.js`, `frontend/test-e2e-fixed.js`
- Delete: `plans/reports/*.png` (screenshots)
- Delete: stale plan dirs if no longer useful

## Implementation Steps

1. Delete untracked artifacts:
   ```bash
   rm -rf Users/ design/
   rm -f frontend/test-e2e.js frontend/test-e2e-fixed.js
   rm -f plans/reports/*.png
   ```

2. Update `.gitignore` -- add:
   ```
   # Plans & reports (session artifacts)
   plans/reports/
   plans/*/reports/
   ```

3. Fix metadata in `frontend/src/app/layout.tsx`:
   - Change description from "AI-powered development team orchestration platform" to "Fullstack starter template with Go backend and Next.js frontend"

4. Verify `git status` is clean after changes

## Todo

- [x] Delete untracked dirs and files
- [x] Update .gitignore
- [x] Fix layout.tsx metadata description
- [x] Verify clean git status

## Success Criteria

- `git status` shows only intentional changes (not artifact noise)
- .gitignore prevents future report/screenshot accumulation
