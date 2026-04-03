# Miguel Portfolio Stitch v1.1 Implementation Plan

> **For agentic workers:** REQUIRED: Use `superpowers:subagent-driven-development` (if subagents available) or `superpowers:executing-plans` to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrar la landing actual a una version `1.1` en Astro que replique con alta fidelidad el HTML/CSS exportado por Stitch, preservando la estructura del proyecto basada en Atomic Design, el contenido bilingue existente y la calidad final del producto.

**Architecture:** Se mantiene la composicion `atoms` / `molecules` / `organisms`, pero los `organisms` de la home se reescriben siguiendo la estructura visual y las proporciones del HTML de Stitch casi 1:1. La capa de estilos se divide por seccion para reducir colisiones y facilitar una traduccion literal de Stitch a Astro, mientras que la iconografia se encapsula en un atomo minimo que no altere el layout ni la presentacion original.

**Tech Stack:** Astro, TypeScript, CSS del proyecto, JSON bilingue, Material Symbols Outlined, Playwright para revision visual, Vitest, `astro check`, build estatico.

---

## File Map

### Reference sources
- Reference: `docs/reference/stitch-artifacts/desktop-home.html` - fuente de verdad estructural desktop
- Reference: `docs/reference/stitch-artifacts/mobile-home.html` - fuente de verdad estructural mobile
- Reference: `docs/reference/stitch-artifacts/desktop-home.png` - referencia visual desktop
- Reference: `docs/reference/stitch-artifacts/mobile-home.png` - referencia visual mobile

### Home structure
- Modify: `src/components/templates/HomeTemplate.astro`
- Modify: `src/components/organisms/Header.astro`
- Modify: `src/components/organisms/HeroSection.astro`
- Modify: `src/components/organisms/AboutSection.astro`
- Modify: `src/components/organisms/StackSection.astro`
- Modify: `src/components/organisms/ProjectsSection.astro`
- Modify: `src/components/organisms/ContactSection.astro`
- Modify: `src/components/organisms/Footer.astro`

### Atoms / molecules to preserve architecture
- Create: `src/components/atoms/StitchIcon.astro` - wrapper minimo para `material-symbols-outlined`
- Review: `src/components/atoms/ButtonLink.astro`
- Review: `src/components/atoms/Heading.astro`
- Review: `src/components/atoms/Text.astro`
- Review: `src/components/molecules/LanguageSwitcher.astro`
- Review: `src/components/molecules/SkillChip.astro`

### Styles
- Modify: `src/styles/components/sections.css` - dejar solo primitives compartidas de secciones
- Modify: `src/styles/components/header.css`
- Create: `src/styles/components/hero.css`
- Create: `src/styles/components/about.css`
- Create: `src/styles/components/stack.css`
- Create: `src/styles/components/projects.css`
- Create: `src/styles/components/contact.css`
- Modify: punto global de imports de estilos de componentes para incluir los nuevos archivos

### Content and tests
- Review: `src/content/pages/home.es.json`
- Review: `src/content/pages/home.en.json`
- Review: `src/content/projects/projects.es.json`
- Review: `src/content/projects/projects.en.json`
- Test: `tests/i18n/locale.test.ts`
- Test: `tests/content/site-schema.test.ts`
- Test: `tests/content/load-site-content.test.ts`
- Test: `tests/content/map-home-page.test.ts`
- Test: `tests/design-system/tokens.test.ts`

## Chunk 1: Freeze Stitch As Source Of Truth

### Task 1: Convert the Stitch export into explicit migration rules

**Files:**
- Reference: `docs/reference/stitch-artifacts/desktop-home.html`
- Reference: `docs/reference/stitch-artifacts/mobile-home.html`
- Reference: `docs/reference/stitch-artifacts/desktop-home.png`
- Reference: `docs/reference/stitch-artifacts/mobile-home.png`

- [ ] **Step 1: List section-by-section invariants from Stitch**

Capture, for each section:
- DOM order
- width constraints
- spacing rhythm
- font scale and line-height
- aspect ratios
- overlays and opacity
- icon names and placement
- mobile-specific differences

- [ ] **Step 2: Define the non-negotiable migration rule**

Rule to follow during implementation:
- if Astro and Stitch differ, Stitch wins unless the difference is required for i18n, content loading, accessibility, or an existing test contract

- [ ] **Step 3: Verify content contracts before touching markup**

Confirm these existing contracts remain preserved during migration:
- `href="#sobre-mi"` in hero scroll
- bilingual content still loaded from JSON
- external links still come from content/site data
- `Resume` can still render with fallback `#` if asset is missing

## Chunk 2: Reduce CSS Load And Split By Section

### Task 2: Slim down `sections.css` into shared primitives only

**Files:**
- Modify: `src/styles/components/sections.css`

- [ ] **Step 1: Identify rules that are truly shared**

Keep only reusable section-level primitives such as:
- `.section`
- `.container`
- `.section-header`
- compact shared layout helpers that are actually reused

- [ ] **Step 2: Remove section-specific rules from `sections.css`**

Move out rules belonging to:
- hero
- about
- stack
- projects
- contact

- [ ] **Step 3: Run a quick style import verification**

Expected result:
- no orphan class names
- no duplicate definitions between shared and section-specific files

### Task 3: Create section-specific style files

**Files:**
- Create: `src/styles/components/hero.css`
- Create: `src/styles/components/about.css`
- Create: `src/styles/components/stack.css`
- Create: `src/styles/components/projects.css`
- Create: `src/styles/components/contact.css`
- Modify: global component style imports file

- [ ] **Step 1: Create one CSS file per home section**

Each file must contain:
- only the classes for that section
- local desktop/mobile media rules for that section
- no unrelated utilities

- [ ] **Step 2: Import the new files in the existing global style entrypoint**

Expected result:
- the app loads all section CSS without changing the import strategy of the project

- [ ] **Step 3: Verify the split did not change behavior before structural rewrites**

Run visual smoke check after import wiring.

## Chunk 3: Add Stitch Iconography Without Breaking Architecture

### Task 4: Create a minimal `StitchIcon` atom

**Files:**
- Create: `src/components/atoms/StitchIcon.astro`

- [ ] **Step 1: Create the atom with minimal responsibility**

The component should only accept the minimum needed props:
- `name`
- `className?`
- `ariaHidden?`

Expected rendering shape:

```astro
<span class={`material-symbols-outlined ${className ?? ''}`} aria-hidden={ariaHidden}>{name}</span>
```

- [ ] **Step 2: Keep layout decisions outside the atom**

Do not implement inside the atom:
- color decisions
- wrappers
- icon remapping
- smart sizing variants
- fallback families

- [ ] **Step 3: Verify it matches the Stitch HTML output shape closely**

Expected result:
- generated markup remains effectively equivalent to the reference span usage

### Task 5: Inventory and migrate Stitch icons literally

**Files:**
- Reference: `docs/reference/stitch-artifacts/desktop-home.html`
- Reference: `docs/reference/stitch-artifacts/mobile-home.html`
- Modify: `src/components/organisms/HeroSection.astro`
- Modify: `src/components/organisms/StackSection.astro`
- Modify: `src/components/organisms/ProjectsSection.astro`

- [ ] **Step 1: Extract the exact icons used by Stitch**

Minimum current known set:
- `terminal`
- `settings_input_component`
- `neurology`
- `layers`
- `database`
- `arrow_outward`

- [ ] **Step 2: Replace existing icon rendering with `StitchIcon` where needed**

Expected result:
- home iconography uses the exact same icon family and names as Stitch

- [ ] **Step 3: Replicate icon size and placement via section CSS**

Expected result:
- icons match Stitch not just semantically, but visually

## Chunk 4: Rebuild Home Sections To Match Stitch Literally

### Task 6: Rebuild the header and footer composition

**Files:**
- Modify: `src/components/organisms/Header.astro`
- Modify: `src/components/organisms/Footer.astro`
- Modify: `src/styles/components/header.css`

- [ ] **Step 1: Rebuild header markup to mirror Stitch composition**

Required structure:
- brand left
- nav desktop center/right
- language block
- `Resume` CTA

- [ ] **Step 2: Rebuild mobile header behavior to match Stitch**

Required behavior:
- nav hidden on mobile
- reduced brand size
- compact language switcher
- smaller CTA

- [ ] **Step 3: Rebuild footer layout for desktop and mobile**

Required structure:
- editorial footer line
- social links row
- mobile line break treatment consistent with reference

### Task 7: Rebuild the hero section literally

**Files:**
- Modify: `src/components/organisms/HeroSection.astro`
- Modify: `src/styles/components/hero.css`

- [ ] **Step 1: Recreate the Stitch hero DOM structure**

Required pieces:
- orb container
- orb core
- three pulses
- nodes
- centered copy block
- descriptor row
- scroll marker

- [ ] **Step 2: Match desktop proportions exactly**

Match:
- hero min-height
- content max-width
- title line breaks
- descriptor spacing
- scroll placement

- [ ] **Step 3: Match mobile behavior exactly**

Match:
- `min-h-[90vh]`
- vertical rhythm
- orb scaling
- text sizes
- scroll marker size and offset

### Task 8: Rebuild the about section literally

**Files:**
- Modify: `src/components/organisms/AboutSection.astro`
- Modify: `src/styles/components/about.css`

- [ ] **Step 1: Recreate the two-column desktop composition from Stitch**

Match:
- image frame
- halo treatment
- image overlay
- copy rhythm
- stats row alignment

- [ ] **Step 2: Recreate the mobile layout from Stitch**

Match:
- centered image block
- reduced spacing values
- border-top stats row
- heading scale

### Task 9: Rebuild the stack section literally

**Files:**
- Modify: `src/components/organisms/StackSection.astro`
- Modify: `src/styles/components/stack.css`
- Review: `src/components/molecules/SkillChip.astro`

- [ ] **Step 1: Decide whether `SkillChip` can match Stitch without distortion**

If yes:
- keep it and tighten it

If no:
- render stack cards directly in `StackSection.astro`

- [ ] **Step 2: Match Stitch card structure and visual details**

Match:
- glass panel treatment
- left border emphasis
- icon box
- title/body spacing
- tag chip appearance

- [ ] **Step 3: Match mobile stack cards literally**

Expected result:
- stack cards read like the Stitch export, not a generalized design-system card

### Task 10: Rebuild the projects section literally

**Files:**
- Modify: `src/components/organisms/ProjectsSection.astro`
- Modify: `src/styles/components/projects.css`

- [ ] **Step 1: Recreate the section header and featured project layout**

Match:
- heading stack
- desktop sublabel placement
- featured card spanning full width

- [ ] **Step 2: Recreate the featured project media block**

Match:
- aspect ratio `21/9` desktop and `16/9` mobile
- image opacity
- overlay gradient
- featured badge
- copy width
- arrow block placement

- [ ] **Step 3: Recreate the supporting cards**

Match:
- aspect ratio
- overlay treatment
- spacing below media
- title/body proportions

### Task 11: Rebuild the contact section literally

**Files:**
- Modify: `src/components/organisms/ContactSection.astro`
- Modify: `src/styles/components/contact.css`

- [ ] **Step 1: Recreate the contact glass panel structure**

Match:
- outer panel shape
- blur and border
- top-right glow
- centered copy block

- [ ] **Step 2: Recreate CTA sizing and layout**

Match:
- desktop horizontal actions
- mobile stacked actions
- button sizing and tracking

## Chunk 5: Verification And Regression Control

### Task 12: Run targeted tests

**Files:**
- Test: `tests/i18n/locale.test.ts`
- Test: `tests/content/site-schema.test.ts`
- Test: `tests/content/load-site-content.test.ts`
- Test: `tests/content/map-home-page.test.ts`
- Test: `tests/design-system/tokens.test.ts`

- [ ] **Step 1: Run the targeted suite**

Run:

```bash
npm run test -- tests/i18n/locale.test.ts tests/content/site-schema.test.ts tests/content/load-site-content.test.ts tests/content/map-home-page.test.ts tests/design-system/tokens.test.ts
```

Expected result:
- all targeted tests pass

- [ ] **Step 2: Fix any regressions without relaxing the Stitch goal**

Allowed fixes:
- restore exact strings or anchors expected by tests
- preserve content contracts while keeping the visual migration literal

### Task 13: Run Astro verification and production build

**Files:**
- Modify as needed: whichever files fail verification

- [ ] **Step 1: Run type and Astro checks**

Run:

```bash
npm run check
```

Expected result:
- `0 errors`

- [ ] **Step 2: Run production build**

Run:

```bash
npm run build
```

Expected result:
- successful static build

### Task 14: Perform mandatory visual comparison against Stitch

**Files:**
- Reference: `docs/reference/stitch-artifacts/desktop-home.png`
- Reference: `docs/reference/stitch-artifacts/mobile-home.png`

- [ ] **Step 1: Capture fresh desktop and mobile screenshots**

Required output:
- one desktop screenshot of the landing
- one mobile screenshot of the landing

- [ ] **Step 2: Compare screenshots against Stitch references**

Review at minimum:
- header proportions
- hero line breaks and orb sizing
- about image/copy balance
- stack card density
- featured project overlay and arrow placement
- contact CTA layout
- footer mobile composition

- [ ] **Step 3: Do one final micro-pass only if differences are concrete**

Do not do another broad redesign.
Only fix visible residual mismatches.

## Acceptance Criteria

- The landing reads as a Stitch-to-Astro migration, not a reinterpretation.
- `sections.css` is reduced to shared section primitives only.
- Home section styles are split into dedicated files by section.
- Iconography on the home matches Stitch literally in family, icon choice, sizing, and placement.
- Atomic Design is preserved through existing atoms/molecules/organisms, with `StitchIcon.astro` as a minimal atom.
- Desktop and mobile layouts both follow the reference HTML/CSS explicitly.
- Existing bilingual content loading and navigation contracts remain intact.
- Targeted tests, `npm run check`, and `npm run build` all pass.
- Final screenshots show only minor residual differences from Stitch.

## Risks And Controls

- Risk: existing atoms or molecules may force markup that drifts from Stitch.
  Control: use them only when they remain markup-thin; otherwise keep section-specific markup in the organism.

- Risk: CSS split could temporarily create missing imports or duplicated rules.
  Control: move one section at a time and verify imports immediately.

- Risk: tests may rely on exact strings or anchors.
  Control: preserve known contracts while rewriting layout.

- Risk: broad stylistic tweaking could reintroduce interpretation.
  Control: compare continuously against Stitch HTML and screenshots, not against taste.

## Recommended Execution Order

1. Freeze Stitch invariants.
2. Split `sections.css` into shared + section files.
3. Create `StitchIcon.astro` and migrate icon usage.
4. Rebuild `Header` and `Hero` first.
5. Rebuild `About`, `Stack`, `Projects`, `Contact`, and `Footer`.
6. Run tests, `check`, `build`, and visual comparison.

Plan complete and saved to `docs/superpowers/plans/2026-04-02-miguel-portfolio-stitch-v1-1.md`. Ready to execute?
