# UX Critical Fixes — Design Document

## Problem Statement

The UX audit surfaced 18 Critical issues across the 5 portfolio sections. They fall into 6 categories:
1. Missing `prefers-reduced-motion` guards (all 5 sections, WCAG 2.3.3)
2. Contrast failure on `--color-text-muted` (4 sections, WCAG AA 4.5:1)
3. GSAP `opacity:0` no-CSS fallback (3 sections)
4. Decorative elements not `aria-hidden` (canvas, dots, lines, section numbers)
5. Non-contextual `aria-label` on project links (Projects)
6. Contact: email not visible + flexDirection overflow at 375px

## Approved Architecture: 2-Phase Sequential+Parallel

### Phase 1 — Global Agent (index.css + animations)

Runs first, alone. Touches only cross-cutting files. Zero risk to component files.

**Files modified:**
- `src/index.css` — token + global CSS rules
- `src/animations/hero.space.animations.js` — GSAP reduced-motion guard

**Fixes:**
| Fix | Critical # | Change |
|-----|-----------|--------|
| Lighten `--color-text-muted` | #4, #7 | `#64748b` → `#7b91a8` in `@theme` block |
| Global `a:focus-visible` rule | #1 | `a:focus-visible { outline: 2px solid var(--color-accent-cyan); outline-offset: 4px; }` |
| CSS reduced-motion safety net | #3, #8, #11, #15, #18 | `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; } }` |
| GSAP matchMedia in hero animation | #3 | Wrap timeline in `gsap.matchMedia()`, snap to final state when reduced-motion preferred |

**Verification:** `npx vitest run` — must stay 34/34.

---

### Phase 2 — 5 Parallel Section Agents

Run simultaneously after Phase 1 completes. Each agent touches ONLY its own component file (+ animation files scoped to that section). Each agent invokes the `ui-ux-pro-max` skill.

#### Hero Agent
**Files:** `src/components/Hero.jsx`
**Fixes:**
- `<Canvas aria-hidden="true">` (Critical #2)
- Scroll indicator `<div aria-hidden="true">` (Warning #1)
- Opacity fallback: add `.hero-char, .hero-fade { opacity: 1; }` CSS class, apply JS class pattern (Critical #5)
- `h-screen` → `min-h-screen h-[100dvh]` for iOS Safari (Warning #3)

#### About Agent
**Files:** `src/components/About/About.jsx`
**Fixes:**
- `<span aria-hidden="true">01.</span>` (Critical #6)
- `<section aria-labelledby="about-heading">` + `id="about-heading"` on h2 (Warning #10)
- Tech stack: wrap in `<ul>/<li>` structure (Warning #11)
- Remove duplicate inline padding, use `py-12 md:py-24` (Warning #12)
- Replace `min-h-screen` with `md:min-h-screen` (Warning #13)

#### Experience Agent
**Files:** `src/components/Experience/Experience.jsx`
**Fixes:**
- Timeline dot `aria-hidden="true"` (Critical #9)
- Timeline vertical line `aria-hidden="true"` (Critical #10)
- `gsap.matchMedia()` for scroll animation (Critical #11)
- `<span>` period → `<time>` element (Warning #15)
- `<section aria-labelledby="experience-heading">` (Warning #16)
- `"02."` span `aria-hidden="true"` (same pattern as About)
- Mobile: `gsap.matchMedia()` x-offset only on md+ (Warning #17)

#### Projects Agent
**Files:** `src/components/Projects/Projects.jsx`
**Fixes:**
- `aria-label={`GitHub repository for ${project.title}`}` (Critical #12)
- `aria-label={`Live demo for ${project.title}`}` (Critical #13)
- CSS opacity fallback for `.project-card { opacity: 1; }` — GSAP overrides at runtime (Critical #14)
- `gsap.matchMedia()` for scroll entrance + tilt (Critical #15)
- `"03."` span `aria-hidden="true"`
- `cursor: 'pointer'` on cards (Warning #24)
- `role="article"` on card divs (Warning #21)

#### Contact Agent
**Files:** `src/components/Contact/Contact.jsx`
**Fixes:**
- Display raw email address as visible text below the link (Critical #16)
- Remove `style={{ flexDirection: 'row' }}` override, use Tailwind responsive classes (Critical #17)
- CSS opacity fallback: `.contact-animate { opacity: 1; }` — GSAP overrides (Critical #18)
- `"04."` span `aria-hidden="true"`
- `gsap.matchMedia()` for scroll animation

---

## Constraints

- Each phase-2 agent must NOT touch `index.css` (Phase 1 owns it)
- All 34 existing tests must pass after each phase
- No new test files required (fixes are structural/semantic, not logic changes)
- Each agent invokes `ui-ux-pro-max` skill for design system context
- Commit each phase separately for clean git history

## Success Criteria

- All 18 Critical issues resolved
- `npx vitest run` → 34/34 after Phase 1
- `npx vitest run` → 34/34 after Phase 2
- `npm run build` succeeds
- All commits on master
