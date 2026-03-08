# UX Audit Agent — Design Document

## Problem Statement

The portfolio has 5 sections (Hero, About, Experience, Projects, Contact) built with React 19, GSAP, Three.js, and Tailwind CSS v4 using a dark/cyberpunk theme. There is no systematic UX review process. We need an automated audit that surfaces real UX problems across accessibility, responsiveness, performance perception, and visual consistency — without making any code changes.

## Approved Approach: Parallel Agents Per Section (Approach A)

5 `general-purpose` sub-agents run in parallel, one per section. Each agent is scoped to a single component file and its related assets. A 6th consolidation agent synthesizes all results into a single prioritized report.

### Why This Approach

- **Maximum parallelism:** all 5 sections analyzed simultaneously
- **Scoped context:** each agent focuses on one component, producing deeper analysis
- **Rerunnable:** a single section can be re-audited without repeating all sections
- **Separation of concerns:** audit vs. synthesis are distinct responsibilities

---

## Agent Design

### Per-Section Agents (×5, run in parallel)

**Sections:** Hero, About, Experience, Projects, Contact

**Each agent reads:**
- `src/components/<Section>/<Section>.jsx` (or `src/components/Hero.jsx`)
- `src/index.css` (design tokens: colors, fonts, spacing)
- `src/data/index.js` + relevant data file (for content-level issues)
- The ui-ux-pro-max skill checklist (via skill invocation)

**Each agent evaluates 4 dimensions:**

| Dimension | What to check |
|-----------|---------------|
| **Accessibility** | ARIA labels, color contrast ratio (≥4.5:1 text, ≥3:1 UI), keyboard focus order, missing `alt`, interactive elements without `role` |
| **Responsiveness** | Layout behavior at 375px / 768px / 1024px / 1440px, hardcoded widths, overflow issues, tap target sizes (≥44px) |
| **Perceived Performance** | LCP candidates, GSAP animation jank risk, missing `will-change` or `transform` hints, blocking 3D scene, missing loading states |
| **Visual Consistency** | Spacing deviations from design tokens, font-family not using `--font-*` vars, colors not using `--color-*` vars, inconsistent border-radius, hover state gaps |

**Each agent uses the ui-ux-pro-max skill** to cross-reference its findings against the Cyberpunk UI style pattern and the pre-delivery checklist.

**Output:** `docs/ux-audit/<section>.md`

```markdown
# UX Audit — <Section>

## Summary
<2-3 sentence overview>

## Findings

| # | Severity | Dimension | Finding | File:Line | Suggested Fix |
|---|----------|-----------|---------|-----------|---------------|
| 1 | 🔴 Critical | Accessibility | ... | ... | ... |
| 2 | 🟡 Warning | Responsiveness | ... | ... | ... |
| 3 | 🟢 Suggestion | Visual Consistency | ... | ... | ... |
```

**Severity definitions:**
- 🔴 **Critical** — breaks functionality, accessibility (WCAG AA), or makes content unreadable
- 🟡 **Warning** — notable UX degradation that a user would notice
- 🟢 **Suggestion** — polish or improvement, no user-visible harm if left

---

### Consolidation Agent (runs after all 5 complete)

**Reads:** All 5 `docs/ux-audit/<section>.md` files

**Produces:** `docs/ux-audit/REPORT.md`

```markdown
# Portfolio UX Audit — Full Report

## Executive Summary
<paragraph>

## Critical Issues (must fix)
<table of all 🔴 findings across sections>

## Warnings (should fix)
<table of all 🟡 findings>

## Suggestions (nice to have)
<table of all 🟢 findings>

## Coverage
- Sections audited: Hero, About, Experience, Projects, Contact
- Dimensions: Accessibility, Responsiveness, Perceived Performance, Visual Consistency
- Design system reference: ui-ux-pro-max / Cyberpunk UI pattern
```

---

## Output Structure

```
docs/ux-audit/
├── hero.md
├── about.md
├── experience.md
├── projects.md
├── contact.md
└── REPORT.md          ← consolidated executive report
```

---

## Constraints

- **Read-only:** no code changes are made by any audit agent
- **No new tools:** agents use grep/glob/view only (no browser, no Lighthouse)
- **Skill required:** each agent invokes `ui-ux-pro-max` for design system context
- **Source of truth for tokens:** `src/index.css` @theme block

---

## Success Criteria

- All 5 section files produced in `docs/ux-audit/`
- `REPORT.md` exists with at least one finding per section
- Every finding includes File:Line reference and a Suggested Fix
- Severity is assigned to every finding (no unlabeled rows)
