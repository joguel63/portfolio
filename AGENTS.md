# AGENTS Guide

## Project Overview

This repository is a bilingual Astro portfolio site.

- Runtime: Astro static site
- Languages: Spanish (`/`) and English (`/en/`)
- Content source: local JSON files under `src/content/`
- Validation: Zod schemas + Vitest tests + `astro check`

The site is a single home page composed from structured content, not a CMS-backed app.

## How The App Is Built

Request flow:

1. `src/pages/index.astro` or `src/pages/en/index.astro`
2. `loadSiteContent(locale)` loads and validates JSON content
3. `mapHomePage(locale, content)` builds the page view model
4. `BaseLayout.astro` loads global styles, SEO, and shell markup
5. `HomeTemplate.astro` composes the page sections

Key files:

- `src/pages/index.astro` — Spanish home page entry
- `src/pages/en/index.astro` — English home page entry
- `src/layouts/BaseLayout.astro` — global layout, metadata, stylesheet imports
- `src/components/templates/HomeTemplate.astro` — top-level section composition
- `src/lib/content/loaders/load-site-content.ts` — loads all content JSON
- `src/lib/content/mappers/map-home-page.ts` — builds the final page model
- `src/lib/content/types/content.ts` — canonical content and page model types

## Content Architecture

Content is split by concern and locale.

- `src/content/global/`
  - `site.json` — author, social links, assets, site URL
  - `navigation.json` — section ids and localized labels
- `src/content/pages/`
  - `home.es.json`
  - `home.en.json`
  - Copy for hero, about, section headings, contact
- `src/content/projects/`
  - `projects.es.json`
  - `projects.en.json`
  - Project cards and featured project data
- `src/content/stack/`
  - `stack.es.json`
  - `stack.en.json`
  - Tech stack cards
- `src/content/seo/`
  - `seo.es.json`
  - `seo.en.json`

Schema definitions live in `src/lib/content/schemas/` and are wired in `src/content.config.ts`.

When changing content shape:

1. Update the schema in `src/lib/content/schemas/`
2. Update the TypeScript types in `src/lib/content/types/content.ts`
3. Update the JSON content files
4. Update mapping logic if needed
5. Update tests

## Component Structure

Components follow an atomic-ish split:

- `src/components/atoms/` — small reusable primitives
- `src/components/molecules/` — composed small UI units
- `src/components/organisms/` — page sections
- `src/components/templates/` — page composition

Important organisms:

- `Header.astro`
- `HeroSection.astro`
- `AboutSection.astro`
- `StackSection.astro`
- `ProjectsSection.astro`
- `ContactSection.astro`
- `Footer.astro`

Recent pattern example:

- `src/components/atoms/HeroOrb.astro` + `src/styles/components/hero-orb.css`

If a visual element has independent structure or is likely to evolve, prefer extracting it into its own component rather than growing the section file.

## Styling Architecture

Styles are global CSS files imported from `BaseLayout.astro`.

Import order currently lives in:

- `src/layouts/BaseLayout.astro`

Style layers:

- `src/styles/tokens/` — design tokens
- `src/styles/globals/` — reset, fonts, base primitives
- `src/styles/components/` — section/component-specific styles

Important rule: styles are not colocated in Astro components right now. Follow the existing pattern unless there is a strong reason to change it.

When editing visuals:

- Prefer changing the section CSS file first
- Check whether a shared global class is also applied (`panel`, `media-frame`, `eyebrow`, etc.)
- If a global utility causes the issue, override it locally instead of changing global behavior unless the change is intended everywhere

## I18n Rules

Locales:

- `es` is default at `/`
- `en` lives at `/en/`

Core i18n files:

- `src/lib/i18n/config.ts`
- `src/lib/i18n/locale.ts`
- `src/lib/i18n/navigation.ts`
- `src/lib/i18n/root-locale-redirect.ts`

Navigation labels are localized in content, not hardcoded in components.

## Testing And Verification

Primary commands:

- `npm test` — full Vitest suite
- `npm test -- tests/content/map-home-page.test.ts` — focused page/content regression test
- `npm run check` — Astro type and diagnostics check
- `npm run build` — production build

Use this verification baseline after non-trivial changes:

1. Relevant focused `npm test -- ...`
2. `npm run check`
3. `npm run build`

Test directories:

- `tests/content/` — content loading, mapping, and source regression tests
- `tests/design-system/` — tokens and design-system rules
- `tests/i18n/` — locale behavior

`tests/content/map-home-page.test.ts` is especially important. It acts as a regression suite for page structure and many styling decisions reflected in source/CSS.

## Safe Editing Guidelines For Agents

Prefer these rules when working in this repo:

- Make the smallest correct change
- Preserve the existing Astro + global CSS structure
- Do not rewrite content architecture unless needed
- Do not edit generated artifacts unless explicitly asked
- Keep Spanish and English content aligned when changing content semantics
- If a change affects both locale copies, update both

When working on visuals:

- Check `docs/reference/stitch-artifacts/` if matching Stitch matters
- Compare against existing CSS before inventing new patterns
- Keep section-specific behavior in that section CSS file

When working on content:

- Update source JSON first
- Then update tests expecting the old literal values

## Files Agents Usually Should Not Edit

Avoid touching these unless the task explicitly requires it:

- `.astro/` — generated Astro cache/data
- `dist/` — build output
- `.playwright-mcp/` — generated snapshots and browser artifacts

These may contain stale values and are not the source of truth.

## Reference Artifacts

The repo includes local reference files used during visual alignment work:

- `docs/reference/stitch-artifacts/desktop-home.html`
- `docs/reference/stitch-artifacts/mobile-home.html`

Treat them as comparison references, not as runtime source.

## Recommended Workflow For Future Agents

1. Read this file
2. Inspect the relevant section/component and CSS file
3. Check whether the data comes from `src/content/` and whether schemas/types are involved
4. Add or update a focused regression test when behavior changes
5. Run focused tests, then `npm run check`, then `npm run build`
6. Update both locales when the change is content-facing

## Quick Map

- Page assembly: `src/components/templates/HomeTemplate.astro`
- Global shell: `src/layouts/BaseLayout.astro`
- Content loading: `src/lib/content/loaders/load-site-content.ts`
- Page mapping: `src/lib/content/mappers/map-home-page.ts`
- Source content: `src/content/`
- Section styles: `src/styles/components/`
- Regression tests: `tests/content/`
