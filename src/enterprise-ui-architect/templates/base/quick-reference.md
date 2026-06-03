# Enterprise UI Architect — Quick Reference

## Verdict
Premium Admin = visual feel. MUI v7 = implementation. Ant Design = architecture discipline.

## Component Stack
- UI: `@mui/material` v7
- Forms: `react-hook-form` + `Controller`
- Tables: `@tanstack/react-table`
- Validation: `valibot` / `zod` via `@hookform/resolvers`

## Design System Generator
```bash
python scripts/search.py --query "fintech" --design-system --product "MyBank"
python scripts/search.py --query "saas" --design-system --persist --product "MyApp"
```

## Drawer vs Dialog vs Page
- **Dialog**: delete confirm, yes/no, small focused form
- **Drawer**: quick create/edit, advanced filters, record preview (width 300-400px)
- **Page**: complex forms, multi-section edit, wizard, heavy validation

## Layout Modes
- **Skin**: default (shadow) | bordered (outline, no shadow)
- **Navbar**: fixed | floating | detached | attached | blur
- **Content**: compact (1440px) | wide (full-bleed)
- **Sidebar**: 260px / 71px collapsed, semi-dark supported

## Table Checklist
- [ ] typed columns via `createColumnHelper`
- [ ] stable rowKey
- [ ] sorting + filtering + search (debounced 500ms)
- [ ] pagination via MUI Pagination (rounded tonal)
- [ ] loading / empty / error states
- [ ] row actions + optional bulk actions
- [ ] status chips + formatted dates/numbers
- [ ] responsive behavior
- [ ] accessible headers
- [ ] controlled filter/sort/page state
- [ ] header height 56px, body 50px
- [ ] horizontal borders only
- [ ] first/last column padding 24px, internal 16px
- [ ] NEVER use MUI TablePagination for logic
- [ ] ALWAYS use TanStack react-table for logic

## Form Checklist
- [ ] typed values via RHF generic
- [ ] validation rules (inline or schema resolver)
- [ ] field-level errors + helper text
- [ ] required indicators
- [ ] submit loading + disabled state
- [ ] cancel / reset via `reset()`
- [ ] dirty state protection
- [ ] responsive field grid (MUI Grid spacing 6)
- [ ] logical sections with Divider + Typography headers
- [ ] accessible labels
- [ ] success / error feedback
- [ ] label above input (slotProps inputLabel shrink true transform none)
- [ ] focus: 2px border + primary-sm shadow
- [ ] start adornments via slotProps input

## Styling Checklist
- [ ] MUI theme tokens used (palette, spacing, shape)
- [ ] CSS variables via MUI cssVariables
- [ ] shared spacing scale (theme.spacing factor)
- [ ] shared typography scale (theme.typography)
- [ ] semantic color roles
- [ ] reusable variants (contained, tonal, outlined)
- [ ] Tailwind utilities for layout/flex/grid only
- [ ] slotProps over deprecated inner prop APIs
- [ ] no random hex colors
- [ ] no random margins / font sizes
- [ ] no heavy inline sx props on generic primitives
- [ ] header height 54px, content padding 24px, max-width 1440px

## Keyboard Navigation
- Autocomplete: Arrow keys, Enter, Escape, Home/End
- Select: Space open, arrows navigate, Enter select, typeahead
- Tabs: Left/Right arrows change tabs; Tab enters panel
- Accordion: Enter/Space toggle; arrows between headers
- Slider: Arrow keys step; Home/End min/max; PageUp/PageDown
- Switch: Space toggles
- Dialog: Escape closes; Tab traps focus

## Backend Data Detection
- [ ] Check for backend presence (API docs proxy repo)
- [ ] Check for real-time endpoints (WebSocket STOMP SSE)
- [ ] Check for existing API layer (api/ services/ hooks/)
- [ ] Use TanStack Query for all server state
- [ ] Use MSW for mock data (never hardcode in components)
- [ ] Create chart adapter function (API response → chart data)
- [ ] Use Skeleton for chart loading states
- [ ] Implement retry + error fallback for unstable APIs
- [ ] Use refetchInterval or WebSocket for real-time dashboards

## Package Import Verification
```bash
enterprise-ui verify-imports --src ./src
```
- [ ] All new imports resolve to installed packages
- [ ] Check package.json before adding imports
- [ ] Ask user before installing missing packages
- [ ] Post-install: run `npx tsc --noEmit`

## Translation Verification
```bash
enterprise-ui verify-i18n --src ./src
```
- [ ] All user-facing strings use `t()` — no hardcoded text
- [ ] Every `t("key")` exists in all `messages/*.json` files
- [ ] Use `useTranslations("namespace")` for page-scoped keys
- [ ] Avoid dynamic template literals for keys

## Pre-Delivery Checklist
- [ ] All interactive elements have hover states and cursor-pointer
- [ ] Focus states are visible and consistent
- [ ] No emojis as icons — only SVG or icon font
- [ ] Text contrast meets 4.5:1 minimum
- [ ] prefers-reduced-motion respected
- [ ] Responsive at 375px, 768px, 1024px, 1440px
- [ ] Loading states for all async operations
- [ ] Empty states for every list/table/grid
- [ ] Error states with helpful messages
- [ ] Browser back button works for filter/sort/page state

## Accessibility Checklist
- [ ] labels on all inputs
- [ ] errors linked via aria-describedby
- [ ] required fields indicated
- [ ] focus trapped in Dialog/Drawer
- [ ] focus returns to trigger on close
- [ ] status uses icon + text (not color alone)
- [ ] table headers semantic
- [ ] row actions keyboard accessible
- [ ] touch targets >= 44x44px
- [ ] contrast >= 4.5:1
- [ ] skip links present
- [ ] focus visible indicators
- [ ] aria-live for dynamic updates
- [ ] aria-label on icon-only buttons
- [ ] prefers-reduced-motion respected
