# Phase 1: Design System (globals.css)

## Context
- Design HTML: `design/glassmorphism_login_page.html`
- Current tokens: `frontend/src/app/globals.css`

## Overview
- **Priority:** P0 (blocker for all other phases)
- **Status:** pending
- **Description:** Replace OKLch teal/amber palette with glassmorphism purple/green palette. Add glass utility classes and gradient background styles.

## Key Insights
- Design uses `linear-gradient(135deg, #0f0c29, #302b63, #24243e)` as root bg
- Glass panels use `rgba(255,255,255,0.06)` with `backdrop-filter: blur(24px)`
- Primary accent: `#7f77dd` (purple), secondary: `#1d9e75` (green)
- Text highlight gradient: `linear-gradient(90deg, #afa9ec, #5dcaa5)`
- Focus ring: `rgba(127,119,221,0.6)` border, `rgba(127,119,221,0.08)` bg, `rgba(127,119,221,0.15)` shadow
- Error color: `#f0997b`
- Dark-only design; keep `:root` light tokens but they wont be used (body gets `dark` class)

## Requirements

### Functional
- Map design colors to existing shadcn CSS variable names
- Add glass utility classes usable via Tailwind
- Add gradient background + floating orb styles
- Maintain shadcn/ui component compatibility

### Non-functional
- `@supports` fallback for `backdrop-filter`
- Respect `prefers-reduced-motion`

## Related Code Files
- **Modify:** `frontend/src/app/globals.css`

## Implementation Steps

### Step 1: Replace `.dark` CSS variables
Replace the entire `.dark` block with these values (converted from design hex):

```css
.dark {
  --background: #0f0c29;
  --foreground: rgba(255, 255, 255, 0.9);
  --card: rgba(255, 255, 255, 0.06);
  --card-foreground: rgba(255, 255, 255, 0.9);
  --popover: rgba(0, 0, 0, 0.3);
  --popover-foreground: rgba(255, 255, 255, 0.9);
  --primary: #7f77dd;
  --primary-foreground: #ffffff;
  --secondary: rgba(255, 255, 255, 0.07);
  --secondary-foreground: rgba(255, 255, 255, 0.7);
  --muted: rgba(255, 255, 255, 0.07);
  --muted-foreground: rgba(255, 255, 255, 0.45);
  --accent: #1d9e75;
  --accent-foreground: #ffffff;
  --destructive: #f0997b;
  --destructive-foreground: #ffffff;
  --border: rgba(255, 255, 255, 0.12);
  --input: rgba(255, 255, 255, 0.07);
  --ring: rgba(127, 119, 221, 0.6);
  --radius: 0.625rem; /* 10px - design uses border-radius: 10px */
  --sidebar: rgba(255, 255, 255, 0.06);
  --sidebar-foreground: rgba(255, 255, 255, 0.7);
  --sidebar-primary: #7f77dd;
  --sidebar-primary-foreground: #ffffff;
  --sidebar-accent: rgba(127, 119, 221, 0.15);
  --sidebar-accent-foreground: #afa9ec;
  --sidebar-border: rgba(255, 255, 255, 0.08);
  --sidebar-ring: rgba(127, 119, 221, 0.6);
}
```

### Step 2: Add glassmorphism utility classes after `@layer base`
```css
/* Glassmorphism utilities */
@layer utilities {
  .glass-light {
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.12);
  }

  .glass-dark {
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
    border: 1px solid rgba(255, 255, 255, 0.12);
  }

  .glass-sidebar {
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-right: 1px solid rgba(255, 255, 255, 0.08);
  }

  .glass-topbar {
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .glass-input {
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.12);
  }

  .glass-input:focus {
    border-color: rgba(127, 119, 221, 0.6);
    background: rgba(127, 119, 221, 0.08);
    box-shadow: 0 0 0 3px rgba(127, 119, 221, 0.15);
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
  }
}
```

### Step 3: Add gradient background and orb styles
```css
@layer utilities {
  .bg-gradient-glass {
    background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  }

  .gradient-text {
    background: linear-gradient(90deg, #afa9ec, #5dcaa5);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .gradient-btn {
    background: linear-gradient(135deg, #7f77dd, #534ab7);
  }

  .gradient-btn:hover {
    background: linear-gradient(135deg, #afa9ec, #7f77dd);
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(127, 119, 221, 0.35);
  }
}
```

### Step 4: Add floating orb styles
```css
@layer utilities {
  .orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.32;
    pointer-events: none;
  }
}
```

### Step 5: Add `@supports` fallback
```css
@supports not (backdrop-filter: blur(1px)) {
  .glass-light { background: rgba(30, 25, 60, 0.85); }
  .glass-dark { background: rgba(10, 8, 25, 0.9); }
  .glass-sidebar { background: rgba(30, 25, 60, 0.85); }
  .glass-topbar { background: rgba(10, 8, 25, 0.9); }
  .glass-card { background: rgba(30, 25, 60, 0.85); }
}
```

### Step 6: Update body base layer
In the `@layer base` body rule, add the gradient background for dark mode:
```css
body {
  @apply bg-background text-foreground;
  font-size: 0.9375rem;
  line-height: 1.6;
}

.dark body,
body:is(.dark *) {
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  min-height: 100vh;
}
```

## Todo List
- [ ] Replace `.dark` CSS variables with glassmorphism palette
- [ ] Add glass utility classes (glass-light, glass-dark, glass-sidebar, glass-topbar, glass-input, glass-card)
- [ ] Add gradient utilities (bg-gradient-glass, gradient-text, gradient-btn)
- [ ] Add orb base style
- [ ] Add `@supports` fallback for no backdrop-filter
- [ ] Update dark body background to gradient
- [ ] Verify shadcn components still render correctly with new vars

## Success Criteria
- `pnpm build` passes with no errors
- All shadcn CSS var names still mapped
- Glass utilities available in Tailwind
- Dark mode shows gradient background

## Risk Assessment
- **shadcn breakage:** Low risk -- we only change CSS var values, not names
- **backdrop-filter perf:** Mitigated with `@supports` fallback

## Next Steps
- Phases 2, 3, 4 depend on this completing first
