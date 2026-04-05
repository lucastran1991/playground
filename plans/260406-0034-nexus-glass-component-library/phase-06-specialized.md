---
phase: 6
title: "Specialized Components"
status: completed
priority: P3
effort: 2h
depends_on: [2]
---

# Phase 6: Specialized Components

## Context
- [design/nexus-glass-ui.html](../../design/nexus-glass-ui.html) -- dropzone (lines 490-501), code block (lines 504-511), empty state (lines 512-516), dividers (lines 517-521), breadcrumb (lines 355-360), pagination (lines 361-367)

## Components to Create

### 1. glass-dropzone.tsx
File upload drag-and-drop area.

Design CSS:
```
.dropzone: border 1.5px dashed rgba(255,255,255,0.18), border-radius 14px, padding 28px, text-align center
.dropzone:hover: border-color rgba(127,119,221,0.5), bg rgba(127,119,221,0.06)
.dropzone-icon: 44x44px, border-radius 12px, bg rgba(127,119,221,0.15)
.file-item: flex, padding 10px 12px, bg rgba(255,255,255,0.05), border-radius 10px
```

**Props:**
```ts
interface GlassDropzoneProps {
  accept?: string // file types
  maxSize?: number // bytes
  onFilesSelected: (files: File[]) => void
  multiple?: boolean
}
```

### 2. glass-code-block.tsx
Syntax-highlighted code display with copy button.

Design CSS:
```
.code-block: bg rgba(0,0,0,0.45), border 1px solid rgba(255,255,255,0.08), border-radius 12px
.code-header: flex, padding 10px 14px, border-bottom 1px solid rgba(255,255,255,0.06)
.code-lang: font-size 11px, color rgba(255,255,255,0.3), monospace
.code-copy: font-size 11px, color rgba(127,119,221,0.7)
.code-body: padding 16px 18px, monospace, font-size 12.5px, line-height 1.8
```

Token colors from design: `.ct` (purple #afa9ec), `.cv` (teal #5dcaa5), `.cs` (amber #fac775), `.cm` (muted comment), `.ck` (coral #f0997b), `.cn` (pink #ed93b1)

**Props:**
```ts
interface GlassCodeBlockProps {
  code: string
  language?: string
  showHeader?: boolean
  copyable?: boolean
}
```

Note: full syntax highlighting via a library (e.g., Prism) is optional. Basic display with copy functionality is MVP.

### 3. glass-empty-state.tsx
Placeholder for empty data views.

Design CSS:
```
.empty: text-align center, padding 44px 20px
.empty-icon: 64x64px, border-radius 18px, bg rgba(255,255,255,0.06)
.empty-title: font-size 15px, font-weight 500, color rgba(255,255,255,0.75)
.empty-sub: font-size 13px, color rgba(255,255,255,0.3)
```

**Props:**
```ts
interface GlassEmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode // e.g., a GlassButton
}
```

### 4. glass-divider.tsx
**Variants:** plain, label, gradient

Design CSS:
```
.div-plain: height 1px, bg rgba(255,255,255,0.07)
.div-label: flex with ::before/::after lines, center text span (font-size 11px)
.div-gradient: height 1px, bg linear-gradient(90deg, transparent, rgba(127,119,221,0.4), transparent)
```

**Props:**
```ts
interface GlassDividerProps {
  variant?: "plain" | "label" | "gradient"
  label?: string
  className?: string
}
```

### 5. glass-breadcrumb.tsx
Design CSS:
```
.bc: flex, gap 6px, font-size 12.5px
.bc-item: color rgba(255,255,255,0.4); links = color #afa9ec
.bc-item.active: color #fff
.bc-sep: color rgba(255,255,255,0.2) -- "/" or ">"
```

**Props:**
```ts
interface GlassBreadcrumbProps {
  items: { label: string; href?: string }[]
  separator?: string
}
```

### 6. glass-pagination.tsx
Design CSS:
```
.pag-btn: 34x34px, border-radius 9px, font-size 13px, color rgba(255,255,255,0.5)
.pag-btn:hover: bg rgba(255,255,255,0.08)
.pag-btn.active: bg rgba(127,119,221,0.25), color #fff, border rgba(127,119,221,0.4)
.pag-btn.disabled: opacity 0.3
.pag-dots: "..." ellipsis
```

**Props:**
```ts
interface GlassPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
}
```

## Related Code Files
- **Create:** `frontend/src/components/glass/glass-dropzone.tsx`
- **Create:** `frontend/src/components/glass/glass-code-block.tsx`
- **Create:** `frontend/src/components/glass/glass-empty-state.tsx`
- **Create:** `frontend/src/components/glass/glass-divider.tsx`
- **Create:** `frontend/src/components/glass/glass-breadcrumb.tsx`
- **Create:** `frontend/src/components/glass/glass-pagination.tsx`
- **Update:** `frontend/src/components/glass/index.ts`

## Implementation Steps
1. Implement glass-dropzone.tsx (drag-drop, file list display)
2. Implement glass-code-block.tsx (display + copy)
3. Implement glass-empty-state.tsx
4. Implement glass-divider.tsx (3 variants)
5. Implement glass-breadcrumb.tsx
6. Implement glass-pagination.tsx (with ellipsis logic)
7. Update barrel exports
8. Build verification

## Todo
- [x] glass-dropzone.tsx
- [x] glass-code-block.tsx
- [x] glass-empty-state.tsx
- [x] glass-divider.tsx
- [x] glass-breadcrumb.tsx
- [x] glass-pagination.tsx
- [x] Update index.ts
- [x] Build verification

## Success Criteria
- Dropzone accepts drag-and-drop files, shows file list
- Code block displays with monospace font, copy button works
- Empty state renders centered with icon/text/action
- All 3 divider variants render correctly
- Pagination shows correct page numbers with ellipsis
