# Enterprise UI Architect

> AI skill for building production-grade enterprise admin dashboards with MUI v7, design system intelligence, and backend integration patterns.

[![MUI v7](https://img.shields.io/badge/MUI-v7-007FFF?logo=mui)](https://mui.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?logo=reactquery)](https://tanstack.com/query)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## What This Skill Does

**Enterprise UI Architect** is an AI coding skill that guides LLMs and coding assistants to build premium admin dashboards with:

- **MUI v7** as the implementation engine — fully typed, theme-token-driven components
- **Ant Design-level engineering discipline** — predictable APIs, reusable abstractions, token-first styling
- **Design system intelligence** — industry-specific palettes, typography, layouts, and anti-patterns
- **Backend-aware integration** — detects APIs, maps charts to data, chooses real-time vs polling vs mock

It is not a component library. It is a **decision framework** that tells AI *how* to compose MUI components into professional admin UIs.

---

## Philosophy

| Layer | Role |
|---|---|
| **Visual Direction** | Premium enterprise admin patterns — card grids, stat cards, status chips, polished tables |
| **Implementation** | MUI v7 components with TypeScript, `slotProps`, `theme.palette`, `CssBaseline` |
| **Architecture** | Ant Design-level discipline — typed props, predictable Form/Table patterns, design tokens |
| **Intelligence** | Industry-specific reasoning — fintech needs different colors than healthcare |
| **Data** | Backend detection → real API, MSW mock, or json-server; never hardcode in components |

---

## Component Stack

| Concern | Package |
|---|---|
| UI Components | `@mui/material` v7 |
| Forms | `react-hook-form` + `Controller` |
| Tables | `@tanstack/react-table` |
| Validation | `valibot` / `zod` via `@hookform/resolvers` |
| Icons | Tabler Icons (`@tabler/icons-react`) |
| Data Fetching | TanStack Query (preferred) or SWR |
| Real-Time | WebSocket / STOMP / Socket.io / SSE |
| API Mocking | MSW (Mock Service Worker) |

---

## Design System Generation

Generate a complete design system for any admin product with a single query:

```bash
python scripts/search.py --query "fintech" --design-system --product "MyBank"
```

Outputs: **pattern** + **style** + **colors** + **typography** + **effects** + **anti-patterns** + **pre-delivery checklist**

Persist for cross-session use:

```bash
python scripts/search.py --query "saas" --design-system --persist --product "MyApp"
```

This creates:
```
design-system/
├── MASTER.md
└── pages/
    ├── dashboard.md
    ├── list.md
    └── form.md
```

---

## Backend Data Detection & Integration

Before building any chart, table, or form, the skill detects the data source:

| Scenario | Approach | Mock Strategy |
|---|---|---|
| Backend exists + API documented | Connect real API immediately | None |
| Backend exists + API not documented | Explore endpoints, reverse engineer | MSW with discovered endpoints |
| Backend in development | MSW with agreed contract | MSW browser + server worker |
| No backend | json-server or localStorage | `db.json` |
| Backend unstable | Retry logic + circuit breaker | MSW fallback mode |

### Real-Time Patterns

| Backend | Frontend Pattern |
|---|---|
| Spring Boot + STOMP | SockJS + STOMP.js + Zustand/TanStack Query |
| Node.js + Socket.io | Socket.io-client + event-driven store |
| Any + SSE | EventSource with reconnect polyfill |
| Any + polling | TanStack Query `refetchInterval` |

### Chart + API Mapping

- Use TanStack Query `useQuery` for chart data
- Map API response → chart format via **adapter function**
- Use `staleTime` + `refetchInterval` for real-time dashboards
- Show **Skeleton** (not spinner) while chart data loads
- Use `placeholderData` to show previous data while refetching

---

## CLI Installation

```bash
npm install -g enterprise-ui-architect-cli

# Initialize for Cursor
enterprise-ui init --ai cursor

# Initialize for multiple platforms
enterprise-ui init --ai all

# Offline mode (uses bundled assets)
enterprise-ui init --ai claude --offline
```

---

## Supported Platforms

| Platform | Output | Status |
|---|---|---|
| **Cursor** | `.cursor/rules/enterprise-ui-architect.mdc` | ✅ Ready |
| **Claude** | `.claude/skills/enterprise-ui-architect/` | ✅ Ready |
| **Windsurf** | `.windsurf/rules/enterprise-ui-architect.mdc` | ✅ Ready |
| **GitHub Copilot** | System prompt injection | ✅ Ready |
| **Codex** | Prompt prefix injection | ✅ Ready |

---

## Data Domains (14 CSV Files)

| Domain | File | Records | Purpose |
|---|---|---|---|
| Design Tokens | `tokens.csv` | 88 | Colors, spacing, shadows, typography, layout |
| Component Standards | `component-standards.csv` | 16 | Quality rules for 16 core MUI components |
| Page Patterns | `page-patterns.csv` | 8 | CRUD List, Dashboard, Form, Detail, Settings, Wizard, Auth, Blank |
| Anti-Patterns | `anti-patterns.csv` | 40 | What NOT to do — MUI, Table, Form, Layout, Theme, A11y, Production |
| Review Rubric | `review-rubric.csv` | 4 | 4-star grading for visual + architecture quality |
| Accessibility | `accessibility-checks.csv` | 30 | WCAG + MUI a11y compliance checklist |
| Industries | `industries.csv` | 15 | Tailored rules per vertical |
| Styles | `styles.csv` | 10 | UI style catalog with admin suitability scores |
| Color Palettes | `color-palettes.csv` | 10 | Pre-built palettes with MUI mapping |
| Typography | `typography.csv` | 10 | Font pairings with admin readability scores |
| Charts | `charts.csv` | 12 | Dashboard chart types with backend integration notes |
| Pre-Delivery | `pre-delivery-checklist.csv` | 30 | Final QA checklist before shipping |
| API Integration | `api-integration-patterns.csv` | 7 | REST, GraphQL, tRPC, gRPC-Web, WebSocket, SSE, Actions |
| Data Strategies | `data-source-strategies.csv` | 5 | Backend detection + mock strategy matrix |

### Search Engine

```bash
# Search all domains
python scripts/search.py --query "fintech" --domain all -n 5

# Search specific domain
python scripts/search.py --query "real-time" --domain api-integration

# Generate design system
python scripts/search.py --query "healthcare" --design-system --product "MedFlow"
```

Pure Python 3. Zero dependencies. BM25-like scoring.

---

## Project Structure

```
enterprise-ui-architect-skill/
├── src/enterprise-ui-architect/
│   ├── SKILL.md                          # Canonical skill definition
│   ├── data/                             # 14 CSV data domains
│   ├── scripts/
│   │   └── search.py                     # Python search + design system generator
│   └── templates/
│       ├── base/
│       │   ├── quick-reference.md        # One-page cheat sheet
│       │   └── skill-content.md          # Full skill content
│       └── platforms/
│           ├── cursor.json               # Cursor IDE rule config
│           ├── claude.json               # Claude skill config
│           ├── windsurf.json             # Windsurf rule config
│           ├── copilot.json              # Copilot system prompt
│           └── codex.json                # Codex prompt prefix
├── cli/                                  # TypeScript CLI package
│   ├── src/
│   │   └── commands/
│   │       └── init.ts                   # Platform initialization
│   ├── assets/templates/                 # Bundled platform configs
│   └── package.json
├── .cursor/
│   └── rules/
│       └── enterprise-ui-architect.mdc   # Generated Cursor rule
├── skill.json                            # Skill metadata manifest
├── CHANGELOG.md
└── README.md
```

---

## Key Capabilities

### 1. One-Shot Dashboard Creation
```bash
python scripts/search.py \
  --query "fintech dark" \
  --design-system \
  --persist \
  --product "TradeDesk"
```

### 2. Backend-Aware Chart Building
The skill tells AI to:
1. Check for `openapi.yaml`, Swagger, Spring Boot, NestJS
2. Look for WebSocket/STOMP/SSE endpoints
3. Use TanStack Query with `staleTime: 5 * 60 * 1000`
4. Fall back to MSW with explicit `USE_MOCK=true`

### 3. Industry-Specific Reasoning
15 verticals with tailored color, typography, and layout rules:
SaaS, Fintech, Healthcare, E-commerce, Logistics, HR, CRM, ERP, Education, Government, Cybersecurity, Real Estate, Energy, Media, Nonprofit.

### 4. Production-Ready Patterns
- Skeleton loading states (not spinners)
- Error boundaries per page section
- Optimistic mutations with rollback
- Request cancellation on unmount
- Dirty form guards with confirmation dialogs

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

---

## Contributing

This is an AI-native skill. Improvements are made through:
1. Data-driven updates to CSV files
2. Rule refinements in SKILL.md
3. Platform template updates
4. Search engine scoring improvements

---

## License

MIT © 2025
