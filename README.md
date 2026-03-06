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
