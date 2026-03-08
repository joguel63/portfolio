# Copilot Instructions

## Commands

```bash
npm run dev          # Vite dev server
npm run build        # Production build (output: dist/)
npm run preview      # Preview production build
npm run lint         # ESLint
npm test             # Run all tests (Vitest, --run mode)
npx vitest run src/components/About/About.test.jsx   # Single test file
npx vitest run -t "renders heading"                  # Single test by name
```

## Architecture

This is a single-page portfolio app (React 19 + Vite 7) with no client-side router — navigation is anchor-based smooth scroll. Sections render in order: `#hero` → `#about` → `#experience` → `#projects` → `#contact`.

The project is designed for **multi-agent parallel development**. Each layer owns a strict domain:

| Layer | Owns | Never touches |
|-------|------|---------------|
| **Data** | `src/data/` | Component JSX, animations |
| **Animations** | `src/animations/`, `src/contracts/animations.contract.js` | Component JSX |
| **UI** | `src/components/`, `src/App.jsx`, `src/index.css` | GSAP/Three.js logic directly |
| **CI/CD** | `.github/workflows/`, `vite.config.js`, `package.json` | Source code |

Layers communicate through **contracts** in `src/contracts/`. The UI layer imports animations only via `src/animations/index.js`, never from specific animation files. The Animations layer never imports React components.

`src/data/` is the single source of truth for all content — never hard-code content in component files. All components import from `src/data/index.js`.

`App.jsx` uses `React.lazy` + `Suspense` for code-split loading of all sections below the hero.

## Key Conventions

**Content editing:** All portfolio content (name, bio, tech stack, projects, experience, social links) lives in `src/data/profile.js`, `src/data/experience.js`, and `src/data/projects.js`. Components consume this via the barrel export `src/data/index.js`.

**GSAP animations:** Always wrap in `gsap.context(() => { ... }, sectionRef)` and return `ctx.revert()` from `useEffect` for cleanup. Animations target CSS class selectors (e.g., `.about-animate`), not refs directly.

**Styling:** Tailwind CSS v4 utility classes are primary. Custom design tokens are defined via `@theme` in `src/index.css` (not `tailwind.config.js` — that file does not exist). Dynamic/responsive values use inline `style={{}}` with CSS variables like `var(--color-accent-cyan)` and `clamp()` for fluid sizing.

**Component structure:** Each component lives in `src/components/ComponentName/ComponentName.jsx` with a co-located `ComponentName.test.jsx`. Components export as default. New components require a test file.

**New animations:** Add the function to `src/animations/`, export from `src/animations/index.js`, and register any new named IDs in `src/contracts/animations.contract.js`.

**Deployment:** Vite is configured with `base: '/portfolio/'` for GitHub Pages. The `dist/` folder is the build output deployed via GitHub Actions.
