# Tech Stack Animation Design

## Goal
Define a maintainable, premium, and scalable animation approach for the Tech Stack section using GSAP and ScrollTrigger, with the section animating once per page load and adapting automatically as cards are added or removed.

## Context
- The repository is an Astro static site with global CSS files imported from `src/layouts/BaseLayout.astro`.
- The Tech Stack section is rendered by `src/components/organisms/StackSection.astro`.
- The section currently contains a section header and a responsive wrapped grid of 5 cards rendered from localized content.
- Each card is rendered through `src/components/molecules/SkillChip.astro`.
- The current layout uses a wrapped flex layout in `src/styles/components/stack.css`, which visually behaves like a grid.
- The user wants a sober, elegant, premium animation with no decorative or gimmicky effects.
- The user wants GSAP for entry choreography and CSS for simple/ambient behavior.
- All work will happen in the current branch.

## Approved Product Decisions

### Playback Behavior
- The Tech Stack section animation runs only the first time the section enters the viewport.
- The animation may replay only after a full page reload.
- The section should not replay when the user scrolls away and back during the same page session.

### Motion Intent
- The section should feel like a modular technical system being revealed.
- The header establishes context first.
- The cards should appear as a coordinated grid, not as a theatrical sequence.
- The motion must remain understated, precise, and premium.

### Grid Behavior
- The implementation must not hardcode animation delays per card.
- The implementation must scale automatically if the number of cards changes in the future.
- The cards should animate as units.
- The first implementation should not animate internal card elements independently.

### Responsive and Accessibility Behavior
- Desktop should emphasize the modular grid feel.
- Mobile should preserve the same idea with lower intensity and shorter perceived duration.
- `prefers-reduced-motion` should keep the information hierarchy while minimizing choreography.

## Recommended Approach

### Animation Strategy
Use one GSAP timeline for the section:
- first animate the eyebrow
- then animate the title
- then animate the cards as a dynamic collection

The collection phase should rely on a grid-aware stagger rather than a hand-authored linear sequence.

This is the right approach because:
- it preserves the current markup structure
- it scales to any card count
- it keeps the section feeling like a system rather than a list
- it matches the motion architecture already being established in the project for other sections

### What GSAP Should Own
- Section entry orchestration
- ScrollTrigger lifecycle
- Header reveal timing
- Card reveal timing and stagger
- Desktop/mobile/reduced-motion motion variants

### What CSS Should Own
- Static visual style of the cards
- Hover transitions already present in `stack.css`
- Equal-height layout behavior
- Fallback visual stability if JS is unavailable

Decision note:
- Reduced-motion behavior should be decided and applied primarily in the animation runtime, not split between unrelated runtime and CSS logic.
- CSS should only provide stable fallback presentation, not a second competing reduced-motion choreography.

## Element Breakdown

### Stack Root
The root section is the animation scope and ScrollTrigger anchor. It should not carry a heavy visible animation itself.

### Header Container
The header groups the eyebrow and title. It establishes the semantic introduction to the section but should not overpower the cards.

### Eyebrow
The eyebrow is the first visible cue and should feel like a controlled label reveal.

### Title
The title is the main statement of the section. It should arrive just after the eyebrow, with slightly more presence.

### Grid Container
The grid is a structural grouping element. It should support the card choreography, not act as the main animated visual target.

### Stack Cards
The cards are the primary motion units. They represent the modular capability system and should arrive in a clean, coordinated grid reveal.

### Card Internal Content
The icon, title, description, and tags should remain visually stable inside each card for the first implementation. The card itself is the animated unit.

## Timeline Strategy

### Phase A: Eyebrow
- Fade in
- Short vertical settle
- Brief and restrained

### Phase B: Title
- Fade in
- Short vertical settle
- Slight overlap with the eyebrow
- More visual weight than the eyebrow

### Phase C: Card Grid
- Fade in cards as a collection
- Short vertical settle per card
- Optional minimal scale settle per card if needed for polish
- Grid-aware stagger

### Perceptual Goal
The section should read as:
1. category
2. statement
3. capability system

It should never read as a long ordered list.

## Grid Stagger Decision

### Core Rule
Use a grid-aware stagger strategy over the collection of cards, not fixed delays based on known positions.

### `stagger.grid = "auto"`
The implementation should rely on GSAP's ability to derive the spatial order from the rendered card positions rather than assuming a fixed row/column count.

This matters because:
- the current layout visually forms a 3 + 2 grid on desktop
- the layout becomes 2 columns at medium sizes and 1 column on mobile
- future card count changes must not require rewriting the timeline

### Responsive Interpretation
- On desktop, the stagger should feel spatial and modular.
- On mobile, the same selection logic should still work, even if the perceptual result becomes more linear due to the single-column layout.
- The mobile variant should compensate with shorter movement and tighter timing.

## Motion Profile By Element

### Root
- No major visible motion
- Optional minimal fade if needed

### Eyebrow
- Fade + short `y` offset
- Low intensity

### Title
- Fade + short `y` offset
- Slightly stronger than the eyebrow

### Cards
- Fade + short `y` offset
- Optional tiny scale adjustment below 1
- Subtle intensity only
- Staggered as a grid-aware collection

### Internal Card Content
- No independent first-pass animation

## Architecture Recommendation

### Markup
Keep the current component split:
- `src/components/organisms/StackSection.astro`
- `src/components/molecules/SkillChip.astro`

### Runtime Modules
Create:
- `src/lib/animations/stack/create-stack-intro.ts`
- `src/lib/animations/stack/init-stack-intro.ts`

### Recommended Hooks
- `data-stack-root`
- `data-stack-header`
- `data-stack-eyebrow`
- `data-stack-title`
- `data-stack-grid`
- `data-stack-card`

### Bootstrap Pattern
- Follow the same section-level initialization pattern already used by Hero and About.
- `StackSection.astro` should own the inline client-side bootstrap that imports and calls `initStackIntro()` against `data-stack-root`.

### Selection Rules
- Select cards dynamically with `querySelectorAll('[data-stack-card]')`
- Avoid `nth-child()`-driven choreography
- Avoid any assumptions about exact card count

## Responsive Strategy

### Desktop
- Preserve the sense of a coordinated modular grid
- Let the spatial stagger do most of the work
- Use the existing desktop behavior already implied above `64rem` in `stack.css`

### Tablet
- Keep the same overall pattern
- Slightly reduce travel and perceived delay
- Align with the existing medium breakpoint behavior defined around `64rem` in `stack.css`

### Mobile
- Keep the same hierarchy
- Use smaller movement
- Use a tighter stagger
- Avoid making the single-column layout feel slow
- Align with the existing mobile breakpoint behavior defined around `48rem` in `stack.css`

## Reduced Motion Strategy
- Preserve the order: eyebrow, title, cards
- Minimize stagger perceptibility
- Remove any non-essential scale accent
- Prefer near-immediate readability over choreography

## Risks
- Using a linear stagger that makes the section feel like a list
- Over-animating internal card contents and creating unnecessary visual noise
- Hardcoding the current 5-card structure into the runtime
- Letting the stagger run too long and making the section feel sluggish
- Using large transforms that make cards feel floaty instead of precise
- Breaking responsive consistency by treating desktop and mobile as separate manual animations

## Success Criteria
- The section feels like a modular capability system
- The header clearly leads the sequence
- The card reveal feels spatial rather than purely linear
- The motion remains sober and premium
- The implementation scales if more cards are added later
- The section stays coherent across desktop and mobile
- Reduced-motion users still get a clear information hierarchy
