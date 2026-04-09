---
phase: 3
title: "Migrate Auth Pages"
status: pending
priority: P2
effort: 1h
depends_on: [phase-01]
---

# Phase 3: Migrate Auth Pages

## Context Links
- [login-form.tsx](../../frontend/src/components/auth/login-form.tsx)
- [register-form.tsx](../../frontend/src/components/auth/register-form.tsx)
- [social-login-buttons.tsx](../../frontend/src/components/auth/social-login-buttons.tsx)
- [auth-left-panel.tsx](../../frontend/src/components/auth/auth-left-panel.tsx)

## Overview

Auth pages currently use raw HTML elements with inline glass CSS classes (`glass-input`, `gradient-btn`). They do NOT import from glass/ at all. This phase upgrades them to shadcn components for consistency and a11y (Radix-based focus management, proper Label association).

**This phase is optional/low-priority** -- auth pages already work and have zero glass/ imports. Migration here is for code consistency, not to unblock deletion.

## Key Insights

- Auth pages use: `<input>` with `glass-input` class, `<button>` with `gradient-btn` class, `<label>` raw HTML
- No glass/ component imports -- these files won't block Phase 4 cleanup
- shadcn Input/Button/Label give better a11y (aria, focus ring, disabled states)
- The visual style must stay identical -- keep `glass-input`, `gradient-btn` classes

## Requirements

### Functional
- Login/register forms use shadcn Input, Button, Label
- Visual appearance unchanged
- Form validation (react-hook-form + zod) still works

### Non-functional
- Better keyboard navigation via Radix primitives
- Proper label-input association

## Implementation Steps

### Step 1: Migrate login-form.tsx
1. Add imports: `import { Input } from "@/components/ui/input"`, `import { Button } from "@/components/ui/button"`, `import { Label } from "@/components/ui/label"`
2. Replace `<input ... className="w-full glass-input ...">` with `<Input className="glass-input ..." />`
   - shadcn Input already has base styling; `glass-input` class overrides bg/border
3. Replace `<label>` with `<Label>`
4. Replace submit `<button>` with `<Button className="w-full gradient-btn ...">` 
5. Keep password toggle button as raw `<button>` (icon-only, custom styling)
6. Keep success overlay, error display, Link elements as-is

### Step 2: Migrate register-form.tsx
1. Same pattern as login-form
2. Likely has name + email + password + confirm password fields

### Step 3: Migrate social-login-buttons.tsx
1. Replace `<button>` elements with `<Button variant="ghost" className="...">`
2. Keep inline SVG icons
3. Keep existing glass bg/border styling via className

### Step 4: Verify
1. Run `pnpm build`
2. Test login page renders correctly
3. Test form validation still triggers
4. Test keyboard tab order

## Todo List
- [ ] Migrate login-form.tsx to shadcn Input/Button/Label
- [ ] Migrate register-form.tsx
- [ ] Migrate social-login-buttons.tsx to shadcn Button
- [ ] Build passes
- [ ] Visual + form validation check

## Success Criteria
- Auth forms use shadcn Input, Button, Label
- Visual appearance unchanged (glass-input, gradient-btn classes preserved)
- react-hook-form `register()` still works with shadcn Input (it does -- Input forwards ref)

## Risk Assessment
- **Low**: shadcn Input may add its own bg/border that conflicts with `glass-input` -- test and override if needed
- **Low**: Button component may override gradient-btn background -- verify specificity

## Related Code Files

### Modify
- `frontend/src/components/auth/login-form.tsx`
- `frontend/src/components/auth/register-form.tsx`
- `frontend/src/components/auth/social-login-buttons.tsx`

### No changes needed
- `frontend/src/components/auth/auth-left-panel.tsx` (pure layout, no form elements)
