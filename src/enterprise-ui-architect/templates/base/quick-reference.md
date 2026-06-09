# Enterprise UI Architect — Quick Reference

## Verdict
Premium Admin = visual feel. MUI v7 = implementation. Ant Design = architecture discipline.
Bad AI UI = workflow problem. Run the Unified Frontend Loop for multi-screen work.

## Unified Frontend Loop (7 Phases)
1. **Stack + design system lock** — detect stack; `MASTER.md` before first screen
2. **Design on canvas** — 3 concepts → pick → v2/v3 refine; reuse visual base across screens
3. **Context Graph** — inventory components/hooks/tokens; import don't duplicate
4. **Plan mode** — approved plan for complex multi-file features
5. **Code + static verify** — implement; `tsc` + lint on touched files
6. **Browser verify** — dev server; snapshot 375/768/1024/1440; DOM-targeted fixes
7. **Sync back** — update code + design-system docs; pre-delivery checklist

```bash
python scripts/search.py --query "shadcn mui" --domain stack-profiles -n 6
python scripts/context-graph.py --root . --scan src
enterprise-ui verify-loop
python scripts/search.py --query "context graph" --domain frontend-loop -n 10
```

Full guide: `references/unified-frontend-loop.md`

## Stack Router
| Signal | Route |
|---|---|
| `@mui/material` | Full skill (phases 1–7) |
| `components.json` + no MUI | shadcn skill for code; EUI for process only |
| Both | `design-system/STACK.md` per-surface map |

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
