# Miguel Portfolio Landing Design

## Goal
Build a premium bilingual portfolio landing in Astro based on Stitch project `16575085803915818341`, using TypeScript from day one, a centralized design system, Atomic Design component structure, SOLID-oriented boundaries, and editable JSON content.

## Context
- The local repository is effectively empty, so the project can be structured cleanly from the start.
- The source design is Stitch project `Miguel Muñoz Portfolio` with a dark, editorial, desktop-first visual direction.
- The landing must preserve recruiter credibility while highlighting software engineering, full stack work, systems thinking, and AI agent programming.
- The initial scope is a single home page with the sections `Hero`, `Sobre mí`, `Stack Tecnológico`, `Proyectos`, and `Contacto`.

## Product Decisions

### Scope
- The first release is a landing page, not a CMS and not a full application.
- Content must be editable through JSON files so new projects, stack items, labels, and copy can be added without modifying the UI structure.
- The implementation must be responsive even though the Stitch concept is desktop-first.

### Languages
- Supported locales are `es` and `en`.
- Spanish is the default locale.
- The default route is `/` for Spanish.
- English lives at `/en/`.
- On first visit, if no user preference exists and the browser prefers English, the app redirects from `/` to `/en/`.
- Locale preference is persisted only after a manual language switch by the user.

### Technical Direction
- Framework: `Astro`
- Language: `TypeScript`
- Styling strategy: centralized design tokens with CSS custom properties and modular global/component styles.
- Output model: static-first Astro pages with minimal client-side enhancement only where required for locale preference UX.
- Routing and internationalization: Astro native i18n routing plus lightweight client-side locale preference behavior.
- Content source: JSON files validated through typed schemas before reaching the UI.

## Architecture

### High-Level Shape
The site is a statically rendered Astro project with locale-aware routes, a typed content layer, a tokenized styling system, and a component tree organized through Atomic Design. Components render data only. Content loading, locale resolution, JSON validation, and data normalization are handled in separate TypeScript modules.

### Project Structure
```text
src/
  components/
    atoms/
    molecules/
    organisms/
    templates/
  content/
    global/
      navigation.json
      site.json
    seo/
      seo.es.json
      seo.en.json
    pages/
      home.es.json
      home.en.json
    projects/
      projects.es.json
      projects.en.json
    stack/
      stack.es.json
      stack.en.json
  layouts/
    BaseLayout.astro
  lib/
    content/
      loaders/
      mappers/
      schemas/
      types/
    design-system/
      tokens.ts
    i18n/
      config.ts
      locale.ts
      navigation.ts
    utils/
  pages/
    index.astro
    en/
      index.astro
  styles/
    components/
    globals/
    tokens/
public/
  images/
```

### Responsibility Boundaries
- `components/`: presentation only. Components receive typed props and do not read JSON files directly.
- `lib/content/schemas/`: runtime validation contracts for JSON content.
- `lib/content/loaders/`: content loading and schema validation.
- `lib/content/mappers/`: convert validated data into component-friendly props.
- `lib/i18n/`: locale configuration, helpers, and language preference behavior.
- `styles/tokens/`: design system primitives exposed as CSS variables.
- `styles/components/` and `styles/globals/`: composition and global styling only.

This keeps single responsibility clear and reduces coupling between content, routing, styling, and rendering.

## Design System

### Token Strategy
The design system is centralized and split into stable token files instead of being scattered across components.

Proposed token files:
- `src/styles/tokens/colors.css`
- `src/styles/tokens/typography.css`
- `src/styles/tokens/spacing.css`
- `src/styles/tokens/radius.css`
- `src/styles/tokens/shadows.css`
- `src/styles/tokens/index.css`

### Token Source of Truth
The visual language should reflect the Stitch project theme:
- Primary accent around `#7EE6FF`
- Secondary accent around `#8B7CFF`
- Tertiary accent around `#4FE0B5`
- Neutral dark background around `#0A0D14`
- Headline font: `Space Grotesk`
- Body font: `IBM Plex Sans`
- Roundness aligned with the design's medium-large rounded surfaces

These values should be represented both as CSS variables and, where useful, mirrored in `src/lib/design-system/tokens.ts` for typed access from TypeScript utilities.

### Font Delivery
- Fonts should be self-hosted in the project instead of loaded from a third-party CDN.
- The implementation should prefer a local package-based approach so font loading remains deterministic, privacy-friendly, and compatible with strict CSP.
- The layout layer is responsible for registering the font faces once and exposing them through design tokens.

### Styling Rules
- Use CSS custom properties as the primary token mechanism.
- Avoid hardcoded colors, spacing, radii, and font sizes inside components.
- Keep the visual tone premium, dark, and editorial, avoiding generic startup landing patterns.
- Respect the original Stitch hierarchy without coupling implementation code directly to Stitch APIs.

## Content Model

### Content Layout
The project uses a mixed JSON content strategy:

Global shared content:
- `src/content/global/site.json`
- `src/content/global/navigation.json`

Locale-specific content:
- `src/content/seo/seo.es.json`
- `src/content/seo/seo.en.json`
- `src/content/pages/home.es.json`
- `src/content/pages/home.en.json`
- `src/content/stack/stack.es.json`
- `src/content/stack/stack.en.json`
- `src/content/projects/projects.es.json`
- `src/content/projects/projects.en.json`

### Why Mixed JSON
- Small global settings should not be duplicated per locale.
- Large or editorial content blocks should be localized independently.
- Projects and stack entries may grow over time and deserve separate files.

### JSON Validation
Although the editable source stays in JSON, it must never flow unvalidated into the UI.

Pipeline:
```text
JSON file -> schema validation -> typed loader -> mapper -> component props
```

The validation layer must fail loudly in development and build if content is malformed or incomplete.

### Schema Ownership Rules
The schemas must make required and optional fields explicit.

Required global fields:
- site identity fields needed by the hero and metadata
- primary contact links used by the contact section
- locale labels used by navigation and the language switcher

Required localized home fields:
- section headings
- hero title and supporting copy
- about copy
- contact CTA copy

Required stack item fields:
- `id`
- `label`
- `category`
- `order`

Optional stack item fields:
- `icon`
- `description`

Required project item fields:
- `id`
- `title`
- `summary`
- `year`
- `role`
- `stack`
- `featured`
- `links`

Optional project item fields:
- `image`

Canonical project links shape:
- `links` is a required object.
- `links` may contain `demo`, `repo`, and `caseStudy` entries.
- Each provided entry contains at minimum a `url` and may also include a `label`.
- At least one link entry must exist for each project.

Missing localized files or missing required localized fields must fail the build. There is no silent content fallback between `es` and `en` at the JSON content level in v1.

### SEO Ownership Rules
- Shared site-wide SEO configuration belongs in `site.json` only for values that do not change by locale, such as canonical site URL, social handles, and default image paths.
- Route metadata that is visible to users or search engines must be locale-specific.
- Each locale therefore owns its own SEO file for the home page in v1.
- Missing localized SEO fields must fail validation for that locale.

### Type Safety
TypeScript is required from project start:
- component props must be typed
- loaders and mappers must be typed
- locale helpers must be typed
- JSON imports must be treated as validated input, not trusted data

`resolveJsonModule` support should be enabled as part of the TypeScript setup, but schema validation still remains required because compile-time typing alone does not protect manually edited content from runtime shape drift.

## Internationalization

### Astro Configuration
Astro native i18n should be configured with:

```ts
i18n: {
  locales: ["es", "en"],
  defaultLocale: "es",
  routing: {
    prefixDefaultLocale: false,
  },
}
```

This yields:
- `/` -> Spanish
- `/en/` -> English

### First-Visit Locale Behavior
Astro's i18n routing should remain the base behavior. Because the site is static-first, first-visit locale preference should be implemented with a minimal client-side script on the root Spanish page instead of request-time middleware.

Expected logic:
1. If a locale preference cookie exists, honor it.
2. Automatic locale detection only runs on the root page `/`.
3. The script checks browser locale preferences using `navigator.languages` or equivalent browser APIs.
4. If no saved preference exists and English is preferred, redirect to `/en/`.
5. If Spanish or no supported language is preferred, stay on `/`.
6. The redirect script should not run on localized pages such as `/en/`.
7. If JavaScript is unavailable, the site remains in Spanish by default.

### Locale Switcher
The language switcher should:
- be visible in navigation
- allow toggling between `es` and `en`
- preserve user intent by storing preference only on manual switch
- always generate locale-correct links through centralized helpers

### Manual Preference Persistence
- Manual locale selection should be handled without introducing a framework island.
- The language switcher uses normal locale links and a tiny progressive-enhancement script that writes the locale preference before navigation.
- The stored preference uses a cookie named `preferred-locale`.
- Allowed cookie values are only `es` and `en`.
- The cookie path is `/` so it applies to both `/` and `/en/`.
- The cookie persistence uses `max-age=31536000`.
- The root-page redirect script reads only this cookie key when deciding whether to bypass browser-language detection.
- This keeps the site mostly static while still honoring explicit language choice.

## Component Design

### Atoms
Examples:
- `Heading`
- `Text`
- `Button`
- `Link`
- `Badge`
- `IconLink`

Atoms should remain small and reusable, but only when they represent real visual primitives. Avoid artificial fragmentation.

### Molecules
Examples:
- `LanguageSwitcher`
- `NavLink`
- `ProjectMeta`
- `SkillChip`
- `ContactAction`

### Organisms
Examples:
- `Header`
- `HeroSection`
- `AboutSection`
- `StackSection`
- `ProjectsSection`
- `ContactSection`
- `Footer`

### Templates
Examples:
- `HomeTemplate`

Templates orchestrate sections but do not own content fetching.

### Layouts
- `BaseLayout.astro` provides document shell, SEO, fonts, global tokens, and shared structure.

## Data Flow

### Rendering Flow
1. Route resolves locale.
2. Locale-aware page requests the correct content set.
3. Loaders import JSON and validate it against schemas.
4. Mappers normalize data for section components.
5. Page composes a typed template.
6. Components render without direct awareness of storage format.

### Why This Flow
- Makes content editable.
- Keeps presentation pure.
- Makes failures explicit.
- Limits the impact of future content changes.

## Error Handling

### Build-Time Safety
- Invalid or incomplete JSON should fail during `astro dev` and `astro build`.
- Schema errors should clearly identify the offending file.
- Missing required localized files should fail fast.

### Runtime Safety
- Runtime logic should stay minimal because the site is primarily static.
- The root-page locale script must gracefully fall back to Spanish when browser preference is absent or unsupported.
- Manual language switching must never create broken links.

## Concrete Content Contracts

### `site.json`
Purpose: shared site-level identity and non-localized settings.

```json
{
  "siteUrl": "https://example.com",
  "author": {
    "name": "Miguel Muñoz",
    "role": "Software Engineer",
    "email": "hello@example.com"
  },
  "social": {
    "github": "https://github.com/username",
    "linkedin": "https://linkedin.com/in/username"
  },
  "assets": {
    "defaultOgImage": "/images/og/home.jpg",
    "resume": "/files/miguel-munoz-resume.pdf"
  }
}
```

### `navigation.json`
Purpose: shared section ids and locale labels used by navigation helpers.

```json
{
  "sections": [
    {
      "id": "hero",
      "labels": { "es": "Inicio", "en": "Home" }
    },
    {
      "id": "about",
      "labels": { "es": "Sobre mí", "en": "About" }
    },
    {
      "id": "stack",
      "labels": { "es": "Stack", "en": "Stack" }
    },
    {
      "id": "projects",
      "labels": { "es": "Proyectos", "en": "Projects" }
    },
    {
      "id": "contact",
      "labels": { "es": "Contacto", "en": "Contact" }
    }
  ],
  "localeLabels": {
    "es": "ES",
    "en": "EN"
  }
}
```

### `home.<locale>.json`
Purpose: localized editorial content for page sections.

```json
{
  "hero": {
    "eyebrow": "Software Engineer",
    "title": "Miguel Muñoz",
    "description": "Full Stack, systems, and AI agent programming.",
    "primaryCta": { "label": "Ver proyectos", "href": "#projects" },
    "secondaryCta": { "label": "Contactar", "href": "#contact" }
  },
  "about": {
    "title": "Sobre mí",
    "body": [
      "Paragraph one.",
      "Paragraph two."
    ],
    "image": "/images/about/profilepicture.png"
  },
  "stack": {
    "title": "Stack Tecnológico",
    "intro": "Selected technologies and capabilities."
  },
  "projects": {
    "title": "Proyectos",
    "intro": "Featured work and supporting case studies."
  },
  "contact": {
    "title": "Contacto",
    "description": "Let's build something meaningful.",
    "primaryAction": { "label": "Escríbeme", "href": "mailto:hello@example.com" }
  }
}
```

### `stack.<locale>.json`
Purpose: localized list of stack entries.

```json
[
  {
    "id": "typescript",
    "label": "TypeScript",
    "category": "language",
    "order": 1,
    "description": "Typed application development."
  }
]
```

### `projects.<locale>.json`
Purpose: localized project cards and featured project content.

```json
[
  {
    "id": "portfolio",
    "title": "Miguel Portfolio",
    "summary": "Premium bilingual personal landing.",
    "year": "2026",
    "role": "Design and development",
    "stack": ["Astro", "TypeScript"],
    "featured": true,
    "image": "/images/projects/portfolio-cover.jpg",
    "links": {
      "demo": { "label": "Live", "url": "https://example.com" },
      "repo": { "label": "Code", "url": "https://github.com/example/repo" }
    }
  }
]
```

### `seo.<locale>.json`
Purpose: localized home metadata.

```json
{
  "title": "Miguel Muñoz | Software Engineer",
  "description": "Portfolio focused on full stack engineering, systems, and AI agent programming.",
  "ogImage": "/images/og/home.jpg"
}
```

These examples define the intended canonical shapes for v1. Field names may be refined during implementation only if the schemas, loaders, and all localized files are updated consistently.

## Contact Section Behavior
- The `Contacto` section in v1 is CTA-based, not a submitting backend form.
- It should present a strong closing call to action plus direct contact methods.
- Supported behaviors in v1 are:
  - `mailto:` primary email action
  - external links such as LinkedIn and GitHub
  - optional resume link if content provides it
- No server-side submission flow, form processing, captcha, or mail API is included in the first release.

## Responsive Strategy
- The visual source is desktop-first, but implementation must support mobile and tablet.
- The hero, about, projects, and contact sections should progressively reflow instead of simply shrinking the desktop layout.
- Section spacing and typography need responsive tokens instead of one-size-fits-all values.
- Projects should preserve an editorial feel on small screens rather than collapsing into generic stacked cards without hierarchy.

## Testing Strategy

### Required Verification Layers
- Unit-level tests for schema validation and loader behavior.
- Unit-level tests for locale helper functions and preference logic.
- Unit-level tests for mappers that convert raw content into UI props.
- Build verification for both Spanish and English routes.

### Minimum Confidence Checks
- `astro check`
- automated tests for content loading and i18n helpers
- `astro build`

### What We Intentionally Avoid Initially
- No CMS in v1.
- No backend contact form in v1 unless added later.
- No unnecessary client-side framework island unless a real interaction demands it.

## Implementation Notes
- Start with a clean Astro + TypeScript setup.
- Enable JSON module imports in TypeScript configuration.
- Add the minimum libraries needed for schema validation and quality checks.
- Prefer the smallest correct dependency set.
- Keep the codebase static-first.

## Success Criteria
- The project matches the tone and section structure defined in Stitch.
- Content can be edited through JSON files without touching UI structure.
- Spanish and English both work through locale-aware routes.
- First-visit locale detection works without overriding explicit user choice.
- The design system is centralized and reusable.
- TypeScript and schema validation protect the project from content drift.
- The resulting site is performant, maintainable, and easy to extend.

## References
- Astro i18n documentation indicates native support for `locales`, `defaultLocale`, `prefixDefaultLocale`, locale-aware helpers, and middleware composition.
- Astro middleware can be composed with the built-in i18n middleware to extend routing behavior rather than replacing it.
- TypeScript supports JSON imports through `resolveJsonModule`, but runtime validation remains necessary for manually edited content.
