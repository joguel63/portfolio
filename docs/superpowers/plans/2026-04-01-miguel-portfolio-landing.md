# Miguel Portfolio Landing Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static-first bilingual Astro landing for Miguel Muñoz based on the approved Stitch design, with TypeScript, centralized design tokens, editable JSON content, and locale-aware routing.

**Architecture:** The app is an Astro + TypeScript project with native i18n routing, a typed content layer that validates JSON through schemas before rendering, and a presentation tree organized through Atomic Design. The root Spanish page uses a tiny client-side script for first-visit locale detection, while manual locale switching persists a `preferred-locale` cookie without adding a framework island.

**Tech Stack:** Astro, TypeScript, Vitest, Zod, Astro native i18n, CSS custom properties, local fonts

**Replacement Strategy:** This branch is a full replacement of the previous portfolio implementation. Do not preserve legacy app structure, compatibility layers, or migration code from the old stack.

---

## File Map

### Source material handoff
- Create: `docs/reference/stitch-content-handoff.md` - captured approved copy, section notes, and asset mapping from Stitch or user-provided source material

### Core setup
- Create: `package.json` - project scripts and dependencies
- Create: `astro.config.mjs` - Astro config with i18n
- Create: `tsconfig.json` - TypeScript config with JSON module support
- Create: `src/env.d.ts` - Astro typing entrypoint
- Create: `.gitignore` - standard ignores for Astro and Node

### Content and validation
- Create: `src/content/global/site.json`
- Create: `src/content/global/navigation.json`
- Create: `src/content/pages/home.es.json`
- Create: `src/content/pages/home.en.json`
- Create: `src/content/stack/stack.es.json`
- Create: `src/content/stack/stack.en.json`
- Create: `src/content/projects/projects.es.json`
- Create: `src/content/projects/projects.en.json`
- Create: `src/content/seo/seo.es.json`
- Create: `src/content/seo/seo.en.json`
- Create: `src/lib/content/types/content.ts` - domain types
- Create: `src/lib/content/schemas/common.ts` - shared Zod pieces
- Create: `src/lib/content/schemas/site.ts`
- Create: `src/lib/content/schemas/navigation.ts`
- Create: `src/lib/content/schemas/home.ts`
- Create: `src/lib/content/schemas/stack.ts`
- Create: `src/lib/content/schemas/projects.ts`
- Create: `src/lib/content/schemas/seo.ts`
- Create: `src/lib/content/loaders/load-json.ts` - generic typed JSON loader
- Create: `src/lib/content/loaders/load-site-content.ts`
- Create: `src/lib/content/mappers/map-home-page.ts`

### i18n and routing
- Create: `src/lib/i18n/config.ts`
- Create: `src/lib/i18n/locale.ts`
- Create: `src/lib/i18n/navigation.ts`
- Create: `src/scripts/root-locale-redirect.ts`

### Design system and styles
- Create: `src/lib/design-system/tokens.ts`
- Create: `src/styles/tokens/colors.css`
- Create: `src/styles/tokens/typography.css`
- Create: `src/styles/tokens/spacing.css`
- Create: `src/styles/tokens/radius.css`
- Create: `src/styles/tokens/shadows.css`
- Create: `src/styles/tokens/index.css`
- Create: `src/styles/globals/reset.css`
- Create: `src/styles/globals/base.css`
- Create: `src/styles/components/button.css`
- Create: `src/styles/components/header.css`
- Create: `src/styles/components/sections.css`

### UI structure
- Create: `src/components/atoms/Heading.astro`
- Create: `src/components/atoms/Text.astro`
- Create: `src/components/atoms/ButtonLink.astro`
- Create: `src/components/atoms/Badge.astro`
- Create: `src/components/molecules/NavLink.astro`
- Create: `src/components/molecules/LanguageSwitcher.astro`
- Create: `src/components/molecules/SkillChip.astro`
- Create: `src/components/molecules/ProjectMeta.astro`
- Create: `src/components/organisms/Header.astro`
- Create: `src/components/organisms/HeroSection.astro`
- Create: `src/components/organisms/AboutSection.astro`
- Create: `src/components/organisms/StackSection.astro`
- Create: `src/components/organisms/ProjectsSection.astro`
- Create: `src/components/organisms/ContactSection.astro`
- Create: `src/components/organisms/Footer.astro`
- Create: `src/components/templates/HomeTemplate.astro`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/pages/index.astro`
- Create: `src/pages/en/index.astro`

### Public assets and fonts
- Create: `public/images/about/miguel-portrait.jpg`
- Create: `public/images/projects/portfolio-cover.jpg`
- Create: `public/images/og/home.jpg`
- Create: `public/images/.gitkeep`
- Create: `public/fonts/.gitkeep`

### Tests
- Create: `tests/content/site-schema.test.ts`
- Create: `tests/content/load-site-content.test.ts`
- Create: `tests/content/map-home-page.test.ts`
- Create: `tests/i18n/locale.test.ts`

## Chunk 1: Project Foundation

### Task 0: Capture approved copy and assets before implementation

**Files:**
- Create: `docs/reference/stitch-content-handoff.md`
- Create: `public/images/about/miguel-portrait.jpg`
- Create: `public/images/projects/portfolio-cover.jpg`
- Create: `public/images/og/home.jpg`

- [ ] **Step 1: Gather the approved source material from Stitch or the user**

Required inputs:
- final Spanish section copy for `hero`, `about`, `stack`, `projects`, and `contact`
- approved English translation or approval to translate from the Spanish source
- approved about image
- approved featured project image
- approved OG image

If any of these inputs are missing, stop implementation and ask the user for the missing source material instead of inventing content.

- [ ] **Step 2: Write the source-of-truth handoff note**

Create `docs/reference/stitch-content-handoff.md` with:
- the exact approved Spanish copy per section
- the exact approved English copy per section
- the filename mapping for each required image asset
- any notes needed to preserve the Stitch tone or hierarchy

- [ ] **Step 3: Place the approved image assets in their final paths**

Required files:
- `public/images/about/miguel-portrait.jpg`
- `public/images/projects/portfolio-cover.jpg`
- `public/images/og/home.jpg`

Rules:
- these must be real approved assets, not placeholders or empty files
- every image path referenced later in JSON must resolve to an existing file

- [ ] **Step 4: Verify that the handoff is complete before writing app content**

Success condition:
- no placeholder copy remains in the source note
- all three required image files exist
- the implementation can proceed without inventing content

- [ ] **Step 5: Commit**

```bash
git add docs/reference/stitch-content-handoff.md public/images/about/miguel-portrait.jpg public/images/projects/portfolio-cover.jpg public/images/og/home.jpg
git commit -m "docs: capture approved portfolio content and assets"
```

### Task 1: Scaffold Astro + TypeScript baseline

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/env.d.ts`
- Create: `.gitignore`

- [ ] **Step 1: Write the failing setup check as command expectations**

Run:

```bash
npm run check
```

Expected: command fails because `package.json` and dependencies do not exist yet.

- [ ] **Step 2: Create `package.json` with the minimum dependency set**

```json
{
  "name": "miguel-portfolio",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "astro": "^5.7.0",
    "zod": "^3.24.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.0",
    "typescript": "^5.9.0",
    "vitest": "^3.1.0"
  }
}
```

- [ ] **Step 3: Create Astro and TypeScript config files**

`astro.config.mjs`

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
```

`tsconfig.json`

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "resolveJsonModule": true,
    "types": ["vitest/globals"]
  },
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

`src/env.d.ts`

```ts
/// <reference types="astro/client" />
```

- [ ] **Step 4: Add a minimal `.gitignore`**

```gitignore
node_modules/
dist/
.astro/
.DS_Store
coverage/
```

- [ ] **Step 5: Install dependencies**

Run:

```bash
npm install
```

Expected: dependencies install successfully and `package-lock.json` is created.

- [ ] **Step 6: Sync Astro types before the first check**

Run:

```bash
npx astro sync
```

Expected: Astro generates its internal types successfully under `.astro/`.

- [ ] **Step 7: Verify the baseline setup**

Run:

```bash
npm run check
```

Expected: `astro check` completes successfully with the generated Astro types in place.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json src/env.d.ts .gitignore
git commit -m "chore: initialize Astro TypeScript project"
```

### Task 2: Add initial tests and test runner wiring

**Files:**
- Modify: `package.json`
- Create: `tests/i18n/locale.test.ts`
- Create: `src/lib/i18n/locale.ts`

- [ ] **Step 1: Write the first failing test file**

```ts
import { describe, expect, it } from 'vitest';
import { isSupportedLocale } from '../../src/lib/i18n/locale';

describe('isSupportedLocale', () => {
  it('accepts es and en only', () => {
    expect(isSupportedLocale('es')).toBe(true);
    expect(isSupportedLocale('en')).toBe(true);
    expect(isSupportedLocale('fr')).toBe(false);
  });
});
```

- [ ] **Step 2: Run the failing test**

Run:

```bash
npm run test -- tests/i18n/locale.test.ts
```

Expected: FAIL because `src/lib/i18n/locale` does not exist yet.

- [ ] **Step 3: Add the smallest passing stub so the branch does not stay red**

`src/lib/i18n/locale.ts`

```ts
export function isSupportedLocale(value: string): boolean {
  return value === 'es' || value === 'en';
}
```

- [ ] **Step 4: Re-run the test to confirm the branch is green again**

Run:

```bash
npm run test -- tests/i18n/locale.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add tests/i18n/locale.test.ts src/lib/i18n/locale.ts
git commit -m "test: add initial locale helper coverage"
```

## Chunk 2: Typed Content and Locale Infrastructure

### Task 3: Implement locale helpers and manual preference utilities

**Files:**
- Create: `src/lib/i18n/config.ts`
- Create: `src/lib/i18n/locale.ts`
- Create: `src/lib/i18n/navigation.ts`
- Create: `src/scripts/root-locale-redirect.ts`
- Modify: `tests/i18n/locale.test.ts`

- [ ] **Step 1: Expand the failing locale test to cover the actual contract**

```ts
import { describe, expect, it } from 'vitest';
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_COOKIE_KEY,
  getLocaleFromPath,
  isSupportedLocale,
} from '../../src/lib/i18n/locale';

describe('locale config', () => {
  it('exposes the supported locales', () => {
    expect(LOCALES).toEqual(['es', 'en']);
    expect(DEFAULT_LOCALE).toBe('es');
    expect(LOCALE_COOKIE_KEY).toBe('preferred-locale');
  });

  it('extracts locale from localized and default paths', () => {
    expect(getLocaleFromPath('/')).toBe('es');
    expect(getLocaleFromPath('/en/')).toBe('en');
    expect(getLocaleFromPath('/en/projects')).toBe('en');
  });

  it('accepts es and en only', () => {
    expect(isSupportedLocale('es')).toBe(true);
    expect(isSupportedLocale('en')).toBe(true);
    expect(isSupportedLocale('fr')).toBe(false);
  });
});
```

- [ ] **Step 2: Run the failing test**

Run:

```bash
npm run test -- tests/i18n/locale.test.ts
```

Expected: FAIL with module-not-found errors for locale utilities.

- [ ] **Step 3: Implement the minimal locale config and helpers**

`src/lib/i18n/config.ts`

```ts
export const LOCALES = ['es', 'en'] as const;
export const DEFAULT_LOCALE = 'es';
export const LOCALE_COOKIE_KEY = 'preferred-locale';
export const LOCALE_COOKIE_MAX_AGE = 31536000;

export type AppLocale = (typeof LOCALES)[number];
```

`src/lib/i18n/locale.ts`

```ts
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_COOKIE_KEY,
  LOCALE_COOKIE_MAX_AGE,
  type AppLocale,
} from './config';

export { DEFAULT_LOCALE, LOCALES, LOCALE_COOKIE_KEY, LOCALE_COOKIE_MAX_AGE };
export type { AppLocale };

export function isSupportedLocale(value: string): value is AppLocale {
  return LOCALES.includes(value as AppLocale);
}

export function getLocaleFromPath(pathname: string): AppLocale {
  return pathname.startsWith('/en') ? 'en' : DEFAULT_LOCALE;
}
```

`src/lib/i18n/navigation.ts`

```ts
import type { AppLocale } from './config';

export function getHomePath(locale: AppLocale): string {
  return locale === 'en' ? '/en/' : '/';
}

export function getSectionPath(locale: AppLocale, sectionId: string): string {
  return `${getHomePath(locale)}#${sectionId}`;
}
```

`src/scripts/root-locale-redirect.ts`

```ts
import { DEFAULT_LOCALE, LOCALE_COOKIE_KEY, type AppLocale } from '../lib/i18n/config';

const ENGLISH_LOCALE = 'en';

export function readPreferredLocale(cookie: string): AppLocale | null {
  const match = cookie
    .split('; ')
    .find((item) => item.startsWith(`${LOCALE_COOKIE_KEY}=`));

  const value = match ? decodeURIComponent(match.split('=')[1]) : null;

  return value === 'es' || value === 'en' ? value : null;
}

export function browserPrefersEnglish(languages: readonly string[]): boolean {
  return languages.some((locale) => locale.toLowerCase().startsWith(ENGLISH_LOCALE));
}

export function getRootRedirectTarget(cookie: string, languages: readonly string[]): string | null {
  const savedLocale = readPreferredLocale(cookie);

  if (savedLocale && savedLocale !== DEFAULT_LOCALE) {
    return `/${savedLocale}/`;
  }

  if (!savedLocale && browserPrefersEnglish(languages)) {
    return '/en/';
  }

  return null;
}

function redirectOnRootVisit(): void {
  const target = getRootRedirectTarget(document.cookie, navigator.languages);

  if (window.location.pathname === '/' && target) {
    window.location.replace(target);
  }
}

if (typeof window !== 'undefined') {
  redirectOnRootVisit();
}
```

- [ ] **Step 4: Add automated tests for cookie and redirect decision logic**

Update `tests/i18n/locale.test.ts` with:

```ts
import { getRootRedirectTarget } from '../../src/scripts/root-locale-redirect';

it('redirects to en on first visit when browser prefers english', () => {
  expect(getRootRedirectTarget('', ['en-US', 'es-ES'])).toBe('/en/');
});

it('does not redirect when browser prefers spanish', () => {
  expect(getRootRedirectTarget('', ['es-ES'])).toBeNull();
});

it('honors saved english preference', () => {
  expect(getRootRedirectTarget('preferred-locale=en', ['es-ES'])).toBe('/en/');
});
```

- [ ] **Step 5: Re-run the locale tests**

Run:

```bash
npm run test -- tests/i18n/locale.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/i18n/config.ts src/lib/i18n/locale.ts src/lib/i18n/navigation.ts src/scripts/root-locale-redirect.ts tests/i18n/locale.test.ts
git commit -m "feat: add locale helpers and preference contract"
```

### Task 4: Define schemas, domain types, and JSON loader

**Files:**
- Create: `src/lib/content/types/content.ts`
- Create: `src/lib/content/schemas/common.ts`
- Create: `src/lib/content/schemas/site.ts`
- Create: `src/lib/content/schemas/navigation.ts`
- Create: `src/lib/content/schemas/home.ts`
- Create: `src/lib/content/schemas/stack.ts`
- Create: `src/lib/content/schemas/projects.ts`
- Create: `src/lib/content/schemas/seo.ts`
- Create: `src/lib/content/loaders/load-json.ts`
- Create: `tests/content/site-schema.test.ts`

- [ ] **Step 1: Write a failing loader test around schema validation**

```ts
import { describe, expect, it } from 'vitest';
import { siteSchema } from '../../src/lib/content/schemas/site';

describe('siteSchema', () => {
  it('accepts the canonical site shape', () => {
    const parsed = siteSchema.parse({
      siteUrl: 'https://example.com',
      author: {
        name: 'Miguel Muñoz',
        role: 'Software Engineer',
        email: 'hello@example.com',
      },
      social: {
        github: 'https://github.com/example',
        linkedin: 'https://linkedin.com/in/example',
      },
      assets: {
        defaultOgImage: '/images/og/home.jpg',
        resume: '/files/resume.pdf',
      },
    });

    expect(parsed.author.name).toBe('Miguel Muñoz');
  });
});
```

- [ ] **Step 2: Run the failing test**

Run:

```bash
npm run test -- tests/content/site-schema.test.ts
```

Expected: FAIL because the schema files do not exist yet.

- [ ] **Step 3: Implement minimal shared Zod schemas and types**

`src/lib/content/types/content.ts`

```ts
import type { AppLocale } from '../../i18n/config';
import type { HomeContent } from '../schemas/home';
import type { NavigationContent } from '../schemas/navigation';
import type { ProjectsContent } from '../schemas/projects';
import type { SeoContent } from '../schemas/seo';
import type { SiteContent } from '../schemas/site';
import type { StackContent } from '../schemas/stack';

export interface LoadedSiteContent {
  site: SiteContent;
  navigation: NavigationContent;
  seo: SeoContent;
  home: HomeContent;
  stack: StackContent;
  projects: ProjectsContent;
}

export interface HomePageData extends LoadedSiteContent {
  locale: AppLocale;
}
```

Rules for these types:
- `LoadedSiteContent` is the return type of `loadSiteContent()`.
- `HomePageData` or a refined equivalent is the mapper output shape consumed by `HomeTemplate`.
- Organism and template props must be derived from these domain types instead of duplicating ad-hoc inline interfaces.

`src/lib/content/schemas/common.ts`

```ts
import { z } from 'zod';

export const localizedLabelSchema = z.object({
  es: z.string().min(1),
  en: z.string().min(1),
});

export const ctaSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

export const externalLinkSchema = z.object({
  label: z.string().min(1).optional(),
  url: z.string().url(),
});
```

`src/lib/content/schemas/site.ts`

```ts
import { z } from 'zod';

export const siteSchema = z.object({
  siteUrl: z.string().url(),
  author: z.object({
    name: z.string().min(1),
    role: z.string().min(1),
    email: z.string().email(),
  }),
  social: z.object({
    github: z.string().url(),
    linkedin: z.string().url(),
  }),
  assets: z.object({
    defaultOgImage: z.string().min(1),
    resume: z.string().min(1).optional(),
  }),
});

export type SiteContent = z.infer<typeof siteSchema>;
```

`src/lib/content/loaders/load-json.ts`

```ts
import type { ZodSchema } from 'zod';

export function parseJsonWithSchema<T>(schema: ZodSchema<T>, input: unknown, source: string): T {
  const result = schema.safeParse(input);

  if (!result.success) {
    throw new Error(`Invalid content in ${source}: ${result.error.message}`);
  }

  return result.data;
}
```

- [ ] **Step 4: Add the remaining schema files using the approved canonical shapes**

Create the other schema files so they align with these explicit contracts:

`src/lib/content/schemas/navigation.ts`

```ts
import { z } from 'zod';
import { localizedLabelSchema } from './common';

export const navigationSchema = z.object({
  sections: z.array(
    z.object({
      id: z.enum(['hero', 'about', 'stack', 'projects', 'contact']),
      labels: localizedLabelSchema,
    }),
  ),
  localeLabels: localizedLabelSchema,
});

export type NavigationContent = z.infer<typeof navigationSchema>;
```

`src/lib/content/schemas/home.ts`

```ts
import { z } from 'zod';
import { ctaSchema } from './common';

export const homeSchema = z.object({
  hero: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    primaryCta: ctaSchema,
    secondaryCta: ctaSchema,
  }),
  about: z.object({
    title: z.string().min(1),
    body: z.array(z.string().min(1)).min(1),
    image: z.string().min(1),
  }),
  stack: z.object({
    title: z.string().min(1),
    intro: z.string().min(1),
  }),
  projects: z.object({
    title: z.string().min(1),
    intro: z.string().min(1),
  }),
  contact: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    primaryAction: ctaSchema,
  }),
});

export type HomeContent = z.infer<typeof homeSchema>;
```

`src/lib/content/schemas/stack.ts`

```ts
import { z } from 'zod';

export const stackItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  category: z.string().min(1),
  order: z.number().int(),
  icon: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
});

export const stackSchema = z.array(stackItemSchema);
export type StackContent = z.infer<typeof stackSchema>;
```

`src/lib/content/schemas/projects.ts`

```ts
import { z } from 'zod';
import { externalLinkSchema } from './common';

export const projectLinksSchema = z
  .object({
    demo: externalLinkSchema.optional(),
    repo: externalLinkSchema.optional(),
    caseStudy: externalLinkSchema.optional(),
  })
  .refine((value) => Boolean(value.demo || value.repo || value.caseStudy), {
    message: 'At least one project link is required',
  });

export const projectSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  year: z.string().min(1),
  role: z.string().min(1),
  stack: z.array(z.string().min(1)).min(1),
  featured: z.boolean(),
  image: z.string().min(1).optional(),
  links: projectLinksSchema,
});

export const projectsSchema = z.array(projectSchema);
export type ProjectsContent = z.infer<typeof projectsSchema>;
```

`src/lib/content/schemas/seo.ts`

```ts
import { z } from 'zod';

export const seoSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  ogImage: z.string().min(1),
});

export type SeoContent = z.infer<typeof seoSchema>;
```

Each schema file must export both the schema and its inferred TypeScript type.

- [ ] **Step 5: Re-run the schema test**

Run:

```bash
npm run test -- tests/content/site-schema.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/content/types/content.ts src/lib/content/schemas src/lib/content/loaders/load-json.ts tests/content/site-schema.test.ts
git commit -m "feat: add typed content schemas"
```

### Task 5: Add canonical content files and a page-data loader

**Files:**
- Create: `src/content/global/site.json`
- Create: `src/content/global/navigation.json`
- Create: `src/content/pages/home.es.json`
- Create: `src/content/pages/home.en.json`
- Create: `src/content/stack/stack.es.json`
- Create: `src/content/stack/stack.en.json`
- Create: `src/content/projects/projects.es.json`
- Create: `src/content/projects/projects.en.json`
- Create: `src/content/seo/seo.es.json`
- Create: `src/content/seo/seo.en.json`
- Create: `src/lib/content/loaders/load-site-content.ts`
- Create: `tests/content/load-site-content.test.ts`
- Create: `public/images/about/miguel-portrait.jpg`
- Create: `public/images/projects/portfolio-cover.jpg`
- Create: `public/images/og/home.jpg`

- [ ] **Step 1: Write the failing integration-style content test**

```ts
import { describe, expect, it } from 'vitest';
import { loadSiteContent } from '../../src/lib/content/loaders/load-site-content';

describe('loadSiteContent', () => {
  it('loads validated content for es and en', async () => {
    const es = await loadSiteContent('es');
    const en = await loadSiteContent('en');

    expect(es.home.hero.title).toBe('Miguel Muñoz');
    expect(en.home.hero.title).toBe('Miguel Muñoz');
    expect(es.navigation.sections.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run the failing test**

Run:

```bash
npm run test -- tests/content/load-site-content.test.ts
```

Expected: FAIL because content files and loader do not exist.

- [ ] **Step 3: Create the JSON content files from the approved spec**

Use the spec's canonical JSON shapes as the starting content. Keep Spanish as the editorial base, then add the English equivalents. Do not add extra sections or fields beyond the approved contracts.

Content fidelity rules:
- Do not use placeholder copy such as `Paragraph one`, `Lorem ipsum`, or invented filler text.
- The actual Spanish copy must be transcribed from the approved Stitch design direction and any user-approved wording already captured in the spec.
- The English copy must be a real translation of the Spanish content, not a placeholder paraphrase.
- If any required copy is missing from the available approved material, stop and ask the user for that content instead of inventing it.

Required content details to encode at this stage:
- `site.json` must include primary email, GitHub, LinkedIn, and optional resume path.
- `seo.es.json` and `seo.en.json` must include localized title, description, and OG image.
- `navigation.json` must include localized section labels for every nav item.

- [ ] **Step 4: Add the required visual assets and make JSON references match real files**

Required minimum asset set for v1:
- `public/images/about/miguel-portrait.jpg`
- `public/images/projects/portfolio-cover.jpg`
- `public/images/og/home.jpg`

Asset rules:
- Source these assets from approved Stitch exports, existing user-provided materials, or finalized replacement assets explicitly aligned to the approved Stitch composition.
- Do not ship placeholder images, empty files, or arbitrary stock substitutions just to satisfy file paths.
- Do not leave placeholder paths in JSON pointing to files that do not exist.
- If a referenced local image changes name or location, update the JSON content in the same task.
- If additional project images are referenced in localized project files, create those exact files under `public/images/projects/` before finishing the task.
- The about image, featured project image, and OG image must exist before `loadSiteContent()` is considered complete.
- If the required approved asset is not available yet, stop and ask the user for the missing asset rather than fabricating one.

- [ ] **Step 5: Implement `loadSiteContent()` as the single composition loader**

Target behavior:

```ts
export async function loadSiteContent(locale: AppLocale) {
  return {
    site: parseJsonWithSchema(siteSchema, siteJson, 'src/content/global/site.json'),
    navigation: parseJsonWithSchema(navigationSchema, navigationJson, 'src/content/global/navigation.json'),
    seo: parseJsonWithSchema(seoSchema, locale === 'en' ? seoEn : seoEs, `src/content/seo/seo.${locale}.json`),
    home: parseJsonWithSchema(homeSchema, locale === 'en' ? homeEn : homeEs, `src/content/pages/home.${locale}.json`),
    stack: parseJsonWithSchema(stackSchema, locale === 'en' ? stackEn : stackEs, `src/content/stack/stack.${locale}.json`),
    projects: parseJsonWithSchema(projectsSchema, locale === 'en' ? projectsEn : projectsEs, `src/content/projects/projects.${locale}.json`),
  };
}
```

- [ ] **Step 6: Re-run the content tests**

Run:

```bash
npm run test -- tests/content/load-site-content.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/content public/images src/lib/content/loaders/load-site-content.ts tests/content/load-site-content.test.ts
git commit -m "feat: add localized content sources"
```

## Chunk 3: Design System and UI Composition

### Task 6: Add design tokens, base styles, and local font wiring

**Files:**
- Create: `src/lib/design-system/tokens.ts`
- Create: `src/styles/tokens/colors.css`
- Create: `src/styles/tokens/typography.css`
- Create: `src/styles/tokens/spacing.css`
- Create: `src/styles/tokens/radius.css`
- Create: `src/styles/tokens/shadows.css`
- Create: `src/styles/tokens/index.css`
- Create: `src/styles/globals/reset.css`
- Create: `src/styles/globals/base.css`
- Modify: `package.json`

- [ ] **Step 1: Define the token source in TypeScript**

`src/lib/design-system/tokens.ts`

```ts
export const designTokens = {
  colors: {
    background: '#0A0D14',
    surface: '#101522',
    surfaceStrong: '#161D2E',
    text: '#F5F7FB',
    textMuted: '#98A3B8',
    primary: '#7EE6FF',
    secondary: '#8B7CFF',
    tertiary: '#4FE0B5',
    border: 'rgba(126, 230, 255, 0.16)',
  },
  fonts: {
    heading: '"Space Grotesk", system-ui, sans-serif',
    body: '"IBM Plex Sans", system-ui, sans-serif',
  },
} as const;
```

- [ ] **Step 2: Expose the same tokens as CSS custom properties**

This step must include responsive tokens, not only static values. At minimum, define:
- typography tokens for display, heading, body, and label sizes
- spacing tokens for section padding and vertical rhythm
- breakpoint-based overrides for tablet and mobile in the token layer

Example from `src/styles/tokens/colors.css`:

```css
:root {
  --color-bg: #0a0d14;
  --color-surface: #101522;
  --color-surface-strong: #161d2e;
  --color-text: #f5f7fb;
  --color-text-muted: #98a3b8;
  --color-primary: #7ee6ff;
  --color-secondary: #8b7cff;
  --color-tertiary: #4fe0b5;
  --color-border: rgba(126, 230, 255, 0.16);
}
```

Example from `src/styles/tokens/typography.css`:

```css
:root {
  --text-display: 4.5rem;
  --text-heading-lg: 2.5rem;
  --text-body: 1rem;
}

@media (max-width: 1024px) {
  :root {
    --text-display: 3.5rem;
    --text-heading-lg: 2.125rem;
  }
}

@media (max-width: 640px) {
  :root {
    --text-display: 2.75rem;
    --text-heading-lg: 1.75rem;
    --text-body: 0.95rem;
  }
}
```

- [ ] **Step 3: Install self-hosted local font packages**

Run:

```bash
npm install @fontsource-variable/space-grotesk @fontsource/ibm-plex-sans
```

Expected: the font packages install successfully and are added to `package.json`.

- [ ] **Step 4: Import local font package CSS from `base.css`**

Use package CSS imports instead of placeholder public files:

```css
@import '@fontsource-variable/space-grotesk';
@import '@fontsource/ibm-plex-sans/400.css';
@import '@fontsource/ibm-plex-sans/500.css';
@import '@fontsource/ibm-plex-sans/600.css';
```

- [ ] **Step 5: Verify styles compile in Astro**

Run:

```bash
npm run check
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/lib/design-system/tokens.ts src/styles
git commit -m "feat: add centralized design tokens"
```

### Task 7: Implement shared layout and base UI atoms/molecules

**Files:**
- Create: `src/components/atoms/Heading.astro`
- Create: `src/components/atoms/Text.astro`
- Create: `src/components/atoms/ButtonLink.astro`
- Create: `src/components/atoms/Badge.astro`
- Create: `src/components/molecules/NavLink.astro`
- Create: `src/components/molecules/LanguageSwitcher.astro`
- Create: `src/components/molecules/SkillChip.astro`
- Create: `src/components/molecules/ProjectMeta.astro`
- Create: `src/components/organisms/Header.astro`
- Create: `src/components/organisms/Footer.astro`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/styles/components/button.css`
- Create: `src/styles/components/header.css`

- [ ] **Step 1: Create components with typed props only**

Example atom pattern:

```astro
---
interface Props {
  level?: 1 | 2 | 3;
  class?: string;
}

const { level = 2, class: className } = Astro.props;
const Tag = `h${level}` as const;
---

<Tag class={className}><slot /></Tag>
```

- [ ] **Step 2: Implement `LanguageSwitcher.astro` with plain links and data attributes for cookie persistence**

Expected behavior:
- Spanish links to `/`
- English links to `/en/`
- script hook writes `preferred-locale` before navigation
- the cookie contract must be exactly:
  - key: `preferred-locale`
  - allowed values: `es` and `en`
  - path: `/`
  - `max-age=31536000`

Expected client script shape:

```html
<script is:inline>
  document.addEventListener('click', (event) => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const link = target.closest('[data-locale-switch]');

    if (!(link instanceof HTMLAnchorElement)) return;

    const locale = link.dataset.locale;

    if (locale === 'es' || locale === 'en') {
      document.cookie = `preferred-locale=${locale}; path=/; max-age=31536000`;
    }
  });
</script>
```

- [ ] **Step 3: Implement `NavLink.astro`, `Header.astro`, and `Footer.astro` so navigation labels and links come from centralized content and helpers**

Required rules:
- `Header` and `Footer` must receive the validated `navigation.sections` array from content, not hardcoded labels.
- `NavLink` must receive an already-resolved `href` built with `getSectionPath(locale, section.id)`.
- `LanguageSwitcher` must receive its locale labels from `navigation.localeLabels`.
- No component may hardcode `Sobre mí`, `About`, `Projects`, or locale URLs directly in markup.

- [ ] **Step 4: Implement `BaseLayout.astro` with full localized SEO wiring**

It must:
- import global token files
- set `<html lang={locale}>`
- include SEO title/description props
- compute canonical URL from `site.siteUrl` plus the current pathname
- include localized Open Graph tags using `seo.ogImage`
- use site-level values from `site.json` where shared metadata is needed
- load the root locale redirect script only on `/`

- [ ] **Step 5: Run type-checking**

Run:

```bash
npm run check
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/atoms src/components/molecules src/components/organisms/Header.astro src/components/organisms/Footer.astro src/layouts/BaseLayout.astro src/styles/components
git commit -m "feat: add shared layout and ui primitives"
```

### Task 8: Implement content mapping and section organisms

**Files:**
- Create: `src/lib/content/mappers/map-home-page.ts`
- Create: `src/components/organisms/HeroSection.astro`
- Create: `src/components/organisms/AboutSection.astro`
- Create: `src/components/organisms/StackSection.astro`
- Create: `src/components/organisms/ProjectsSection.astro`
- Create: `src/components/organisms/ContactSection.astro`
- Create: `src/components/templates/HomeTemplate.astro`
- Create: `src/styles/components/sections.css`
- Create: `tests/content/map-home-page.test.ts`

- [ ] **Step 1: Write a failing mapper test**

```ts
import { describe, expect, it } from 'vitest';
import { loadSiteContent } from '../../src/lib/content/loaders/load-site-content';
import { mapHomePage } from '../../src/lib/content/mappers/map-home-page';

describe('mapHomePage', () => {
  it('maps content into template-friendly props', async () => {
    const content = await loadSiteContent('es');
    const page = mapHomePage('es', content);

    expect(page.locale).toBe('es');
    expect(page.hero.title).toBe('Miguel Muñoz');
    expect(page.projects.items.length).toBeGreaterThan(0);
    expect(page.contact.links.github).toContain('github.com');
    expect(page.seo.title.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run the failing test**

Run:

```bash
npm run test -- tests/content/map-home-page.test.ts
```

Expected: FAIL because the mapper does not exist yet.

- [ ] **Step 3: Implement `mapHomePage()` as a pure function**

Target shape:

```ts
export function mapHomePage(locale: AppLocale, content: LoadedSiteContent) {
  return {
    locale,
    seo: content.seo,
    navigation: content.navigation,
    hero: content.home.hero,
    about: content.home.about,
    stack: {
      ...content.home.stack,
      items: [...content.stack].sort((a, b) => a.order - b.order),
    },
    projects: {
      ...content.home.projects,
      items: content.projects,
    },
    contact: {
      ...content.home.contact,
      links: {
        email: `mailto:${content.site.author.email}`,
        github: content.site.social.github,
        linkedin: content.site.social.linkedin,
        resume: content.site.assets.resume,
      },
    },
    site: content.site,
  };
}
```

- [ ] **Step 4: Implement the organisms and template**

Rules:
- sections render only typed props
- no JSON imports inside components
- no locale branching inside section markup except where a locale prop is explicitly needed
- preserve the Stitch section order exactly
- `Header` and `Footer` consume centralized navigation data and resolved links from helpers
- `ContactSection` must render the primary CTA plus direct contact methods for email, GitHub, and LinkedIn, and render a resume link only when present
- `ProjectsSection` must preserve a featured-project hierarchy on mobile instead of flattening every card into identical blocks
- `HeroSection`, `AboutSection`, `ProjectsSection`, and `ContactSection` must implement explicit mobile/tablet reflow rules, not simple scaled-down desktop spacing

- [ ] **Step 5: Re-run mapper tests and type-checks**

Run:

```bash
npm run test -- tests/content/map-home-page.test.ts
npm run check
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/content/mappers/map-home-page.ts src/components/organisms src/components/templates/HomeTemplate.astro src/styles/components/sections.css tests/content/map-home-page.test.ts
git commit -m "feat: compose landing sections from typed content"
```

## Chunk 4: Pages, Verification, and Polish

### Task 9: Build localized pages from the template

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/pages/en/index.astro`

- [ ] **Step 1: Create the Spanish page as the default route**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import HomeTemplate from '../components/templates/HomeTemplate.astro';
import { loadSiteContent } from '../lib/content/loaders/load-site-content';
import { mapHomePage } from '../lib/content/mappers/map-home-page';

const content = await loadSiteContent('es');
const page = mapHomePage('es', content);
---

<BaseLayout locale={page.locale} seo={page.seo} site={page.site} pathname={Astro.url.pathname}>
  <HomeTemplate page={page} />
</BaseLayout>
```

- [ ] **Step 2: Create the English page as `/en/`**

Repeat the same structure using locale `en`, including `site={page.site}`.

- [ ] **Step 3: Run Astro checks and build**

Run:

```bash
npm run check
npm run build
```

Expected: PASS and build output contains both `/` and `/en/` routes.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro src/pages/en/index.astro
git commit -m "feat: add bilingual home routes"
```

### Task 10: Verify content behavior, locale switching, and final output

**Files:**
- Modify: any files needed to fix failures discovered by verification

- [ ] **Step 1: Run the full project verification suite**

Run:

```bash
npm run test
npm run check
npm run build
```

Expected: all commands PASS.

- [ ] **Step 2: Start the dev server in one shell and verify critical flows in a separate browser session**

Run:

```bash
npm run dev
```

With the dev server running, use browser automation if available. Verify:
- `/` renders Spanish content
- `/en/` renders English content
- switching locale writes `preferred-locale`
- the cookie is written with `path=/` and `max-age=31536000`
- visiting `/` after selecting English redirects to `/en/`
- canonical and OG metadata reflect the current locale
- navigation labels come from localized content and route through helper-built hrefs
- contact renders direct email, GitHub, LinkedIn, and optional resume link correctly
- about image, featured project image, and OG image resolve successfully with no broken local asset paths
- sections appear in the approved order
- the UI stays coherent on desktop and mobile widths

If Playwright is available, use it to script the checks instead of relying only on manual inspection.

- [ ] **Step 3: Fix any issues found and rerun all verification commands**

Run again:

```bash
npm run test
npm run check
npm run build
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: finalize Miguel portfolio landing"
```

## Review Checklist For The Implementer
- This branch replaces the previous portfolio completely; remove or ignore legacy app code instead of adapting to it.
- Keep the project static-first.
- Do not introduce React or another island framework unless a real requirement appears.
- Do not bypass schema validation by reading JSON directly in components.
- Keep components presentation-focused and loaders pure.
- Keep the token system centralized and avoid inline design values.
- Preserve the approved section order and bilingual routing behavior.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-01-miguel-portfolio-landing.md`. Ready to execute.
