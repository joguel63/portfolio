# Hero Blank Screen & Projects Stuck Hover — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix two UI bugs: (1) the Hero 3D starfield canvas is invisible on load, (2) project cards stay in a tilted/hover state after the mouse leaves.

**Architecture:** Both fixes are surgical — Hero.jsx moves its animation trigger from `useEffect` to R3F's `onCreated` callback; Projects.jsx adds `overwrite: 'auto'` to two GSAP calls. No animation contracts or data layer is touched.

**Tech Stack:** React 19, React Three Fiber (`@react-three/fiber`), GSAP 3, Vitest, @testing-library/react

---

## Task 1: Fix Hero Canvas Invisible (Hero.jsx)

**Root cause:** `useEffect` runs synchronously after React renders, but R3F injects the `<canvas>` element **asynchronously**. `initSpaceHeroEntrance` calls `heroRef.current.querySelector('canvas')` — which returns `null` at that point — so `gsap.set(canvas, { opacity: 0 })` never runs AND the fade-in animation is skipped. The canvas stays at the default opacity (visible), but... wait, re-reading the animation code: `gsap.set` sets canvas to `opacity: 0`, then `tl.from(canvas, { opacity: 0 })` animates it FROM 0 TO 1. If canvas is null, the initial `gsap.set` is skipped but the canvas still renders normally — **unless** another part of the code sets it to opacity 0 elsewhere.

**Actual mechanism of blank:** `gsap.set(heroRef.current.querySelectorAll('.hero-char'), { opacity: 0 })` and `.hero-fade` ARE set to `opacity: 0` (those selectors DO exist in DOM at useEffect time). The `tl.from(...)` for those chars starts but the canvas `from` never fires since canvas is null — so chars start at opacity 0 and animate in, but canvas is null so the `if (canvas)` branch for the timeline is skipped. The canvas renders fine visibly. The actual "blank" is that **`.hero-char` and `.hero-fade` elements are set to `opacity: 0` and never animated back because the timeline may not complete or canvas detection failure short-circuits**.

Actually no — let me be precise. The GSAP `tl.from(chars, ...)` runs regardless of whether canvas was found. The issue is that `querySelector('canvas')` returns null at `useEffect` time, which means:
- Canvas is NOT set to `opacity: 0` initially ✓ (would be visible)
- Canvas is NOT added to the timeline ✓ (timeline still runs for chars and fades)
- BUT the chars and fades ARE set to `opacity: 0` initially and animated IN

So why is the hero blank? Because the canvas query fails → canvas pointer is null → `tl.from(canvas...)` at time 0 is skipped → chars animate fine. The "blank" is the **canvas area showing the background color (#050508) without the star particles**, because R3F hasn't rendered yet OR because the canvas renders but the stars aren't visible initially.

The real fix: ensure canvas is queried AFTER R3F mounts it, using `onCreated`.

**Files:**
- Modify: `src/components/Hero.jsx:51-54` (useEffect with initSpaceHeroEntrance)
- Modify: `src/components/Hero.jsx:73-78` (Canvas element — add onCreated)

---

### Step 1: Store timeline ref for cleanup

In `Hero.jsx`, replace the `useEffect` that calls `initSpaceHeroEntrance` with one that only handles cleanup via a ref. Add `animationTlRef` alongside the existing refs.

**Current code (lines 47-54):**
```jsx
export default function Hero() {
  const heroRef = useRef(null)
  const scrollProgressRef = useRef(0)

  useEffect(() => {
    const tl = initSpaceHeroEntrance(heroRef)
    return () => tl?.kill()
  }, [])
```

**New code:**
```jsx
export default function Hero() {
  const heroRef = useRef(null)
  const scrollProgressRef = useRef(0)
  const animationTlRef = useRef(null)

  useEffect(() => {
    return () => animationTlRef.current?.kill()
  }, [])
```

---

### Step 2: Add onCreated callback to Canvas

Move the animation call to the R3F `onCreated` prop, which fires after the GL context and `<canvas>` are injected into the DOM.

**Current code (lines 73-78):**
```jsx
<Canvas
  camera={{ position: [0, 0, 1], fov: 75 }}
  style={{ background: 'transparent', width: '100%', height: '100%' }}
>
  <SpaceScene scrollProgressRef={scrollProgressRef} />
</Canvas>
```

**New code:**
```jsx
<Canvas
  camera={{ position: [0, 0, 1], fov: 75 }}
  style={{ background: 'transparent', width: '100%', height: '100%' }}
  onCreated={() => {
    animationTlRef.current = initSpaceHeroEntrance(heroRef)
  }}
>
  <SpaceScene scrollProgressRef={scrollProgressRef} />
</Canvas>
```

---

### Step 3: Run existing tests to verify no regression

```bash
npx vitest run
```

Expected: All 34 tests pass (Hero.jsx has no test file, so nothing new to break).

---

### Step 4: Commit

```bash
git add src/components/Hero.jsx
git commit -m "fix: trigger hero animation after R3F canvas mounts via onCreated

Canvas was queried before React Three Fiber injected it into the DOM,
causing the animation timeline to skip the canvas fade-in.
Moving initSpaceHeroEntrance to onCreated guarantees the canvas exists.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 2: Fix Project Cards Stuck Hover (Projects.jsx)

**Root cause:** Every `mousemove` event queues a new `gsap.to()` tween on the card element. Without `overwrite: 'auto'`, GSAP runs all queued tweens. When `onMouseLeave` fires the reset tween, the pending move tweens override it, leaving the card in a tilted state.

**Files:**
- Modify: `src/components/Projects/Projects.jsx:17-22` (handleMouseMove gsap.to)
- Modify: `src/components/Projects/Projects.jsx:26-31` (handleMouseLeave gsap.to)

---

### Step 1: Add overwrite to handleMouseMove

**Current code (lines 17-22):**
```jsx
gsap.to(card, {
  rotateY: x * 10,
  rotateX: -y * 10,
  duration: 0.3,
  ease: 'power2.out',
})
```

**New code:**
```jsx
gsap.to(card, {
  rotateY: x * 10,
  rotateX: -y * 10,
  duration: 0.3,
  ease: 'power2.out',
  overwrite: 'auto',
})
```

---

### Step 2: Add overwrite to handleMouseLeave

**Current code (lines 26-31):**
```jsx
gsap.to(cardRef.current, {
  rotateY: 0,
  rotateX: 0,
  duration: 0.5,
  ease: 'elastic.out(1, 0.5)',
})
```

**New code:**
```jsx
gsap.to(cardRef.current, {
  rotateY: 0,
  rotateX: 0,
  duration: 0.5,
  ease: 'elastic.out(1, 0.5)',
  overwrite: 'auto',
})
```

---

### Step 3: Run existing tests

```bash
npx vitest run src/components/Projects/Projects.test.jsx
```

Expected: 4/4 tests pass.

---

### Step 4: Commit

```bash
git add src/components/Projects/Projects.jsx
git commit -m "fix: prevent stuck hover on project cards with gsap overwrite

Without overwrite:'auto', queued mousemove tweens competed with the
mouseleave reset tween, leaving cards in a tilted state.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 3: Final Verification

### Step 1: Run full test suite

```bash
npx vitest run
```

Expected: All 34 tests pass with no new failures.

### Step 2: Build to verify no compile errors

```bash
npm run build
```

Expected: Build completes successfully, output in `dist/`.

### Step 3: Manual smoke test

```bash
npm run preview
```

Open `http://localhost:4173/portfolio/` and verify:
- ✅ Hero section shows animated 3D starfield (not blank)
- ✅ Name characters fade/slide in after ~0.5s
- ✅ Project cards tilt on hover
- ✅ Project cards return to flat position after mouse leaves
