# Portfolio — [Your Name]

> Full-Stack Developer Portfolio built with React, Three.js, and GSAP

🌐 **[Live Demo](https://username.github.io/portfolio/)** ← replace with your URL

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite 7 |
| 3D Graphics | Three.js + @react-three/fiber + @react-three/drei |
| Animations | GSAP 3 (ScrollTrigger) |
| Styling | Tailwind CSS 4 |
| Testing | Vitest + @testing-library/react |
| CI/CD | GitHub Actions → GitHub Pages |

## Sections

- **Hero** — Immersive Three.js space scene with cosmic text entrance
- **About** — Bio + tech stack with scroll animations
- **Experience** — Timeline with GSAP-animated cards
- **Projects** — 3D tilt grid with glow effects
- **Contact** — Social links (GitHub, LinkedIn, Email)

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test

# Production build
npm run build
```

## Updating Content

Edit the files in `src/data/`:
- `src/data/profile.js` — name, bio, social links
- `src/data/experience.js` — work history
- `src/data/projects.js` — portfolio projects

## Architecture

See [`docs/architecture.md`](docs/architecture.md) for the multi-agent layer architecture.

## License

MIT
