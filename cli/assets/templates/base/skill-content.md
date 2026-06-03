# Enterprise UI Architect — Skill Content

## What This Skill Does
Guides AI coding assistants to build premium admin dashboards that use MUI v7 components, follow Ant Design engineering discipline, and leverage design system intelligence for consistent, industry-appropriate UIs.

## Visual Direction (Enterprise Admin)
- Card-based layouts with consistent padding and elevation
- Sidebar + navbar composition (header 54px, sidebar 260px/71px collapsed)
- Status chips with semantic colors and tonal variant
- Dashboard widget rhythm with 24px gaps
- Polished tables with action menus (header 56px, body 50px, horizontal borders only)
- Clean form sections with footer actions
- Label-above-input text fields with primary focus shadow
- Stat cards: horizontal (stats left, avatar right) or vertical (avatar top, stats below)

## Implementation Engine (MUI v7)
- MUI Card, CardHeader, CardContent, CardActions, Divider
- MUI Dialog, Drawer, Button, Chip, TextField, Pagination
- MUI Grid for responsive layouts (no `item` prop in v7)
- MUI Tabs, Descriptions, Badge, Switch
- Theme tokens via theme.palette, theme.spacing, theme.shape

## Architecture Principles (Ant Design-inspired)
- TypeScript-first component APIs
- Predictable Form patterns (react-hook-form + Controller)
- Predictable Table patterns (TanStack Table + MUI Pagination)
- Drawer/Dialog discipline
- Design token usage
- Reusable abstractions
- Accessibility compliance
- Production-ready state handling

## Component Stack
- UI: `@mui/material` v7
- Forms: `react-hook-form` + `Controller`
- Tables: `@tanstack/react-table`
- Validation: `valibot` / `zod` via `@hookform/resolvers`
- Icons: Tabler Icons
- Data Fetching: TanStack Query (preferred) or SWR
- Real-Time: WebSocket / STOMP / Socket.io / SSE
- API Mocking: MSW (Mock Service Worker) for development

## Design System Generation
Generate a complete design system for any admin product:

```bash
python scripts/search.py --query "fintech" --design-system --product "MyBank"
```

Outputs: pattern + style + colors + typography + effects + anti-patterns + checklist

Persist for cross-session use:
```bash
python scripts/search.py --query "saas" --design-system --persist --product "MyApp"
```

## Industry-Specific Reasoning
15 admin industries with tailored rules:
- SaaS / B2B Platform
- Fintech / Banking
- Healthcare / Medical
- E-commerce Admin
- Logistics / Supply Chain
- HR / People Management
- CRM / Sales
- ERP / Manufacturing
- Education / LMS
- Government / Public Sector
- Cybersecurity / SOC
- Real Estate / Property
- Energy / Utilities
- Media / Content Management
- Nonprofit / NGO

## UI Styles for Admin Dashboards
15 styles rated for admin suitability:
- Minimalism & Swiss Style (10/10)
- Bento Box Grid (10/10)
- Dark Mode OLED (9/10)
- Soft UI Evolution (9/10)
- Data-Dense Dashboard (10/10)
- Executive Dashboard (8/10)
- Real-Time Monitoring (9/10)
- Accessible & Inclusive (10/10)
- Glassmorphism (7/10)
- AI-Native UI (7/10)

## Color Palettes
20 admin-specific palettes matched to industries.

## Typography Pairings
15 curated font pairings with Google Fonts imports.

## Charts for Dashboards
25 chart types mapped to admin use cases:
- Revenue/Growth: Line, Area, Sparkline
- Comparisons: Bar, Grouped Bar, Horizontal Bar
- Proportions: Donut, Pie, Treemap
- Real-time: Gauge, Metric Cards
- Project: Gantt, Timeline
- Geographic: Map, Choropleth

## Page Patterns Quick Map
| Page Type | Visual Feel | MUI + RHF Architecture |
|---|---|---|
| CRUD List | Card + toolbar + table + pagination | TanStack Table + MUI Pagination + Drawer filters |
| Complex Form | Card sections + footer actions | RHF + Controller + MUI TextField + dirty guard |
| Dashboard | Widget grid + charts + activity | MUI Card + StatCard + Grid + Chip tonal |
| Detail | Summary + tabs + related lists | MUI Tabs + Descriptions + Card per section |
| Settings | Tab categories + toggles + save | MUI Tabs + Card per section + Switch + RHF |
| Wizard | Stepper + step validation | RHF step schema + MUI Stepper + summary review |
| Auth | Centered card + blank layout | BlankLayout + MUI Card + RHF + fullWidth buttons |
| Blank | Full-width centered no sidebar | BlankLayout + centered content |

## Component Standards Quick Map
| Component | Key Rules |
|---|---|
| PageLayout | Consistent padding, max-width, background from theme, layout modes |
| Card | MUI Card + CardHeader + CardContent + CardActions + Divider |
| DataTable | TanStack Table, typed columns, rowKey, loading/empty/error, MUI Pagination rounded tonal |
| FormSection | MUI Card + section title + Divider + Grid spacing 6 |
| StatusChip | MUI Chip, variant tonal, size small, icon + text, semantic color |
| Drawer | MUI Drawer, anchor right, width 300-400px, manual reset on close |
| Dialog | MUI Dialog, maxWidth md for edit, scroll body, closeAfterTransition false for confirmations |
| SubmitBar | MUI CardActions, Button contained primary + tonal secondary, loading, dirty guard |
| CustomTextField | MUI TextField variant filled with styled overrides, label above input, slotProps inputLabel shrink true |
| StatCard | MUI Card, horizontal or vertical, avatar + tonal Chip, border accent optional |
| Button | MUI Button, variant contained/tonal/outlined, loading via CircularProgress, active scale 0.98 |
| Pagination | MUI Pagination, shape rounded, variant tonal, connected to table state |
| OptionMenu | MUI Menu + IconButton trigger, typed options array |
| Skeleton | MUI Skeleton for known-shape content loading, not CircularProgress |
| ErrorBoundary | React ErrorBoundary at page/layout level with fallback UI |

## Backend Data Detection
Before building charts tables or forms detect the data source:
- Backend exists + API documented → Connect real API immediately
- Backend exists + API not documented → Explore endpoints reverse engineer
- Backend in development → MSW or json-server with agreed contract
- No backend → json-server or localStorage mock
- Backend unstable → Retry logic + circuit breaker + MSW fallback

### Chart + Backend Integration
- Use TanStack Query `useQuery` for chart data
- Map API response to chart format in adapter function
- Use `staleTime` and `refetchInterval` for real-time dashboards
- Show Skeleton (not spinner) while chart data loads
- Use `placeholderData` to show previous data while refetching

### Real-Time Patterns
| Backend | Frontend Pattern |
|---|---|
| Spring Boot + STOMP | SockJS + STOMP.js + Zustand |
| Node.js + Socket.io | Socket.io-client + event store |
| Any + SSE | EventSource with reconnect |
| Any + polling | TanStack Query `refetchInterval` |

## Anti-Patterns to Catch
- Complex forms inside Dialogs
- Inline table column definitions
- Random hex colors or margins
- Missing loading/empty/error states
- Color-only status indicators
- Missing dirty form guard
- Inline sx props on generic primitives
- Vertical table borders
- Floating labels without shrink
- Using MUI TablePagination for logic instead of TanStack state
- Using native MUI Table without TanStack react-table
- Missing CardHeader/CardContent/CardActions structure
- Using `item` prop on MUI v7 Grid
- Forgetting `declare module` for `tonal` variant
- Using MUI v7 without AppRouterCacheProvider in Next.js
- Using rules inline alongside schema resolver
- No Error Boundaries
- Using CircularProgress instead of Skeleton for content loading
- Icon-only buttons without aria-label
- Disabling focus outlines globally

## Review Verdict Scale
- Excellent
- Good but needs refinement
- Visually acceptable but structurally weak
- Not production-ready
- Needs redesign
