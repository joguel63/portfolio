# miguelmunoz.dev

![Astro](https://img.shields.io/badge/Astro-5.7-000?logo=astro)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![GSAP](https://img.shields.io/badge/GSAP-3.12-88CE02?logo=greensock)

Bilingual portfolio site built with **Astro**, **TypeScript**, and **GSAP** — designed to be fast, intentional, and minimal. No frameworks, no hydration overhead, just clean static HTML with subtle motion where it counts.

---

## What's inside

**Type-safe content engine** — Every section is driven by structured JSON validated with Zod. Content lives in `src/content/`, split by locale (es/en), with full TypeScript coverage from source to component. Changing copy never breaks the layout.

**Bilingual, zero-config routing** — Spanish (`/`) and English (`/en/`) pages share the same component tree. Content, SEO metadata, and navigation labels are locale-aware without conditional rendering spaghetti.

**Expressive motion, not noise** — GSAP scroll-triggered reveals across hero, about, stack, projects, contact, and footer sections. Subtle parallax on the hero orb. Motion serves the content, not the other way around.

**Design-token foundations** — CSS custom properties for colors, spacing, typography, and motion curves live in `src/styles/tokens/`. Every visual decision traces back to a token. Section styles are scoped, globals are intentional, and the cascade is predictable.

**Regression-tested content mapping** — `mapHomePage` transforms raw content into template-ready props. The test suite asserts on exact CSS values, animation structure, component structure, and localized output — not just data shapes.

---

## Stack

| Layer | Tools |
|-------|-------|
| Static site | Astro 5 |
| Language | TypeScript |
| Validation | Zod |
| Animation | GSAP + ScrollTrigger |
| Fonts | IBM Plex Sans, Space Grotesk |
| Testing | Vitest |

---

## Quick start

```bash
git clone https://github.com/joguel63/portfolio.git
cd portfolio
pnpm install
pnpm dev
```

Open `http://localhost:4321` for Spanish, `http://localhost:4321/en/` for English.

---

## Verification

```bash
pnpm test          # Full test suite
pnpm check         # Astro type diagnostics
pnpm build         # Production build
```

---

## License

MIT — built in public.
