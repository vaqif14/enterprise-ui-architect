# Changelog

All notable changes to the Enterprise UI Architect skill.

## 2.2.0 — 2026-06-09

### Added
- **Stack Router** — mixed MUI/shadcn routing table in SKILL.md + `stack-profiles.csv` searchable domain
- **Loop gate** — mandatory phase checklist before multi-screen UI codegen
- **`scripts/context-graph.py`** — auto-generates `design-system/CONTEXT_GRAPH.md` reuse map
- **`enterprise-ui verify-loop`** — CLI check for MASTER.md, STACK.md, CONTEXT_GRAPH.md (+ optional `--tsc`)
- **`references/audit-live-evidence.md`** — live audit scores from corp-auction (MUI) and itinnovations (shadcn)
- Cursor rule template injects Stack Router + Unified Frontend Loop sections

### Changed
- `cursor.json` inject section titles fixed to match SKILL.md headings
- Quick reference and skill-content include stack router + verify-loop commands

## 2.1.0 — 2026-06-09

### Added
- **Unified Frontend Loop** (Kombai-inspired, Cursor-native): 7-phase workflow connecting design system lock, canvas variants, Context Graph reuse, plan mode, code generation, browser verification, and sync-back
- **`references/unified-frontend-loop.md`**: full workflow guide with Cursor equivalents for Design mode, Context Graphs, Plan mode, and browser polish loop
- **`frontend-loop` data domain**: searchable workflow steps via `search.py`
- New workflow anti-patterns (#58–#64): design drift, missing Context Graph, skipped browser verification, vague visual prompts, unsynced MASTER.md, plan-less multi-screen work, lint-only review
- New operating modes: Design Exploration, Context Graph, Browser Verification, Unified Frontend Loop

### Changed
- SKILL.md, quick-reference, and skill-content templates updated with loop phases and triggers
- `search.py` registers `frontend-loop` domain

## 2.0.0 — 2026-06-03

### Added
- **Translation verification**: `enterprise-ui verify-i18n [--src <dir>]` command scans source files for `t()` calls, respects `useTranslations` namespace, and reports missing keys across all locale files
- **Package import verification**: `enterprise-ui verify-imports [--src <dir>]` command scans imports, detects missing npm packages, auto-detects package manager, respects tsconfig path aliases
- **Translation Discipline (i18n)** section in SKILL.md — guidelines for `next-intl` / `react-i18next` workflows
- **Package Import Discipline** section in SKILL.md — verify before import, ask user before install
- New anti-patterns: #56 (missing packages), #57 (missing translation keys)
- New pre-delivery checklist items for dependencies and i18n

### Changed
- Version alignment: all artifacts now report `2.0.0`
- Claude skill synced with full SKILL.md content (696 lines)
- Cursor `.mdc` rule regenerated with new discipline sections

## 1.0.0 — 2026-06-03

### Added
- Initial release with MUI v7 enterprise admin dashboard skill
- 14 data CSV domains (tokens, components, patterns, anti-patterns, rubric, accessibility, industries, styles, colors, typography, charts, pre-delivery, api-integration, data-strategies)
- Python search engine with BM25 scoring and design system generation
- Backend-aware integration patterns (API detection, real-time, chart-to-API mapping)
- TypeScript CLI with platform initialization for Cursor, Claude, Windsurf, Copilot, Codex
