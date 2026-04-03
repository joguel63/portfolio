# Hero Orb Animation Design

## Goal
Define a maintainable, premium, and performance-conscious implementation plan for the home hero animation in the Astro portfolio, using GSAP for entry choreography and CSS for lightweight continuous motion where it makes sense.

## Context
- The repository is an Astro static site with global CSS files imported from `src/layouts/BaseLayout.astro`.
- The current hero already exists in `src/components/organisms/HeroSection.astro` and uses `src/components/atoms/HeroOrb.astro` plus `src/styles/components/hero.css` and `src/styles/components/hero-orb.css`.
- The current orb is a static HTML/CSS construct composed of one core, three rings, and three secondary nodes.
- GSAP is not yet installed in the project.
- The user wants the hero to feel futuristic, clean, premium, and subtle, without over-engineering.
- The user wants the hero solution to establish a reusable animation architecture for future sections of the landing.

## Approved Product Decisions

### Playback Behavior
- The hero intro runs on each page load.
- The intro is contemplative: the hero should briefly prioritize the animation sequence before normal page interaction.
- The hero text enters only after the orb system is fully established.
- The overall intro should feel medium-length and premium, not abrupt and not theatrical.
- Planning should treat the intro as having a practical ceiling of roughly 1.8s to 2.8s before normal interaction is restored.

### Orb Motion Behavior
- The orb system begins with a single central point.
- Three concentric rings expand outward from that center.
- The DOM structure should keep three secondary orb layers so selectors and geometry remain stable.
- Desktop may animate all three as active orbiting bodies.
- Mobile or reduced-motion variants may soften or visually demote one orb, but should not require a different markup count.
- The secondary orbs enter first and then transition into continuous orbit.
- Their persistent state includes subtle orbital motion plus micro pulse/glow.

### Responsive and Accessibility Behavior
- Mobile should preserve the same idea as desktop, but with reduced intensity and reduced orbital travel.
- `prefers-reduced-motion` should keep the same composition but use a much softer motion profile.
- Reduced-motion should not preserve the full cinematic lock. It may keep a very brief reveal state, but interaction should be restored quickly once the composition is readable.

### Intro Gating Behavior
- During the intro, scrolling is temporarily blocked.
- During the intro, the header is not shown.
- The scrollbar should be visually hidden during the intro.
- CSS must reserve scrollbar space so that no layout jump occurs when the intro completes and scrolling is restored.
- The intro gating state must fail open: if client initialization fails, normal scroll and header visibility must be restored immediately rather than leaving the page locked.
- During `active`, page-level pointer and keyboard interaction outside the cinematic sequence should be treated as gated.
- During `active`, header actions and scroll affordances are not interactive.
- The hero's own final interactive affordances, such as the scroll indicator, become usable only after transition to `released`.

Active interaction contract:
- Do not create a focus trap.
- Keep focus on the document/body unless the user explicitly initiated focus before intro activation.
- Apply `inert` to the header and any hero affordances that should not be interactive during `active`.
- Remove `inert` when the state changes to `released`.
- Do not rely on scattered event suppression or ad-hoc `tabindex` mutation as the primary gating mechanism.

### Eligibility Rule
- The intro applies only on the two home routes that render `HeroSection.astro`: `/` and `/en/`.
- Eligibility is declared by the page when rendering `BaseLayout.astro`, not inferred from arbitrary route matching.
- Non-home routes must never enter hero intro gating state.

## Recommended Approach

### Implementation Strategy
Use the existing Astro + global CSS structure as the visual foundation and introduce GSAP as a focused orchestration layer for the hero timeline.

The visual system should remain DOM-first:
- Astro defines the hero structure.
- CSS defines static appearance, responsive geometry, and lightweight ambient motion.
- GSAP controls the entrance sequence, timing relationships, and transition from intro state to persistent live state.

This approach best matches the current repository patterns and avoids turning the hero into an isolated animation island with overly complex rendering logic.

### What GSAP Should Own
- Initial reveal of the central point.
- Expansion of the three rings.
- Entrance of the secondary orbs.
- Activation of continuous orbital motion.
- Staggered reveal of the hero content after the orb system settles.
- Temporary intro gating state: header hidden, scroll disabled, scrollbar visually suppressed.

### What CSS Should Own
- Base visual geometry of the orb system.
- Glow, ring styling, and non-timeline cosmetic states.
- Low-cost persistent micro pulse or glow breathing where a CSS loop is simpler than a GSAP timeline.
- Responsive scaling and reduced-intensity variants by breakpoint.
- Reduced-motion overrides where they can be expressed declaratively.

### DOM vs SVG
The orb should remain primarily DOM-based using `div`/`span` layers rather than moving to a full SVG implementation.

Reasoning:
- The current hero already follows this pattern.
- The desired geometry is simple enough to express cleanly with layered DOM elements.
- DOM + CSS will be easier to tune visually inside the existing project structure.
- SVG would add precision, but the current brief values ease of adjustment and maintainability over maximal geometric control.

SVG should only be reconsidered later if the design evolves toward path-based choreography, complex stroke animation, or non-circular orbital systems.

## Hero Layer Breakdown

### Orb System Container
The orb system container is the absolute-positioned visual stage behind the hero content. It owns overall footprint, center point alignment, layering, and responsive scale boundaries. Its responsibility is to create the spatial field that anchors the hero, not to compete with the content after the intro.

### Central Point
The central point is the first visible element and the narrative source of the entire sequence. It establishes the visual origin, attracts the first fixation point, and becomes the stable anchor around which the rest of the system unfolds.

### Concentric Rings
The three rings are the structural expansion of the center. They communicate precision, propagation, and controlled energy. Their role is to transform the hero from a single luminous point into a readable system.

### Secondary Orbs
The secondary orbs are the first dynamic agents in the scene after the system structure exists. They turn the background from static composition into a living mechanism. They must feel subordinate to the center, never like competing focal points.

### Orbital Wrappers
Orbital wrappers are technical layers that may not be visually distinct but are architecturally important. They define orbital radius, transform origin, and rotation behavior so that the orbs can move cleanly without hard-to-maintain manual positioning logic.

### Hero Title: Name
The name is the first content block and should inherit focus after the orb system stabilizes. It converts attention from spectacle to identity.

### Hero Title: Support Line
The support line extends the name into a fuller statement of positioning. It should enter close enough to the name to feel like one headline unit while still having a subtle offset that adds polish.

### Descriptor List
The descriptor list grounds the hero in practical meaning after the impact of the headline. It should arrive after the headline so it reads as supporting information rather than competing information.

### Scroll Indicator
The scroll indicator is the final activation signal that the intro is complete and the page is now navigable. It should reinforce continuity toward the rest of the landing rather than act as a primary focal object.

## Proposed Animation Sequence

### Sequence Logic
The sequence should direct focus in this order:
1. Origin
2. Structure
3. Motion
4. Message

This order matches the desired contemplative feeling and prevents the hero from becoming a busy simultaneous reveal.

### Phase A: Silent Origin
The first visible element is the central point alone. This creates a moment of silence and gives the eye a single obvious place to land.

### Phase B: Structural Expansion
The three rings expand outward from the center in a controlled progression from inner to outer. Their reveals may slightly overlap so the sequence feels intentional rather than mechanical, but the growth must still read as ordered propagation.

### Phase C: Secondary Orb Arrival
Once the ring system is established, the secondary orbs appear. They should not begin in full motion immediately. First they become visible as members of the system, then they transition into orbit.

### Phase D: Live System Activation
The secondary orbs begin continuous orbital motion and subtle pulse/glow. This marks the point where the background stops being an event and becomes an ambient living system.

### Phase E: Hero Content Entrance
Only after the orbital system is visibly alive should the hero content enter. Recommended content order:
- Name
- Support line
- Descriptor list
- Scroll indicator

This preserves the approved rule that the orb system completes before text begins.

### Phase F: Intro Release
After the content is in place, the intro state is released:
- the header becomes visible
- scroll locking is removed
- the page transitions from cinematic opening to normal interaction state

### Timing Principles
The spec intentionally avoids arbitrary fixed durations. Instead, the implementation should validate against these timing criteria:
- The center should be readable before the rings begin.
- The rings should establish structure before the orbs orbit.
- The orbital motion should feel active before the text enters.
- The full sequence should feel medium-length and premium.
- The release to interactive state should happen immediately after the hero message becomes readable, not after an additional ornamental pause.

Planning should use these target timing ranges:
- Phase A, center reveal: about 0.15s to 0.3s
- Phase B, ring expansion: about 0.45s to 0.8s total, with slight internal overlap
- Phase C, secondary orb arrival: about 0.25s to 0.5s
- Phase D, orbital activation settle: about 0.25s to 0.45s before text starts
- Phase E, content entrance: about 0.45s to 0.8s total
- Phase F, intro release: immediate at the end of content entrance or within about 0.1s to 0.2s after readability is achieved

These ranges are planning guidance rather than final tuning mandates. They exist to keep implementation within the approved overall ceiling while preserving the intended visual order.

### Variant Matrix

| Variant | Orb Count in DOM | Active Orbit Bodies | Intro Gating | Motion Intensity | Expected Outcome |
|---------|------------------|---------------------|--------------|------------------|------------------|
| Desktop default | 3 | 3 | Full | Standard | Full cinematic sequence with medium premium pacing |
| Mobile default | 3 | 2-3, with one optionally visually demoted but still present in DOM | Full | Reduced | Same concept with tighter travel, softer glow, and less background dominance |
| Reduced motion | 3 | 0-2 visually softened bodies, no pronounced orbit choreography | No full gating | Minimal | Same composition, readable quickly, no prolonged interaction lock |

## Technical Architecture

### Existing Files That Remain Core
- `src/components/organisms/HeroSection.astro`
- `src/components/atoms/HeroOrb.astro`
- `src/styles/components/hero.css`
- `src/styles/components/hero-orb.css`
- `src/layouts/BaseLayout.astro`

### Recommended Additions
Introduce a dedicated animation boundary under `src/lib/animations/hero/`.

Suggested structure:

```text
src/
  lib/
    animations/
      hero/
        init-hero-intro.ts
        create-hero-intro.ts
        hero-motion-config.ts
        hero-motion-state.ts
```

Responsibilities:
- `init-hero-intro.ts`: runtime bootstrap entrypoint invoked by the home hero and responsible for lifecycle order.
- `create-hero-intro.ts`: build and return the hero GSAP choreography only, without owning document-level lifecycle behavior.
- `hero-motion-config.ts`: centralize constants such as selectors, intensity presets, breakpoint-aware values, and reduced-motion branching inputs.
- `hero-motion-state.ts`: own global intro state concerns, especially scroll locking, header visibility control, and fail-safe release behavior.

This is intentionally small. It is not a generic site-wide animation framework. It is a focused hero module that leaves space for later shared utilities if future sections justify them.

### Module Interface Contract
The interface between the hero timeline and intro state should be explicit.

`hero-motion-state.ts` owns the document-level state lifecycle through this concrete API:
- `enterPendingIntro()`
- `activateIntro()`
- `releaseIntro()`
- `failOpenIntro()`

State storage contract:
- `BaseLayout.astro` renders `data-hero-intro-eligible="true"` only on eligible home pages.
- `hero-motion-state.ts` owns a single body attribute: `data-hero-intro-state`.
- Allowed values are `pending`, `active`, and `released`.
- `pending` is pre-intro preparation only. It is not a locked or header-hidden state.
- `header.css` consumes `body[data-hero-intro-state="active"]` as the only header-hiding contract.
- Scroll locking and scrollbar visibility rules also key off `body[data-hero-intro-state="active"]`.
- `failOpenIntro()` must always set the state to `released`, never remove the attribute, so CSS and JS share one stable end-state contract.

`create-hero-intro.ts` should not directly mutate document-level intro state. It should:
- accept the hero root element and resolved motion variant
- build the GSAP timeline for the hero only
- return a small controller object with exactly:
  - `timeline`
  - `play(): Promise<void>`
  - `destroy()`

`play()` resolves only when the gated intro sequence has completed and the page is ready to transition to `released`.
It does not wait for perpetual ambient motion loops. Continuous live motion begins before or at the end of intro completion and then continues independently after the promise resolves.
If the intro sequence cannot complete normally because of teardown, cancellation, or runtime failure, `play()` rejects so `init-hero-intro.ts` can call `failOpenIntro()`.

`destroy()` contract:
- It is idempotent.
- It stops the intro timeline and any ambient GSAP loops owned by the controller.
- It removes listeners owned by the controller.
- If `play()` is still pending, `destroy()` causes it to reject with a cancellation error so bootstrap cleanup can route through `failOpenIntro()`.

`init-hero-intro.ts` uses that controller to own the lifecycle while `create-hero-intro.ts` stays responsible only for hero choreography.

`init-hero-intro.ts` owns the runtime orchestration order:
1. verify that the hero root exists
2. call `enterPendingIntro()`
3. resolve the motion variant
4. if the variant is reduced motion, call `releaseIntro()` and run only the softened reveal path
5. otherwise call `activateIntro()`, create the timeline, and start it
6. on successful completion, call `releaseIntro()`
7. on setup error, cancellation, or early exit, call `failOpenIntro()`

### Intro State Lifecycle Table

| Variant | State Path | Header Behavior | Scroll Behavior |
|---------|------------|-----------------|-----------------|
| Desktop default | `pending -> active -> released` | Hidden only during `active` | Locked only during `active` |
| Mobile default | `pending -> active -> released` | Hidden only during `active` | Locked only during `active` |
| Reduced motion | `pending -> released` | Never enters full hidden cinematic state | Never enters prolonged lock |

This boundary keeps the timeline focused on choreography while the state module owns document-level side effects.

### Variant Resolution Source
`hero-motion-config.ts` should resolve the runtime variant with `matchMedia` inputs:
- reduced motion via `prefers-reduced-motion`
- mobile vs desktop via a JS breakpoint constant aligned with the same `48rem` boundary already used by the hero CSS

JS uses those inputs only to choose the motion branch and intensity profile. CSS remains the source of truth for final layout and sizing.
Reduced motion may still reuse `create-hero-intro.ts`, but only through a reduced variant that resolves quickly and never enters full `active` gating.

### Component Responsibilities
- `HeroSection.astro`
  - defines content structure and animation targets for text elements
  - hosts the hero section identity and runtime bootstrap for `init-hero-intro.ts`
- `HeroOrb.astro`
  - defines orb markup only
  - should expose clear internal layers for core, rings, orbital wrappers, and secondary orbs
  - should not embed the full animation choreography inline

### Style Responsibilities
- `hero.css`
  - hero layout
  - hero text states
  - page-level intro states consumed from `body[data-hero-intro-state]`
- `header.css`
  - header visibility rules driven by `body[data-hero-intro-state="active"]`
- `hero-orb.css`
  - orb geometry and visual styling
  - static and responsive orb system rules
  - lightweight ambient CSS loops where appropriate

### CSS vs JS Responsive Boundary
- CSS is the source of truth for layout, scale, breakpoint presentation, and scrollbar-gutter stability.
- JS motion config only chooses motion intensity, travel-distance multipliers, and variant branching.
- JS should not redefine responsive structural layout that CSS already owns.

### Global Intro State
The intro requires a temporary document-level state, because it affects more than one component:
- the hero itself
- the site header
- body scroll behavior
- scrollbar presentation

This should be modeled as an explicit intro state rather than scattered one-off DOM mutations. The architecture should support:
- setting a pending intro state at startup on eligible pages only
- upgrading pending state to active intro gating only after client-side initialization confirms the hero can run
- releasing it when the timeline completes
- guaranteeing release even if animation setup fails or is interrupted

Expected startup contract:
- `src/pages/index.astro` and `src/pages/en/index.astro` explicitly opt into hero intro eligibility through a boolean layout prop that causes `BaseLayout.astro` to render `data-hero-intro-eligible="true"` on `body`.
- `BaseLayout.astro` may render a neutral eligibility marker only for those pages.
- That eligibility marker may prepare stable layout behavior such as scrollbar-gutter handling, but must not fully lock the page by itself.
- `HeroSection.astro` boots `init-hero-intro.ts`, because the hero component is the single reliable proof that the current page actually contains the target root.
- If the animation boots successfully, pending upgrades to active intro state.
- If the animation cannot boot, pending transitions to `released` and the page becomes normally interactive immediately.
- Reduced-motion mode follows `pending -> released` and then runs a softened reveal path without ever entering `active` gating.

### Interruption Matrix
- Missing hero root: call `failOpenIntro()` and do not start a timeline.
- GSAP unavailable or initialization error: call `failOpenIntro()`.
- Reduced-motion branch: skip `active` gating, move from `pending` to `released`, then run a softened reveal path with immediate or near-immediate interaction.
- Navigation away or teardown before completion: call `failOpenIntro()` during cleanup.
- Timeline cancel or runtime exception: call `failOpenIntro()`.

### Release Presentation
The transition from `active` to `released` may use a short CSS reveal for the header, but the state change itself should be immediate and must not delay restored interaction.

## Implementation Phases

### Phase 1: Static Structure
Refine `HeroOrb.astro` and `HeroSection.astro` so each animated layer has a stable responsibility and a clear target.

Validation gate:
- The hero looks correct without any animation logic.
- No timeline work is required to understand the DOM structure.

### Phase 2: Visual Orb Baseline
Refine the static appearance of the orb system before moving anything.

Validation gate:
- The orb already feels premium when frozen.
- The background does not reduce heading readability.

### Phase 3: Intro Timeline for Orb System
Implement the sequence for center, rings, and secondary orb arrival.

Validation gate:
- The sequence is understandable even without text.
- No abrupt pops or visually disconnected transitions appear.

### Phase 4: Persistent Live Motion
Add continuous orbital movement and micro pulse/glow.

Validation gate:
- The loop remains subtle over time.
- The movement does not feel noisy, game-like, or distracting.

### Phase 5: Hero Content Entrance and Intro Release
Animate the content reveal and release the cinematic intro state.

Validation gate:
- The eye transitions naturally from orb to text.
- Header reveal and scroll release feel intentional and stable.
- No layout jump occurs when scrollbar behavior changes.

### Phase 6: Responsive and Reduced Motion
Tune desktop, mobile, and reduced-motion variants.

Validation gate:
- Mobile keeps the same concept with less intensity.
- Reduced motion preserves hierarchy without reproducing the full choreography.

### Phase 7: Final Performance and Polish
Tune easings, overlaps, glow intensity, and render cost.

Validation gate:
- Motion stays smooth on normal hardware.
- Final state supports reading instead of competing with it.

## Risks and Important Decisions

### Risk: The Intro Becomes Friction
The approved cinematic gating increases perceived polish but also increases UX risk. If the sequence becomes too long, too heavy, or too repetitive on reload, it will feel obstructive rather than premium.

### Risk: Overusing GSAP
Using GSAP for all persistent micro motion would make the solution heavier and harder to reason about than necessary. GSAP should own narrative timing. CSS should own the simplest perpetual effects.

### Risk: Hard-to-Maintain Orbit Logic
If orbital movement depends on scattered manual offsets or opaque calculations, future tuning becomes fragile. Orbital wrappers with clear transform origins are the maintainable boundary.

### Risk: Background Competes with Message
Excess glow, blur, or overly active orbital motion can steal focus from the hero title. The system must become ambient after the intro.

### Risk: Fragile Scroll Locking
Temporary scroll blocking and scrollbar suppression can create broken-feeling UX if not modeled as a robust state with a guaranteed release path.

### Decision: Do Not Overbuild Shared Animation Infrastructure Yet
This hero should establish conventions, not a premature animation platform. Shared abstractions should only be extracted later if additional sections prove the need.

## Performance and Accessibility Rules

### Reduced Motion
The reduced-motion version should preserve the same composition and hierarchy with much softer motion, not simply disable the hero entirely.

### Stable Layout
- Reserve the hero footprint from the start.
- Keep the orb container box stable.
- Keep text in its final layout position even when visually hidden.
- Reserve scrollbar space to avoid post-intro layout jump.

### Cheap Animated Properties
Prefer animating:
- `transform`
- `opacity`

Avoid relying on continuous animation of:
- `width`
- `height`
- `top`
- `left`
- heavy `filter`
- aggressive `box-shadow`

### Glow and Blur Discipline
Glow and blur should be accents, not the structural basis of the hero. On mobile especially, reduced glow intensity is preferable to preserve crispness and rendering stability.

### Responsive Orb Principles
- Maintain the same composition idea across breakpoints.
- Reduce orbital travel on mobile.
- Reduce background intensity on mobile.
- Avoid letting the orb dominate the text block on smaller screens.

### Robust Intro Release
The intro state must have a safe release path even if GSAP initialization fails, the timeline is interrupted, or a reduced-motion branch bypasses the full sequence.

## Quality Criteria
- The first frame establishes a clear center of attention.
- The eye moves in order from center to rings to orbiting elements to text.
- The final effect feels futuristic, clean, and premium rather than flashy.
- The orb system does not compete with the heading after the intro.
- Continuous motion remains subtle during reading.
- Header reveal and scroll unlocking feel intentional, not broken.
- No visible layout jump occurs when scrollbar behavior changes.
- Desktop feels spacious and cinematic.
- Mobile preserves the same design idea with softer intensity.
- Reduced-motion users still receive a polished version of the composition.
- The architecture leaves a clear precedent for future section animations.

## Verification Expectations
Implementation should later be verified with the repository's existing standard:
- focused tests if behavior-driven tests are added
- `npm run check`
- `npm run build`

For visual validation, the hero implementation should also be checked in desktop and mobile states to confirm:
- stable layout before and after intro release
- legible text against the animated background
- no jitter in persistent orbital motion

## Next Recommended Deliverable
After this design is approved, the next deliverable should be a written implementation plan that maps this spec onto concrete file edits, initialization flow, GSAP setup, intro-state handling, responsive tuning, and validation steps for the actual Astro repository.
