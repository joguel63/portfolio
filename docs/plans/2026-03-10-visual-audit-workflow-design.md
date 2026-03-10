# Visual Audit Workflow — Design Document

**Date:** 2026-03-10  
**Status:** Approved  
**Author:** Copilot CLI (brainstorming session)

---

## Problem Statement

The portfolio has an existing code-based UX audit (`docs/ux-audit/`) that analyzes source files statically. While useful, it cannot detect visual regressions, real rendering issues, animation problems, or layout breakage that only appear in a live browser. We need a **live visual audit workflow** that uses Playwright MCP to capture real screenshots and video recordings of the running app, then leverages the `ui-ux-pro-max` skill to analyze them and produce an actionable fix plan.

---

## Approved Approach: Orchestrator Agent (Approach C)

A single `general-purpose` orchestrator agent drives the entire flow end-to-end:
captures → analyzes → writes findings → writes plan → updates incident index.

### Why This Approach

- **Full trazability:** every audit is a self-contained incident with ID, screenshots, videos, findings, and plan
- **Repeatable:** same prompt invokes the same workflow every time, no manual steps
- **Multi-agent compatible:** fits the existing parallel agent architecture
- **Lifecycle tracking:** incidents move from `open` → `in-progress` → `resolved`

---

## Incident Structure

Each audit run generates a unique incident ID using the format `YYYYMMDD-HHmm`.

```
incidents/
└── 20260310-1348/                    ← Incident ID
    ├── screenshots/
    │   ├── hero-desktop.png           ← 1440px viewport
    │   ├── hero-mobile.png            ← 375px viewport
    │   ├── about-desktop.png
    │   ├── about-mobile.png
    │   ├── experience-desktop.png
    │   ├── experience-mobile.png
    │   ├── projects-desktop.png
    │   ├── projects-mobile.png
    │   ├── contact-desktop.png
    │   └── contact-mobile.png
    ├── videos/
    │   ├── scroll-desktop.webm        ← Full scroll at 1440px
    │   └── scroll-mobile.webm         ← Full scroll at 375px
    ├── findings.md                    ← Visual analysis by ui-ux-pro-max
    └── plan.md                        ← Fix plan (links to docs/plans/)
```

**Cross-references:**
- `findings.md` links to `../../docs/plans/<date>-visual-fixes.md`
- `docs/plans/<date>-visual-fixes.md` links back to the incident folder
- `incidents/README.md` indexes all incidents with their status

---

## Orchestrator Agent Flow

```
[Audit invoked]
       ↓
1. Generate incident ID: YYYYMMDD-HHmm
2. Create incidents/<id>/screenshots/ and /videos/
3. Health-check: GET http://localhost:5173/portfolio/
   ├── ✅ 200 → proceed
   └── ❌ no response → `npm run dev` (detached) → wait for ready
4. Playwright MCP — Desktop (viewport: 1440×900):
   ├── Start video recording → videos/scroll-desktop.webm
   ├── Navigate to http://localhost:5173/portfolio/
   ├── Wait for animations to settle (1s)
   ├── Screenshot #hero  → screenshots/hero-desktop.png
   ├── Scroll to #about, wait 800ms → screenshot about-desktop.png
   ├── Scroll to #experience, wait 800ms → screenshot experience-desktop.png
   ├── Scroll to #projects, wait 800ms → screenshot projects-desktop.png
   ├── Scroll to #contact, wait 800ms → screenshot contact-desktop.png
   └── Stop recording
5. Playwright MCP — Mobile (viewport: 375×812):
   └── Same sequence → 5 screenshots + scroll-mobile.webm
6. Invoke ui-ux-pro-max skill with all 10 screenshots + 2 videos
7. Write incidents/<id>/findings.md (see format below)
8. Write incidents/<id>/plan.md + docs/plans/<date>-visual-fixes.md
9. Update incidents/README.md → new row with status: open
```

---

## Output Formats

### findings.md

```markdown
# Visual Audit Findings — <Incident ID>

**Date:** YYYY-MM-DD  
**Screenshots:** ./screenshots/  
**Videos:** ./videos/  
**Fix Plan:** ../../docs/plans/<date>-visual-fixes.md  

## Executive Summary
<2-3 sentence overview of overall visual health>

## Findings

| # | Severity | Section | Viewport | Dimension | Finding | Screenshot | Suggested Fix |
|---|----------|---------|----------|-----------|---------|------------|---------------|
| 1 | 🔴 Critical | Hero | Mobile | Responsiveness | ... | hero-mobile.png | ... |
| 2 | 🟡 Warning | Projects | Desktop | Visual Consistency | ... | projects-desktop.png | ... |
| 3 | 🟢 Suggestion | About | Both | Accessibility | ... | — | ... |

## Animation Notes
<Observations from video recordings. Issues that require manual review are flagged here.>

## Cierre del Incidente
- Estado: open
- Plan ejecutado: —
- Commit de cierre: —
- Fecha de cierre: —
```

**Severity definitions:**
- 🔴 **Critical** — breaks layout, WCAG AA violation, content unreadable
- 🟡 **Warning** — notable UX degradation a user would notice
- 🟢 **Suggestion** — polish or improvement, no visible harm if left

---

## incidents/README.md Format

```markdown
# Visual Audit Incidents

| ID | Fecha | Estado | Findings | Plan |
|----|-------|--------|----------|------|
| 20260310-1348 | 2026-03-10 | open | [ver](./20260310-1348/findings.md) | [ver](../docs/plans/20260310-visual-fixes.md) |

## Cómo Cerrar un Incidente

1. Asegúrate de que todos los issues del plan de fixes estén mergeados.
2. Actualiza `findings.md` del incidente:
   - `Estado: resolved`
   - `Plan ejecutado: <link al plan>`
   - `Commit de cierre: <sha>`
   - `Fecha de cierre: YYYY-MM-DD`
3. Actualiza esta tabla cambiando el estado a `resolved`.
4. Opcional: re-ejecuta el audit para verificar que los problemas están corregidos.
```

---

## Documentation Updates

`docs/architecture.md` will receive a new section **"Visual Audit Workflow"** covering:

- When to run (before releases, after major visual changes)
- How to invoke (Copilot CLI prompt)
- What gets generated (incident structure)
- How to interpret findings (severity levels)
- How to link incidents to fix plans
- Known limitation: animations require video review; GSAP timing issues may not be visible in single-frame screenshots

---

## Constraints

- **Read-only audit:** no code changes are made during capture or analysis
- **Requires running app:** the workflow depends on the dev server being accessible
- **Video format:** `.webm` (Playwright default)
- **Screenshot tool:** Playwright MCP `browser_take_screenshot`
- **Analysis tool:** `ui-ux-pro-max` skill

---

## Success Criteria

- 10 screenshots saved in correct folder structure
- 2 video files saved
- `findings.md` has at least one finding per section
- Every finding references the screenshot file that shows it
- `plan.md` exists with severity-ordered fix items
- `incidents/README.md` updated with the new incident
- `docs/architecture.md` documents the workflow
