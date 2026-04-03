# Hero Orb Animation Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a premium hero intro animation for the Astro portfolio using GSAP for entry choreography, CSS for lightweight ambient motion, and a robust intro state that temporarily hides the header and blocks scrolling until the sequence completes.

**Architecture:** The hero remains DOM-first with `HeroOrb.astro` as the visual structure, global CSS files as the source of visual and responsive truth, and a small `src/lib/animations/hero/` module set as the animation boundary. `BaseLayout.astro` provides page eligibility state, `HeroSection.astro` boots the runtime entrypoint, and the intro lifecycle uses a single body attribute to coordinate header visibility, scroll locking, and safe release paths.

**Tech Stack:** Astro, TypeScript, GSAP, Vitest, global CSS, raw-source regression tests.

---

## File Map

### Existing files to modify
- `package.json`
  Add `gsap` as a dependency.
- `package-lock.json`
  Record the resolved `gsap` dependency state after install.
- `src/pages/index.astro`
  Pass an explicit layout prop enabling hero intro eligibility on the Spanish home page.
- `src/pages/en/index.astro`
  Pass the same layout prop on the English home page.
- `src/layouts/BaseLayout.astro`
  Accept the new hero-intro eligibility prop and render the `data-hero-intro-eligible` body attribute.
- `src/components/organisms/HeroSection.astro`
  Add stable animation hooks for text targets and bootstrap `init-hero-intro.ts`.
- `src/components/atoms/HeroOrb.astro`
  Expand the current orb markup into explicit layers for core, rings, orbital wrappers, and secondary orbs while keeping three orb bodies in the DOM.
- `src/styles/components/hero.css`
  Add intro-state-driven content states and any hero-level interaction/visibility rules.
- `src/styles/components/hero-orb.css`
  Add the refined orb geometry, static states, mobile intensity adjustments, and CSS ambient motion helpers.
- `src/styles/components/header.css`
  Hide the header only when `body[data-hero-intro-state="active"]` is present.
- `tests/content/map-home-page.test.ts`
  Update or trim any assertions that no longer match the new `HeroOrb.astro` or hero bootstrap structure.

### New files to create
- `src/lib/animations/hero/init-hero-intro.ts`
  Runtime bootstrap and lifecycle owner.
- `src/lib/animations/hero/create-hero-intro.ts`
  Builds the GSAP hero intro controller.
- `src/lib/animations/hero/hero-motion-config.ts`
  Centralized selectors, breakpoint constants, and variant resolution helpers.
- `src/lib/animations/hero/hero-motion-state.ts`
  Owns `pending/active/released` body state transitions, inert application, and fail-open recovery.
- `tests/content/hero-intro-animation.test.ts`
  Focused raw-source regression test for the new hero intro architecture.
- `tests/design-system/hero-intro-state.test.ts`
  Small behavior-level test for intro state lifecycle and fail-open semantics.

### Verification commands used across tasks
- Focused architecture test: `npm test -- tests/content/hero-intro-animation.test.ts`
- Existing regression suite: `npm test -- tests/content/map-home-page.test.ts`
- Full checks: `npm run check`
- Production build: `npm run build`

## Chunk 1: Foundation and Eligibility

### Task 1: Add the GSAP dependency and home-page eligibility contract

**Files:**
- Modify: `package.json`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/en/index.astro`
- Modify: `src/layouts/BaseLayout.astro`
- Create: `tests/content/hero-intro-animation.test.ts`
- Create: `tests/design-system/hero-intro-state.test.ts`

- [ ] **Step 1: Write the failing test for layout eligibility**

Add a new focused test file `tests/content/hero-intro-animation.test.ts` that reads raw source from:
- `src/pages/index.astro`
- `src/pages/en/index.astro`
- `src/layouts/BaseLayout.astro`
- `src/components/templates/HomeTemplate.astro`

Include assertions equivalent to:

```ts
expect(indexSource).toContain('enableHeroIntro');
expect(enIndexSource).toContain('enableHeroIntro');
expect(layoutSource).toContain('enableHeroIntro?: boolean');
expect(layoutSource).toContain('data-hero-intro-eligible');
expect(homeTemplateSource).not.toContain('enableHeroIntro');
```

- [ ] **Step 2: Run the new test to verify it fails**

Run: `npm test -- tests/content/hero-intro-animation.test.ts`
Expected: FAIL because the new layout prop and body attribute do not exist yet.

- [ ] **Step 3: Add GSAP to the project manifest**

Run `npm install gsap` so both `package.json` and `package-lock.json` are updated consistently.

Expected manifest entry:

```json
"gsap": "^3.12.5"
```

Do not add any extra animation libraries.

- [ ] **Step 4: Add explicit home-page eligibility in both page entries**

Update:
- `src/pages/index.astro`
- `src/pages/en/index.astro`

Pass a new boolean prop to `BaseLayout.astro`:

```astro
enableHeroIntro
```

This must only appear on the two home pages.

- [ ] **Step 5: Implement the eligibility attribute in `BaseLayout.astro`**

Add a typed prop:

```ts
enableHeroIntro?: boolean;
```

and render the body contract:

```astro
<body class="site-shell" data-hero-intro-eligible={enableHeroIntro ? 'true' : undefined}>
```

Do not set `data-hero-intro-state` in layout markup yet. That state belongs to runtime motion state management.

- [ ] **Step 6: Run the focused eligibility test again**

Run: `npm test -- tests/content/hero-intro-animation.test.ts`
Expected: PASS for the new eligibility assertions.

- [ ] **Step 7: Commit the foundation contract**

Run:

```bash
git add package.json package-lock.json src/pages/index.astro src/pages/en/index.astro src/layouts/BaseLayout.astro tests/content/hero-intro-animation.test.ts
git commit -m "feat: add hero intro eligibility contract"
```

Expected: commit created on the current branch.

### Task 2: Add the runtime motion skeleton before full choreography

**Files:**
- Create: `src/lib/animations/hero/init-hero-intro.ts`
- Create: `src/lib/animations/hero/hero-motion-config.ts`
- Create: `src/lib/animations/hero/hero-motion-state.ts`
- Modify: `tests/content/hero-intro-animation.test.ts`
- Create: `tests/design-system/hero-intro-state.test.ts`

- [ ] **Step 1: Extend the failing test for the motion module skeleton**

Add raw-source assertions equivalent to:

```ts
expect(initSource).toContain('initHeroIntro');
expect(stateSource).toContain('enterPendingIntro');
expect(stateSource).toContain('activateIntro');
expect(stateSource).toContain('releaseIntro');
expect(stateSource).toContain('failOpenIntro');
expect(stateSource).toContain('data-hero-intro-state');
expect(configSource).toContain('48rem');
expect(configSource).toContain('prefers-reduced-motion');
```

- [ ] **Step 2: Write the failing behavior tests for intro state semantics**

Create `tests/design-system/hero-intro-state.test.ts` with exact lifecycle checks such as:

```ts
it('failOpenIntro ends in released', () => {
  failOpenIntro();
  expect(document.body.dataset.heroIntroState).toBe('released');
});

it('initHeroIntro reduced-motion path never enters active', () => {
  // mock reduced motion matchMedia
  initHeroIntro(root);
  expect(document.body.dataset.heroIntroState).toBe('released');
});
```

- [ ] **Step 3: Run the focused tests to verify the new assertions fail**

Run:

```bash
npm test -- tests/content/hero-intro-animation.test.ts
npm test -- tests/design-system/hero-intro-state.test.ts
```

Expected: FAIL because the files and lifecycle behavior do not exist yet.

- [ ] **Step 4: Create `hero-motion-config.ts` with minimal variant helpers**

Implement only the small plan-ready surface:

```ts
export const HERO_MOBILE_BREAKPOINT = '(max-width: 48rem)';
export const HERO_REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export function resolveHeroMotionVariant() {
  // returns 'reduced' | 'mobile' | 'desktop'
}
```

No choreography here.

- [ ] **Step 5: Create `hero-motion-state.ts` with the lifecycle API only**

Implement the exact exported surface:

```ts
export function enterPendingIntro() {}
export function activateIntro() {}
export function releaseIntro() {}
export function failOpenIntro() {}
```

Rules to encode now:
- own `body[data-hero-intro-state]`
- use only `pending`, `active`, and `released`
- only `active` hides header / locks page
- `pending` is preparation only
- `failOpenIntro()` ends in `released`
- apply and remove `inert` for `.site-header` during `active`

- [ ] **Step 6: Create `init-hero-intro.ts` as the runtime entrypoint skeleton**

Implement an exported bootstrap function with this required behavior:

```ts
export function initHeroIntro(root: HTMLElement) {
  // enter pending state
  // resolve variant
  // release immediately for reduced motion, then trigger a minimal non-gating reveal stub
  // route setup errors through failOpenIntro()
}
```

Required behavior in this task:
- call `enterPendingIntro()` before resolving the branch outcome
- call `releaseIntro()` for the reduced-motion branch
- trigger a minimal softened reveal stub after release in the reduced-motion branch
- for desktop/mobile in this chunk, immediately call `releaseIntro()` after `enterPendingIntro()` so the later HeroSection bootstrap cannot leave the page in an unfinished intro state
- call `failOpenIntro()` on setup errors

Do not wire `create-hero-intro.ts` yet.

- [ ] **Step 7: Run the focused tests again**

Run:

```bash
npm test -- tests/content/hero-intro-animation.test.ts
npm test -- tests/design-system/hero-intro-state.test.ts
```

Expected:
- raw-source assertions PASS
- behavior-level state tests PASS for:
- `failOpenIntro()` ends in `released`
- `initHeroIntro()` reduced-motion path moves from `pending` to `released`
- `initHeroIntro()` reduced-motion path never enters `active`

- [ ] **Step 8: Commit the runtime foundation**

Run:

```bash
git add src/lib/animations/hero/init-hero-intro.ts src/lib/animations/hero/hero-motion-config.ts src/lib/animations/hero/hero-motion-state.ts tests/content/hero-intro-animation.test.ts tests/design-system/hero-intro-state.test.ts
git commit -m "feat: add hero intro runtime foundation"
```

Expected: commit created on the current branch.

## Chunk 2: Hero Markup, CSS States, and Runtime Wiring

### Task 3: Refactor `HeroOrb.astro` into explicit animation layers

**Files:**
- Modify: `src/components/atoms/HeroOrb.astro`
- Modify: `src/styles/components/hero-orb.css`
- Modify: `tests/content/hero-intro-animation.test.ts`
- Modify: `tests/content/map-home-page.test.ts`

- [ ] **Step 1: Write the failing structure assertions**

Add assertions for named layers so the DOM remains stable for GSAP selectors. Assert for markup fragments such as:

```ts
expect(heroOrbSource).toContain('hero__orb-rings');
expect(heroOrbSource).toContain('hero__orb-ring hero__orb-ring--inner');
expect(heroOrbSource).toContain('hero__orb-ring hero__orb-ring--middle');
expect(heroOrbSource).toContain('hero__orb-ring hero__orb-ring--outer');
expect(heroOrbSource).toContain('hero__orb-orbit hero__orb-orbit--alpha');
expect(heroOrbSource).toContain('hero__orb-orbit hero__orb-orbit--beta');
expect(heroOrbSource).toContain('hero__orb-orbit hero__orb-orbit--gamma');
expect(heroOrbSource).toContain('hero__orb-satellite');
```

Update `map-home-page.test.ts` to replace the old `.hero__orb-pulse` assertions with the exact new ring/orbit/satellite assertions if the pulse naming is removed.

- [ ] **Step 2: Run the focused test and existing hero regression test**

Run:

```bash
npm test -- tests/content/hero-intro-animation.test.ts
npm test -- tests/content/map-home-page.test.ts
```

Expected: FAIL because the current orb markup still uses the old pulse structure.

- [ ] **Step 3: Rewrite `HeroOrb.astro` with stable wrappers**

Keep three satellites in the DOM and introduce clear layers:

```astro
<div class="hero__orb" data-hero-orb>
  <span class="hero__orb-core" data-hero-core></span>
  <div class="hero__orb-rings">
    <span class="hero__orb-ring hero__orb-ring--inner" data-hero-ring="inner"></span>
    <span class="hero__orb-ring hero__orb-ring--middle" data-hero-ring="middle"></span>
    <span class="hero__orb-ring hero__orb-ring--outer" data-hero-ring="outer"></span>
  </div>
  <div class="hero__orb-orbit hero__orb-orbit--alpha" data-hero-orbit="alpha">
    <span class="hero__orb-satellite" data-hero-satellite="alpha"></span>
  </div>
  <div class="hero__orb-orbit hero__orb-orbit--beta" data-hero-orbit="beta">
    <span class="hero__orb-satellite" data-hero-satellite="beta"></span>
  </div>
  <div class="hero__orb-orbit hero__orb-orbit--gamma" data-hero-orbit="gamma">
    <span class="hero__orb-satellite" data-hero-satellite="gamma"></span>
  </div>
</div>
```

Avoid inline styles and keep orbit radii configurable from CSS.

- [ ] **Step 4: Update `hero-orb.css` to match the new structure**

Add the static orbital geometry first:
- ring sizes
- orbit wrapper radii
- satellite appearance
- mobile reduced intensity rules

Do not add final keyframe polish yet beyond the minimum ambient hooks.

- [ ] **Step 5: Run the tests again**

Run:

```bash
npm test -- tests/content/hero-intro-animation.test.ts
npm test -- tests/content/map-home-page.test.ts
```

Expected: PASS.

- [ ] **Step 6: Verify the static hero baseline manually**

Check the page in the browser with animation logic not yet active and confirm:
- the three satellites render
- the frozen orb already feels balanced and premium
- hero text remains legible over the orb
- no static layout regression was introduced on desktop or mobile

- [ ] **Step 7: Commit the orb structure refactor**

Run:

```bash
git add src/components/atoms/HeroOrb.astro src/styles/components/hero-orb.css tests/content/hero-intro-animation.test.ts tests/content/map-home-page.test.ts
git commit -m "refactor: prepare hero orb animation layers"
```

### Task 4: Wire `HeroSection.astro` and intro-state CSS

**Files:**
- Modify: `src/components/organisms/HeroSection.astro`
- Modify: `src/styles/components/hero.css`
- Modify: `src/styles/components/header.css`
- Modify: `tests/content/hero-intro-animation.test.ts`

- [ ] **Step 1: Write the failing wiring assertions**

Add assertions for:

```ts
expect(heroSource).toContain('data-hero-root');
expect(heroSource).toContain('document.body.dataset.heroIntroEligible');
expect(heroSource).toContain('data-hero-title');
expect(heroSource).toContain('data-hero-support');
expect(heroSource).toContain('data-hero-descriptors');
expect(heroSource).toContain('data-hero-scroll');
expect(heroSource).toContain('initHeroIntro');
expect(heroCssSource).toContain('data-hero-intro-state');
expect(headerCssSource).toContain('data-hero-intro-state="active"');
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- tests/content/hero-intro-animation.test.ts`
Expected: FAIL.

- [ ] **Step 3: Add stable hero targets and bootstrap in `HeroSection.astro`**

Introduce dataset hooks on:
- hero root
- title name
- title support line
- descriptor list
- scroll indicator

Load the runtime bootstrap with a concrete inline `<script type="module">` inside `HeroSection.astro` that imports `initHeroIntro` and calls it only when:
- `[data-hero-root]` exists
- `document.body.dataset.heroIntroEligible === 'true'`

Keep the integration point in `HeroSection.astro`, not in `BaseLayout.astro`.

- [ ] **Step 4: Add intro-state CSS in `hero.css` and `header.css`**

Implement only the state contract first:
- header hidden only during `body[data-hero-intro-state="active"]`
- scroll locked only during `body[data-hero-intro-state="active"]`
- visual scrollbar suppression only during `body[data-hero-intro-state="active"]`
- hero content hidden/offset base states compatible with GSAP entry
- scrollbar-gutter stability and intro-safe layout

Do not over-style the header reveal; keep it short and subtle if transitioned at all.

- [ ] **Step 5: Run the focused test and Astro checks again**

Run:

```bash
npm test -- tests/content/hero-intro-animation.test.ts
npm run check
```

Expected:
- raw-source test PASS
- `npm run check` PASS so the inline module script and imports are valid

- [ ] **Step 6: Verify the `active` CSS contract manually**

Using devtools or a temporary body attribute toggle, verify `body[data-hero-intro-state="active"]` produces all of these outcomes:
- header hidden
- scroll blocked
- scrollbar visually suppressed
- scrollbar gutter remains stable

- [ ] **Step 7: Commit the wiring layer**

Run:

```bash
git add src/components/organisms/HeroSection.astro src/styles/components/hero.css src/styles/components/header.css tests/content/hero-intro-animation.test.ts
git commit -m "feat: wire hero intro targets and state styles"
```

## Chunk 3: Choreography, Release Logic, and Verification

### Task 5: Implement the hero intro controller and lifecycle ownership

**Files:**
- Create: `src/lib/animations/hero/create-hero-intro.ts`
- Modify: `src/lib/animations/hero/init-hero-intro.ts`
- Modify: `src/lib/animations/hero/hero-motion-state.ts`
- Modify: `tests/content/hero-intro-animation.test.ts`
- Modify: `tests/design-system/hero-intro-state.test.ts`

- [ ] **Step 1: Write the failing controller assertions**

Add assertions equivalent to:

```ts
expect(createSource).toContain('export function createHeroIntro');
expect(createSource).toContain('play(): Promise<void>');
expect(createSource).toContain('destroy()');
expect(stateSource).toContain('data-hero-intro-state');
expect(stateSource).toContain('inert');
expect(initSource).toContain('createHeroIntro');
expect(initSource).toContain('releaseIntro()');
expect(initSource).toContain('failOpenIntro()');
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- tests/content/hero-intro-animation.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement the timeline phase assembly in `create-hero-intro.ts`**

Implement the controller shape:

```ts
export function createHeroIntro(root: HTMLElement, variant: HeroMotionVariant) {
  return {
    timeline,
    play: () => Promise<void>,
    destroy: () => void,
  };
}
```

Contract to implement:
- intro phases A-F from the approved spec
- keep selector lookup and timeline assembly localized to this file

- [ ] **Step 4: Implement the controller promise lifecycle in `create-hero-intro.ts`**

Implement:
- promise resolves when gated intro is complete
- ambient motion continues after resolve
- promise rejects on cancellation/teardown/runtime failure

- [ ] **Step 5: Implement `destroy()` ownership in `create-hero-intro.ts`**

Implement:
- idempotent `destroy()`
- kill intro timeline and owned ambient loops
- remove owned listeners
- reject pending `play()` with cancellation semantics

- [ ] **Step 6: Finish `hero-motion-state.ts` with concrete state transitions**

Implement:
- `pending -> active -> released`
- `pending -> released` for reduced motion and fail-open cases
- `inert` toggling for the header root and the hero scroll indicator / other gated hero affordances now that those selectors exist
- no focus trap and no forced focus changes during `active`
- idempotent release/fail-open behavior

Use a single body attribute, not scattered classes.

- [ ] **Step 7: Wire the normal desktop/mobile orchestration in `init-hero-intro.ts`**

Implement the ownership flow:
- resolve variant
- enter pending
- activate and play for desktop/mobile
- release on success
- fail open on setup errors or destroy path
- wire teardown cleanup in the same bootstrap layer so navigating away or aborting the sequence calls `controller.destroy()` before the page is left in `active`

- [ ] **Step 8: Wire the reduced-motion orchestration in `init-hero-intro.ts`**

Implement the reduced branch explicitly:
- `pending -> released`
- trigger the softened reduced-motion reveal after `releaseIntro()`
- never enter `active`

- [ ] **Step 9: Extend `tests/design-system/hero-intro-state.test.ts` for full lifecycle coverage**

Add exact behavior checks for:
- desktop/mobile `pending -> active -> released`
- reduced motion never entering `active`
- idempotent `releaseIntro()` and `failOpenIntro()`
- destroy/cancel routing to released fail-open semantics

- [ ] **Step 10: Run the focused architecture and state tests**

Run:

```bash
npm test -- tests/content/hero-intro-animation.test.ts
npm test -- tests/design-system/hero-intro-state.test.ts
```

Expected: PASS.

- [ ] **Step 11: Commit the intro controller**

Run:

```bash
git add src/lib/animations/hero/create-hero-intro.ts src/lib/animations/hero/init-hero-intro.ts src/lib/animations/hero/hero-motion-state.ts tests/content/hero-intro-animation.test.ts tests/design-system/hero-intro-state.test.ts
git commit -m "feat: implement hero intro lifecycle"
```

### Task 6: Tune reduced motion, mobile intensity, and ambient loops

**Files:**
- Modify: `src/lib/animations/hero/hero-motion-config.ts`
- Modify: `src/lib/animations/hero/create-hero-intro.ts`
- Modify: `src/styles/components/hero-orb.css`
- Modify: `src/styles/components/hero.css`
- Modify: `tests/content/hero-intro-animation.test.ts`

- [ ] **Step 1: Write failing assertions for variant handling**

Add assertions for:

```ts
expect(configSource).toContain('HERO_MOBILE_BREAKPOINT');
expect(configSource).toContain('HERO_REDUCED_MOTION_QUERY');
expect(createSource).toContain('desktop');
expect(createSource).toContain('mobile');
expect(createSource).toContain('reduced');
expect(heroOrbCssSource).toContain('@media (max-width: 48rem)');
```

- [ ] **Step 2: Run the focused test to verify the variant assertions fail**

Run: `npm test -- tests/content/hero-intro-animation.test.ts`
Expected: FAIL until the explicit `desktop` / `mobile` / `reduced` branches and media-query contract exist in source.

- [ ] **Step 3: Tune the motion branches minimally**

Implement the plan-level differences:
- desktop: full intro + 3 active orbit bodies
- mobile: same structure with shorter travel and softer glow
- reduced motion: softened reveal with no prolonged lock and no pronounced orbit choreography

Keep the branch logic data-driven from `hero-motion-config.ts`.

- [ ] **Step 4: Add or refine CSS ambient helpers**

Use CSS for only the simple perpetual effects that do not justify GSAP ownership:
- micro pulse
- gentle glow breathing

Avoid moving the orbital choreography itself into CSS if GSAP already owns that path.

- [ ] **Step 5: Run the focused architecture test again**

Run: `npm test -- tests/content/hero-intro-animation.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit the variant tuning**

Run:

```bash
git add src/lib/animations/hero/hero-motion-config.ts src/lib/animations/hero/create-hero-intro.ts src/styles/components/hero-orb.css src/styles/components/hero.css tests/content/hero-intro-animation.test.ts
git commit -m "feat: tune hero intro motion variants"
```

### Task 7: Final verification and regression safety

**Files:**
- Modify: `tests/content/map-home-page.test.ts`
- Modify: `tests/content/hero-intro-animation.test.ts`
- Modify: any touched source files only if verification reveals a real issue

- [ ] **Step 1: Add final regression assertions for fail-open and state semantics**

Add raw-source assertions that make the architectural contract hard to regress, for example:

```ts
expect(stateSource).toContain("'pending'");
expect(stateSource).toContain("'active'");
expect(stateSource).toContain("'released'");
expect(stateSource).toContain('failOpenIntro');
expect(heroSource).toContain('data-hero-root');
```

- [ ] **Step 2: Run both focused tests**

Run:

```bash
npm test -- tests/content/hero-intro-animation.test.ts
npm test -- tests/content/map-home-page.test.ts
```

Expected: PASS.

- [ ] **Step 3: Run project verification**

Run:

```bash
npm run check
npm run build
```

Expected:
- `npm run check`: PASS with no new Astro diagnostics
- `npm run build`: PASS and emit the production site successfully

- [ ] **Step 4: Run runtime verification for state transitions and gating**

Verify manually in browser or Playwright with these expected outcomes:
- desktop load: `pending -> active -> released`
- mobile load: `pending -> active -> released` with softer motion
- reduced-motion load: `pending -> released`
- header hidden only during `active`
- scroll blocked only during `active`
- no visible layout jump when scroll is restored
- no focus trap created during intro
- fail-open on setup error returns the page to `released` using a temporary forced-init error flag or a mocked `createHeroIntro()` rejection
- teardown/cancel path returns the page to `released` by navigating away or calling controller `destroy()` before `play()` resolves
- normal intro restores interaction within roughly `1.8s` to `2.8s`

- [ ] **Step 5: If any verification fails, make the smallest corrective change and rerun only the affected command first**

Examples:
- failing raw-source test: adjust the exact selector/markup contract
- Astro diagnostic: fix type/import/bootstrap mismatch
- build-only failure: fix client-side import or environment assumptions

- [ ] **Step 6: Commit the verified implementation**

Run:

```bash
git add tests/content/map-home-page.test.ts tests/content/hero-intro-animation.test.ts tests/design-system/hero-intro-state.test.ts src/components/organisms/HeroSection.astro src/components/atoms/HeroOrb.astro src/layouts/BaseLayout.astro src/lib/animations/hero src/styles/components/hero.css src/styles/components/hero-orb.css src/styles/components/header.css package.json package-lock.json
git commit -m "feat: add animated hero intro sequence"
```

- [ ] **Step 7: Capture a short implementation note in the PR or handoff summary**

Include:
- GSAP owns intro choreography
- CSS owns lightweight ambient motion
- `data-hero-intro-state` is the single page-level contract
- reduced motion uses `pending -> released`

## Completion Criteria
- The hero intro runs on each page load for `/` and `/en/` only.
- The header is hidden only during the active cinematic intro.
- Scroll is blocked only during the active cinematic intro.
- The orb sequence follows the approved order: core, rings, satellites, orbit, text, release.
- Mobile preserves the same idea with less intensity.
- Reduced motion avoids prolonged gating while preserving the composition.
- Raw-source regression tests protect the architecture and markup contracts.
- `npm run check` and `npm run build` pass.

## Execution Notes
- Work on the current branch only, per user preference.
- Keep changes minimal and aligned with the repo's existing Astro + global CSS architecture.
- Do not introduce a generic site-wide animation framework in this pass.
- If the plan reveals a smaller, cleaner file split while implementing, keep the same ownership boundaries instead of inventing new abstractions.

Plan complete and saved to `docs/superpowers/plans/2026-04-02-hero-orb-animation-implementation.md`. Ready to execute?
