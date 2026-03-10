# Visual Audit Workflow Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Set up the live visual audit infrastructure (incidents index, architecture docs, and orchestrator prompt) and execute the first visual audit run using Playwright MCP + ui-ux-pro-max.

**Architecture:** An orchestrator agent uses Playwright MCP to capture 10 screenshots + 2 videos of the running app at localhost:5173/portfolio/, saves them to `incidents/<YYYYMMDD-HHmm>/`, then invokes ui-ux-pro-max to analyze them visually and produce a prioritized findings report and fix plan.

**Tech Stack:** Playwright MCP (`@playwright/mcp`), ui-ux-pro-max skill, Vite dev server (port 5173), React 19 portfolio app

**Design document:** `docs/plans/2026-03-10-visual-audit-workflow-design.md`

---

## Task 1: Create incidents/ Infrastructure

**Files:**
- Create: `incidents/README.md`

**Step 1: Create the incidents index file**

Create `incidents/README.md` with this exact content:

```markdown
# Visual Audit Incidents

This folder contains live visual audit runs. Each sub-folder is one incident
captured by the Playwright MCP + ui-ux-pro-max workflow.

## Incident Index

| ID | Fecha | Estado | Findings | Plan |
|----|-------|--------|----------|------|

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
```

**Step 2: Commit**

```bash
git add incidents/README.md
git commit -m "feat: add incidents/ index for visual audit workflow

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 2: Document the Visual Audit Workflow in architecture.md

**Files:**
- Modify: `docs/architecture.md` (append new section at end of file)

**Step 1: Append the Visual Audit Workflow section**

Add the following block at the end of `docs/architecture.md`:

```markdown

## Visual Audit Workflow

Use this workflow to detect visual regressions, layout issues, and UX problems
in the live running app. It complements the static code audit in `docs/ux-audit/`.

### When to Run

- Before any release or deployment
- After significant visual/animation changes
- When a bug report mentions visual issues

### How to Invoke

Start the dev server if it isn't already running:

```bash
npm run dev
```

Then prompt Copilot CLI (in this project directory):

> "Run a visual audit of the portfolio. Use Playwright MCP to capture screenshots
> and video of http://localhost:5173/portfolio/ at desktop (1440px) and mobile (375px)
> for all 5 sections (Hero, About, Experience, Projects, Contact). Save to
> incidents/YYYYMMDD-HHmm/. Then analyze with ui-ux-pro-max and write findings.md
> and plan.md inside the incident folder. Update incidents/README.md."

### What Gets Generated

```
incidents/
└── YYYYMMDD-HHmm/
    ├── screenshots/          ← 10 PNG files (5 sections × 2 viewports)
    ├── videos/               ← 2 WebM files (scroll-desktop.webm, scroll-mobile.webm)
    ├── findings.md           ← Severity-tagged visual findings
    └── plan.md               ← Prioritized fix plan
```

### How to Interpret Findings

| Severity | Meaning | Action |
|----------|---------|--------|
| 🔴 Critical | Broken layout, WCAG AA violation, unreadable content | Fix before next release |
| 🟡 Warning | UX degradation a user would notice | Fix in current sprint |
| 🟢 Suggestion | Polish or improvement | Backlog |

### Animation Limitation

Screenshots capture a single frame. GSAP scroll-triggered animations may appear
incomplete or mid-transition. Always review `videos/scroll-*.webm` manually for
animation timing, jank, and transition smoothness. Flag animation issues as
separate findings in the plan.

### Closing an Incident

See `incidents/README.md` for the full lifecycle and closure instructions.
```

**Step 2: Commit**

```bash
git add docs/architecture.md
git commit -m "docs: document visual audit workflow in architecture.md

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 3: Execute First Visual Audit (Proof of Concept)

This task runs the full workflow for the first time. The orchestrator agent handles all sub-steps.

**Pre-condition:** Dev server must be running at `http://localhost:5173/portfolio/`

**Step 1: Verify dev server is running**

Run in PowerShell:
```powershell
try { $r = Invoke-WebRequest -Uri "http://localhost:5173/portfolio/" -UseBasicParsing -TimeoutSec 3; "Server OK: $($r.StatusCode)" } catch { "Server NOT running — start with: npm run dev" }
```

If not running:
```bash
npm run dev
```
Wait until you see `Local: http://localhost:5173/portfolio/` in the output.

**Step 2: Generate incident ID**

In PowerShell:
```powershell
$id = Get-Date -Format "yyyyMMdd-HHmm"; Write-Host "Incident ID: $id"
```

Note the ID (e.g., `20260310-1348`). Use it for all following steps.

**Step 3: Create incident folder structure**

```powershell
$id = Get-Date -Format "yyyyMMdd-HHmm"
New-Item -ItemType Directory -Path "incidents\$id\screenshots" -Force
New-Item -ItemType Directory -Path "incidents\$id\videos" -Force
Write-Host "Created incidents\$id\"
```

**Step 4: Dispatch orchestrator agent**

Invoke a `general-purpose` agent with this prompt (replace `<INCIDENT_ID>` with the actual ID):

---
*Prompt to use:*

```
You are a visual audit orchestrator. The portfolio app is running at http://localhost:5173/portfolio/.
The incident folder has already been created at incidents/<INCIDENT_ID>/.

Your job:

1. Use Playwright MCP to capture screenshots and video of all 5 sections at 2 viewports.

DESKTOP CAPTURE (viewport 1440x900):
- browser_navigate to http://localhost:5173/portfolio/
- browser_resize_window to 1440x900
- Wait 2 seconds for animations to settle
- browser_take_screenshot → save as incidents/<INCIDENT_ID>/screenshots/hero-desktop.png
- Scroll to #about (use browser_evaluate: document.querySelector('#about').scrollIntoView())
- Wait 800ms
- browser_take_screenshot → about-desktop.png
- Repeat for #experience, #projects, #contact

MOBILE CAPTURE (viewport 375x812):
- browser_resize_window to 375x812
- Scroll back to top
- browser_navigate to http://localhost:5173/portfolio/
- Wait 2 seconds
- Same 5 screenshots with -mobile suffix

VIDEO: Use Playwright's recordVideo context option if available via MCP, or note in findings.md that video capture requires manual Playwright script execution.

2. After capturing, invoke the ui-ux-pro-max skill to analyze ALL 10 screenshots.
   Focus on: layout issues, color contrast, typography, spacing, responsive breakage,
   hover states, animation artifacts visible in screenshots.

3. Write incidents/<INCIDENT_ID>/findings.md using this exact format:

---
# Visual Audit Findings — <INCIDENT_ID>

**Date:** YYYY-MM-DD
**Screenshots:** ./screenshots/
**Videos:** ./videos/
**Fix Plan:** ../../docs/plans/<date>-visual-fixes.md

## Executive Summary
<2-3 sentences>

## Findings

| # | Severity | Section | Viewport | Dimension | Finding | Screenshot | Suggested Fix |
|---|----------|---------|----------|-----------|---------|------------|---------------|

## Animation Notes
<observations from screenshots; flag anything requiring video review>

## Cierre del Incidente
- Estado: open
- Plan ejecutado: —
- Commit de cierre: —
- Fecha de cierre: —
---

4. Write incidents/<INCIDENT_ID>/plan.md with fix items ordered by severity (Critical first).
   Each item: section, file to change, exact change needed.

5. Also write docs/plans/<YYYYMMDD>-visual-fixes.md with the same plan content plus
   a header linking back to the incident:
   "Source incident: incidents/<INCIDENT_ID>/"

6. Update incidents/README.md: append a new table row:
   | <INCIDENT_ID> | <date> | open | [ver](incidents/<INCIDENT_ID>/findings.md) | [ver](docs/plans/<date>-visual-fixes.md) |

7. git add incidents/<INCIDENT_ID>/ docs/plans/<date>-visual-fixes.md incidents/README.md
   git commit -m "audit: visual audit incident <INCIDENT_ID>
   
   Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```
---

**Step 5: Review findings**

After the agent completes, open:
- `incidents/<INCIDENT_ID>/findings.md` — review all findings
- `incidents/<INCIDENT_ID>/screenshots/` — visually verify captures look correct
- `incidents/<INCIDENT_ID>/plan.md` — confirm fix items are actionable

**Step 6: Invoke writing-plans for the fix plan (if findings warrant it)**

If Critical or Warning findings exist, use the `writing-plans` skill to expand
`incidents/<INCIDENT_ID>/plan.md` into a full step-by-step implementation plan.

---

## Verification Checklist

After all 3 tasks complete, verify:

- [ ] `incidents/README.md` exists with lifecycle documentation
- [ ] `docs/architecture.md` has "Visual Audit Workflow" section
- [ ] `incidents/<ID>/screenshots/` contains exactly 10 PNG files
- [ ] `incidents/<ID>/findings.md` exists with at least 1 finding per section
- [ ] Every finding has a severity (🔴/🟡/🟢), screenshot reference, and suggested fix
- [ ] `incidents/README.md` table has the new incident row with status `open`
- [ ] `docs/plans/<date>-visual-fixes.md` created and links back to incident
- [ ] All files committed to git
