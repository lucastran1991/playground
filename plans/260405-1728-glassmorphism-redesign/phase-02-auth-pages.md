# Phase 2: Auth Pages

## Context
- Design HTML: `design/glassmorphism_login_page.html` (lines 74-196 for structure, 1-73 for CSS)
- Phase 1 must be complete (glass utilities available)

## Overview
- **Priority:** P1
- **Status:** pending
- **Description:** Redesign auth layout to split-panel glass design. Redesign login/register forms with social buttons, glass inputs, Nexus branding.

## Key Insights
- Login wrap: `width: 900px`, `min-height: 560px`, `border-radius: 24px`, `border: 1px solid rgba(255,255,255,.12)`, `box-shadow: 0 40px 80px rgba(0,0,0,.5)`
- Left panel: `flex: 1`, `glass-light` style, `padding: 52px 48px`
- Right panel: `width: 400px`, `glass-dark` style, `padding: 52px 44px`
- Social buttons: `padding: 10px`, `border-radius: 10px`, `rgba(255,255,255,.07)` bg
- Submit button: `gradient-btn`, `padding: 12px`, `border-radius: 10px`
- Input fields: `padding: 11px 14px`, `border-radius: 10px`, `font-size: 13.5px`
- Form title: `22px`, `font-weight: 500`
- Hero title: `32px`, `font-weight: 500`, gradient span
- Feature icons: `28x28px`, `border-radius: 8px`, colored bg with matching stroke SVGs
- Success overlay: absolute inset, blur(8px), green checkmark

## Requirements

### Functional
- Split-panel layout: left branding, right form
- Floating orbs behind the login wrap
- Social login buttons (Google, GitHub) -- UI only
- Divider "or continue with email"
- Password show/hide toggle
- Forgot password link
- Terms of service footer
- Success overlay animation on submit
- Nexus logo + name in left panel
- Hero title with gradient text
- Feature list with colored icons
- Footer copyright

### Non-functional
- Responsive: stack vertically on mobile (hide left panel on small screens)
- Maintain react-hook-form + zod validation (no logic changes)

## Architecture
```
(auth)/layout.tsx         -- gradient bg, orbs, centered wrap with split panels
(auth)/login/page.tsx     -- imports LoginForm, no Card wrapper
(auth)/register/page.tsx  -- imports RegisterForm, no Card wrapper
components/auth/login-form.tsx      -- glass form with social buttons
components/auth/register-form.tsx   -- glass form (no social, or with social)
components/auth/social-login-buttons.tsx  -- NEW: shared social buttons
components/auth/auth-left-panel.tsx       -- NEW: shared branding panel
```

## Related Code Files
- **Modify:** `frontend/src/app/(auth)/layout.tsx`
- **Modify:** `frontend/src/app/(auth)/login/page.tsx`
- **Modify:** `frontend/src/app/(auth)/register/page.tsx`
- **Modify:** `frontend/src/components/auth/login-form.tsx`
- **Modify:** `frontend/src/components/auth/register-form.tsx`
- **Create:** `frontend/src/components/auth/social-login-buttons.tsx`
- **Create:** `frontend/src/components/auth/auth-left-panel.tsx`

## Implementation Steps

### Step 1: Create `auth-left-panel.tsx`
Shared left panel component with Nexus branding:

```tsx
// Logo: gradient icon (linear-gradient(135deg, #7f77dd, #1d9e75)) + "Nexus" text
// Hero: "Your AI-powered\n{development team}\nawaits." -- span gets gradient-text class
// Subtitle: "Orchestrate 14 specialized agents..." in rgba(255,255,255,.45)
// Feature list: 4 items with colored icon backgrounds
//   - purple bg rgba(127,119,221,.2), stroke #afa9ec
//   - green bg rgba(29,158,117,.2), stroke #5dcaa5
//   - amber bg rgba(239,159,39,.2), stroke #fac775
//   - pink bg rgba(212,83,126,.2), stroke #ed93b1
// Footer: "2025 Nexus Inc." in rgba(255,255,255,.2)
```

Styling (Tailwind classes):
- Container: `flex-1 glass-light p-[52px_48px] flex flex-col justify-between border-r border-white/8 hidden md:flex`
- Logo row: `flex items-center gap-3`
- Logo icon: `w-[38px] h-[38px] rounded-[11px] flex items-center justify-center` + inline gradient bg
- Hero title: `text-[32px] font-medium text-white leading-[1.25] mb-3.5`
- Feature icon: `w-7 h-7 rounded-lg flex items-center justify-center shrink-0`
- Feature item: `flex items-center gap-2.5 text-[13px] text-white/55`

### Step 2: Create `social-login-buttons.tsx`
```tsx
// Two buttons side by side: Google, GitHub
// Container: flex gap-2.5 mb-6
// Each button: flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[10px]
//   bg: rgba(255,255,255,.07), border: 1px solid rgba(255,255,255,.12)
//   text: text-[12.5px] text-white/70
//   hover: bg-white/12 text-white border-white/22
// Include Google colored SVG and GitHub white SVG from design
// onClick: no-op (placeholder)
```

### Step 3: Rewrite `(auth)/layout.tsx`
```tsx
export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-glass flex items-center justify-center relative overflow-hidden px-4">
      {/* Floating orbs */}
      <div className="orb w-[560px] h-[560px] bg-[#7f77dd] -top-40 -left-[140px] absolute" />
      <div className="orb w-[420px] h-[420px] bg-[#1d9e75] -bottom-[100px] -right-20 absolute" />
      <div className="orb w-[300px] h-[300px] bg-[#d4537e] top-1/2 right-[120px] -translate-y-1/2 absolute" />
      <div className="orb w-[200px] h-[200px] bg-[#ef9f27] bottom-[60px] left-[200px] opacity-[0.18] absolute" />

      {/* Login wrap */}
      <div className="relative z-10 flex w-full max-w-[900px] min-h-[560px] rounded-3xl overflow-hidden border border-white/12 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
        <AuthLeftPanel />
        <div className="w-full md:w-[400px] glass-dark p-[52px_44px] flex flex-col justify-center">
          {children}
        </div>
      </div>
    </div>
  )
}
```

### Step 4: Rewrite `login/page.tsx`
Remove Card wrapper. Page just renders `<LoginForm />` directly since layout provides the glass panel.

```tsx
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return <LoginForm />
}
```

### Step 5: Rewrite `register/page.tsx`
Same pattern:
```tsx
import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return <RegisterForm />
}
```

### Step 6: Rewrite `login-form.tsx`
Structure (top to bottom):
1. Form title: `<h1 className="text-[22px] font-medium text-white mb-1.5">Sign in</h1>`
2. Subtitle: `<p className="text-[13px] text-white/40 mb-8">No account? <Link className="text-[#afa9ec]">Start for free</Link></p>`
3. `<SocialLoginButtons />`
4. Divider: flex row with `<div className="flex-1 h-px bg-white/8" />` + `<span className="text-[11px] text-white/25">or continue with email</span>`
5. Email field:
   - Label: `text-[12px] text-white/50 mb-1.5 block`
   - Input: `w-full glass-input rounded-[10px] py-[11px] px-3.5 text-[13.5px] text-white placeholder:text-white/20 outline-none transition-all`
   - Focus: handled by `glass-input:focus` in CSS
   - Email icon (SVG) positioned absolute right-3.5
   - Error: `text-[11.5px] text-[#f0997b] mt-1.5 flex items-center gap-1.5`
6. Password field:
   - Label row: flex justify-between -- label left, "Forgot password?" link right (`text-[11.5px] text-[#afa9ec]`)
   - Input: same as email but with eye toggle icon
   - Eye toggle: `onClick` toggles input type between password/text
7. Submit button: `w-full py-3 rounded-[10px] gradient-btn text-white text-sm font-medium flex items-center justify-center gap-2 mt-2 mb-5 transition-all cursor-pointer border-none`
   - Loading state: spinner SVG + "Signing in..."
   - Default: arrow SVG + "Sign in to Nexus"
8. Terms: `text-[11px] text-white/20 text-center leading-relaxed` with `<a className="text-[#afa9ec]/60">`

Keep all existing react-hook-form + zod + signIn logic. Only change JSX and classes.

Add `useState` for password visibility toggle:
```tsx
const [showPassword, setShowPassword] = useState(false)
// input type={showPassword ? "text" : "password"}
```

Add success overlay state:
```tsx
const [showSuccess, setShowSuccess] = useState(false)
// After successful signIn, setShowSuccess(true), delay router.push by 1.4s
```

### Step 7: Rewrite `register-form.tsx`
Same glass styling as login. Differences:
- Title: "Create account"
- Subtitle: "Already have an account? Sign in"
- Has name + confirmPassword fields (keep existing)
- May or may not include social buttons (optional -- keep simple, skip social on register)
- Submit: "Create Account" / "Creating account..."

### Step 8: Success overlay (in login-form)
```tsx
{showSuccess && (
  <div className="absolute inset-0 bg-black/50 backdrop-blur-[8px] rounded-3xl flex flex-col items-center justify-center gap-4 z-10">
    <div className="w-16 h-16 rounded-full bg-[rgba(29,158,117,0.25)] border-2 border-[#1d9e75] flex items-center justify-center">
      <svg ...checkmark... />
    </div>
    <div className="text-lg font-medium text-white">Welcome back!</div>
    <div className="text-[13px] text-white/45">Redirecting to dashboard...</div>
  </div>
)}
```

## Todo List
- [ ] Create `auth-left-panel.tsx` with Nexus branding, hero, features, footer
- [ ] Create `social-login-buttons.tsx` with Google + GitHub placeholder buttons
- [ ] Rewrite `(auth)/layout.tsx` with gradient bg, orbs, split-panel wrap
- [ ] Simplify `login/page.tsx` (remove Card wrapper)
- [ ] Simplify `register/page.tsx` (remove Card wrapper)
- [ ] Rewrite `login-form.tsx` with glass styling, social buttons, eye toggle, success overlay
- [ ] Rewrite `register-form.tsx` with glass styling
- [ ] Test form validation still works
- [ ] Verify responsive: left panel hidden on mobile

## Success Criteria
- Auth pages match design reference visually
- Form validation (react-hook-form + zod) unchanged
- Social buttons render but are non-functional
- Password toggle works
- Success overlay shows on login
- Responsive: form-only on mobile, split-panel on md+

## Risk Assessment
- **Form logic regression:** Keep all useForm/signIn logic intact, only change JSX
- **SVG bloat:** Extract SVGs to small inline components, keep files under 200 lines

## Security Considerations
- No changes to auth logic
- Social buttons are UI-only, no OAuth secrets needed

## Next Steps
- Depends on Phase 1 completion
- Can run parallel with Phases 3, 4
