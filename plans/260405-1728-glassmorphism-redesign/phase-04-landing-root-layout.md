# Phase 4: Landing Page + Root Layout

## Context
- Design HTML: `design/glassmorphism_login_page.html` (branding reference)
- Phase 1 must be complete

## Overview
- **Priority:** P1
- **Status:** pending
- **Description:** Update root layout metadata to "Nexus" branding. Redesign landing page with Nexus-branded hero or redirect logic.

## Key Insights
- Current landing page (`app/page.tsx`) just redirects: authenticated -> dashboard, unauthenticated -> login
- Root layout uses DM Sans + JetBrains Mono fonts -- keep these, they work well with glassmorphism
- Metadata: change "MyApp" to "Nexus"
- Could keep redirect-only landing or add a simple branded hero page

## Requirements

### Functional
- Root layout metadata: title "Nexus", description updated
- Landing page: keep redirect logic (simplest approach, YAGNI)
- Force dark mode by default (add `dark` class to html element)

### Non-functional
- No font changes needed (DM Sans is clean, modern)

## Related Code Files
- **Modify:** `frontend/src/app/layout.tsx`
- **Modify:** `frontend/src/app/page.tsx` (minimal or no change)

## Implementation Steps

### Step 1: Update `layout.tsx` metadata
```tsx
export const metadata: Metadata = {
  title: "Nexus",
  description: "AI-powered development team orchestration platform",
}
```

### Step 2: Force dark mode on html element
Add `dark` class to `<html>` tag to ensure dark mode is always active:

```tsx
<html
  lang="en"
  className={`${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
  suppressHydrationWarning
>
```

Note: This bypasses ThemeProvider's toggle. Since we're dark-first, this is intentional. The ThemeProvider can still be used later when light mode is added.

### Step 3: Landing page (optional enhancement)
Current behavior: redirect to /dashboard or /login. This is fine -- YAGNI.

If we want a simple branded landing instead of instant redirect:
```tsx
// Option A: Keep redirect (recommended -- KISS)
export default async function Home() {
  const session = await auth()
  if (session) redirect("/dashboard")
  redirect("/login")
}
```

Decision: **Keep redirect-only.** No landing page hero needed since auth pages already have full Nexus branding.

## Todo List
- [ ] Update metadata title to "Nexus" and description
- [ ] Add `dark` class to html element
- [ ] Verify ThemeProvider doesn't conflict with forced dark class
- [ ] Optional: update favicon/logo if available

## Success Criteria
- Browser tab shows "Nexus"
- App always renders in dark mode
- Redirect logic unchanged

## Risk Assessment
- **ThemeProvider conflict:** ThemeProvider may try to remove `dark` class. Check if `next-themes` `forcedTheme="dark"` is needed instead of hardcoding class.
  - Mitigation: Use `<ThemeProvider forcedTheme="dark">` instead of class on html. This is cleaner.

## Security Considerations
- No changes

## Next Steps
- Depends on Phase 1 completion
- Can run parallel with Phases 2, 3
