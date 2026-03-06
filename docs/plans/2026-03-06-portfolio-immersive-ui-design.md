# Portfolio — Immersive 3D UI Design

**Date:** 2026-03-06  
**Status:** Approved  
**Author:** Brainstorming session (Copilot + user)

---

## Problem Statement

The portfolio has a solid technical foundation (React + Vite + Three.js + GSAP, tests passing, multi-agent architecture documented) but nothing production-ready in terms of UI. The goal is to build a complete, impressive, and deployable developer portfolio that reflects a Full-Stack developer profile with a dark, tech, and modern aesthetic.

---

## Approved Design

### Architecture

A Single Page Application (SPA) with smooth scroll navigation. No client-side routing — all sections live on one page with GSAP ScrollTrigger orchestrating transitions.

**Component tree:**
```
App.jsx
  ├── Navbar          (fixed, scroll-spy active section highlight)
  ├── BackgroundCanvas (Three.js global particle canvas, z-index: -1)
  ├── Hero            (immersive space scene — see below)
  ├── About           (bio + floating 3D tech icons)
  ├── Experience      (vertical timeline with 3D depth cards)
  ├── Projects        (grid with 3D tilt/glow cards)
  └── Contact         (social links — GitHub, LinkedIn, Email)
```

---

### Visual System

**Color palette:**
| Token | Hex | Usage |
|-------|-----|-------|
| `bg-primary` | `#050508` | Global background |
| `bg-secondary` | `#0d0d14` | Alternating section backgrounds |
| `accent-cyan` | `#00f5ff` | Titles, hover states, particles |
| `accent-purple` | `#8b5cf6` | Secondary gradients, skill badges |
| `text-primary` | `#e2e8f0` | Body text |
| `text-muted` | `#64748b` | Labels, dates, subtitles |

**Typography:**
- Headlines: **Space Grotesk** (modern, tech feel)
- Body: **Inter** (readable, professional)
- Code/labels: **JetBrains Mono** (tech badges, snippets)

**Animation language:**
- Background particles react to scroll speed
- Cards have 3D tilt on hover
- Sections enter with `gsap.from()` — fade + slide from below via ScrollTrigger
- Custom cursor: cyan halo that follows the mouse

---

### Sections

#### 1. Hero (Immersive Space Scene)
A full-viewport Three.js scene:
- **Background:** 3D starfield (thousands of particles distributed in a large sphere), slow rotation
- **Nebula:** Cyan/purple colored cloud using Three.js `FogExp2` or shader material
- **Text:** Name and title appear with a "cosmic materialization" effect — particles condense into letters using GSAP
- **CTA:** Pulsing "Ver proyectos" button with subtle glow
- **Scroll transition:** Stars accelerate (warp speed effect) as the user scrolls down

#### 2. About
- 2–3 paragraph bio
- Tech stack grid: icons that float/rotate slowly using `@react-three/drei` or CSS 3D transforms
- Skills shown as animated progress indicators or glowing badges

#### 3. Experience
- Vertical timeline layout
- Cards fly in from alternating sides on scroll (GSAP ScrollTrigger)
- Each card: company, role, dates, 3–5 achievement bullets
- Subtle 3D depth effect on cards (box-shadow + perspective)

#### 4. Projects
- 3×2 grid (6 projects)
- Each card: project name, short description, tech stack badges, GitHub + live links
- Hover: 3D tilt effect + cyan border glow
- Featured project gets a wider card

#### 5. Contact
- Minimal: inspirational closing text
- 3 large icon buttons: GitHub, LinkedIn, Email
- Background: pulsing gradient (cyan → purple → black)

---

### Data Layer

Static data files in `src/data/`:
- `src/data/profile.js` — name, title, bio, social links
- `src/data/experience.js` — array of job objects
- `src/data/projects.js` — array of project objects

No backend, no CMS. Edit the files directly to update content.

---

### CI/CD & Deployment

**GitHub Actions:**
- On PR: run tests (`npm test`) + lint (`npm run lint`)
- On push to `master`: build + deploy to GitHub Pages (`gh-pages` branch)

**Workflow:** Each micro-task → feature branch → PR → tests pass → merge to `master` → docs updated → auto-deploy.

---

### Testing Strategy

- Each new component gets a test file
- Rule: no merge without green tests
- Animation contracts remain the interface between layers

---

## Constraints & Notes

- Keep Three.js scenes performant: use `instancedMesh` for particles, limit draw calls
- Lazy load heavy 3D sections (already scaffolded in App.jsx)
- Fonts loaded via Google Fonts CDN
- All content is placeholder until the user fills `src/data/` files
