# UX Critical Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix all 18 Critical UX issues found in the portfolio audit across 5 sections, covering accessibility (WCAG AA), motion safety, and JS-failure fallbacks.

**Architecture:** Two sequential phases. Phase 1 runs a single agent on cross-cutting files (`index.css`, `hero.space.animations.js`) first to avoid conflicts. Phase 2 dispatches 5 agents in parallel, one per section component. Each agent uses the `ui-ux-pro-max` skill.

**Tech Stack:** React 19, GSAP 3 (`gsap.matchMedia`), Tailwind CSS v4, CSS custom properties

---

## PHASE 1 — Global Cross-Cutting Fixes

### Task 1: Fix `index.css` — token, focus, reduced-motion, opacity fallbacks

**Files:**
- Modify: `src/index.css`

**What to change and why:**

1. **`--color-text-muted` contrast fix** (Critical #4, #7) — Current `#64748b` yields ≈4.28:1 on both bg colors, failing WCAG AA 4.5:1. Change to `#7b91a8` (≈4.6:1).

2. **`a:focus-visible` global rule** (Critical #1) — No keyboard focus ring exists anywhere. Add it globally so every `<a>` and button inherits it.

3. **`@media (prefers-reduced-motion)` safety net** (Critical #3, #8, #11, #15, #18) — CSS-level kill-switch for all transitions and CSS keyframe animations when user prefers reduced motion. GSAP guards will be added per-component, but this CSS rule protects any missed cases.

4. **GSAP opacity:0 fallbacks** (Critical #5, #14, #18) — Elements that GSAP initialises at opacity:0 must have a CSS `opacity: 1` baseline. GSAP overrides this at runtime; if GSAP fails, content stays visible.

5. **Contact pulse animation** — The `@keyframes pulse` inline in Contact.jsx fires unconditionally. Add a reduced-motion override in index.css.

**Step 1: Apply all changes to `src/index.css`**

Replace the file contents with:

```css
@import "tailwindcss";

@theme {
  --color-bg-primary: #050508;
  --color-bg-secondary: #0d0d14;
  --color-accent-cyan: #00f5ff;
  --color-accent-purple: #8b5cf6;
  --color-text-primary: #e2e8f0;
  --color-text-muted: #7b91a8;

  --font-sans: 'Inter', system-ui, sans-serif;
  --font-display: 'Space Grotesk', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

:root {
  color-scheme: dark;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: auto;
}

body {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1.6;
  min-height: 100vh;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: var(--color-bg-primary);
}
::-webkit-scrollbar-thumb {
  background: var(--color-accent-cyan);
  border-radius: 3px;
  opacity: 0.5;
}

::selection {
  background: var(--color-accent-cyan);
  color: var(--color-bg-primary);
}

a {
  color: var(--color-accent-cyan);
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}

/* Global keyboard focus ring — applies to all focusable elements */
a:focus-visible,
button:focus-visible,
[tabindex]:focus-visible {
  outline: 2px solid var(--color-accent-cyan);
  outline-offset: 4px;
  border-radius: 2px;
}

/* Typography hierarchy */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
}

code, pre {
  font-family: var(--font-mono);
}

p {
  line-height: 1.75;
}

/* GSAP opacity:0 safety net — GSAP overrides these at runtime.
   If GSAP fails to load, content stays visible. */
.hero-char,
.hero-fade,
.about-animate,
.experience-card,
.project-card,
.contact-animate {
  opacity: 1;
}

/* Reduced-motion: disable all CSS animations/transitions.
   GSAP animations are guarded per-component with gsap.matchMedia(). */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Step 2: Run tests**

```bash
npx vitest run
```

Expected: `Tests 34 passed (34)` — the CSS change does not affect any test logic.

**Step 3: Commit**

```bash
git add src/index.css
git commit -m "fix(a11y): lighten --color-text-muted to pass WCAG AA contrast

#64748b (4.28:1) → #7b91a8 (4.6:1) on dark backgrounds.
Add global a:focus-visible ring, GSAP opacity fallbacks, and
prefers-reduced-motion CSS safety net.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 2: Fix `hero.space.animations.js` — GSAP `gsap.matchMedia()` guard

**Files:**
- Modify: `src/animations/hero.space.animations.js`

**What:** Wrap the entrance timeline in `gsap.matchMedia()`. When `prefers-reduced-motion: reduce` is active, snap all elements to their final visible state instantly instead of animating.

**Step 1: Replace `initSpaceHeroEntrance` body**

```js
import gsap from 'gsap'
import { ANIMATION_IDS } from '../contracts/animations.contract.js'

export function initSpaceHeroEntrance(heroRef) {
  if (!heroRef?.current) return null

  const chars = heroRef.current.querySelectorAll('.hero-char')
  const fades = heroRef.current.querySelectorAll('.hero-fade')
  const canvas = heroRef.current.querySelector('canvas')

  const mm = gsap.matchMedia()

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // Kill any in-progress tweens before re-running (safe for React StrictMode)
    gsap.killTweensOf([...chars, ...fades, canvas].filter(Boolean))

    // Set initial hidden state explicitly
    gsap.set(chars, { opacity: 0, y: 40, filter: 'blur(10px)' })
    gsap.set(fades, { opacity: 0, y: 20 })
    if (canvas) gsap.set(canvas, { opacity: 0 })

    const tl = gsap.timeline({ id: ANIMATION_IDS.HERO_ENTRANCE })

    if (canvas) {
      tl.to(canvas, { opacity: 1, duration: 2, ease: 'power2.out' }, 0)
    }
    tl.to(chars, { opacity: 1, y: 0, filter: 'blur(0px)', stagger: 0.03, duration: 1.2, ease: 'power3.out' }, 0.5)
    tl.to(fades, { opacity: 1, y: 0, stagger: 0.2, duration: 0.8, ease: 'power2.out' }, 1.2)
  })

  mm.add('(prefers-reduced-motion: reduce)', () => {
    // Snap to final state immediately — no animation
    gsap.set([...chars, ...fades, canvas].filter(Boolean), { opacity: 1, y: 0, filter: 'none' })
  })

  return mm
}
```

**Step 2: Run tests**

```bash
npx vitest run src/animations/hero.space.animations.test.js
```

Expected: `Tests 6 passed (6)` — tests check that the function returns a non-null object and doesn't throw. `gsap.matchMedia()` returns a `MatchMedia` object (truthy), so the "returns a GSAP timeline" test needs to check for a truthy return rather than a `.kill()` method. If that test breaks, update `Hero.jsx`'s cleanup: change `animationTlRef.current?.kill()` to `animationTlRef.current?.revert()` since `gsap.matchMedia()` uses `.revert()` not `.kill()`.

Check and fix `Hero.jsx:53` if needed:
```js
// Change:
return () => animationTlRef.current?.kill()
// To:
return () => animationTlRef.current?.revert()
```

Also check `hero.space.animations.test.js` — if tests call `.kill()` on the return value, update them to check `typeof result.revert === 'function'` instead.

**Step 3: Run full suite**

```bash
npx vitest run
```

Expected: `Tests 34 passed (34)`.

**Step 4: Commit**

```bash
git add src/animations/hero.space.animations.js src/components/Hero.jsx
git commit -m "fix(a11y): add prefers-reduced-motion guard to hero entrance animation

Wrap GSAP timeline in gsap.matchMedia(). Reduced-motion users see
content immediately at full opacity with no animation.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## PHASE 2 — Per-Section Parallel Agents

> Dispatch all 5 tasks below simultaneously as background agents. Each agent invokes the ui-ux-pro-max skill. Each touches ONLY its own component file.

---

### Task 3: Hero.jsx — Section-specific fixes

**Agent type:** `general-purpose` (background)

**Files:**
- Modify: `src/components/Hero.jsx`

**Invoke ui-ux-pro-max skill first:**
```bash
python "C:\Users\migue\Documents\clases\IA programming\copilot sdk\portfolio\.claude\skills\ui-ux-pro-max\scripts\search.py" "portfolio cyberpunk hero canvas aria accessibility ios viewport" --design-system -p "Portfolio"
```

**Fixes to apply (surgical edits only):**

**Fix A — `<Canvas aria-hidden="true">`** (Critical #2)
```jsx
// Line 73 — add aria-hidden prop:
<Canvas
  aria-hidden="true"
  camera={{ position: [0, 0, 1], fov: 75 }}
  style={{ background: 'transparent', width: '100%', height: '100%' }}
  onCreated={() => {
    animationTlRef.current = initSpaceHeroEntrance(heroRef)
  }}
>
```

**Fix B — Scroll indicator `aria-hidden`** (Warning #1)
```jsx
// Line 141 — add aria-hidden:
<div
  aria-hidden="true"
  className="absolute bottom-8 left-1/2 -translate-x-1/2 hero-fade flex flex-col items-center gap-2"
  style={{ color: 'var(--color-text-muted)' }}
>
```

**Fix C — iOS viewport fix** (Warning #3)
```jsx
// Line 69 — add h-[100dvh] alongside h-screen:
className="relative h-screen min-h-[100dvh] w-full overflow-hidden flex items-center justify-center"
```

**Fix D — h1 aria-label for full phrase** (Warning #2)
```jsx
// Line 92 — add aria-label:
<h1
  aria-label={`Hola, soy ${profile.name}`}
  className="font-display font-bold leading-none mb-4"
  style={{ fontSize: 'clamp(2.5rem, 8vw, 7rem)', color: 'var(--color-text-primary)' }}
>
```
Note: also change clamp minimum from `3rem` to `2.5rem` to prevent overflow at 375px (Warning #4).

**After all edits, run tests:**
```bash
npx vitest run
```
Expected: 34/34.

**Commit:**
```bash
git add src/components/Hero.jsx
git commit -m "fix(a11y,hero): aria-hidden canvas+scroll, ios dvh, h1 label, name clamp

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 4: About.jsx — Section-specific fixes

**Agent type:** `general-purpose` (background)

**Files:**
- Modify: `src/components/About/About.jsx`

**Invoke ui-ux-pro-max skill first.**

**Fixes to apply:**

**Fix A — `aria-hidden` on "01."** (Critical #6)
```jsx
// Line 39 — add aria-hidden:
<span
  aria-hidden="true"
  className="font-mono text-sm"
  style={{ color: 'var(--color-accent-cyan)' }}
>
  01.
</span>
```

**Fix B — `aria-labelledby` on section + id on h2** (Warning #10)
```jsx
// Line 31 — add aria-labelledby:
<section
  id="about"
  ref={sectionRef}
  aria-labelledby="about-heading"
  className="min-h-screen flex items-center py-12 md:py-24 px-4 md:px-6"
  style={{ backgroundColor: 'var(--color-bg-secondary)' }}
>
// Note: remove the inline padding style — Tailwind responsive classes handle it

// Line 45 — add id to h2:
<h2
  id="about-heading"
  className="font-display font-bold"
  style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'var(--color-text-primary)' }}
>
  About
</h2>
```

**Fix C — Tech Stack semantic markup** (Warning #11)
```jsx
// Line 73 — change <p> to <h3>:
<h3
  className="font-mono text-sm mb-6 uppercase tracking-widest"
  style={{ color: 'var(--color-accent-cyan)' }}
>
  Tech Stack
</h3>

// Line 79 — wrap in <ul>:
<ul className="flex flex-wrap gap-3" style={{ listStyle: 'none' }}>
  {profile.techStack.map(({ name, color }) => (
    <li key={name}>
      <span
        className="font-mono text-sm px-3 py-1 rounded border transition-all duration-200"
        style={{
          borderColor: `${color}40`,
          color: color,
          backgroundColor: `${color}10`,
        }}
      >
        {name}
      </span>
    </li>
  ))}
</ul>
```

**Fix D — Add `gsap.matchMedia()` guard** (Critical #8)
```jsx
// Lines 11-28 — replace useEffect animation body:
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.about-animate', {
        opacity: 0,
        y: 50,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      })
    })
  }, sectionRef)
  return () => ctx.revert()
}, [])
```

**Fix E — Remove min-h-screen on mobile** (Warning #13)
Change `min-h-screen` to `md:min-h-screen` in the className or remove it.

**After all edits, run tests:**
```bash
npx vitest run src/components/About/About.test.jsx
```
Expected: 4/4.

**Commit:**
```bash
git add src/components/About/About.jsx
git commit -m "fix(a11y,about): aria-hidden 01., labelledby, tech stack ul/li, reduced-motion

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 5: Experience.jsx — Section-specific fixes

**Agent type:** `general-purpose` (background)

**Files:**
- Modify: `src/components/Experience/Experience.jsx`

**Invoke ui-ux-pro-max skill first.**

**Fixes to apply:**

**Fix A — Timeline dot `aria-hidden`** (Critical #9)
```jsx
// Line 16 — add aria-hidden to the center dot div:
<div
  aria-hidden="true"
  className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center justify-center w-4 h-4 rounded-full border-2 mt-2"
  style={{ ... }}
/>
```

**Fix B — Timeline vertical line `aria-hidden`** (Critical #10)
```jsx
// Line 149 — add aria-hidden to the vertical line div:
<div
  aria-hidden="true"
  className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block"
  style={{ backgroundColor: 'rgba(0,245,255,0.15)' }}
/>
```

**Fix C — `aria-hidden` on "02."** (same pattern as About)
```jsx
// Line 130:
<span
  aria-hidden="true"
  className="font-mono text-sm"
  style={{ color: 'var(--color-accent-cyan)' }}
>
  02.
</span>
```

**Fix D — `aria-labelledby` on section** (Warning #16)
```jsx
// Line 122:
<section
  id="experience"
  ref={sectionRef}
  aria-labelledby="experience-heading"
  ...
>
// Line 138 — add id to h2:
<h2
  id="experience-heading"
  ...
>
```

**Fix E — `<time>` element for period** (Warning #15)
```jsx
// Line 51 — replace <span> with <time>:
<time
  dateTime={item.period}
  className="font-mono text-xs ml-4 whitespace-nowrap"
  style={{ color: 'var(--color-text-muted)' }}
>
  {item.period}
</time>
```

**Fix F — `gsap.matchMedia()` with responsive x-offset** (Critical #11, Warning #17)
```jsx
// Lines 102-119 — replace useEffect animation body:
useEffect(() => {
  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia()

    mm.add({
      isDesktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
      isMobile: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
    }, (context) => {
      const { isDesktop } = context.conditions
      gsap.from('.experience-card', {
        opacity: 0,
        x: isDesktop ? (i) => (i % 2 === 0 ? -60 : 60) : 0,
        y: isDesktop ? 0 : 20,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      })
    })
  }, sectionRef)
  return () => ctx.revert()
}, [])
```

**After all edits, run tests:**
```bash
npx vitest run src/components/Experience/Experience.test.jsx
```
Expected: 4/4.

**Commit:**
```bash
git add src/components/Experience/Experience.jsx
git commit -m "fix(a11y,experience): aria-hidden decoratives, time element, reduced-motion gsap

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 6: Projects.jsx — Section-specific fixes

**Agent type:** `general-purpose` (background)

**Files:**
- Modify: `src/components/Projects/Projects.jsx`

**Invoke ui-ux-pro-max skill first.**

**Fixes to apply:**

**Fix A — Contextual `aria-label` on GitHub link** (Critical #12)
```jsx
// Line 68 — change aria-label:
aria-label={`GitHub repository for ${project.title}`}
```

**Fix B — Contextual `aria-label` on Live link** (Critical #13)
```jsx
// Line 81 — change aria-label:
aria-label={`Live demo for ${project.title}`}
```

**Fix C — `role="article"` on cards** (Warning #21)
```jsx
// Line 34 — change outer div to use role:
<div
  ref={cardRef}
  role="article"
  aria-label={project.title}
  onMouseMove={handleMouseMove}
  onMouseLeave={handleMouseLeave}
  ...
>
```

**Fix D — `cursor: 'pointer'`** (Warning #24)
```jsx
// Line 45 — change cursor:
cursor: 'pointer',
```

**Fix E — `aria-hidden` on "03."** (same pattern as other sections)
```jsx
<span
  aria-hidden="true"
  className="font-mono text-sm"
  style={{ color: 'var(--color-accent-cyan)' }}
>
  03.
</span>
```

**Fix F — `gsap.matchMedia()` for scroll entrance** (Critical #15)
```jsx
// Lines 134-151 — replace useEffect animation body:
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.project-card', {
        opacity: 0,
        y: 40,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      })
    })
  }, sectionRef)
  return () => ctx.revert()
}, [])
```

**Fix G — Skip tilt on reduced-motion** (Critical #15 — tilt part)
```jsx
// Lines 11-23 — add reduced-motion guard to handleMouseMove:
const handleMouseMove = useCallback((e) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const card = cardRef.current
  if (!card) return
  const rect = card.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5
  gsap.to(card, {
    rotateY: x * 10,
    rotateX: -y * 10,
    duration: 0.3,
    ease: 'power2.out',
    overwrite: 'auto',
  })
}, [])
```

**After all edits, run tests:**
```bash
npx vitest run src/components/Projects/Projects.test.jsx
```
Expected: 4/4.

**Commit:**
```bash
git add src/components/Projects/Projects.jsx
git commit -m "fix(a11y,projects): contextual aria-labels, role=article, cursor pointer, reduced-motion

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 7: Contact.jsx — Section-specific fixes

**Agent type:** `general-purpose` (background)

**Files:**
- Modify: `src/components/Contact/Contact.jsx`

**Invoke ui-ux-pro-max skill first.**

**Fixes to apply:**

**Fix A — Remove `flexDirection: 'row'` override** (Critical #17)
The inline `style={{ display: 'flex', flexDirection: 'row', ... }}` on line 107 overrides the Tailwind `flex-col sm:flex-row` responsive classes. Remove the entire inline style object from that wrapper div, keeping only the Tailwind classes.

```jsx
// Line 107 — BEFORE:
<div className="flex flex-col sm:flex-row items-center justify-center gap-4 contact-animate" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>

// AFTER (remove the style prop entirely):
<div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap contact-animate">
```

**Fix B — Display email address visibly** (Critical #16)
The email link currently shows only the label "Email". Add the raw address as visible text so users without a mail client can copy it.

Find the Email entry in `SOCIAL_LINKS` rendering (line ~108-137) and add a visible email span below the social buttons block. Add this after the closing `</div>` of the social links wrapper:

```jsx
<p
  className="mt-4 contact-animate font-mono text-xs"
  style={{ color: 'var(--color-text-muted)' }}
>
  {profile.email}
</p>
```

**Fix C — `aria-hidden` on "04."** (same pattern as other sections)
```jsx
// Line 80:
<span
  aria-hidden="true"
  className="font-mono text-sm"
  style={{ color: 'var(--color-accent-cyan)' }}
>
  04.
</span>
```

**Fix D — `gsap.matchMedia()` for scroll animation** (Critical #18)
```jsx
// Lines 36-53 — replace useEffect animation body:
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.contact-animate', {
        opacity: 0,
        y: 40,
        stagger: 0.2,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      })
    })
  }, sectionRef)
  return () => ctx.revert()
}, [])
```

**Fix E — Move `@keyframes pulse` to `index.css`** (reduced-motion compliance)
The `<style>` tag injecting `@keyframes pulse` inside the component is a code smell. However, since index.css already has `animation-duration: 0.01ms !important` in the reduced-motion media query, the CSS safety net covers it. For now, just leave it — it's already covered by the global rule. (Minor improvement, not blocking.)

**After all edits, run tests:**
```bash
npx vitest run src/components/Contact/Contact.test.jsx
```
Expected: 5/5.

**Commit:**
```bash
git add src/components/Contact/Contact.jsx
git commit -m "fix(a11y,contact): remove flexDirection override, show email address, reduced-motion

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## PHASE 2 — Final Verification (after all 5 section tasks complete)

### Task 8: Full test suite + build + push

**Step 1: Run full test suite**
```bash
npx vitest run
```
Expected: `Tests 34 passed (34)` — all tests green.

**Step 2: Build**
```bash
npm run build
```
Expected: `✓ built in X.XXs` — no errors (chunk size warning for Three.js is pre-existing and acceptable).

**Step 3: Push to origin/master**
```bash
git push origin master
```

---

## Execution Order

```
Task 1 (index.css)              → sequential
Task 2 (hero.space.animations)  → sequential, after Task 1
  └─ Tasks 3-7 (section agents) → ALL PARALLEL, after Task 2
       └─ Task 8 (verify+push)  → after all 5 section tasks
```

Tasks 3–7 MUST be dispatched simultaneously using `mode: "background"` on the task tool.
