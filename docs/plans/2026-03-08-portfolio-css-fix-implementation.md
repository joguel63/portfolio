# Portfolio CSS Fix — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restore full visual styling to the portfolio by wiring Tailwind v4 correctly, fixing broken icons, and polishing each component to match the design spec.

**Architecture:** Infrastructure-first (Bloque 1 sequential) → Component polish in parallel (Bloque 2) → Global polish (Bloque 3 sequential). Each Bloque 2 agent must invoke the `ux-ui` skill before touching component code.

**Tech Stack:** React 19, Vite 7, Tailwind CSS v4.2.1 (`@tailwindcss/vite`), GSAP 3 + ScrollTrigger, Three.js + React Three Fiber, CSS custom properties (`@theme` block in `index.css`)

**Root Cause Summary:** `vite.config.js` only registers `@vitejs/plugin-react`. Tailwind v4 requires `@tailwindcss/vite` plugin (or `@tailwindcss/postcss`). Without it, `@import "tailwindcss"` in `index.css` is ignored, and all utility classes (`flex`, `grid`, `gap-*`, `font-mono`, etc.) produce no output.

---

## Design Tokens (never change these)

```
--color-bg-primary:    #050508
--color-bg-secondary:  #0d0d14
--color-accent-cyan:   #00f5ff
--color-accent-purple: #8b5cf6
--color-text-primary:  #e2e8f0
--color-text-muted:    #64748b
Fonts: Inter (body), Space Grotesk (display/font-display), JetBrains Mono (mono/font-mono)
```

---

## BLOQUE 1 — Infrastructure (run sequentially, prerequisite for everything else)

---

### Task 1.1 — Install and wire Tailwind v4 Vite plugin

**Files:**
- Modify: `vite.config.js`
- Modify: `package.json` (via npm install)

**Step 1: Install `@tailwindcss/vite`**

```bash
cd "C:\Users\migue\Documents\clases\IA programming\copilot sdk\portfolio"
npm install -D @tailwindcss/vite
```

Expected output: `added 1 package` (or similar), no errors.

**Step 2: Update `vite.config.js`**

Replace the ENTIRE content of `vite.config.js` with:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/portfolio/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.js'],
  },
})
```

**Step 3: Verify `src/index.css` first line is correct**

It must be exactly:
```css
@import "tailwindcss";
```
(Do NOT add `@tailwind base; @tailwind components; @tailwind utilities;` — that's v3 syntax)

**Step 4: Run dev server to verify Tailwind is active**

```bash
npm run dev
```

Open browser. Check that the Navbar is now horizontal (not a vertical list). If the navbar shows items side by side, Tailwind is working.

**Step 5: Commit**

```bash
git add vite.config.js package.json package-lock.json
git commit -m "fix: wire Tailwind CSS v4 Vite plugin to restore all utility classes

- Install @tailwindcss/vite
- Register tailwindcss() plugin in vite.config.js
- Root cause of full visual regression: no Tailwind pipeline

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 1.2 — Verify Google Fonts loading in index.html

**Files:**
- Read + possibly modify: `index.html`

**Step 1: Check index.html `<head>` for font links**

Open `index.html`. It must contain ALL THREE of the following `<link>` tags:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

**Step 2: If ANY font link is missing, replace the `<head>` section**

The complete `<head>` should look like:

```html
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Portfolio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
</head>
```

**Step 3: In the dev server, open DevTools → Network tab → filter "fonts.googleapis.com"**

All 3 fonts should load with status 200. If they 404, the URL is wrong.

**Step 4: Commit only if changes were needed**

```bash
git add index.html
git commit -m "fix: ensure all three Google Fonts load correctly in index.html

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 1.3 — Smoke test: build passes, dev server renders styled output

**Step 1: Run the test suite to establish baseline**

```bash
npm run test
```

Note which tests pass/fail. Do NOT fix pre-existing failures — just document them.

**Step 2: Run build**

```bash
npm run build
```

Expected: `✓ built in Xs` with zero errors. If CSS-related errors appear, go back to Task 1.1.

**Step 3: Run linter**

```bash
npm run lint
```

Expected: zero errors (pre-existing warnings are OK).

**Step 4: Visual smoke test in browser**

Run `npm run dev`. Visit `http://localhost:5173/portfolio/` (or whatever port Vite uses). Confirm:
- [ ] Navbar is horizontal (not vertical)
- [ ] Hero section has visible content (name, tagline)
- [ ] Dark background is visible
- [ ] No giant unstyled text dump

**Step 5: Commit smoke test confirmation**

```bash
git commit --allow-empty -m "chore: confirm Tailwind v4 pipeline working after Task 1.1-1.2

All utility classes applying. Dev server shows styled output.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## BLOQUE 2 — Component Polish (run in parallel after Bloque 1 complete)

> ⚠️ REQUIRED: Every agent in this block MUST invoke the `ux-ui` skill BEFORE making any code changes.
>
> Context for all agents: design tokens are in `src/index.css` `@theme` block. Components use a mix of Tailwind utility classes + inline `style` props with CSS variables. Do NOT switch to pure Tailwind or pure inline — preserve the hybrid approach.

---

### Task 2.1 — Navbar: verify layout + polish active states

> **USE `ux-ui` SKILL FIRST before any code changes.**

**Files:**
- Modify: `src/components/Navbar/Navbar.jsx`

**Context:** The Navbar code is structurally complete. After Task 1.1, `flex`, `items-center`, `justify-between`, `px-8`, `py-4`, `fixed`, `top-0`, `z-50` should work. This task is to verify and polish.

**Step 1: With dev server running, scroll the page and visually verify**

Checklist:
- [ ] Navbar is fixed to top (doesn't scroll away)
- [ ] Logo "Tu Nombre" appears in cyan on the left
- [ ] Four nav links appear on the right, horizontally
- [ ] On scroll past 50px: backdrop-blur glass effect appears, subtle bottom border shows
- [ ] Active section link turns cyan as you scroll
- [ ] Clicking a nav link smooth-scrolls to that section

**Step 2: If active section does not highlight — fix the observer threshold**

The current threshold is `0.5` (50% visible). For the Hero section which is 100vh, this works. But for shorter sections it might not fire. If active state doesn't track properly:

Change in `Navbar.jsx` line 28-30:
```javascript
// FROM:
{ threshold: 0.5 }

// TO:
{ threshold: 0.3, rootMargin: '-10% 0px -60% 0px' }
```

**Step 3: Add hover state to nav links (currently missing)**

In `Navbar.jsx`, the nav link anchor has `transition-colors duration-200` but no hover style defined in JSX. Add `onMouseEnter`/`onMouseLeave` handlers:

Find the anchor element for nav links (around line 62-75) and replace with:

```jsx
<a
  href={href}
  onClick={(e) => handleNavClick(e, href)}
  className="font-medium text-sm tracking-wide transition-colors duration-200"
  style={{
    color: active === href.slice(1)
      ? 'var(--color-accent-cyan)'
      : 'var(--color-text-muted)',
    fontFamily: 'var(--font-mono)',
  }}
  onMouseEnter={(e) => {
    if (active !== href.slice(1)) {
      e.currentTarget.style.color = 'var(--color-text-primary)'
    }
  }}
  onMouseLeave={(e) => {
    if (active !== href.slice(1)) {
      e.currentTarget.style.color = 'var(--color-text-muted)'
    }
  }}
>
  {label}
</a>
```

**Step 4: Commit**

```bash
git add src/components/Navbar/Navbar.jsx
git commit -m "fix(navbar): polish active states and hover transitions

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 2.2 — Hero: verify Three.js canvas + GSAP entrance

> **USE `ux-ui` SKILL FIRST before any code changes.**

**Files:**
- Possibly modify: `src/components/Hero.jsx`
- Possibly modify: `src/animations/hero.space.animations.js`

**Context:** Hero uses `h-screen relative w-full overflow-hidden flex items-center justify-center`. Canvas is `absolute inset-0`. Content is `relative z-10 text-center`. After Task 1.1 these classes should work.

**Step 1: Visual verification checklist**

With dev server running, scroll to top:
- [ ] Hero fills 100% of viewport height
- [ ] Stars (Three.js) are visible rotating in background
- [ ] "Hola, soy" text (cyan, mono, small) is visible
- [ ] Large name text is visible (Space Grotesk, white)
- [ ] Purple subtitle (role/title) is visible
- [ ] Muted tagline text is visible
- [ ] "Ver proyectos →" cyan border button is visible
- [ ] Scroll indicator (line + "scroll" text) is at the bottom
- [ ] GSAP entrance animation plays (elements fade in on load)

**Step 2: Check `hero.space.animations.js` — verify GSAP targets exist**

Read `src/animations/hero.space.animations.js`. It should target:
- The Canvas element (for fade-in)
- `.hero-char` elements (character entrance)
- `.hero-fade` elements (other content)

If the file uses `gsap.from('.hero-char', {...})` with a blur effect, verify that `filter: 'blur(8px)'` is being animated to `filter: 'blur(0px)'`. GSAP can animate CSS filter. If it fails silently, add `willChange: 'opacity, filter'` to the hero chars via CSS.

**Step 3: If Canvas does not fill the hero container**

The `Canvas` component from `@react-three/fiber` renders a `<canvas>`. If it doesn't fill, add `style` prop:

In `Hero.jsx` around line 73, find the `<Canvas>` component and ensure:
```jsx
<Canvas
  camera={{ position: [0, 0, 1], fov: 75 }}
  style={{ background: 'transparent', width: '100%', height: '100%' }}
>
```

Also ensure the wrapping div has explicit height:
```jsx
<div className="absolute inset-0" style={{ width: '100%', height: '100%' }}>
```

**Step 4: If GSAP entrance doesn't play**

Read `src/animations/hero.space.animations.js` and verify `initSpaceHeroEntrance` returns a GSAP timeline. If initial opacity is not set to 0 before animation, elements flash in without animation. Add:

```javascript
// At the start of initSpaceHeroEntrance, before the timeline:
gsap.set('.hero-char', { opacity: 0 })
gsap.set('.hero-fade', { opacity: 0 })
```

**Step 5: Commit any fixes**

```bash
git add src/components/Hero.jsx src/animations/hero.space.animations.js
git commit -m "fix(hero): ensure Three.js canvas fills viewport and GSAP animations play

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 2.3 — About: verify 2-column layout + tech badge pills

> **USE `ux-ui` SKILL FIRST before any code changes.**

**Files:**
- Possibly modify: `src/components/About/About.jsx`

**Context:** About uses `grid md:grid-cols-2 gap-16` for two columns. Tech badges use inline `style` for colored borders and backgrounds. These are mostly inline styles so they should work even without Tailwind. The `grid` class needs Tailwind.

**Step 1: Visual verification checklist**

- [ ] "01. About" heading with cyan number and divider line
- [ ] Two-column layout: bio text on left, tech stack on right
- [ ] Tech badges are pills: colored border + colored background + colored text
- [ ] GSAP fade-in plays when section scrolls into view
- [ ] Section has dark secondary bg (`#0d0d14`)

**Step 2: If two columns do NOT appear (single column)**

Tailwind's `md:` prefix requires the breakpoint system to work. On a desktop viewport (>768px), `md:grid-cols-2` should activate. If single column persists on desktop after Task 1.1, the issue is screen width — verify the browser window is at least 800px wide.

If still broken, as a fallback add explicit inline style:
```jsx
<div
  className="grid md:grid-cols-2 gap-16"
  style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}
>
```

**Step 3: Verify tech badge pill styling**

Each badge should look like a pill with:
- Colored left border (tech color at 25% opacity)
- Colored text (full tech color)
- Colored background (tech color at 6% opacity)

Current code uses `${color}40` for border and `${color}10` for bg. These are hex opacity suffixes. Verify in browser that badges have color. If hex opacity format doesn't work in all browsers, convert to `rgba()`:

Replace the badge `style` prop:
```jsx
style={{
  borderColor: `${color}40`,
  color: color,
  backgroundColor: `${color}10`,
}}
```
With:
```jsx
style={{
  borderColor: color,
  borderOpacity: '0.25',
  color: color,
  backgroundColor: color,
  // use rgba directly for wider browser support:
}}
```

Actually, hex 8-digit is fine for modern browsers. If it doesn't show, just verify the colors in browser DevTools.

**Step 4: Commit any fixes**

```bash
git add src/components/About/About.jsx
git commit -m "fix(about): verify 2-column grid and tech badge pill styles

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 2.4 — Experience: verify alternating timeline + card styling

> **USE `ux-ui` SKILL FIRST before any code changes.**

**Files:**
- Possibly modify: `src/components/Experience/Experience.jsx`

**Context:** Experience uses alternating `md:flex-row` / `md:flex-row-reverse` with a `w-full md:w-5/12` card and an absolute-positioned center dot. The vertical line is `absolute left-1/2 ... hidden md:block`. Cards use inline styles for glass morphism.

**Step 1: Visual verification checklist**

- [ ] "02. Experience" heading with cyan number and divider line
- [ ] Vertical center timeline line is visible
- [ ] First card appears on the LEFT (even index)
- [ ] Second card appears on the RIGHT (odd index)
- [ ] Each card has: Role (white), Company (cyan), Period (muted mono, right-aligned)
- [ ] Glass morphism: dark semi-transparent bg with cyan border, rounded corners
- [ ] Achievement list with cyan `▸` bullets
- [ ] Tech tags are purple pills with border + bg
- [ ] GSAP slide-in from alternating sides on scroll

**Step 2: If cards don't alternate (both appear on left)**

`md:flex-row-reverse` needs Tailwind's responsive prefix system. On desktop, verify both `md:flex-row` and `md:flex-row-reverse` work. If alternation fails, force it with a conditional style:

```jsx
<div
  className={`experience-card relative flex items-start gap-8 mb-16`}
  style={{
    flexDirection: index % 2 === 0 ? 'row' : 'row-reverse',
  }}
>
```
(Keep the `className` for GSAP targeting but add inline style for direction)

**Step 3: Verify center dot positioning**

The dot is `absolute left-1/2 -translate-x-1/2`. The `-translate-x-1/2` class needs Tailwind. If the dot doesn't center, add:
```jsx
style={{
  ...existingStyle,
  transform: 'translateX(-50%)',
}}
```

**Step 4: Verify tech tags have pill styling**

Experience tech tags already have proper pill styling via inline `style`:
```jsx
style={{
  backgroundColor: 'rgba(139,92,246,0.15)',
  color: 'var(--color-accent-purple)',
  border: '1px solid rgba(139,92,246,0.3)',
}}
```
These are fully inline — they work regardless of Tailwind. Just verify they render correctly.

**Step 5: Commit any fixes**

```bash
git add src/components/Experience/Experience.jsx
git commit -m "fix(experience): ensure alternating timeline layout and card glass morphism

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 2.5 — Projects: fix tech tag pills + fix broken hexagon icon + verify 3D hover

> **USE `ux-ui` SKILL FIRST before any code changes.**

**Files:**
- Modify: `src/components/Projects/Projects.jsx`

**Context:** Two known bugs:
1. **Tech tags missing pill styling** — current code has only `font-mono text-xs` + color, no border or bg. This causes tags to look like plain colored text even when `gap-2` works.
2. **`⬡` hexagon Unicode char** — may render as "O", "□" or broken on some systems/fonts.

**Step 1: Fix tech tag pills in `ProjectCard`**

Find the tech tags render block (around line 103-113 in Projects.jsx):

```jsx
// CURRENT (broken - no pill styling):
<div className="flex flex-wrap gap-2">
  {project.tech.map((t) => (
    <span
      key={t}
      className="font-mono text-xs"
      style={{ color: 'var(--color-accent-purple)' }}
    >
      {t}
    </span>
  ))}
</div>
```

Replace with:

```jsx
// FIXED (pill styling matching Experience component):
<div className="flex flex-wrap gap-2">
  {project.tech.map((t) => (
    <span
      key={t}
      className="font-mono text-xs px-2 py-0.5 rounded"
      style={{
        backgroundColor: 'rgba(139,92,246,0.15)',
        color: 'var(--color-accent-purple)',
        border: '1px solid rgba(139,92,246,0.3)',
      }}
    >
      {t}
    </span>
  ))}
</div>
```

**Step 2: Replace `⬡` hexagon with inline SVG folder icon**

Find line ~56-58 in Projects.jsx:
```jsx
<span
  className="font-mono text-2xl"
  style={{ color: 'var(--color-accent-cyan)' }}
>
  ⬡
</span>
```

Replace with SVG:
```jsx
<svg
  width="32"
  height="32"
  viewBox="0 0 24 24"
  fill="none"
  stroke="var(--color-accent-cyan)"
  strokeWidth="1.5"
  strokeLinecap="round"
  strokeLinejoin="round"
  aria-hidden="true"
>
  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
</svg>
```

**Step 3: Visual verification checklist**

- [ ] "03. Projects" heading with cyan number and divider line
- [ ] Project cards in a responsive grid (auto-fill minmax 300px)
- [ ] Each card has: folder SVG icon (cyan, top-left), GitHub link (top-right), Live link if available
- [ ] Card title in white, description in muted gray
- [ ] Tech tags as purple pills (border + bg)
- [ ] Card has glass morphism styling
- [ ] 3D hover effect: card rotates toward mouse, bounces back on leave
- [ ] GSAP fade-in on scroll

**Step 4: Verify 3D hover**

The `transformStyle: 'preserve-3d'` is in the inline `style`. GSAP animates `rotateX` and `rotateY`. This should work. Test by hovering over cards — they should tilt toward cursor.

If 3D effect is too extreme, reduce the multiplier from `10` to `8`:
```javascript
rotateY: x * 8,   // was x * 10
rotateX: -y * 8,  // was -y * 10
```

**Step 5: Commit**

```bash
git add src/components/Projects/Projects.jsx
git commit -m "fix(projects): add pill styling to tech tags, replace broken unicode icon with SVG

- Tech tags now match Experience component (purple pill with border+bg)
- Folder icon replaced with reliable inline SVG
- 3D card hover effect verified working

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 2.6 — Contact: replace Unicode social icons with SVG + verify layout

> **USE `ux-ui` SKILL FIRST before any code changes.**

**Files:**
- Modify: `src/components/Contact/Contact.jsx`

**Context:** Social links use `⌥` (GitHub), `◈` (LinkedIn), `◉` (Email) as icons. These render as "O" or broken chars. The rest of the layout uses `flex-col sm:flex-row gap-4` which needs Tailwind.

**Step 1: Replace Unicode icons with SVG inline icons**

Find the `SOCIAL_LINKS` constant at the top of `Contact.jsx` (lines 8-24):

```javascript
// CURRENT (broken Unicode):
const SOCIAL_LINKS = [
  { label: 'GitHub',   href: (p) => p.social.github,          icon: '⌥' },
  { label: 'LinkedIn', href: (p) => p.social.linkedin,         icon: '◈' },
  { label: 'Email',    href: (p) => `mailto:${p.email}`,       icon: '◉' },
]
```

Replace with JSX SVG icon components. Change `icon` from a string to a JSX element:

```javascript
// FIXED (inline SVGs - reliable across all systems):
const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
)

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const EmailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)

const SOCIAL_LINKS = [
  { label: 'GitHub',   href: (p) => p.social.github,          Icon: GitHubIcon },
  { label: 'LinkedIn', href: (p) => p.social.linkedin,         Icon: LinkedInIcon },
  { label: 'Email',    href: (p) => `mailto:${p.email}`,       Icon: EmailIcon },
]
```

**Step 2: Update the render to use `Icon` component instead of `icon` string**

Find around line 101-129 in Contact.jsx where social links are rendered:

```jsx
// Find: <span>{icon}</span>
// Replace with: <Icon />
```

Change the map to use `{ label, href, Icon }` destructuring and render `<Icon />`:

```jsx
<div className="flex flex-col sm:flex-row items-center justify-center gap-4 contact-animate">
  {SOCIAL_LINKS.map(({ label, href, Icon }) => (
    <a
      key={label}
      href={href(profile)}
      target={label !== 'Email' ? '_blank' : undefined}
      rel="noreferrer"
      aria-label={label}
      className="flex items-center gap-3 px-8 py-4 rounded-lg border font-mono text-sm font-medium w-full sm:w-auto justify-center transition-all duration-300"
      style={{
        borderColor: 'rgba(0,245,255,0.2)',
        color: 'var(--color-text-primary)',
        backgroundColor: 'rgba(0,245,255,0.03)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-accent-cyan)'
        e.currentTarget.style.color = 'var(--color-accent-cyan)'
        e.currentTarget.style.boxShadow = '0 0 20px rgba(0,245,255,0.2)'
        e.currentTarget.style.backgroundColor = 'rgba(0,245,255,0.08)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0,245,255,0.2)'
        e.currentTarget.style.color = 'var(--color-text-primary)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.backgroundColor = 'rgba(0,245,255,0.03)'
      }}
    >
      <Icon />
      {label}
    </a>
  ))}
</div>
```

**Step 3: Visual verification checklist**

- [ ] "04. Contact" heading visible
- [ ] Radial gradient background (subtle cyan/purple glow at center)
- [ ] Three social buttons: GitHub, LinkedIn, Email — each with SVG icon
- [ ] Each button has border + glass bg
- [ ] Hover: button glows cyan, text turns cyan
- [ ] Footer text "Diseñado y desarrollado con React + Three.js" visible in muted mono
- [ ] GSAP staggered fade-in on scroll

**Step 4: Commit**

```bash
git add src/components/Contact/Contact.jsx
git commit -m "fix(contact): replace broken Unicode icons with inline SVG for GitHub/LinkedIn/Email

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## BLOQUE 3 — Global Polish (run sequentially after all Bloque 2 tasks complete)

---

### Task 3.1 — Global typography hierarchy audit

> **USE `ux-ui` SKILL FIRST before any code changes.**

**Files:**
- Possibly modify: `src/index.css`

**Step 1: Visual audit — scroll through entire page**

Check that typography follows a clear hierarchy:
- Section numbers (e.g. "01."): `font-mono text-sm` cyan — small, technical
- Section headings ("About", "Experience", etc.): `font-display font-bold clamp(1.8rem, 4vw, 3rem)` — large, prominent
- Subheadings (role in Experience): `font-display font-semibold text-lg`
- Body text: `Inter`, `text-sm` or base, `text-muted`, `leading-7`
- Code/tags: `font-mono text-xs`
- Nav links: `font-mono text-sm`

**Step 2: If Inter body font isn't applying**

Add to `src/index.css` after the `@theme` block:

```css
body {
  font-family: var(--font-sans);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
}

code, pre, .font-mono {
  font-family: var(--font-mono);
}
```

(These may already be there — check first before adding)

**Step 3: Verify line heights are readable**

Body text should have `line-height: 1.7` minimum. If paragraphs look cramped, add to `index.css`:

```css
p {
  line-height: 1.75;
}
```

**Step 4: Commit if changes made**

```bash
git add src/index.css
git commit -m "polish(typography): ensure font hierarchy and line-heights are consistent globally

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 3.2 — Global spacing and max-width container audit

> **USE `ux-ui` SKILL FIRST before any code changes.**

**Files:**
- Read: `src/App.jsx`
- Possibly modify: `src/index.css`

**Step 1: Verify all sections use consistent padding**

Each section component (About, Experience, Projects, Contact) should have `py-24 px-6` and a `max-w-5xl mx-auto` inner container. Check each:

| Component | Expected outer padding | Expected container |
|-----------|----------------------|-------------------|
| About     | `py-24 px-6`         | `max-w-5xl mx-auto w-full` |
| Experience| `py-24 px-6`         | `max-w-5xl mx-auto` |
| Projects  | `py-24 px-6`         | `max-w-5xl mx-auto` |
| Contact   | `py-24 px-6`         | `max-w-2xl mx-auto` (narrower, centered) |

**Step 2: Verify section dividers (decorative lines) are visible**

Each section heading has a `flex-1 h-px` divider line. The `flex-1` class needs Tailwind to grow. Verify they appear as thin horizontal lines extending to the right of headings.

If `flex-1` isn't working (line has zero width), add explicit style fallback:
```jsx
<div
  className="flex-1 h-px ml-4"
  style={{
    backgroundColor: 'rgba(0,245,255,0.2)',
    flexGrow: 1,   // fallback for flex-1
  }}
/>
```

**Step 3: Check no horizontal overflow on any section**

Resize browser to ~1024px width. No element should cause horizontal scrollbar. If overflow exists, check `max-w-5xl` is constraining properly.

**Step 4: Commit if changes made**

```bash
git add src/index.css src/App.jsx
git commit -m "polish(spacing): verify consistent section padding and max-width containers

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 3.3 — Scroll navigation: verify IntersectionObserver + smooth scroll

> **USE `ux-ui` SKILL FIRST before any code changes.**

**Files:**
- Possibly modify: `src/components/Navbar/Navbar.jsx`

**Step 1: Full scroll test**

Open the portfolio and slowly scroll from top to bottom:
- [ ] Navbar active state changes as each section enters viewport
- [ ] "About" becomes active when About section is ~30% visible
- [ ] "Experience" becomes active when Experience section is ~30% visible
- [ ] Same for Projects and Contact
- [ ] Clicking a nav link instantly scrolls (smooth) to target section

**Step 2: Edge case — Hero section**

The Hero section uses `id="hero"` but the Navbar active links are `#about`, `#experience`, `#projects`, `#contact`. The Hero doesn't have a nav link. Verify that when at the very top, NO nav link is highlighted (empty string active state). This is the current behavior — confirm it looks right visually.

**Step 3: If active tracking feels laggy or incorrect**

The IntersectionObserver uses `threshold: 0.5` (or `0.3` if changed in Task 2.1). If transitions feel jerky, adjust `rootMargin`:

```javascript
// In Navbar.jsx, in the IntersectionObserver options:
{ threshold: 0.3, rootMargin: '-10% 0px -60% 0px' }
```

This means: trigger when section is 10% from top and 60% from bottom of viewport — ensures the active section is always the one most prominently visible.

**Step 4: Final visual regression check — scroll through entire portfolio**

Go through each section. Screenshot or mentally compare against the design doc. Confirm no broken layouts remain.

**Step 5: Final commit**

```bash
git add src/components/Navbar/Navbar.jsx
git commit -m "polish(nav): fine-tune IntersectionObserver rootMargin for accurate active tracking

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Final Verification

After all tasks complete, run:

```bash
npm run test
npm run lint
npm run build
```

All should pass. Then do a final visual walkthrough of the full portfolio in the browser.

---

## Dependency Graph

```
T1.1 (Tailwind Vite plugin)
T1.2 (Fonts)
    ↓
T1.3 (Smoke test)
    ↓ (parallel)
┌───────────────────────────────────┐
T2.1 (Navbar)  T2.2 (Hero)  T2.3 (About)
T2.4 (Experience)  T2.5 (Projects)  T2.6 (Contact)
└───────────────────────────────────┘
    ↓ (sequential)
T3.1 (Typography) → T3.2 (Spacing) → T3.3 (Scroll nav)
```

---

## Agent Briefing Template

When dispatching each Bloque 2 agent, include:

```
You are fixing a portfolio React app at: C:\Users\migue\Documents\clases\IA programming\copilot sdk\portfolio

REQUIRED: Use the ux-ui skill FIRST before any code changes.

Your task: [task description from this plan]

Context:
- Tailwind v4.2.1 with @tailwindcss/vite plugin (already fixed in Bloque 1)
- Components use hybrid: Tailwind utility classes + inline style props with CSS vars
- Design tokens are in src/index.css @theme block
- DO NOT remove existing tests or break passing tests
- DO NOT switch from hybrid styling to pure Tailwind or pure inline

Files to modify: [specific files from this plan]
Specific steps: [paste the task steps verbatim]
```
