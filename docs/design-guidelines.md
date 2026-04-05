# Design Guidelines - Nexus

Nexus features a modern glassmorphism design system with a dark-mode-only interface. All applications use this unified palette and component library.

## Color Palette

### Dark Mode (Primary)
- **Background**: `#0f0c29` (Deep space black)
- **Foreground**: `rgba(255, 255, 255, 0.9)` (Near white text)
- **Primary**: `#7f77dd` (Purple accent)
- **Accent**: `#1d9e75` (Teal/Green)
- **Destructive**: `#f0997b` (Coral/Orange)
- **Border**: `rgba(255, 255, 255, 0.12)` (Subtle dividers)
- **Input**: `rgba(255, 255, 255, 0.07)` (Glass input fields)
- **Muted**: `rgba(255, 255, 255, 0.07)` (Disabled elements)

### Theme Tokens (CSS Variables)
All colors available via CSS variables in `:root` and `.dark` selectors:
```css
--primary: #7f77dd;
--accent: #1d9e75;
--destructive: #f0997b;
--background: #0f0c29;
--foreground: rgba(255, 255, 255, 0.9);
--border: rgba(255, 255, 255, 0.12);
```

## Glassmorphism Effects

### Glass Utilities
Pre-built glass effect classes (defined in `globals.css`):

#### `.glass-light`
- **Use case**: Light glass panels, modals, dropdowns
- **Blur**: 24px
- **Background**: `rgba(255, 255, 255, 0.06)`
- **Border**: 1px solid `rgba(255, 255, 255, 0.12)`

#### `.glass-dark`
- **Use case**: Dark glass overlays, semi-transparent layers
- **Blur**: 28px
- **Background**: `rgba(0, 0, 0, 0.3)`
- **Border**: 1px solid `rgba(255, 255, 255, 0.12)`

#### `.glass-sidebar`
- **Use case**: Navigation sidebar
- **Blur**: 24px
- **Background**: `rgba(255, 255, 255, 0.06)`
- **Border-right**: 1px solid `rgba(255, 255, 255, 0.08)`

#### `.glass-topbar`
- **Use case**: Header/top navigation
- **Blur**: 20px
- **Background**: `rgba(0, 0, 0, 0.2)`
- **Border-bottom**: 1px solid `rgba(255, 255, 255, 0.08)`

#### `.glass-input`
- **Use case**: Form inputs
- **Background**: `rgba(255, 255, 255, 0.07)`
- **Border**: 1px solid `rgba(255, 255, 255, 0.12)`
- **Focus state**: Purple ring with gradient background

#### `.glass-card`
- **Use case**: Content cards, panels
- **Blur**: 16px
- **Background**: `rgba(255, 255, 255, 0.06)`
- **Border**: 1px solid `rgba(255, 255, 255, 0.1)`
- **Border-radius**: 16px

### Gradient Utilities

#### `.bg-gradient-glass`
- **Use case**: Page backgrounds, hero sections
- **Gradient**: `linear-gradient(135deg, #0f0c29, #302b63, #24243e)`

#### `.gradient-text`
- **Use case**: Headlines, branded text
- **Gradient**: `linear-gradient(90deg, #afa9ec, #5dcaa5)` (Purple to teal)

#### `.gradient-btn`
- **Use case**: Primary buttons, CTAs
- **Gradient**: `linear-gradient(135deg, #7f77dd, #534ab7)` (Purple gradient)
- **Hover**: Lighter purple gradient with shadow and translateY(-1px)

## Layout Tokens

- **Border radius**: `0.625rem` (10px, smooth rounded corners)
- **Sidebar radius**: `16px` (cards and glass panels)
- **Spacing scale**: Tailwind defaults (4px base unit)

## Typography

- **Font family**: System sans-serif stack (Tailwind default)
- **Font size base**: `0.9375rem` (15px)
- **Line height**: 1.6 (spacious, readable)

## Dark Mode Only

All UI surfaces use dark mode (`--background: #0f0c29`). Light mode tokens exist for compatibility but are not used in the Nexus design.

**Theme Provider Setup** (`src/providers/theme-provider.tsx`):
- Forces dark mode on app startup
- No light mode toggle (unless explicitly added for advanced users)
- Uses `next-themes` library

## Component System

Uses **shadcn/ui** components themed with glassmorphism CSS. Located at `src/components/ui/` with app-specific components in `src/components/dashboard/`.

### shadcn/ui Components
- **Button** – Multiple variants styled with glass effects
- **Input** – Form inputs with `.glass-input` styling
- **Card** – Content containers with `.glass-card` background
- **Avatar** – User avatars with glass styling
- **Skeleton** – Loading placeholders
- **Breadcrumb** – Navigation breadcrumbs
- **Sidebar** – Multi-level navigation
- **Sheet** – Slide-out panels
- **DropdownMenu** – Context menus with glass styling
- **Tooltip** – Hover tooltips
- And more...

### App-Specific Components
- **StatCard** (`components/dashboard/stat-card.tsx`) – KPI card with trend indicator
- **ColorProgress** (`components/ui/color-progress.tsx`) – Custom progress indicator

### Import Pattern
```tsx
// shadcn/ui components
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
```

## Component Patterns

### Button Variants
- **Primary**: `gradient-btn` class (purple gradient)
- **Secondary**: Default Tailwind button with glass-light background
- **Destructive**: Uses `--destructive` color (#f0997b)
- **Muted**: `--muted` with reduced opacity

### Form Inputs
- Use `.glass-input` class for all inputs
- Focus state: Purple ring + gradient background
- Placeholder: `--muted-foreground` (45% opacity white)

### Cards & Panels
- Use `.glass-card` for bordered glass containers
- Use `.glass-light` or `.glass-dark` for modal/dropdown overlays
- Minimum padding: 20px (consistent spacing)

### Navigation
- **Sidebar**: `.glass-sidebar` background with border-right
- **Topbar**: `.glass-topbar` background with border-bottom
- **Active state**: Purple highlight with `.sidebar-accent` background

## Accessibility

- **Contrast**: All text meets WCAG AA standards (light text on dark glass)
- **Focus states**: Purple ring (from `--ring: rgba(127, 119, 221, 0.6)`)
- **Reduced motion**: Respects `prefers-reduced-motion` media query
- **Fallback**: Non-backdrop-filter browsers get solid fallback colors

## Browser Support

- **Glassmorphism**: Requires `backdrop-filter` support (most modern browsers)
- **Fallback**: Solid colors for older browsers (automatically applied via `@supports` rule)

## Usage Examples

### Auth Page (Split Panel)
- Left: Nexus branding + gradient-text headline
- Right: `.glass-light` card with login form, `.glass-input` fields
- Background: `.bg-gradient-glass` body gradient

### Dashboard
- Sidebar: `.glass-sidebar` with navigation
- Topbar: `.glass-topbar` with user menu and settings
- Cards: `.glass-card` for dashboard widgets
- Buttons: Primary `.gradient-btn`, secondary variants in muted colors

### Modals
- Background overlay: `.glass-dark` (semi-transparent dark)
- Modal container: `.glass-light` with padding
- Title: `.gradient-text` (branded purple-to-teal gradient)

## Customization

To override color palette, edit `/src/app/globals.css`:
1. Update `.dark` selector CSS variables
2. Adjust blur amounts in glass utilities as needed
3. Modify gradient values in `.gradient-*` classes

Avoid changing the glassmorphism effect intensity (blur amounts) without testing on all target devices for performance.
