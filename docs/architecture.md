# Multi-Agent Architecture

This project is designed for parallel development by multiple AI agents.
Each agent owns a dedicated layer of the codebase. This document is the
authoritative reference for layer ownership and coordination rules.

## Layer Overview

| Layer | Owns | Does NOT touch |
|-------|------|----------------|
| **Data** | `src/data/` | Component JSX, animations, CI config |
| **Animations** | `src/animations/`, `src/contracts/animations.contract.js` | Component JSX, CI config |
| **UI** | `src/components/`, `src/App.jsx`, `src/index.css` | GSAP/Three.js logic, CI config |
| **CI/CD** | `.github/workflows/`, `vite.config.js`, `package.json` | Source code, docs |
| **Docs** | `README.md`, `docs/` | Source code, CI config |

## How Layers Communicate

Layers communicate through **interface contracts** in `src/contracts/`:

- `src/contracts/animations.contract.js` — defines named animation IDs and function signatures
- `src/contracts/hero.contract.js` — defines Hero component props and default values

The **Data layer** (`src/data/`) acts as a single source of truth for all content. UI components import directly from `src/data/index.js`. Never hard-code content in component files.

## The No-Conflict Rules

1. **One layer, one domain.** Never create or modify files outside your layer's domain.
2. **Contracts are shared.** Any layer may *read* any contract. To *write* a contract,
   coordinate with the owning layer (see ownership table above).
3. **No direct imports across layers.** The UI layer imports from `src/animations/index.js`,
   never from a specific animation file. The Animations layer never imports React components.
4. **Master is integration-only.** No agent commits directly to `master`. Use worktree branches.

## Adding a New Component (UI Agent)

1. Create `src/components/ComponentName/ComponentName.jsx`
2. Create `src/components/ComponentName/ComponentName.test.jsx`
3. If the component needs animations, add the animation function to `src/animations/`
   and export it from `src/animations/index.js`
4. If the component exposes new props that other layers need to know about,
   add a contract to `src/contracts/`

## Adding a New Animation (Animations Agent)

1. Add the animation function to `src/animations/` (new file or existing)
2. Export it from `src/animations/index.js`
3. If the animation introduces a new named ID, add it to `src/contracts/animations.contract.js`
4. The UI agent will call the function — do not call it yourself from animation files

## Components

| Component | Section ID | Data Source |
|-----------|-----------|-------------|
| `Navbar` | — | `profile.name` |
| `Hero` | `#hero` | `profile.name`, `profile.title`, `profile.tagline` |
| `About` | `#about` | `profile.bio`, `profile.techStack` |
| `Experience` | `#experience` | `experience[]` |
| `Projects` | `#projects` | `projects[]` |
| `Contact` | `#contact` | `profile.social`, `profile.email` |

## Worktree Setup

See `docs/TASK-DEPENDENCIES.md` for the full layer table and commands to create worktrees.
