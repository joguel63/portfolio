# UX Audit Agent Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Run 5 parallel read-only UX audit agents (one per portfolio section) using the ui-ux-pro-max skill, then consolidate findings into a prioritized report in `docs/ux-audit/`.

**Architecture:** 5 `general-purpose` sub-agents dispatched in parallel via the `task` tool, each scoped to one component. Each agent invokes the `ui-ux-pro-max` skill and evaluates 4 UX dimensions (Accessibility, Responsiveness, Perceived Performance, Visual Consistency). A 6th consolidation agent reads all outputs and writes the executive report.

**Tech Stack:** React 19, GSAP 3, Three.js / R3F, Tailwind CSS v4, CSS custom properties (design tokens in `src/index.css`)

---

## Severity Reference (used in every agent prompt)

| Symbol | Label | Meaning |
|--------|-------|---------|
| 🔴 | Critical | Breaks functionality, WCAG AA accessibility, or makes content unreadable |
| 🟡 | Warning | Notable UX degradation a user would notice |
| 🟢 | Suggestion | Polish / improvement, no user harm if left |

---

## Task 1: Audit — Hero Section

**Files:**
- Read: `src/components/Hero.jsx`
- Read: `src/index.css` (design tokens)
- Read: `src/data/profile.js`
- Write: `docs/ux-audit/hero.md`

**Agent type:** `general-purpose`

**Agent prompt:**
```
You are a UX auditor for a portfolio website. Your job is READ-ONLY — do NOT modify any code.

Invoke the ui-ux-pro-max skill FIRST for design system context (Cyberpunk UI / Portfolio pattern).

Then read these files:
- src/components/Hero.jsx
- src/index.css (design tokens: --color-*, --font-*)
- src/data/profile.js

Evaluate the Hero section across 4 dimensions:

1. ACCESSIBILITY
   - Do all interactive elements (the CTA button/link) have visible focus styles?
   - Is "Hola, soy" (the greeting p tag) read correctly by screen readers? Is there a proper h1 hierarchy?
   - Does the canvas (Three.js starfield) have aria-hidden="true" since it's decorative?
   - Are color contrasts acceptable? --color-text-muted (#64748b) on --color-bg-primary (#050508): calculate contrast ratio
   - Does the scroll indicator have accessible text or aria-label?
   - Is "Ver proyectos →" meaningful as a link label for screen readers?

2. RESPONSIVENESS
   - Are font sizes fluid? (clamp() used?)
   - Does `h-screen` work reliably on mobile browsers with dynamic viewport bars (iOS Safari)?
   - Is the canvas container (absolute inset-0) safe on all viewport sizes?
   - Is the text content at 375px likely to overflow or be illegible?
   - Is the CTA button tap target ≥44px height?

3. PERCEIVED PERFORMANCE
   - The Three.js Canvas loads immediately — is there a loading fallback if WebGL is unavailable?
   - Does `count={5000}` stars risk GPU performance on low-end mobile?
   - Is there a `prefers-reduced-motion` check for the GSAP entrance animation?
   - Does GSAP animate `filter: blur()` which is expensive on some browsers?

4. VISUAL CONSISTENCY
   - Are all colors using CSS vars (--color-*) or are any hardcoded hex values present?
   - Are fonts using --font-display / --font-mono / --font-sans consistently?
   - Is the spacing (mb-4, mb-6, mb-10) consistent with a clear visual hierarchy?
   - Does the scroll indicator use `animate-pulse` (Tailwind) while everything else uses GSAP — is this consistent?

Design system reference (from ui-ux-pro-max):
- Pattern: Portfolio Grid / Cyberpunk UI
- Pre-delivery checklist: cursor-pointer on clickables, hover states 150-300ms, prefers-reduced-motion, focus states visible, tap targets ≥44px

Write your findings to docs/ux-audit/hero.md using this exact format:

# UX Audit — Hero

## Summary
<2-3 sentences>

## Findings

| # | Severity | Dimension | Finding | File:Line | Suggested Fix |
|---|----------|-----------|---------|-----------|---------------|

Severity: 🔴 Critical / 🟡 Warning / 🟢 Suggestion
Every row MUST have all 6 columns filled.
```

---

## Task 2: Audit — About Section

**Files:**
- Read: `src/components/About/About.jsx`
- Read: `src/index.css`
- Read: `src/data/profile.js`
- Write: `docs/ux-audit/about.md`

**Agent type:** `general-purpose`

**Agent prompt:**
```
You are a UX auditor for a portfolio website. Your job is READ-ONLY — do NOT modify any code.

Invoke the ui-ux-pro-max skill FIRST for design system context (Cyberpunk UI / Portfolio pattern).

Then read these files:
- src/components/About/About.jsx
- src/index.css (design tokens: --color-*, --font-*)
- src/data/profile.js

Evaluate the About section across 4 dimensions:

1. ACCESSIBILITY
   - Does the section have a proper heading hierarchy? (h2 with section number prefix — is "01." read by screen readers as intended?)
   - Are the tech stack tags (span elements) meaningful for screen readers or just decorative?
   - Is there enough contrast for muted text used in the bio?
   - Do GSAP scroll animations set elements to opacity:0 initially — if JS fails, does content stay invisible?

2. RESPONSIVENESS
   - The 2-column layout (bio + tech stack) — does it collapse to 1 column at mobile (375px)?
   - Are tech stack pill tags wrapping correctly on small screens?
   - Is font size fluid with clamp()?
   - Does the section divider (the decorative line) behave correctly on mobile?

3. PERCEIVED PERFORMANCE
   - ScrollTrigger — does the animation fire too late or too early (start: 'top 75%')? Is content invisible for too long?
   - Is `prefers-reduced-motion` respected for the GSAP scroll animations?
   - Are the stagger animations too slow for dense content?

4. VISUAL CONSISTENCY
   - Are spacing values (py-24, mb-16) consistent with other sections?
   - Are tech tag colors using CSS vars or hardcoded rgba?
   - Is the section number ("01.") style consistent with other sections?

Design system reference (from ui-ux-pro-max):
- Pattern: Portfolio Grid / Cyberpunk UI
- Pre-delivery checklist: prefers-reduced-motion, focus states, tap targets ≥44px

Write your findings to docs/ux-audit/about.md using this exact format:

# UX Audit — About

## Summary
<2-3 sentences>

## Findings

| # | Severity | Dimension | Finding | File:Line | Suggested Fix |
|---|----------|-----------|---------|-----------|---------------|

Severity: 🔴 Critical / 🟡 Warning / 🟢 Suggestion
Every row MUST have all 6 columns filled.
```

---

## Task 3: Audit — Experience Section

**Files:**
- Read: `src/components/Experience/Experience.jsx`
- Read: `src/index.css`
- Read: `src/data/experience.js`
- Write: `docs/ux-audit/experience.md`

**Agent type:** `general-purpose`

**Agent prompt:**
```
You are a UX auditor for a portfolio website. Your job is READ-ONLY — do NOT modify any code.

Invoke the ui-ux-pro-max skill FIRST for design system context (Cyberpunk UI / Portfolio pattern).

Then read these files:
- src/components/Experience/Experience.jsx
- src/index.css (design tokens: --color-*, --font-*)
- src/data/experience.js

Evaluate the Experience section across 4 dimensions:

1. ACCESSIBILITY
   - Timeline items with left/right alternating layout — is reading order logical for screen readers?
   - Are achievement bullet points in a proper <ul>/<li> structure or custom elements?
   - Is the timeline dot (center connector) decorative — does it have aria-hidden?
   - Is date/period text contrast sufficient? (likely --color-text-muted on dark bg)
   - Are tech tags meaningful or just decorative?

2. RESPONSIVENESS
   - Alternating left/right layout — does it collapse to single column correctly on mobile?
   - Do experience cards have a minimum touch target for any interactive elements?
   - Is the timeline vertical line hidden/adapted on mobile?
   - Are long company names or role titles likely to overflow at 375px?

3. PERCEIVED PERFORMANCE
   - ScrollTrigger animations — same questions as About (too early/late? prefers-reduced-motion?)
   - Are there too many staggered elements causing a long wait before content is visible?
   - Does the section load feel heavier due to multiple cards?

4. VISUAL CONSISTENCY
   - Are card background colors using --color-bg-secondary or hardcoded?
   - Is spacing between experience items consistent?
   - Is the section header style (number + title + divider) identical to About and Projects?
   - Are tech tags styled identically to the Projects section tags?

Design system reference (from ui-ux-pro-max):
- Pattern: Portfolio Grid / Cyberpunk UI
- Pre-delivery checklist: prefers-reduced-motion, focus states, tap targets ≥44px, responsive 375px+

Write your findings to docs/ux-audit/experience.md using this exact format:

# UX Audit — Experience

## Summary
<2-3 sentences>

## Findings

| # | Severity | Dimension | Finding | File:Line | Suggested Fix |
|---|----------|-----------|---------|-----------|---------------|

Severity: 🔴 Critical / 🟡 Warning / 🟢 Suggestion
Every row MUST have all 6 columns filled.
```

---

## Task 4: Audit — Projects Section

**Files:**
- Read: `src/components/Projects/Projects.jsx`
- Read: `src/index.css`
- Read: `src/data/projects.js`
- Write: `docs/ux-audit/projects.md`

**Agent type:** `general-purpose`

**Agent prompt:**
```
You are a UX auditor for a portfolio website. Your job is READ-ONLY — do NOT modify any code.

Invoke the ui-ux-pro-max skill FIRST for design system context (Cyberpunk UI / Portfolio pattern).

Then read these files:
- src/components/Projects/Projects.jsx
- src/index.css (design tokens: --color-*, --font-*)
- src/data/projects.js

Evaluate the Projects section across 4 dimensions:

1. ACCESSIBILITY
   - GitHub and Live links: do they have meaningful aria-label attributes?
   - The folder SVG icon — does it have aria-hidden="true"?
   - Are card hover effects keyboard-accessible? Can a keyboard user trigger the tilt effect?
   - Is the "GitHub ↗" and "Live ↗" text alone sufficient as link labels for screen readers?
   - Do project cards have any role or landmark to help screen readers navigate?

2. RESPONSIVENESS
   - Grid with auto-fill minmax(300px, 1fr) — does it produce 1 column at 375px?
   - Are project titles and descriptions likely to overflow at mobile widths?
   - Does the 3D tilt effect (GSAP rotateX/Y) cause any layout shift on mobile?
   - Are the tech tag pills wrapping correctly on narrow cards?

3. PERCEIVED PERFORMANCE
   - The GSAP 3D tilt fires on every mousemove — is there a throttle or requestAnimationFrame guard?
   - ScrollTrigger entrance animation — does opacity:0 initial state risk content being invisible if JS fails?
   - Is `prefers-reduced-motion` respected for both the tilt and scroll animations?
   - Does the CSS `transformStyle: 'preserve-3d'` combined with GSAP create compositing layer issues?

4. VISUAL CONSISTENCY
   - Card border and shadow use rgba values — are they consistent with other card components?
   - Are tech tags styled the same as Experience section tags?
   - Is the hover border color (rgba(0,245,255,0.5)) a reasonable variant of --color-accent-cyan?
   - Is the card background (rgba(13,13,20,0.8)) consistent with --color-bg-secondary (#0d0d14)?

Design system reference (from ui-ux-pro-max):
- Pattern: Portfolio Grid / Cyberpunk UI
- Pre-delivery checklist: cursor-pointer on clickables, hover states 150-300ms, prefers-reduced-motion, keyboard accessible

Write your findings to docs/ux-audit/projects.md using this exact format:

# UX Audit — Projects

## Summary
<2-3 sentences>

## Findings

| # | Severity | Dimension | Finding | File:Line | Suggested Fix |
|---|----------|-----------|---------|-----------|---------------|

Severity: 🔴 Critical / 🟡 Warning / 🟢 Suggestion
Every row MUST have all 6 columns filled.
```

---

## Task 5: Audit — Contact Section

**Files:**
- Read: `src/components/Contact/Contact.jsx`
- Read: `src/index.css`
- Read: `src/data/profile.js`
- Write: `docs/ux-audit/contact.md`

**Agent type:** `general-purpose`

**Agent prompt:**
```
You are a UX auditor for a portfolio website. Your job is READ-ONLY — do NOT modify any code.

Invoke the ui-ux-pro-max skill FIRST for design system context (Cyberpunk UI / Portfolio pattern).

Then read these files:
- src/components/Contact/Contact.jsx
- src/index.css (design tokens: --color-*, --font-*)
- src/data/profile.js

Evaluate the Contact section across 4 dimensions:

1. ACCESSIBILITY
   - Do all social links (GitHub, LinkedIn, Email) have aria-label attributes?
   - Are inline SVG icons aria-hidden="true"?
   - Is the email link using mailto: — is there a fallback for users without a mail client?
   - Is the heading hierarchy correct (h2 inside section)?
   - Are hover color changes sufficient contrast? (--color-text-muted to --color-accent-cyan)
   - Is the section reachable by keyboard and tab order logical?

2. RESPONSIVENESS
   - Are social link flex items wrapping correctly at mobile width?
   - Are SVG icons sized with accessible tap targets (≥44px)?
   - Is the footer-like text legible at all breakpoints?
   - Does the section feel complete as a page-ending section on mobile?

3. PERCEIVED PERFORMANCE
   - Are there GSAP scroll animations? If so, do they respect prefers-reduced-motion?
   - Is the section lightweight enough to render without impact?
   - Is there a visible "end of page" signal for users (any bottom padding/indicator)?

4. VISUAL CONSISTENCY
   - Does the section background match --color-bg-primary (matching Hero) for a bookend feel?
   - Is the "04." section number style consistent with other sections?
   - Is icon sizing consistent across GitHub, LinkedIn, Email?
   - Are hover transitions 150-300ms as per the Cyberpunk pre-delivery checklist?

Design system reference (from ui-ux-pro-max):
- Pattern: Portfolio Grid / Cyberpunk UI
- Pre-delivery checklist: cursor-pointer on clickables, hover states 150-300ms, prefers-reduced-motion, accessible link labels

Write your findings to docs/ux-audit/contact.md using this exact format:

# UX Audit — Contact

## Summary
<2-3 sentences>

## Findings

| # | Severity | Dimension | Finding | File:Line | Suggested Fix |
|---|----------|-----------|---------|-----------|---------------|

Severity: 🔴 Critical / 🟡 Warning / 🟢 Suggestion
Every row MUST have all 6 columns filled.
```

---

## Task 6: Consolidation Agent

**Depends on:** Tasks 1–5 all complete (all 5 section md files exist)

**Files:**
- Read: `docs/ux-audit/hero.md`
- Read: `docs/ux-audit/about.md`
- Read: `docs/ux-audit/experience.md`
- Read: `docs/ux-audit/projects.md`
- Read: `docs/ux-audit/contact.md`
- Write: `docs/ux-audit/REPORT.md`

**Agent type:** `general-purpose`

**Agent prompt:**
```
You are a UX report consolidator. Read these 5 audit files completely:
- docs/ux-audit/hero.md
- docs/ux-audit/about.md
- docs/ux-audit/experience.md
- docs/ux-audit/projects.md
- docs/ux-audit/contact.md

Then write docs/ux-audit/REPORT.md using EXACTLY this format:

# Portfolio UX Audit — Full Report

## Executive Summary
<3-4 sentence paragraph covering: total findings count, most critical issues, overall UX health, top recommendation>

## 🔴 Critical Issues (fix immediately)

| Section | Finding | File:Line | Suggested Fix |
|---------|---------|-----------|---------------|
<all Critical rows from all sections>

## 🟡 Warnings (should fix)

| Section | Finding | File:Line | Suggested Fix |
|---------|---------|-----------|---------------|
<all Warning rows from all sections>

## 🟢 Suggestions (nice to have)

| Section | Finding | File:Line | Suggested Fix |
|---------|---------|-----------|---------------|
<all Suggestion rows from all sections>

## Coverage

| Section | Critical | Warning | Suggestion | Total |
|---------|----------|---------|------------|-------|
| Hero | N | N | N | N |
| About | N | N | N | N |
| Experience | N | N | N | N |
| Projects | N | N | N | N |
| Contact | N | N | N | N |
| **Total** | **N** | **N** | **N** | **N** |

## Audit Scope
- Sections: Hero, About, Experience, Projects, Contact
- Dimensions: Accessibility, Responsiveness, Perceived Performance, Visual Consistency
- Design system: Cyberpunk UI / Portfolio Grid (ui-ux-pro-max)
- Date: 2026-03-08
```

---

## Task 7: Commit Audit Results

```bash
git add docs/ux-audit/
git commit -m "docs(ux-audit): add full UX audit report for all 5 sections

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Execution Order

```
Tasks 1-5 → run in PARALLEL (dispatched simultaneously via background mode)
Task 6    → run AFTER all 5 complete (consolidation)
Task 7    → commit after Task 6 completes
```

Tasks 1–5 have NO dependencies on each other and MUST be dispatched simultaneously.
