# Maintainer Guide: Enterprise UI Architect Skill

## Source of Truth

`src/enterprise-ui-architect/` is the single source of truth for all skill content.

- `SKILL.md` — canonical skill definition
- `data/*.csv` — structured reference data (page patterns, components, rubrics, anti-patterns, tokens, accessibility)
- `scripts/search.py` — standalone Python search utility for CSV data
- `templates/base/` — platform-agnostic markdown templates
- `templates/platforms/` — per-AI-assistant output definitions

## Sync Rules

1. **Edit `src/` first.** All changes must start in `src/enterprise-ui-architect/`.
2. **CLI assets are copies.** `cli/assets/` mirrors `src/enterprise-ui-architect/` for npm packaging. Rebuild or copy after `src/` changes.
3. **Generated files.** `.cursor/rules/enterprise-ui-architect.mdc` is generated from `templates/platforms/cursor.json` + `SKILL.md` content. Do not hand-edit generated files.
4. **Templates drive output.** `templates/platforms/*.json` defines where each AI assistant installs its files. Keep paths accurate.

## Data / Scripts / Templates Difference

| Layer | Purpose | Edit? |
|---|---|---|
| `data/*.csv` | Structured, machine-readable rules and standards | Yes, in `src/` |
| `scripts/search.py` | Runtime search across CSVs without dependencies | Yes, in `src/` |
| `templates/base/*.md` | Human-readable skill content and quick ref | Yes, in `src/` |
| `templates/platforms/*.json` | Per-platform installation manifests | Yes, in `src/` |

## CLI Assets

`cli/assets/` exists only so the npm package is self-contained. After changing `src/`, run:

```bash
# From repo root
rsync -av src/enterprise-ui-architect/ cli/assets/
```

Or let the CLI build step copy them during `npm run build`.

## No Direct Main Push Rule

- Open a PR for any non-trivial change.
- Update `CHANGELOG.md` with Conventional Commits style.
- Ensure `skill.json` version is bumped if behavior changes.
- Verify generated `.cursor/rules/enterprise-ui-architect.mdc` is regenerated before merge.
