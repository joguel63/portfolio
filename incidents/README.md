# Visual Audit Incidents

This folder contains live visual audit runs. Each sub-folder is one incident
captured by the Playwright MCP + ui-ux-pro-max workflow.

## Incident Index

| ID | Fecha | Estado | Findings | Plan |
|----|-------|--------|----------|------|

| 20260310-0939 | 2026-03-10 | open | [ver](./20260310-0939/findings.md) | [ver](../docs/plans/20260310-visual-fixes.md) |

<!-- New rows are appended here by the orchestrator agent after each audit run -->

## Lifecycle

- `open` — audit captured, findings written, fix plan created, fixes not yet merged
- `in-progress` — some fixes merged, work ongoing
- `resolved` — all fixes merged and verified

## Cómo Cerrar un Incidente

1. Merge all fix PRs referenced in the incident's `plan.md`.
2. Edit the incident's `findings.md`, update the **Cierre del Incidente** section:
   ```
   Estado: resolved
   Plan ejecutado: <link>
   Commit de cierre: <sha>
   Fecha de cierre: YYYY-MM-DD
   ```
3. Update this table: change the incident's `Estado` cell to `resolved`.
4. Optional: re-run the visual audit to verify no regressions.
