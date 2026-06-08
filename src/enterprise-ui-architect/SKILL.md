# Enterprise UI Architect

## Description
This skill provides expert UI/UX and frontend architecture guidance for premium enterprise admin panels. It combines enterprise-inspired visual composition with MUI v7 component implementation, Ant Design-level engineering discipline, and design system intelligence.

## When to Apply
Use this skill when:
- building admin dashboards with MUI
- building CRUD list pages with MUI + TanStack Table
- building complex forms with MUI + react-hook-form
- building detail pages with MUI
- building settings pages with MUI
- building wizard/multi-step forms with MUI
- building auth pages with MUI
- generating a complete design system for an admin product
- reviewing UI implementation quality
- refactoring tables, forms, cards, drawers, dialogs, sidebars, navbars
- improving visual polish
- improving MUI architecture
- enforcing design tokens
- checking accessibility and responsiveness
- **UI drifts after multiple screens** (run Unified Frontend Loop)
- **shipping MVP/admin portals fast** without Figma handoff tax
- **preventing duplicate components** (Context Graph before codegen)
- **polishing live UI** with browser verification + sync back to code

## Core Philosophy
Premium enterprise admin panels are the visual reference.
MUI v7 is the implementation engine.
Ant Design principles guide the architecture.
Design system intelligence drives consistency.

Bad AI frontend output is usually a **workflow problem**, not a model problem.
Design intent, code reuse, and rendered UI must stay connected in one loop.

## Unified Frontend Loop (Kombai-Inspired, Cursor-Native)

Full reference: `references/unified-frontend-loop.md`

Run this loop for new screens, multi-screen MVPs, and any task where visual drift or component duplication is a risk.

### Phase 1 — Stack + Design System Lock
Before the first screen:
1. Detect stack from `package.json`, configs, and existing theme files.
2. Lock design system via generator or `design-system/MASTER.md` (+ page overrides).
3. Confirm ambiguous stacks with the user; do not silently switch libraries.

```bash
python scripts/search.py --query "saas" --design-system --persist --product "MyApp"
```

### Phase 2 — Design on Canvas (Not Prompt-Only)
- Use Cursor Canvas or structured wireframes when layout direction is unclear.
- Generate **3 concepts** when exploring; refine v2/v3 on the chosen direction.
- Reuse a locked screen as visual base for related screens (client portal → admin portal).

Variant prompt pattern:
```
Generate 3 design concepts for [PAGE]. Use design-system/MASTER.md.
Concept 1 — [density/layout hero]. Concept 2 — [...]. Concept 3 — [...].
```

### Phase 3 — Context Graph (Mandatory Before Codegen)
Build a semantic reuse map of the repo — Kombai's Context Graph equivalent:

| Category | Examples to index |
|---|---|
| Components | PageLayout, Card, DataTable, StatusChip, DrawerForm |
| Hooks / stores | useFilters, usePagination, auth/store modules |
| Tokens | `theme.palette`, spacing, typography, customShadows |
| Types / services | DTOs, form types, API clients, query keys |

Rules:
- **Import existing abstractions**; do not duplicate Button/Table/Chip/filter patterns.
- List explicit reuse targets in plan or implementation notes.

```bash
python scripts/search.py --query "context graph reuse" --domain frontend-loop -n 10
```

### Phase 4 — Plan Mode (Complex Features)
For business logic, multi-file flows, or API integration: write an approved plan first.
Plan includes strategy, files, reuse map, states, responsive/a11y, verification steps.
Then implement.

### Phase 5 — Code + Static Verification
Implement with MUI + RHF + TanStack standards from this skill.
After edits: run `npx tsc --noEmit` and project lint on touched files; fix before claiming done.

### Phase 6 — Browser Verification Loop
Cursor equivalent of Kombai Browser:
1. Start dev server; open localhost (browser MCP).
2. Snapshot/screenshot at **375, 768, 1024, 1440**.
3. Test flows: nav, filters, forms, empty states.
4. Fix with **DOM-targeted context** (selector, computed styles, file path) — not vague "make it better."
5. Use console/network evidence for runtime bugs.

### Phase 7 — Sync Back
- Code is source of truth after validation.
- Update `design-system/MASTER.md` or `pages/*.md` if tokens/patterns changed.
- Run pre-delivery checklist before shipping.

```bash
python scripts/search.py --query "dashboard" --domain pre-delivery-checklist -n 15
```

### Workflow Anti-Patterns
- Each screen as a fresh prompt with no MASTER lock → visual drift.
- Codegen without Context Graph → duplicate components/hooks.
- Code review only, no rendered UI check → tablet/spacing bugs ship.
- Vague visual prompts without element context → wasted iterations.

Search workflow steps:
```bash
python scripts/search.py --query "browser verification" --domain frontend-loop -n 8
python scripts/search.py --query "workflow duplicate" --domain anti-patterns -n 5
```

Premium enterprise admin panels provide:
- premium admin dashboard feeling
- card composition
- sidebar/navbar inspiration
- layout hierarchy
- dashboard page rhythm
- polished status chips
- spacing inspiration
- visual hierarchy

MUI v7 provides:
- production-grade React components
- theme system with CSS variables
- emotion/styled styling
- accessibility baseline
- rtl support
- dense admin-friendly sizing

Ant Design principles provide:
- component API discipline
- TypeScript-first props
- predictable Form/Table patterns
- Drawer/Dialog usage rules
- design token thinking
- enterprise interaction quality
- reusable abstractions
- accessibility and state discipline

## Design System Generation
When starting a new admin dashboard project, generate a design system first:

```bash
python src/enterprise-ui-architect/scripts/search.py \
  --query "fintech" \
  --design-system \
  --product "MyBank Admin" \
  --format markdown
```

The design system generator analyzes the industry and outputs:
- **Recommended Pattern** — page structure and CTA placement
- **Style Priority** — best matching UI styles for the industry
- **Color Palette** — primary, secondary, accent, semantic colors
- **Typography** — heading and body font pairings with Google Fonts imports
- **Key Effects** — animations, transitions, interactions
- **Anti-Patterns** — what NOT to do for this industry
- **Pre-Delivery Checklist** — validation before shipping

### Persist Design System (Master + Overrides)

Save the generated design system for hierarchical retrieval across sessions:

```bash
python src/enterprise-ui-architect/scripts/search.py \
  --query "saas" \
  --design-system \
  --persist \
  --product "MyApp"
```

This creates:
```
design-system/
├── MASTER.md           # Global Source of Truth
└── pages/
    └── dashboard.md    # Page-specific overrides
```

When building a specific page, check for page overrides first, then fall back to MASTER.

## Component Stack
- **UI Components**: `@mui/material` v7
- **Forms**: `react-hook-form` + `Controller`
- **Tables**: `@tanstack/react-table`
- **Styling**: MUI theme tokens + Tailwind utilities (secondary)
- **Icons**: Tabler Icons (`tabler-*` classes)
- **Validation**: `valibot` / `zod` via `@hookform/resolvers`
- **Charts**: Recharts / ApexCharts / MUI X-Charts
- **Data Fetching**: TanStack Query (preferred) or SWR
- **Real-Time**: WebSocket / STOMP / Socket.io / SSE
- **API Mocking**: MSW (Mock Service Worker) for development

## Layout Architecture
Enterprise admin panels support configurable layout modes:

### Skin Variants
- `default`: shadow-based cards and surfaces
- `bordered`: outlined cards with no shadow, border-driven aesthetics
- Set via `data-skin` attribute on layout wrapper
- Affects Card, Dialog, Drawer, Menu, Popover, Snackbar styling

### Navbar Modes
- `fixed`: sticky header at top
- `floating`: rounded, shadowed, inset from edges
- `detached`: rounded bottom corners, scroll shadow
- `attached`: full-width, border-bottom
- `blur`: backdrop-filter blur on scroll
- Navbar content width: `compact` (1440px) or `wide` (full-bleed)

### Sidebar
- Width: 260px expanded, 71px collapsed
- `semiDark`: dark sidebar in light mode via `data-dark` attribute
- Collapse behavior: hover to expand, toggle lock, breakpoint auto-collapse
- Scroll shadow overlay at top when scrolled

### Content & Footer
- Content padding: 24px (`theme.spacing(6)`)
- Content max-width: 1440px in compact mode
- Footer: `detached` (rounded top, separate) or `attached` (full-width)
- Footer content width independent of main content width

## Theme Augmentation
MUI v7 requires module augmentation for custom variants and theme properties:

```typescript
// types.ts
import '@mui/material/Button';
import '@mui/material/Chip';
import '@mui/material/Pagination';

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    tonal: true;
  }
}
declare module '@mui/material/Chip' {
  interface ChipPropsVariantOverrides {
    tonal: true;
  }
}
declare module '@mui/material/Pagination' {
  interface PaginationPropsVariantOverrides {
    tonal: true;
  }
}
```

Custom theme properties:
```typescript
declare module '@mui/material/styles' {
  interface Theme {
    customShadows: {
      xs: string; sm: string; md: string; lg: string; xl: string;
      primarySm: string; primaryMd: string; primaryLg: string;
      successSm: string; errorSm: string; warningSm: string; infoSm: string;
    };
    mainColorChannels: {
      light: string; dark: string; lightShadow: string; darkShadow: string;
    };
  }
  interface Shape {
    customBorderRadius: { xs: number; sm: number; md: number; lg: number; xl: number };
  }
}
```

## Next.js Setup
For Next.js App Router with MUI v7:

```tsx
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  cssVariables: { colorSchemeSelector: 'data' },
  colorSchemes: { light: { palette: { ... } }, dark: { palette: { ... } } },
  // ...other config
});

export default function RootLayout({ children }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
```

Key setup points:
- Always use `AppRouterCacheProvider` from `@mui/material-nextjs`
- Always render `CssBaseline` inside `ThemeProvider`
- Use `cssVariables: { colorSchemeSelector: 'data' }` for data-attribute theming
- Build theme config first, then pass to `createTheme()`
- Use `slotProps` instead of legacy `InputProps` / `InputLabelProps`

## Industry-Specific Reasoning
The skill includes reasoning rules for 15 admin panel industries:

| Industry | Pattern | Style Priority | Color Mood |
|---|---|---|---|
| SaaS / B2B | Feature-Rich Dashboard + Onboarding | Bento Grid, Minimalism, Soft UI | Corporate blue + white + accent |
| Fintech / Banking | Data-Dense Dashboard + Transaction Table | Minimalism, Dark Mode, Glassmorphism | Deep navy + emerald + gold |
| Healthcare | Patient List + Appointment Calendar | Minimalism, Accessible, Soft UI | Soft teal + white + warm gray |
| E-commerce Admin | Order Management + Inventory Grid | Bento Grid, Data-Dense | Orange accent + white + dark sidebar |
| Logistics | Map + Shipment Tracker + Fleet Table | Real-Time Monitoring, Glassmorphism | Deep blue + bright cyan + amber |
| HR / People | Employee Directory + Org Chart | Minimalism, Soft UI, Bento Grid | Warm purple + soft gray + white |
| CRM / Sales | Pipeline Board + Contact List | Bento Grid, Soft UI | Electric blue + white + warm gray |
| ERP / Manufacturing | Production Dashboard + Inventory | Data-Dense, Executive | Industrial gray + safety orange |
| Education | Course List + Student Progress | Minimalism, Accessible, Soft UI | Academic blue + warm white |
| Government | Case Management + Document List | Minimalism, Accessible, Flat | Official blue + white + gray |
| Cybersecurity | Alert Feed + Threat Map | Dark Mode, HUD Sci-Fi | Deep black + alert red + cyber cyan |
| Real Estate | Property Grid + Map + Lead Pipeline | Bento Grid, Soft UI | Premium navy + gold accent |
| Energy | Grid Monitor + Meter Readings | Real-Time Monitoring, Data-Dense | Power blue + grid yellow + outage red |
| Media | Asset Library + Editorial Calendar | Minimalism, Bento Grid | Dark charcoal + vibrant accent |
| Nonprofit | Donor CRM + Campaign Tracker | Soft UI, Accessible, Minimalism | Hope blue + growth green + warm white |

Generate industry-specific guidance with:
```bash
python scripts/search.py --query "fintech" --domain industries -n 1
```

## UI Styles for Admin Dashboards
The skill includes 15 admin-appropriate UI styles:

| Style | Best For | Suitability |
|---|---|---|
| Minimalism & Swiss Style | Enterprise dashboards, documentation | 10/10 |
| Bento Box Grid | Admin dashboards, analytics, widgets | 10/10 |
| Dark Mode (OLED) | DevOps, cybersecurity, night operations | 9/10 |
| Soft UI Evolution | HR, healthcare, wellness, support | 9/10 |
| Glassmorphism | Financial dashboards, premium SaaS | 7/10 |
| Data-Dense Dashboard | Trading, ERP, manufacturing, power users | 10/10 |
| Executive Dashboard | C-suite, board meetings, high-level KPIs | 8/10 |
| Real-Time Monitoring | DevOps, IoT, logistics, network ops | 9/10 |
| Accessible & Inclusive | Government, healthcare, education | 10/10 |
| AI-Native UI | AI platforms, chatbots, copilot admin | 7/10 |

Search styles with:
```bash
python scripts/search.py --query "minimal" --domain styles -n 3
```

## Color Palette Selection
20 admin-specific color palettes are included, matched to industries:

```bash
python scripts/search.py --query "fintech" --domain color-palettes -n 3
```

Each palette includes: primary, secondary, accent, success, warning, error, info, background, text colors.

## Typography Pairing
15 curated font pairings for admin UIs:

```bash
python scripts/search.py --query "clean" --domain typography -n 3
```

Each pairing includes: heading font, body font, Google Fonts imports, mood description, best-for industries.

## Chart Selection for Dashboards
25 chart types mapped to admin use cases:

```bash
python scripts/search.py --query "revenue" --domain charts -n 5
```

Common admin chart patterns:
- **Revenue/Growth**: Line Chart, Area Chart, Sparkline
- **Comparisons**: Bar Chart, Grouped Bar, Horizontal Bar
- **Proportions**: Donut Chart, Pie Chart, Treemap
- **Real-time**: Gauge Chart, Metric Cards, Live Counter
- **Project/Timeline**: Gantt Chart, Timeline
- **Geographic**: Map, Choropleth
- **Correlation**: Scatter Plot, Heatmap

## Pre-Delivery Checklist
Every page must pass these checks before shipping:

### Universal Checks (All Pages)
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

### Page-Specific Checks
- **CRUD List**: Table row actions keyboard accessible, pagination updates URL, search debounced 300-500ms
- **Complex Form**: Dirty form confirmation, submit disabled while invalid, sections collapse on mobile
- **Dashboard**: Skeleton screens not spinners, charts have loading/empty states, auto-refresh reasonable
- **Detail**: Back navigation returns to correct list state, related data lazy-loaded
- **Settings**: Sections save independently or explicit global save, toggles have immediate feedback
- **Wizard**: Step validation prevents forward, progress indicator visible, summary review before submit
- **Auth**: Password visibility toggle, first input focused on load

Run checklist validation:
```bash
python scripts/search.py --query "crud-list" --domain pre-delivery-checklist -n 10
```

## Expert Panel
The assistant must internally review decisions from these expert roles:
1. UI/UX Architect
2. Design System Architect
3. MUI Component Reviewer
4. Frontend Implementation Reviewer
5. Accessibility Reviewer
6. Cursor Codebase Reviewer

Do not output fake panel discussion unless requested.
Use the panel to improve the final answer.

## Required Codebase Inspection
Before editing code:
1. Detect stack: React, Next.js, Vite, Vue, Nuxt, TypeScript, JavaScript.
2. Detect styling: CSS Modules, SCSS, Tailwind, Emotion, styled-components, CSS variables, tokens.
3. Detect MUI version if present.
4. Search for existing:
   - PageLayout
   - Card wrapper
   - Table abstraction
   - Form abstraction
   - Drawer/Dialog helpers
   - StatusChip/Badge
   - theme tokens
   - sidebar/navbar components
5. Reuse existing conventions.
6. Do not introduce unnecessary abstractions.

## Backend Data Detection & Integration
Before building any chart table or form the assistant must detect the data source:

### Detection Rules
1. **Check for backend presence**: Look for `package.json` proxy, `vite.config.ts` proxy, `.env` API URLs, `openapi.yaml`, Swagger docs, Spring Boot repo, NestJS repo, or existing API calls in the codebase.
2. **Check for real-time endpoints**: Look for WebSocket, STOMP, Socket.io, SSE, or GraphQL subscription configurations.
3. **Check for existing API layer**: Look for `api/`, `services/`, `hooks/` directories with fetch/axios/TanStack Query usage.

### Decision Matrix
| Scenario | Frontend Approach | Mock Strategy | Real-Time |
|---|---|---|---|
| Backend exists + API documented | Connect real API immediately | None — use real data | WebSocket/STOMP/SSE or polling |
| Backend exists + API not documented | Explore endpoints reverse engineer | MSW with discovered endpoints | Polling fallback |
| Backend in development not ready | MSW or json-server with agreed contract | MSW browser + server worker | Simulated polling |
| No backend frontend-first | json-server or localStorage mock | json-server db.json | Simulated polling |
| Backend unstable | Retry logic + circuit breaker | MSW fallback mode | Cached data + stale indicator |

### Chart + Backend Integration
When building charts with backend data:
- Always use TanStack Query `useQuery` to fetch chart data
- Map API response to chart format in `select` option or adapter function
- Use `staleTime` and `refetchInterval` for real-time dashboards
- Show loading skeletons (not spinners) while chart data loads
- Show error state with retry button on API failure
- Use `placeholderData` to show previous data while refetching

### Mock Data Strategy
When backend is not available:
- **MSW (preferred)**: Mock REST/GraphQL endpoints at network level. Share mock contract with backend team.
- **json-server**: Full fake REST API for rapid prototyping.
- **localStorage**: Simple persistence for demo data.
- **Never**: Hardcode mock data inside chart components or pages.

### Real-Time Data Patterns
| Backend Stack | Frontend Pattern |
|---|---|
| Spring Boot + STOMP | SockJS + STOMP.js + Zustand/TanStack Query |
| Node.js + Socket.io | Socket.io-client + event-driven store |
| Any + SSE | EventSource with reconnect polyfill |
| Any + polling | TanStack Query `refetchInterval` |
| GraphQL + subscriptions | Apollo Client subscriptions or TanStack Query polling |

## Operating Modes
Support these modes:
- Implementation
- Review
- Refactor
- Planning / Architecture
- Design System Generation
- Data Source Integration
- Cursor Prompt Generation
- **Design Exploration** (canvas/wireframe variants before code)
- **Context Graph** (inventory + reuse map before codegen)
- **Browser Verification** (live UI polish + flow testing)
- **Unified Frontend Loop** (full Phase 1–7 end-to-end)

## Page Pattern Mapping
Include detailed guidance for:
- CRUD List Page
- Complex Form Page
- Dashboard Page
- Detail Page
- Settings Page
- Wizard Page
- Auth Page
- Blank Layout

For each page type, include:
- Visual pattern
- MUI architectural equivalent
- reusable components
- required states
- accessibility requirements
- responsive behavior
- anti-patterns

## Drawer vs Dialog vs Page Rules
Use Dialog for:
- delete confirmation
- simple yes/no confirmation
- small focused form

Use Drawer for:
- quick create
- quick edit
- advanced filters
- record preview
- side details

Use full page for:
- complex forms
- multi-section edit
- workflows
- heavy validation
- wizard-like creation

Never put complex multi-section forms inside a small dialog.

## Table Standard
Every production table should use `@tanstack/react-table` and support:
- typed column config via `createColumnHelper`
- stable row keys
- sorting
- filtering (faceted + global)
- search (debounced 500ms)
- pagination via MUI `Pagination` (`shape='rounded'` `variant='tonal'`)
- server-side pagination when needed
- loading state
- empty state
- error state
- row actions via `OptionMenu`
- optional bulk actions via `rowSelection`
- status chips via MUI `Chip` (`variant='tonal'`)
- formatted date/number values
- responsive behavior (horizontal scroll)
- accessible headers
- controlled filter/sort/page state
- header height 56px, body row height 50px
- horizontal borders only, no vertical borders
- first/last column padding 24px, internal columns 16px

## Form Standard
Every production form should use `react-hook-form` and support:
- typed values via `defaultValues` generic
- validation rules (inline or schema via resolver)
- field-level errors via `formState.errors`
- helper text under fields
- required indicators
- submit loading via `CircularProgress` in button
- disabled state
- cancel/reset via `reset()`
- dirty state protection
- responsive field grid via MUI `Grid` (`spacing={6}`)
- logical sections separated by `Divider` + `Typography` headers
- accessible labels (`htmlFor` on label)
- success/error feedback
- MUI `TextField` with label-above-input pattern (`slotProps={{ inputLabel: { shrink: true, style: { transform: 'none' } } }}`)
- focus state: 2px border + `primary-sm` shadow
- start adornments for icons via `InputAdornment` in `slotProps={{ input: { startAdornment: ... } }}`

## Theme and Styling Standard
Prefer:
- MUI theme tokens (`theme.palette`, `theme.spacing`, `theme.shape`)
- CSS variables via MUI `cssVariables`
- shared spacing scale (`theme.spacing(factor)`)
- shared typography scale (`theme.typography`)
- semantic color roles (`primary`, `success`, `warning`, `error`, `info`)
- reusable variants (`contained`, `tonal`, `outlined`)
- Tailwind utilities for layout/flex/grid only
- `slotProps` over legacy `InputProps` / `InputLabelProps`

Avoid:
- random hex colors
- random margins
- random font sizes
- inconsistent border radius
- one-off shadows
- heavy inline `sx` props on generic primitives
- business-specific styling inside generic UI primitives
- using `item` prop on MUI v7 `Grid`

## Package Import Discipline

When adding or modifying imports in any module:

### 1. Verify Package Exists
Before writing a new import statement, check `package.json` (and `package-lock.json` / `yarn.lock` / `pnpm-lock.yaml`) to confirm the package is installed.

```bash
# Quick check
grep '"package-name"' package.json
```

### 2. If Package Is Missing
**Do NOT install automatically.** Present the user with:
- The missing package name
- The import path that triggered the need
- The recommended install command
- Ask for explicit confirmation

Example prompt:
```
⚠️  Missing package: @mui/x-data-grid
    Required by: src/features/admin/components/DataTable.tsx
    Install: npm install @mui/x-data-grid
    Proceed? (y/n)
```

### 3. Install Only After Confirmation
If user confirms, install with the project's package manager:
- Detect from lockfile: `package-lock.json` → npm, `yarn.lock` → yarn, `pnpm-lock.yaml` → pnpm
- Respect existing version constraints in `package.json`
- Update lockfile alongside install

### 4. Post-Install Verification
After install:
1. Run TypeScript check: `npx tsc --noEmit`
2. Verify the import resolves without error
3. Confirm no unused imports were added (tree-shaking friendly)

### 5. Anti-Pattern
- Adding imports for packages not in `package.json`
- Auto-installing without user consent
- Using different package managers within the same repo
- Adding unused dependencies "just in case"

## Keyboard Navigation
MUI components require specific keyboard patterns:

| Component | Keyboard Pattern |
|---|---|
| Autocomplete | Arrow keys navigate, Enter selects, Escape clears, Home/End in popup |
| Select | Space opens, arrows navigate, Enter selects, typeahead supported |
| Tabs | Left/Right arrows change tabs (not Tab key); Tab enters panel content |
| Accordion | Enter/Space toggles; arrows move between headers |
| Slider | Arrow keys adjust by step; Home/End to min/max; PageUp/PageDown |
| Switch | Space toggles (not Enter) |
| RadioGroup | Arrow keys change selection; Tab enters group |
| DatePicker | Arrow keys navigate calendar; PageUp/PageDown for months |
| Menu | Arrow keys navigate items; Escape closes; Enter activates |
| Dialog | Escape closes; Tab traps focus; Return focus to trigger on close |

## Review Output Format
When reviewing implementation, always output:

### 1. Verdict
Choose:
- Excellent
- Good but needs refinement
- Visually acceptable but structurally weak
- Not production-ready
- Needs redesign

### 2. Premium Admin Visual Alignment
Evaluate:
- layout
- cards
- spacing
- dashboard feel
- sidebar/navbar consistency
- hierarchy
- table/form presentation

### 3. MUI Architecture Alignment
Evaluate:
- component API
- reusable abstractions
- typed props
- form architecture (RHF + Controller)
- table architecture (TanStack + MUI Pagination)
- drawer/dialog usage
- theme/token usage
- predictable states

### 4. Main Problems
For each:
- what is wrong
- why it matters
- how to fix it

### 5. Production Readiness Score
Score 1-10:
- Premium Admin Visual Quality
- MUI Architecture Quality
- Component Reusability
- Form Quality
- Table Quality
- State Handling
- Responsiveness
- Accessibility
- Maintainability
- Production Readiness

### 6. Exact Fix Plan
Step-by-step practical fixes.

### 7. Final Decision
Choose:
- approve
- approve with minor changes
- request changes
- reject and redesign
