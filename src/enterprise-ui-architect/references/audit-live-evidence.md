# Live Audit Evidence (2026-06-09)

Professional expert audit executed per plan. Projects tested with simulated **Projects CRUD List Page** task.

## MUI Project: corp-auction/frontend

**Stack:** Next.js 16, MUI 7.3.6, RHF, TanStack Table/Query, next-intl, Playwright.

| Phase | Score | Notes |
|---|---|---|
| 1 Stack + DS | partial | Stack matches skill; no `design-system/MASTER.md` |
| 2 Design | partial | Reference pages exist (`document-templates`, `holidays`) |
| 3 Context Graph | partial | Rich `ui-custom` barrel; naming mismatch (`PageScaffold` vs `PageLayout`) |
| 4 Plan | yes | Feature hooks + admin-client pattern fits |
| 5 Code | partial | `DataTable` uses `TablePagination` (skill anti-pattern) |
| 6 Browser | yes | Playwright + dev server available |
| 7 Sync | partial | No design-system folder to sync back |

**Loop adherence: 64%** (2 yes + 5 partial / 7)

**Top gaps:** no MASTER.md; skill vocabulary ≠ repo names; fragmented table patterns.

## shadcn Project: itinnovations-main-

**Stack:** Next.js 16, shadcn/base-nova, Tailwind, lucide-react, TanStack Query. **No MUI.**

| Metric | Score |
|---|---|
| Portable directives | ~37% |
| Implementation fit | **3/10** |
| Process-only fit | **7/10** |

**Hard misfires:** ~32 MUI-specific directives would emit wrong imports/components.

**Routing:** Implementation → `shadcn` skill; process → trimmed enterprise-ui-architect phases 1/2/4/6/7.

## Composite Scores

| Expert | MUI admin | shadcn |
|---|---|---|
| UI/UX Architect | 7.5 | 6.0 |
| Design System Architect | 8.0 | 5.0 |
| MUI Implementation | 9.0 | 3.0 |
| Frontend Execution | 7.5 | 3.0 |
| Accessibility | 7.0 | 7.0 |
| Workflow / Tooling | 6.5 → 8.0 post-remediation | 6.0 |

**Overall: 7.8/10 (MUI)** | **4.2/10 (shadcn implementation)**

## Remediation Shipped (v2.2.0)

- Stack Router section + `stack-profiles.csv`
- Loop gate checklist in SKILL.md
- `scripts/context-graph.py`
- `enterprise-ui verify-loop` CLI
- Cursor rule template updated with loop + router
