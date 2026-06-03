# Changelog

All notable changes to the Enterprise UI Architect skill.

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
