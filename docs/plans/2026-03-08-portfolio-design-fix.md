# Portfolio Design Fix — Post-Incident Plan

**Date:** 2026-03-08  
**Status:** Approved  
**Trigger:** Visual regression — all Tailwind utility classes failing, components rendering as unstyled plain text

---

## Problem Statement

The portfolio deployed with a complete CSS failure. Screenshots from `incidents/` show:

1. **Hero section** — Renders as empty black void (~100vh). Three.js canvas loads but hero text content (name, tagline, CTA) is invisible.
2. **Navbar** — Plain text list in top-left corner, no fixed position, no glass-morphism, no horizontal layout.
3. **Experience & Projects** — All content as unstyled plain text. No cards, no grid, no timeline.
4. **Tech tags** — Concatenated without spacing: `"ReactNode.jsPostgreSQL"`.
5. **Icons** — Unicode symbols (⌥ ◈ ◉) rendering as "O" or broken characters.
6. **Contact** — Social links smashed together, no button styling.

**Root Cause:** Tailwind CSS v4 `@theme` syntax requires a proper PostCSS pipeline that was not configured. Without `postcss.config.js`, Tailwind v4 directives are ignored and no utility classes are injected.

---

## Approach

**Infrastructure-first + Parallel component agents**, each using the `ux-ui` skill.

- Bloque 1 (infrastructure) must complete before any component work begins.
- Bloque 2 tasks are independent and can run as parallel agents.
- Bloque 3 polish runs after all components are verified.

---

## Design Tokens (preserve as-is)

```css
--color-bg-primary: #050508
--color-bg-secondary: #0d0d14
--color-accent-cyan: #00f5ff
--color-accent-purple: #8b5cf6
--color-text-primary: #e2e8f0
--color-text-muted: #64748b
```

Fonts: Inter (body), Space Grotesk (display), JetBrains Mono (mono)

---

## Subtasks

### BLOQUE 1 — Infrastructure (prerequisite, sequential)

#### 1.1 — Fix PostCSS + Tailwind v4 Pipeline
- **File:** `postcss.config.js` (create), `vite.config.js` (verify)
- **Action:** Create `postcss.config.js` exporting `tailwindcss` and `autoprefixer`. Confirm `@tailwindcss/vite` or PostCSS plugin is wired correctly. Verify `@import "tailwindcss"` in `index.css` resolves.
- **Success:** All Tailwind utility classes (`flex`, `grid`, `bg-*`, `text-*`, `p-*`, etc.) apply in dev server.

#### 1.2 — Verify Google Fonts Loading
- **File:** `index.html`
- **Action:** Confirm `<link>` preconnect and font stylesheet for Inter, Space Grotesk, JetBrains Mono are present and correct.
- **Success:** Fonts load in browser Network tab without 404s.

#### 1.3 — Smoke Test Build
- **Action:** Run `npm run dev` and `npm run build`. Zero CSS-related errors or warnings.
- **Success:** Build completes, dev server shows styled output.

---

### BLOQUE 2 — Visual Components (parallel, all use `ux-ui` skill)

#### 2.1 — Navbar
- **File:** `src/components/Navbar/Navbar.jsx`
- **Requirements:**
  - Fixed top (`fixed top-0`), full width, z-50
  - Glass-morphism: `backdrop-blur-md`, semi-transparent dark bg (`bg-bg-primary/80`)
  - Bottom border that appears on scroll (`border-b border-accent-cyan/20`)
  - Horizontal flex layout: logo left, nav links right
  - Logo: `font-display`, cyan color
  - Nav links: muted text → cyan on active section (IntersectionObserver already exists)
  - Smooth scroll on click (already implemented, verify works)
- **Success:** Navbar is visible, fixed, styled, and highlights active section while scrolling.

#### 2.2 — Hero
- **File:** `src/components/Hero.jsx`, `src/animations/hero.animations.js`
- **Requirements:**
  - Full viewport height (`h-screen`), relative positioning
  - Three.js Canvas as absolute background (z-0), 100% width and height
  - Hero content (name, tagline, CTA) layered on top (z-10, relative)
  - Name: large display font, white or text-primary
  - Tagline: smaller, text-muted
  - CTA button: cyan border, transparent bg, hover glow
  - Scroll indicator arrow: centered bottom, pulsing animation
  - GSAP entrance animations fire correctly on mount
- **Success:** Hero shows name/tagline/CTA over Three.js stars background.

#### 2.3 — About
- **File:** `src/components/About/About.jsx`
- **Requirements:**
  - Section padding: `py-24 px-6`, max-width container centered
  - Section number + heading ("01. About") with display font
  - Two-column grid on desktop: bio text left (~60%), tech stack right (~40%)
  - Tech stack badges: pill shape, colored left border, semi-transparent bg matching tech color
  - GSAP scroll-triggered fade-in from bottom
- **Success:** About renders 2-column with styled tech badges.

#### 2.4 — Experience
- **File:** `src/components/Experience/Experience.jsx`
- **Requirements:**
  - Section padding: `py-24 px-6`, max-width container
  - Alternating cards: even cards on left, odd on right, with center vertical timeline line
  - Cards: glass morphism (`bg-bg-secondary/60 backdrop-blur-sm`), cyan border (`border border-accent-cyan/20`), `rounded-xl`, shadow
  - Card header: Role (large, text-primary), Company (cyan), Period (muted, mono font)
  - Achievement list: `▸` bullet in cyan, items in text-muted
  - Tech tags: individual pill badges in purple (`text-accent-purple`, `border-accent-purple/30 bg-accent-purple/10`)
  - Vertical timeline line: `border-l-2 border-accent-cyan/30`, centered
  - GSAP slide-in from alternating sides
- **Success:** Experience shows alternating timeline cards with glass styling.

#### 2.5 — Projects
- **File:** `src/components/Projects/Projects.jsx`
- **Requirements:**
  - Section padding: `py-24 px-6`, max-width container
  - Responsive grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`, gap-6
  - Card: glass morphism, cyan border, rounded-xl, `cursor-pointer`
  - Card 3D hover: `perspective-1000`, `rotateX/Y` transform via GSAP (already coded, verify works)
  - Card hover: border glows brighter (`border-accent-cyan/60`), subtle box-shadow cyan
  - **Fix broken icons:** Replace Unicode `⊙` symbol with inline SVG folder icon
  - GitHub/Live links: small icon buttons top-right of card, SVG icons for GitHub and external link
  - Tech tags: pills in purple accent (same as Experience)
  - Featured badge: highlighted differently (larger card or accent top border)
- **Success:** Project grid renders with interactive 3D cards and correct icons.

#### 2.6 — Contact
- **File:** `src/components/Contact/Contact.jsx`
- **Requirements:**
  - Full-width section with radial gradient bg (cyan/purple blend, pulsing)
  - Centered content: heading, subtitle, social buttons
  - Social buttons: `GitHub`, `LinkedIn`, `Email` as individual styled buttons
  - Each button: border (`border-accent-cyan/40`), transparent bg, hover → cyan glow
  - **Fix icons:** Use SVG icons (GitHub logo, LinkedIn logo, envelope) instead of Unicode
  - Footer text: "Diseñado y desarrollado con React + Three.js" in text-muted, mono font
  - GSAP staggered fade-in
- **Success:** Contact shows centered CTA with styled social buttons and working icons.

---

### BLOQUE 3 — Global Polish (after all components verified)

#### 3.1 — Global Typography Hierarchy
- **File:** `src/index.css`
- **Action:** Define base font-size scale, heading weights, line-heights. Ensure `font-display` and `font-mono` apply to correct elements globally.
- **Success:** Visual hierarchy is clear across all sections.

#### 3.2 — Global Spacing + Container
- **File:** `src/App.jsx`, `src/index.css`
- **Action:** Wrap all sections in a consistent max-width container (`max-w-6xl mx-auto`). Verify section padding is uniform (`py-24`).
- **Success:** All content is centered with consistent margins.

#### 3.3 — Scroll Navigation Polish
- **File:** `src/components/Navbar/Navbar.jsx`
- **Action:** Verify IntersectionObserver correctly tracks active section. Ensure smooth scroll works for all anchor links. Add subtle transition to active state change.
- **Success:** Navbar active state tracks scroll position accurately.

---

## Dependency Graph

```
1.1 (PostCSS) ─┐
1.2 (Fonts)   ─┤→ 1.3 (Smoke Test) ─┐
               │                     ├→ 2.1 (Navbar)     ─┐
               │                     ├→ 2.2 (Hero)       ─┤
               │                     ├→ 2.3 (About)      ─┤→ 3.1 → 3.2 → 3.3
               │                     ├→ 2.4 (Experience) ─┤
               │                     ├→ 2.5 (Projects)   ─┤
               │                     └→ 2.6 (Contact)    ─┘
```

---

## Agent Instructions Template

Each Bloque 2 agent should be prompted with:
1. The specific component file path and requirements from this doc
2. Instruction to use the `ux-ui` skill before implementing
3. The design tokens from `index.css` as context
4. Instruction to NOT break existing test files
5. Instruction to run `npm run dev` to verify visually before completing
