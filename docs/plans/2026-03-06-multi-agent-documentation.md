# Multi-Agent Documentation & Architecture Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Document the project with a developer/agent-oriented README and create a layer-based architecture that allows multiple AI agents to work in parallel without conflicts.

**Architecture:** Layer-based ownership using Git worktrees — UI, Animations, CI/CD, and Docs agents each own a dedicated file domain. Interface contracts in `src/contracts/` prevent shared-state conflicts between layers. A task dependency map enforces safe merge order.

**Tech Stack:** React 19, Vite, Three.js, GSAP, Tailwind CSS, Vitest, Git worktrees

---

## Task 1: Create `src/animations/` layer scaffold

**Files:**
- Create: `src/animations/index.js`
- Create: `src/animations/hero.animations.js`
- Create: `src/animations/hero.animations.test.js`

This creates the Animations layer's home directory so the UI layer never writes GSAP logic directly in components.

**Step 1: Write the failing test**

Create `src/animations/hero.animations.test.js`:
```js
import { initHeroEntrance } from './hero.animations.js'

describe('hero animations', () => {
  it('exports initHeroEntrance function', () => {
    expect(typeof initHeroEntrance).toBe('function')
  })

  it('initHeroEntrance returns a GSAP timeline', () => {
    const fakeRef = { current: { style: {} } }
    const tl = initHeroEntrance(fakeRef)
    expect(tl).toBeDefined()
    expect(typeof tl.kill).toBe('function')
  })
})
```

**Step 2: Run test to verify it fails**

```
npm test -- hero.animations
```
Expected: FAIL — "Cannot find module './hero.animations.js'"

**Step 3: Create `src/animations/hero.animations.js`**

```js
import gsap from 'gsap'

/**
 * Animates the hero section entrance.
 * @param {React.RefObject} heroRef - ref attached to the .hero element
 * @returns {gsap.core.Timeline}
 */
export function initHeroEntrance(heroRef) {
  const tl = gsap.timeline()
  if (heroRef?.current) {
    tl.from(heroRef.current, { opacity: 0, y: -20, duration: 1 })
  }
  return tl
}
```

**Step 4: Create `src/animations/index.js`** (barrel export)

```js
export { initHeroEntrance } from './hero.animations.js'
```

**Step 5: Run test to verify it passes**

```
npm test -- hero.animations
```
Expected: PASS — 2 tests pass

**Step 6: Commit**

```bash
git add src/animations/
git commit -m "feat(animations): scaffold animations layer with hero entrance"
```

---

## Task 2: Create interface contracts

**Files:**
- Create: `src/contracts/animations.contract.js`
- Create: `src/contracts/hero.contract.js`
- Create: `src/contracts/contracts.test.js`

Contracts are the shared interface between layers. They document what each layer exposes and expects.

**Step 1: Write the failing test**

Create `src/contracts/contracts.test.js`:
```js
import { ANIMATION_IDS } from './animations.contract.js'
import { HERO_DEFAULTS } from './hero.contract.js'

describe('contracts', () => {
  it('ANIMATION_IDS exports expected keys', () => {
    expect(ANIMATION_IDS).toHaveProperty('HERO_ENTRANCE')
    expect(typeof ANIMATION_IDS.HERO_ENTRANCE).toBe('string')
  })

  it('HERO_DEFAULTS exports expected shape', () => {
    expect(HERO_DEFAULTS).toHaveProperty('canvasHeight')
    expect(HERO_DEFAULTS).toHaveProperty('boxColor')
  })
})
```

**Step 2: Run test to verify it fails**

```
npm test -- contracts
```
Expected: FAIL — "Cannot find module './animations.contract.js'"

**Step 3: Create `src/contracts/animations.contract.js`**

```js
/**
 * ANIMATIONS LAYER CONTRACT
 *
 * This file defines the public interface of the Animations layer.
 * - The UI layer calls functions from src/animations/ using these IDs.
 * - The Animations layer owns all logic inside src/animations/.
 * - Never write GSAP or Three.js logic directly in component files.
 */

/** Named identifiers for GSAP timelines. Use these as keys, never magic strings. */
export const ANIMATION_IDS = {
  /** Hero section entrance animation (fade + slide from top) */
  HERO_ENTRANCE: 'hero-entrance',
}

/**
 * Signature contract for animation functions.
 * Every function in src/animations/ must match this shape:
 *
 * @typedef {function(React.RefObject): gsap.core.Timeline} AnimationFn
 */
```

**Step 4: Create `src/contracts/hero.contract.js`**

```js
/**
 * HERO COMPONENT CONTRACT
 *
 * This file defines the props interface and defaults for the Hero component.
 * - The UI layer (Hero.jsx) owns markup and layout.
 * - The Animations layer calls initHeroEntrance() from src/animations/.
 * - Neither layer accesses the other's internals directly.
 */

/** Default configuration values for the Hero component. */
export const HERO_DEFAULTS = {
  /** CSS height class applied to the hero section */
  canvasHeight: 'h-screen',
  /** Default color for the rotating 3D box */
  boxColor: 'orange',
  /** Duration in seconds for the entrance animation */
  entranceDuration: 1,
}

/**
 * Hero component props shape (JSDoc type for editors and agents).
 *
 * @typedef {Object} HeroProps
 * @property {string} [boxColor] - Override the box color. Defaults to HERO_DEFAULTS.boxColor.
 * @property {string} [className] - Additional CSS classes for the section element.
 */
```

**Step 5: Run test to verify it passes**

```
npm test -- contracts
```
Expected: PASS — 2 tests pass

**Step 6: Commit**

```bash
git add src/contracts/
git commit -m "feat(contracts): add animations and hero interface contracts"
```

---

## Task 3: Update `Hero.jsx` to use contracts and animations layer

**Files:**
- Modify: `src/components/Hero.jsx`

This wires the existing Hero component to use the new animations layer instead of inline GSAP logic.

**Step 1: No new test needed** — hero already works. This is a refactor. Verify existing behavior first:

```
npm test
```
Expected: All existing tests pass.

**Step 2: Update `src/components/Hero.jsx`**

```jsx
import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { initHeroEntrance } from '../animations/index.js'
import { HERO_DEFAULTS } from '../contracts/hero.contract.js'

function Box({ color = HERO_DEFAULTS.boxColor }) {
  const ref = useRef()
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.01
  })
  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

export default function Hero({ boxColor, className = '' }) {
  const heroRef = useRef(null)

  useEffect(() => {
    const tl = initHeroEntrance(heroRef)
    return () => tl.kill()
  }, [])

  return (
    <section ref={heroRef} className={`${HERO_DEFAULTS.canvasHeight} ${className}`}>
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box color={boxColor} />
      </Canvas>
    </section>
  )
}
```

**Step 3: Run tests to verify nothing broke**

```
npm test
```
Expected: All tests pass.

**Step 4: Commit**

```bash
git add src/components/Hero.jsx
git commit -m "refactor(hero): delegate animation logic to animations layer"
```

---

## Task 4: Create `docs/TASK-DEPENDENCIES.md`

**Files:**
- Create: `docs/TASK-DEPENDENCIES.md`

No test needed — this is a documentation file.

**Step 1: Create `docs/TASK-DEPENDENCIES.md`**

```markdown
# Task Dependencies & Merge Order

This document defines the safe merge order for layer branches into `master`.
Agents must respect this order to avoid broken integrations.

## Merge Order

```
layer/animations  ──┐
                    ├──► master
layer/ui          ──┘  (merge animations first, then ui)

layer/cicd        ──► master  (independent — merge after build is confirmed stable)
layer/docs        ──► master  (fully independent — no blocking dependencies)
```

## Rationale

- **Animations before UI:** `Hero.jsx` imports from `src/animations/`. If UI merges first
  without the animations layer, imports will break.
- **UI before CI/CD:** CI/CD workflows run `npm run build`. A passing build requires UI
  components to be complete.
- **Docs is always independent:** Documentation files (`README.md`, `docs/`) have no runtime
  dependencies.

## Layer Ownership Table

| Layer | Branch | Worktree | Files Owned |
|-------|--------|----------|-------------|
| Animations | `layer/animations` | `worktrees/layer-animations` | `src/animations/`, `src/contracts/animations.contract.js` |
| UI | `layer/ui` | `worktrees/layer-ui` | `src/components/**/*.jsx`, `src/App.jsx`, `src/index.css`, `src/contracts/hero.contract.js` |
| CI/CD | `layer/cicd` | `worktrees/layer-cicd` | `.github/workflows/`, `vite.config.js`, `package.json`, `eslint.config.js` |
| Docs | `layer/docs` | `worktrees/layer-docs` | `README.md`, `docs/` |

## Creating a Layer Worktree

To spin up a new agent worktree for a layer:

```bash
# Example: create the UI layer worktree
git worktree add worktrees/layer-ui -b layer/ui

# Then give the agent its worktree path as its working directory
```

## Cross-Layer Coordination

When a change requires touching files in two layers:
1. Make the change in the layer that owns the file.
2. Update the relevant contract file (`src/contracts/`) to document the new interface.
3. Reference the contract change in your PR description so the other layer's agent is aware.
```

**Step 2: Commit**

```bash
git add docs/TASK-DEPENDENCIES.md
git commit -m "docs: add task dependency map and merge order for multi-agent workflow"
```

---

## Task 5: Create `docs/architecture.md`

**Files:**
- Create: `docs/architecture.md`

No test needed — documentation file.

**Step 1: Create `docs/architecture.md`**

```markdown
# Multi-Agent Architecture

This project is designed for parallel development by multiple AI agents.
Each agent owns a dedicated layer of the codebase. This document is the
authoritative reference for layer ownership and coordination rules.

## Layer Overview

| Layer | Owns | Does NOT touch |
|-------|------|----------------|
| **Animations** | `src/animations/`, `src/contracts/animations.contract.js` | Component JSX, CI config |
| **UI** | `src/components/`, `src/App.jsx`, `src/index.css` | GSAP/Three.js logic, CI config |
| **CI/CD** | `.github/workflows/`, `vite.config.js`, `package.json` | Source code, docs |
| **Docs** | `README.md`, `docs/` | Source code, CI config |

## How Layers Communicate

Layers communicate through **interface contracts** in `src/contracts/`:

- `src/contracts/animations.contract.js` — defines named animation IDs and function signatures
- `src/contracts/hero.contract.js` — defines Hero component props and default values

**Rule:** If you need something from another layer, look in `src/contracts/` first.
If the contract doesn't cover your case, update the contract and note it in your PR.

## The No-Conflict Rules

1. **One layer, one domain.** Never create or modify files outside your layer's domain.
2. **Contracts are shared.** Any layer may *read* any contract. To *write* a contract,
   coordinate with the owning layer (see ownership table above).
3. **No direct imports across layers.** The UI layer imports from `src/animations/index.js`,
   never from a specific animation file. The Animations layer never imports React components.
4. **Master is integration-only.** No agent commits directly to `master`. Use worktree branches.

## Adding a New Component (UI Agent)

1. Create `src/components/ComponentName/ComponentName.jsx`
2. Create `src/components/ComponentName/ComponentName.test.jsx`
3. If the component needs animations, add the animation function to `src/animations/`
   and export it from `src/animations/index.js`
4. If the component exposes new props that other layers need to know about,
   add a contract to `src/contracts/`

## Adding a New Animation (Animations Agent)

1. Add the animation function to `src/animations/` (new file or existing)
2. Export it from `src/animations/index.js`
3. If the animation introduces a new named ID, add it to `src/contracts/animations.contract.js`
4. The UI agent will call the function — do not call it yourself from animation files

## Worktree Setup

See `docs/TASK-DEPENDENCIES.md` for the full layer table and commands to create worktrees.
```

**Step 2: Commit**

```bash
git add docs/architecture.md
git commit -m "docs: add multi-agent architecture reference document"
```

---

## Task 6: Rewrite `README.md`

**Files:**
- Modify: `README.md`

No test needed — documentation file.

**Step 1: Replace the entire content of `README.md`**

```markdown
# Portfolio

Personal portfolio website built with React, Three.js, and GSAP.

**Live demo:** _coming soon_

---

## Quick Setup

```bash
npm install
npm run dev       # dev server at http://localhost:5173
npm run build     # production build → dist/
npm run test      # run Vitest tests
npm run lint      # ESLint check
npm run preview   # preview production build locally
```

Requires **Node 18+**.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite 7 |
| 3D Graphics | Three.js + @react-three/fiber + @react-three/drei |
| Animations | GSAP 3 |
| Styling | Tailwind CSS 4 |
| Testing | Vitest + @testing-library/react |
| CI/CD | GitHub Actions |

---

## Component Architecture

```
src/
  animations/          ← ANIMATIONS LAYER (GSAP + Three.js logic)
    index.js           ← barrel export — UI imports from here only
    hero.animations.js
  components/          ← UI LAYER (React components)
    Hero.jsx
    About/
      About.jsx
      About.test.jsx
  contracts/           ← SHARED INTERFACE (read by any layer)
    animations.contract.js
    hero.contract.js
  features/            ← Feature planning docs (markdown only)
  App.jsx
  main.jsx
  index.css
```

---

## Multi-Agent Development

This project uses a **layer-based architecture** that lets multiple AI agents work in
parallel without conflicts. Each agent owns a specific layer and a dedicated Git worktree.

| Agent | Layer | Worktree | Branch |
|-------|-------|----------|--------|
| Animations Agent | Animations | `worktrees/layer-animations` | `layer/animations` |
| UI Agent | UI | `worktrees/layer-ui` | `layer/ui` |
| CI/CD Agent | CI/CD | `worktrees/layer-cicd` | `layer/cicd` |
| Docs Agent | Docs | `worktrees/layer-docs` | `layer/docs` |

**Full documentation:**
- [`docs/architecture.md`](docs/architecture.md) — layer ownership rules and communication patterns
- [`docs/TASK-DEPENDENCIES.md`](docs/TASK-DEPENDENCIES.md) — merge order and worktree setup

---

## Code Conventions

### Naming
- Components: `PascalCase` (`Hero.jsx`, `About.jsx`)
- Hooks: `camelCase` prefixed with `use` (`useGSAPTimeline.js`)
- Animation functions: `camelCase` verb phrase (`initHeroEntrance`, `playScrollReveal`)
- CSS classes: Tailwind utilities only; no custom classes unless unavoidable

### Adding a New Section
1. Create `src/components/SectionName/SectionName.jsx`
2. Create `src/components/SectionName/SectionName.test.jsx` with at least one render test
3. Lazy-load it in `App.jsx` via `React.lazy()`
4. Add a `<section id="section-name">` anchor and a nav link

### Animation Rule
Never write GSAP or Three.js logic inside a component file. Add a function to
`src/animations/` and call it from the component via `useEffect`.

---

## Project Status

| Section | Status |
|---------|--------|
| Hero (3D box + entrance animation) | ✅ Done |
| About | 🔄 Placeholder |
| Experience | ⏳ Planned |
| Projects | ⏳ Planned |
| Contact | ⏳ Planned |
```

**Step 2: Commit**

```bash
git add README.md
git commit -m "docs(readme): rewrite with developer/agent-oriented documentation"
```

---

## Task 7: Verify everything builds and tests pass

**Step 1: Run full test suite**

```
npm test
```
Expected: All tests pass (About render test + animations test + contracts test).

**Step 2: Run lint**

```
npm run lint
```
Expected: No errors.

**Step 3: Run build**

```
npm run build
```
Expected: Build succeeds with output in `dist/`.

**Step 4: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "chore: fix any lint/build issues after multi-agent architecture setup"
```
