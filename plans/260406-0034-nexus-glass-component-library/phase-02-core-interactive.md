---
phase: 2
title: "Core Interactive Components"
status: completed
priority: P1
effort: 4h
depends_on: [1]
---

# Phase 2: Core Interactive Components

## Context
- [design/nexus-glass-ui.html](../../design/nexus-glass-ui.html) -- buttons (lines 239-261), inputs (lines 78-98, 476-489), toggles/checkbox/radio (lines 296-312)
- [frontend/src/components/auth/login-form.tsx](../../frontend/src/components/auth/login-form.tsx) -- current inline glass input usage
- [frontend/src/components/ui/button.tsx](../../frontend/src/components/ui/button.tsx) -- shadcn button to replace

## Overview
Build the most-used interactive components. These block all other phases since buttons/inputs appear everywhere.

## Components to Create

### 1. glass-button.tsx
**Variants (7):** primary, success, danger, warning, ghost, outline, link
**Sizes (4):** xs, sm, md (default), lg
**Modifiers:** pill, icon-only, full-width, disabled, loading

Design CSS reference:
```
.btn: padding 9px 18px, border-radius 10px, font-size 13px, font-weight 500
.btn-primary: bg linear-gradient(135deg, #7f77dd, #534ab7), hover -> gradient shift + translateY(-1px) + box-shadow
.btn-success: bg linear-gradient(135deg, #1d9e75, #0f6e56)
.btn-danger: bg linear-gradient(135deg, #d85a30, #993c1d)
.btn-warning: bg linear-gradient(135deg, #ef9f27, #ba7517)
.btn-ghost: bg rgba(255,255,255,0.07), border 1px solid rgba(255,255,255,0.14), color rgba(255,255,255,0.7)
.btn-outline: bg transparent, color #afa9ec, border 1px solid rgba(127,119,221,0.5)
.btn-link: bg transparent, color #afa9ec, text-decoration underline, padding 9px 4px
.btn-xs: padding 4px 9px, font-size 10.5px, border-radius 6px
.btn-sm: padding 6px 12px, font-size 11.5px, border-radius 8px
.btn-lg: padding 12px 26px, font-size 14.5px, border-radius 12px
.btn-icon-sq: padding 8px, 34x34px, border-radius 9px
.btn-pill: border-radius 20px
.btn-full: width 100%
.btn-disabled: opacity 0.4, cursor not-allowed, pointer-events none
```

**Props:**
```ts
interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "success" | "danger" | "warning" | "ghost" | "outline" | "link"
  size?: "xs" | "sm" | "md" | "lg"
  pill?: boolean
  iconOnly?: boolean
  fullWidth?: boolean
  loading?: boolean
  asChild?: boolean  // for composition with Link etc.
}
```

### 2. glass-input.tsx
**States:** default, focus (purple glow), success (teal border), error (coral border)
**Features:** left/right icon slots, hint text, error message

Design CSS reference:
```
.inp: bg rgba(255,255,255,0.07), border 1px solid rgba(255,255,255,0.12), border-radius 10px, padding 11px 14px, font-size 13.5px
.inp:focus: border-color rgba(127,119,221,0.6), bg rgba(127,119,221,0.08), box-shadow 0 0 0 3px rgba(127,119,221,0.15)
.inp-success: border-color rgba(29,158,117,0.6), bg rgba(29,158,117,0.07)
.inp-error: border-color rgba(216,90,48,0.6), bg rgba(216,90,48,0.07)
.inp-pl: padding-left 38px (for left icon)
.inp-pr: padding-right 38px (for right icon)
```

**Props:**
```ts
interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  state?: "default" | "success" | "error"
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  hint?: string
  error?: string
  label?: string
}
```

### 3. glass-input-group.tsx
Input with prefix text or appended button. Design: `.inp-group`, `.inp-group-prefix`

### 4. glass-select.tsx
Styled `<select>` with glass appearance. Design: `.select-w`, `select.inp`

### 5. glass-textarea.tsx
Same glass styling as input but for `<textarea>`.

### 6. glass-toggle.tsx
Design CSS:
```
.toggle: 38x20px, border-radius 10px, bg rgba(255,255,255,0.12), border 1px solid rgba(255,255,255,0.18)
.toggle.on: bg rgba(127,119,221,0.7), border-color #7f77dd
.toggle.on.green: bg rgba(29,158,117,0.7), border-color #1d9e75
.toggle-thumb: 14x14px, bg #fff, transition left 0.25s
```

**Props:**
```ts
interface GlassToggleProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  color?: "purple" | "green"
  label?: string
  disabled?: boolean
}
```

### 7. glass-checkbox.tsx
Design CSS:
```
.checkbox: 17x17px, border-radius 5px, border 1.5px solid rgba(255,255,255,0.25), bg rgba(255,255,255,0.06)
.checkbox.on: bg rgba(127,119,221,0.55), border-color #7f77dd
```

### 8. glass-radio.tsx
Design CSS:
```
.radio: 17x17px, border-radius 50%, border 1.5px solid rgba(255,255,255,0.25)
.radio.on: border-color #7f77dd, inner dot 7x7px bg #7f77dd
```

### 9. glass-otp-input.tsx
OTP code input -- 6 digit fields. Design: `.input-otp input` -- 44x48px each, center-aligned text.

## Related Code Files
- **Create:** `frontend/src/components/glass/glass-button.tsx`
- **Create:** `frontend/src/components/glass/glass-input.tsx`
- **Create:** `frontend/src/components/glass/glass-input-group.tsx`
- **Create:** `frontend/src/components/glass/glass-select.tsx`
- **Create:** `frontend/src/components/glass/glass-textarea.tsx`
- **Create:** `frontend/src/components/glass/glass-toggle.tsx`
- **Create:** `frontend/src/components/glass/glass-checkbox.tsx`
- **Create:** `frontend/src/components/glass/glass-radio.tsx`
- **Create:** `frontend/src/components/glass/glass-otp-input.tsx`
- **Create:** `frontend/src/components/glass/index.ts` (barrel export)

## Implementation Steps
1. Create `frontend/src/components/glass/` directory
2. Implement `glass-button.tsx` with all 7 variants, 4 sizes, modifiers
3. Implement `glass-input.tsx` with states, icon slots, hint/error
4. Implement `glass-input-group.tsx` (prefix + button append)
5. Implement `glass-select.tsx`
6. Implement `glass-textarea.tsx`
7. Implement `glass-toggle.tsx` with controlled state
8. Implement `glass-checkbox.tsx` with controlled state
9. Implement `glass-radio.tsx` with controlled state
10. Implement `glass-otp-input.tsx`
11. Create barrel `index.ts` for clean imports
12. Verify build with `pnpm build`

## A11y Requirements
- Button: proper `disabled` attr, `aria-busy` when loading, focus-visible ring
- Input: `aria-invalid` on error state, `aria-describedby` linking to hint/error
- Toggle: `role="switch"`, `aria-checked`
- Checkbox: `role="checkbox"`, `aria-checked`
- Radio: use native `<input type="radio">` with visual overlay, or `role="radio"`
- All: keyboard navigable (Enter/Space for toggles, Tab for focus order)

## Todo
- [x] glass-button.tsx (7 variants, 4 sizes, modifiers)
- [x] glass-input.tsx (states, icons, hint/error)
- [x] glass-input-group.tsx
- [x] glass-select.tsx
- [x] glass-textarea.tsx
- [x] glass-toggle.tsx
- [x] glass-checkbox.tsx
- [x] glass-radio.tsx
- [x] glass-otp-input.tsx
- [x] index.ts barrel export
- [x] Build verification

## Success Criteria
- All components render correctly in dark mode with glass styling
- Props match design variants exactly
- Keyboard navigation works for all interactive elements
- No build errors
- Each file < 200 lines
