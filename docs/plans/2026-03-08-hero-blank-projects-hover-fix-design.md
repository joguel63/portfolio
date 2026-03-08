# Bug Fix Design: Hero Blank Screen & Projects Stuck Hover

## Problem

Two UI bugs detected in the portfolio:

1. **Hero section renders blank** — the 3D starfield canvas is invisible on load.
2. **Project cards stay in hover state** — 3D tilt effect persists after mouse leaves.

## Root Causes

### Bug 1: Hero Canvas Invisible

`initSpaceHeroEntrance` in `src/animations/hero.space.animations.js` does:

```js
const canvas = heroRef.current.querySelector('canvas')
if (canvas) gsap.set(canvas, { opacity: 0 })
```

This sets the canvas to `opacity: 0` as an initial state before animating it in. The animation is triggered in a `useEffect` in `Hero.jsx`, but React Three Fiber (R3F) injects the `<canvas>` element **asynchronously** after the component renders. When `useEffect` runs, `querySelector('canvas')` returns `null`, so the canvas never gets the fade-in animation — it stays permanently at `opacity: 0`.

### Bug 2: Projects Stuck Hover

`handleMouseMove` calls `gsap.to()` on every mouse move event, queuing many tweens. Without `overwrite: 'auto'`, GSAP does not cancel previous tweens when new ones target the same properties. When `handleMouseLeave` fires the reset tween, it competes with the queued move tweens, resulting in the card staying in a rotated/hovered state.

## Approved Solution (Approach A — Minimal Surgical Changes)

### Fix 1: Hero.jsx

Move the animation trigger from `useEffect` to the `<Canvas onCreated>` callback. The `onCreated` prop fires **after** R3F has created the GL context and injected the `<canvas>` element into the DOM, guaranteeing `querySelector('canvas')` succeeds.

```jsx
// Remove:
useEffect(() => {
  const ctx = gsap.context(() => { initSpaceHeroEntrance(heroRef) }, heroRef)
  return () => ctx.revert()
}, [])

// Add to <Canvas>:
<Canvas
  onCreated={() => {
    const ctx = gsap.context(() => { initSpaceHeroEntrance(heroRef) }, heroRef)
    // Store ctx on ref for cleanup
  }}
  ...
>
```

**Files changed:** `src/components/Hero/Hero.jsx`

### Fix 2: Projects.jsx

Add `overwrite: 'auto'` to both GSAP calls in the `ProjectCard` component:

- `handleMouseMove` — kills conflicting rotate tweens before starting new ones
- `handleMouseLeave` — kills all pending move tweens, applies clean reset

**Files changed:** `src/components/Projects/Projects.jsx`

## Constraints

- No changes to animation files (`src/animations/`) or contracts
- No changes to data layer or CSS tokens
- All 34 existing tests must continue to pass after fixes
