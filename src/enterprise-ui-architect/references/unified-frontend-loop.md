# Unified Frontend Loop (Kombai-Inspired, Cursor-Native)

Adapted from Kombai's design → code → browser workflow for use inside Cursor with
`enterprise-ui-architect`, Canvas, browser MCP, and repo-native design systems.

## Core Idea

Design intent, code reuse, and rendered UI must stay connected. Change one; update the others deliberately.

Bad AI frontend output is usually a **workflow problem**, not a model problem.

## When to Run the Full Loop

Run all phases for:
- new MVP screens or admin portals
- multi-screen products where visual drift is visible
- client + admin portal pairs
- any task where reuse of existing MUI abstractions matters

Skip or shorten for:
- one-line bug fixes
- backend-only work
- repos so inconsistent that reuse requires cleanup first (say so upfront)

---

## Phase 1 — Stack + Design System Lock

**Goal:** Every generation inherits real project context from minute one.

### Stack detection (mandatory)

Inspect before first edit:

| Signal | Where to look |
|---|---|
| Framework | `package.json`, `next.config.*`, `vite.config.*` |
| UI library | `@mui/material`, shadcn, etc. |
| Forms | `react-hook-form`, form libs |
| Tables | `@tanstack/react-table` |
| Data | `@tanstack/react-query`, SWR, axios |
| Styling | Tailwind, Emotion, CSS variables, `theme.ts` |
| Design tokens | `theme/`, `tokens/`, CSS variables, MUI `createTheme` |

Write a short **Stack Profile** in the session (or persist under `design-system/STACK.md` if the user wants).

### Design system lock

```bash
python scripts/search.py --query "saas" --design-system --persist --product "MyApp"
```

Or load existing:
- `design-system/MASTER.md` — global source of truth
- `design-system/pages/<page>.md` — page overrides

Rules:
- No new screen until MASTER exists or is loaded
- Brand colors typography spacing come from MASTER not ad-hoc prompts
- Quality of design system quality of every generated screen

---

## Phase 2 — Design on Canvas (Not Prompt-Only)

**Goal:** Design against options; pick direction; refine in place.

### Cursor equivalents

| Kombai | Cursor |
|---|---|
| Infinite design canvas | Cursor Canvas (`.canvas.tsx`) or structured wireframe artifact |
| 3 refinement passes by default | Explicit v1 → v2 → v3 iterations |
| Variant count in settings | Ask for 3 concepts in prompt when direction is unclear |
| Code design button | Approve design → switch to implementation mode |

### Variant prompt template

```
Generate 3 design concepts for [PAGE NAME].
Context: [who sees it, primary job-to-be-done]

Concept 1 — [name]: [layout + density + hero element]
Concept 2 — [name]: [layout + density + hero element]
Concept 3 — [name]: [layout + density + hero element]

Use applied theme from design-system/MASTER.md.
Full screen. Admin/enterprise density. MUI-compatible structure.
```

### Refinement

After picking a concept:
1. v2 — tighten card layout spacing hierarchy
2. v3 — adjust metrics sidebar CTA placement
3. Lock — note chosen layout pattern for related screens

### Cross-screen reuse

Do not re-prompt from zero for related screens. Example:

> Use the locked client portal dashboard as visual base. Generate admin projects
> dashboard with same card rhythm and chip style; adjust content for internal team.

---

## Phase 3 — Context Graph (Codebase Semantic Map)

**Goal:** Reuse what exists; never silently duplicate abstractions.

Kombai builds Context Graphs for components, hooks, stores, tokens, types, constants.
This skill requires the same inventory **before** writing new UI code.

### Build the graph

Search and document:

```
Components:  PageLayout, Card wrappers, DataTable, StatusChip, DrawerForm, ...
Hooks:       useFilters, usePagination, useAuth, ...
Stores:      (Zustand/Redux modules)
Tokens:      theme.palette, spacing, shape, customShadows, typography
Types:       shared DTOs, form value types, table row types
Services:    API clients, query keys
```

For each item note: **purpose**, **props/API**, **where used**, **when to reuse**.

### Reuse rules

| Situation | Action |
|---|---|
| DataTable exists | Extend columns config; do not create second table shell |
| StatusChip/Badge exists | Import it; do not invent new chip styling |
| useFilters exists | Wire table to it; do not write new filter state |
| Theme tonal variants exist | Use `variant="tonal"`; do not inline colors |
| PageLayout exists | Wrap page; do not raw Box padding |

### Attach context explicitly

In plan or implementation, list imports:

```
Reuse:
- DataTable from @/components/DataTable
- StatusChip from @/components/StatusChip
- useFilters from @/hooks/useFilters
- theme.customShadows.primarySm for focus rings
```

---

## Phase 4 — Plan Mode (Complex Features)

**Goal:** Transparent roadmap before multi-file work.

Use **Planning / Architecture** mode when the task includes:
- business logic + UI together
- new state management
- multi-screen flows
- API integration across components

Plan must include:
1. Technical strategy
2. Files to create/modify
3. Context graph reuse map
4. Required states (loading empty error)
5. Responsive + a11y notes
6. Verification steps

User approves plan → then implement.

---

## Phase 5 — Code Implementation

**Goal:** Production MUI architecture aligned with locked design + context graph.

Follow existing skill standards:
- MUI v7 + RHF + TanStack Table + TanStack Query
- Drawer vs Dialog vs Page rules
- Theme tokens only
- Package import discipline (verify package.json; ask before install)

After generation:
```bash
npx tsc --noEmit
# project lint command if available
```

Fix type/lint issues before browser verification.

---

## Phase 6 — Browser Verification Loop

**Goal:** Validate rendered UI; fix with precise DOM context.

### Cursor browser MCP workflow

1. Start dev server (`npm run dev` / equivalent)
2. Open localhost in browser MCP
3. `browser_snapshot` for structure
4. `browser_take_screenshot` at 375 / 768 / 1024 / 1440 if needed
5. Click flows: nav, filters, drawer, form submit, empty states

### Precise fix pattern (Kombai Browser equivalent)

When polish issues appear:

```
Element: [selector or ref from snapshot]
Issue: badge padding wrong on sm cards at 768px
Computed: padding 4px 8px → need 4px 12px
File: src/features/projects/ProjectCard.tsx
Action: adjust Chip slotProps / sx using theme.spacing
```

Not: "make spacing better."

### Autonomous flow tests

Examples:
- "Open sidebar; verify all nav items route correctly"
- "Submit empty form; verify validation messages"
- "Resize to tablet; fix CTA misalignment on empty state"

### DevTools context

For runtime bugs pull:
- console errors
- failed network requests
- hydration warnings

Fix from evidence, not guesses.

---

## Phase 7 — Sync Back

After browser-validated changes:

1. Update code (source of truth)
2. If tokens/patterns changed → update `design-system/MASTER.md` or page override
3. Run pre-delivery checklist:

```bash
python scripts/search.py --query "dashboard" --domain pre-delivery-checklist -n 15
```

4. Review mode verdict if user asked for review

---

## Quick Command Reference

```bash
# Design system
python scripts/search.py --query "fintech" --design-system --persist --product "MyApp"

# Workflow phases
python scripts/search.py --query "context graph" --domain frontend-loop -n 10

# Pre-ship checks
python scripts/search.py --query "crud-list" --domain pre-delivery-checklist -n 10

# Anti-patterns (drift + duplication)
python scripts/search.py --query "workflow duplicate" --domain anti-patterns -n 5
```

---

## Honest Limits (Same as Kombai)

- Garbage design system → garbage output. Invest in MASTER first.
- Vague prompts → generic UI. Be specific on layout density and content.
- Agent picks variants; **human taste** still selects direction.
- Lint/type clean ≠ architecture approved. Senior review still matters for big decisions.
