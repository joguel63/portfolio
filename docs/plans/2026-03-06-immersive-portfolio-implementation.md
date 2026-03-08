# Immersive 3D Portfolio — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a complete, production-ready portfolio SPA with a dark tech aesthetic, immersive Three.js space hero, animated sections (About, Experience, Projects, Contact), and automated GitHub Pages deployment.

**Architecture:** Single Page Application with smooth GSAP scroll navigation. A full-viewport Three.js space scene anchors the Hero. Remaining sections use GSAP ScrollTrigger for entrance animations. Static data in `src/data/` drives all content. GitHub Actions handles CI (tests + lint on every PR) and CD (auto-deploy to GitHub Pages on every push to `master`).

**Tech Stack:** React 19 + Vite 7, Three.js + @react-three/fiber + @react-three/drei, GSAP 3 (ScrollTrigger + ScrollToPlugin), Tailwind CSS 4, Vitest + @testing-library/react, GitHub Actions

---

## Task 1: Foundation Cleanup

**Goal:** Remove all Vite demo scaffolding. Leave App.jsx as a clean shell that only renders the Hero.

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/App.css`
- Modify: `src/index.css`
- Modify: `index.html`

**Step 1: Overwrite `src/App.css` — delete all Vite demo styles**

Replace the entire content with:
```css
/* App-level layout styles will live here */
```

**Step 2: Overwrite `src/App.jsx` — clean shell**

```jsx
import { lazy, Suspense } from 'react'
import Hero from './components/Hero.jsx'

const About = lazy(() => import('./components/About/About'))

export default function App() {
  return (
    <>
      <Hero />
      <Suspense fallback={null}>
        <About />
      </Suspense>
    </>
  )
}
```

**Step 3: Run tests to confirm nothing broke**

```bash
npm test
```
Expected: all tests pass (10/10).

**Step 4: Commit**

```bash
git add src/App.jsx src/App.css
git commit -m "chore: remove Vite demo scaffolding from App

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 2: Design Tokens & Global Styles

**Goal:** Replace Vite's default CSS variables with the approved dark tech design system. Configure Tailwind v4 custom theme tokens. Add Google Fonts.

**Files:**
- Modify: `src/index.css`
- Modify: `index.html`

**Step 1: Update `index.html` — add Google Fonts + meta**

Replace the `<head>` section:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Portfolio — Full-Stack Developer" />
    <title>Portfolio</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**Step 2: Overwrite `src/index.css` — design tokens + Tailwind v4 theme**

```css
@import "tailwindcss";

@theme {
  --color-bg-primary: #050508;
  --color-bg-secondary: #0d0d14;
  --color-accent-cyan: #00f5ff;
  --color-accent-purple: #8b5cf6;
  --color-text-primary: #e2e8f0;
  --color-text-muted: #64748b;

  --font-sans: 'Inter', system-ui, sans-serif;
  --font-display: 'Space Grotesk', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

:root {
  color-scheme: dark;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: auto; /* GSAP ScrollToPlugin controls scrolling */
}

body {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1.6;
  min-height: 100vh;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Smooth scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: var(--color-bg-primary);
}
::-webkit-scrollbar-thumb {
  background: var(--color-accent-cyan);
  border-radius: 3px;
  opacity: 0.5;
}

/* Selection highlight */
::selection {
  background: var(--color-accent-cyan);
  color: var(--color-bg-primary);
}

a {
  color: var(--color-accent-cyan);
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
```

**Step 3: Run dev server to verify styles load**

```bash
npm run dev
```
Navigate to `http://localhost:5173`. Expect: black background, no Vite demo content.

**Step 4: Run tests**

```bash
npm test
```
Expected: all tests pass.

**Step 5: Commit**

```bash
git add src/index.css index.html
git commit -m "style: apply dark tech design tokens and Google Fonts

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 3: Vitest Setup File (jest-dom matchers)

**Goal:** Configure Vitest to load `@testing-library/jest-dom` matchers globally so tests can use `toBeInTheDocument()`, `toHaveTextContent()`, etc.

**Files:**
- Create: `src/test-setup.js`
- Modify: `vite.config.js`

**Step 1: Create `src/test-setup.js`**

```js
import '@testing-library/jest-dom'
```

**Step 2: Update `vite.config.js` — add Vitest config**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.js'],
  },
})
```

**Step 3: Remove environment flags from `package.json` scripts**

Update the `test` script (the config now lives in vite.config.js):
```json
"test": "vitest --run"
```

**Step 4: Run tests to confirm setup works**

```bash
npm test
```
Expected: 10/10 pass, no "undefined matcher" errors.

**Step 5: Commit**

```bash
git add src/test-setup.js vite.config.js package.json
git commit -m "test: add jest-dom setup file and move vitest config to vite.config.js

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 4: Static Data Layer

**Goal:** Create all portfolio content as static JS data files. These are the single source of truth for the entire UI.

**Files:**
- Create: `src/data/profile.js`
- Create: `src/data/experience.js`
- Create: `src/data/projects.js`
- Create: `src/data/index.js`

**Step 1: Create `src/data/profile.js`**

```js
export const profile = {
  name: 'Miguel Muñoz',           // ← replace with your real name
  title: 'Full-Stack Developer',
  tagline: 'Building digital experiences that live between frontend and backend.',
  bio: [
    'Desarrollador Full-Stack con pasión por crear aplicaciones web modernas, escalables y con interfaces atractivas.',
    'Especializado en React, Node.js y arquitecturas cloud. Me enfoco en escribir código limpio y bien testeado.',
  ],
  location: 'Cucuta, Colombia',  // ← replace
  email: 'joguel63@email.com',         // ← replace
  social: {
    github: 'https://github.com/joguel63',    // ← replace
    linkedin: 'https://www.linkedin.com/in/jose-miguel-mu%C3%B1oz-velasco', // ← replace
  },
  techStack: [
    { name: 'React', color: '#61dafb' },
    { name: 'Node.js', color: '#8cc84b' },
    { name: 'TypeScript', color: '#3178c6' },
    { name: 'PostgreSQL', color: '#336791' },
    { name: 'Docker', color: '#2496ed' },
    { name: 'AWS', color: '#ff9900' },
    { name: 'GraphQL', color: '#e10098' },
    { name: 'Python', color: '#3776ab' },
  ],
}
```

**Step 2: Create `src/data/experience.js`**

```js
export const experience = [
  {
    id: 'exp-1',
    role: 'Full-Stack Developer',
    company: 'Empresa Ejemplo',
    period: '2023 — Presente',
    description: 'Descripción breve de lo que haces en esta empresa.',
    achievements: [
      'Logro 1: migré el sistema de autenticación a JWT, reduciendo latencia en 40%.',
      'Logro 2: lideré el desarrollo del nuevo dashboard, adoptado por 500+ usuarios.',
      'Logro 3: implementé CI/CD con GitHub Actions, eliminando deploys manuales.',
    ],
    tech: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
  },
  {
    id: 'exp-2',
    role: 'Frontend Developer',
    company: 'Otra Empresa',
    period: '2021 — 2023',
    description: 'Descripción de tu rol anterior.',
    achievements: [
      'Logro 1',
      'Logro 2',
      'Logro 3',
    ],
    tech: ['Vue.js', 'TypeScript', 'Sass'],
  },
]
```

**Step 3: Create `src/data/projects.js`**

```js
export const projects = [
  {
    id: 'project-1',
    title: 'Proyecto Destacado',
    description: 'Descripción de tu proyecto más importante. Qué problema resuelve y cómo.',
    tech: ['React', 'Node.js', 'MongoDB'],
    github: 'https://github.com/tu-usuario/proyecto',
    live: 'https://tu-proyecto.com',
    featured: true,
  },
  {
    id: 'project-2',
    title: 'Otro Proyecto',
    description: 'Descripción breve.',
    tech: ['Python', 'FastAPI', 'PostgreSQL'],
    github: 'https://github.com/tu-usuario/proyecto-2',
    live: null,
    featured: false,
  },
  {
    id: 'project-3',
    title: 'Proyecto 3',
    description: 'Descripción breve.',
    tech: ['TypeScript', 'Next.js'],
    github: 'https://github.com/tu-usuario/proyecto-3',
    live: 'https://proyecto-3.vercel.app',
    featured: false,
  },
  {
    id: 'project-4',
    title: 'Proyecto 4',
    description: 'Descripción breve.',
    tech: ['Docker', 'AWS', 'Terraform'],
    github: 'https://github.com/tu-usuario/proyecto-4',
    live: null,
    featured: false,
  },
  {
    id: 'project-5',
    title: 'Proyecto 5',
    description: 'Descripción breve.',
    tech: ['React Native', 'Firebase'],
    github: 'https://github.com/tu-usuario/proyecto-5',
    live: null,
    featured: false,
  },
]
```

**Step 4: Create `src/data/index.js`**

```js
export { profile } from './profile.js'
export { experience } from './experience.js'
export { projects } from './projects.js'
```

**Step 5: Commit**

```bash
git add src/data/
git commit -m "feat(data): add static data layer for profile, experience, and projects

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 5: Navbar Component

**Goal:** Fixed top navbar with the developer name/logo on the left, navigation links on the right. Links use GSAP ScrollToPlugin for smooth scroll. Active section highlighted via IntersectionObserver.

**Files:**
- Create: `src/components/Navbar/Navbar.jsx`
- Create: `src/components/Navbar/Navbar.test.jsx`
- Modify: `src/App.jsx`

**Step 1: Write the failing test first — `src/components/Navbar/Navbar.test.jsx`**

```jsx
import { render, screen } from '@testing-library/react'
import Navbar from './Navbar'
import { profile } from '../../data/index.js'

describe('Navbar', () => {
  it('renders the developer name', () => {
    render(<Navbar />)
    expect(screen.getByText(profile.name)).toBeInTheDocument()
  })

  it('renders all navigation links', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /experience/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument()
  })
})
```

**Step 2: Run to verify it fails**

```bash
npm test -- Navbar
```
Expected: FAIL — "Cannot find module './Navbar'"

**Step 3: Create `src/components/Navbar/Navbar.jsx`**

```jsx
import { useEffect, useState, useCallback } from 'react'
import { profile } from '../../data/index.js'

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [active, setActive] = useState('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { threshold: 0.5 }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const handleNavClick = useCallback((e, href) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) target.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'rgba(5, 5, 8, 0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,245,255,0.1)' : 'none',
      }}
    >
      <a
        href="#hero"
        onClick={(e) => handleNavClick(e, '#hero')}
        className="font-display font-bold text-lg tracking-tight"
        style={{ color: 'var(--color-accent-cyan)' }}
      >
        {profile.name}
      </a>

      <ul className="flex gap-8 list-none">
        {NAV_LINKS.map(({ label, href }) => (
          <li key={href}>
            <a
              href={href}
              onClick={(e) => handleNavClick(e, href)}
              className="font-medium text-sm tracking-wide transition-colors duration-200"
              style={{
                color: active === href.slice(1)
                  ? 'var(--color-accent-cyan)'
                  : 'var(--color-text-muted)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
```

**Step 4: Run tests**

```bash
npm test -- Navbar
```
Expected: PASS (2 tests)

**Step 5: Add Navbar to `src/App.jsx`**

```jsx
import { lazy, Suspense } from 'react'
import Navbar from './components/Navbar/Navbar.jsx'
import Hero from './components/Hero.jsx'

const About = lazy(() => import('./components/About/About'))

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Suspense fallback={null}>
        <About />
      </Suspense>
    </>
  )
}
```

**Step 6: Run all tests**

```bash
npm test
```
Expected: all pass.

**Step 7: Commit**

```bash
git add src/components/Navbar/ src/App.jsx
git commit -m "feat(navbar): add fixed navbar with scroll-spy and smooth scroll

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 6: Hero Section — Immersive Space Scene

**Goal:** Replace the basic rotating box Hero with a full-viewport space scene: Three.js starfield via `@react-three/drei` Stars, cosmic nebula fog, GSAP text materialization entrance, and a pulsing CTA button.

**Files:**
- Modify: `src/components/Hero.jsx`
- Create: `src/animations/hero.space.animations.js`
- Create: `src/animations/hero.space.animations.test.js`
- Modify: `src/contracts/hero.contract.js`

**Step 1: Update `src/contracts/hero.contract.js`**

```js
export const HERO_DEFAULTS = Object.freeze({
  canvasHeight: 'h-screen',
  boxColor: '#00f5ff',
  entranceDuration: 1.2,
  starsCount: 5000,
  starsRadius: 100,
})
```

**Step 2: Write the failing animation test — `src/animations/hero.space.animations.test.js`**

```js
import { describe, it, expect, vi } from 'vitest'
import { initSpaceHeroEntrance } from './hero.space.animations.js'

describe('initSpaceHeroEntrance', () => {
  it('is a function', () => {
    expect(typeof initSpaceHeroEntrance).toBe('function')
  })

  it('returns null gracefully when ref is null', () => {
    const result = initSpaceHeroEntrance(null)
    expect(result).toBeNull()
  })

  it('returns a GSAP timeline when ref has current', () => {
    const mockRef = { current: document.createElement('div') }
    const tl = initSpaceHeroEntrance(mockRef)
    expect(tl).not.toBeNull()
    expect(typeof tl.kill).toBe('function')
    tl.kill()
  })
})
```

**Step 3: Run to verify it fails**

```bash
npm test -- hero.space
```
Expected: FAIL — "Cannot find module"

**Step 4: Create `src/animations/hero.space.animations.js`**

```js
import gsap from 'gsap'
import { ANIMATION_IDS } from '../contracts/animations.contract.js'

/**
 * Animates the Hero space scene entrance.
 * Fades in the canvas + slides title characters up from below with a blur.
 * @param {React.RefObject} heroRef - ref to the hero <section>
 * @returns {gsap.core.Timeline|null}
 */
export function initSpaceHeroEntrance(heroRef) {
  if (!heroRef?.current) return null

  const tl = gsap.timeline({ id: ANIMATION_IDS.HERO_ENTRANCE })

  // Fade in the canvas
  tl.from(heroRef.current.querySelector('canvas'), {
    opacity: 0,
    duration: 2,
    ease: 'power2.out',
  }, 0)

  // Materialize title characters
  tl.from(heroRef.current.querySelectorAll('.hero-char'), {
    opacity: 0,
    y: 40,
    filter: 'blur(10px)',
    stagger: 0.03,
    duration: 1.2,
    ease: 'power3.out',
  }, 0.5)

  // Fade in subtitle + CTA
  tl.from(heroRef.current.querySelectorAll('.hero-fade'), {
    opacity: 0,
    y: 20,
    stagger: 0.2,
    duration: 0.8,
    ease: 'power2.out',
  }, 1.2)

  return tl
}
```

**Step 5: Run animation test**

```bash
npm test -- hero.space
```
Expected: PASS (3 tests)

**Step 6: Rewrite `src/components/Hero.jsx`**

```jsx
import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { initSpaceHeroEntrance } from '../animations/hero.space.animations.js'
import { profile } from '../data/index.js'

function SpaceScene({ scrollProgressRef }) {
  const starsGroupRef = useRef()

  useFrame((_, delta) => {
    if (!starsGroupRef.current) return
    const speed = 0.03 + (scrollProgressRef.current || 0) * 0.8
    starsGroupRef.current.rotation.y += delta * speed
    starsGroupRef.current.rotation.x += delta * speed * 0.1
  })

  return (
    <group ref={starsGroupRef}>
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0.2}
        fade
      />
      <fog attach="fog" args={['#050508', 80, 200]} />
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#00f5ff" distance={50} />
    </group>
  )
}

// Splits a string into individual <span> elements for character-level animation
function SplitText({ text, className }) {
  const chars = useMemo(() => [...text], [text])
  return (
    <span className={className}>
      {chars.map((char, i) => (
        <span key={i} className="hero-char inline-block">
          {char === ' ' ? '\u00a0' : char}
        </span>
      ))}
    </span>
  )
}

export default function Hero() {
  const heroRef = useRef(null)
  const scrollProgressRef = useRef(0)

  useEffect(() => {
    const tl = initSpaceHeroEntrance(heroRef)
    return () => tl?.kill()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = heroRef.current?.offsetHeight || window.innerHeight
      scrollProgressRef.current = Math.min(window.scrollY / heroHeight, 1)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      {/* Three.js canvas fills the section */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 1], fov: 75 }}
          style={{ background: 'transparent' }}
        >
          <SpaceScene scrollProgressRef={scrollProgressRef} />
        </Canvas>
      </div>

      {/* Text overlay */}
      <div className="relative z-10 text-center px-6 select-none">
        <p
          className="hero-fade font-mono text-sm mb-4 tracking-widest uppercase"
          style={{ color: 'var(--color-accent-cyan)' }}
        >
          Hola, soy
        </p>

        <h1
          className="font-display font-bold leading-none mb-4"
          style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', color: 'var(--color-text-primary)' }}
        >
          <SplitText text={profile.name} />
        </h1>

        <h2
          className="hero-fade font-display font-medium mb-6"
          style={{
            fontSize: 'clamp(1.2rem, 3vw, 2rem)',
            color: 'var(--color-accent-purple)',
          }}
        >
          {profile.title}
        </h2>

        <p
          className="hero-fade max-w-xl mx-auto mb-10 text-base"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {profile.tagline}
        </p>

        <a
          href="#projects"
          onClick={(e) => {
            e.preventDefault()
            document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="hero-fade inline-block font-mono text-sm font-medium px-8 py-3 rounded border transition-all duration-300"
          style={{
            borderColor: 'var(--color-accent-cyan)',
            color: 'var(--color-accent-cyan)',
            boxShadow: '0 0 20px rgba(0,245,255,0.2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0,245,255,0.1)'
            e.currentTarget.style.boxShadow = '0 0 30px rgba(0,245,255,0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.boxShadow = '0 0 20px rgba(0,245,255,0.2)'
          }}
        >
          Ver proyectos →
        </a>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hero-fade flex flex-col items-center gap-2"
        style={{ color: 'var(--color-text-muted)' }}
      >
        <span className="font-mono text-xs tracking-widest uppercase">scroll</span>
        <div
          className="w-px h-12 origin-top animate-pulse"
          style={{ backgroundColor: 'var(--color-accent-cyan)' }}
        />
      </div>
    </section>
  )
}
```

**Step 7: Run all tests**

```bash
npm test
```
Expected: all pass. (The Hero component render is not directly tested — the animation function is.)

**Step 8: Verify visually in browser**

```bash
npm run dev
```
Navigate to `http://localhost:5173`. Expect: full-screen starfield, name appearing with blur fade-in, cyan CTA button.

**Step 9: Commit**

```bash
git add src/components/Hero.jsx src/animations/hero.space.animations.js src/animations/hero.space.animations.test.js src/contracts/hero.contract.js
git commit -m "feat(hero): replace box with immersive space scene (Three.js Stars + GSAP materialization)

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 7: About Section

**Goal:** Build the About section with bio paragraphs, a tech stack grid with colored badges, and a GSAP ScrollTrigger entrance.

**Files:**
- Modify: `src/components/About/About.jsx`
- Modify: `src/components/About/About.test.jsx`

**Step 1: Write the failing test**

```jsx
import { render, screen } from '@testing-library/react'
import About from './About'
import { profile } from '../../data/index.js'

describe('About', () => {
  it('renders the section heading', () => {
    render(<About />)
    expect(screen.getByRole('heading', { name: /about/i })).toBeInTheDocument()
  })

  it('renders bio paragraphs', () => {
    render(<About />)
    expect(screen.getByText(profile.bio[0])).toBeInTheDocument()
  })

  it('renders tech stack items', () => {
    render(<About />)
    profile.techStack.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument()
    })
  })

  it('has a section with id="about"', () => {
    render(<About />)
    expect(document.querySelector('#about')).toBeInTheDocument()
  })
})
```

**Step 2: Run to verify fails**

```bash
npm test -- About
```
Expected: FAIL (existing About test was checking for different text)

**Step 3: Rewrite `src/components/About/About.jsx`**

```jsx
import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { profile } from '../../data/index.js'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-animate', {
        opacity: 0,
        y: 50,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="min-h-screen flex items-center py-24 px-6"
      style={{ backgroundColor: 'var(--color-bg-secondary)' }}
    >
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-12 about-animate">
          <span
            className="font-mono text-sm"
            style={{ color: 'var(--color-accent-cyan)' }}
          >
            01.
          </span>
          <h2
            className="font-display font-bold"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'var(--color-text-primary)' }}
          >
            About
          </h2>
          <div
            className="flex-1 h-px ml-4"
            style={{ backgroundColor: 'rgba(0,245,255,0.2)' }}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Bio */}
          <div className="space-y-4 about-animate">
            {profile.bio.map((paragraph, i) => (
              <p
                key={i}
                style={{ color: 'var(--color-text-muted)', lineHeight: 1.8 }}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Tech Stack */}
          <div className="about-animate">
            <p
              className="font-mono text-sm mb-6 uppercase tracking-widest"
              style={{ color: 'var(--color-accent-cyan)' }}
            >
              Tech Stack
            </p>
            <div className="flex flex-wrap gap-3">
              {profile.techStack.map(({ name, color }) => (
                <span
                  key={name}
                  className="font-mono text-sm px-3 py-1 rounded border transition-all duration-200"
                  style={{
                    borderColor: `${color}40`,
                    color: color,
                    backgroundColor: `${color}10`,
                  }}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

**Step 4: Run tests**

```bash
npm test -- About
```
Expected: PASS (4 tests)

**Step 5: Add About to `src/App.jsx`**

```jsx
import { lazy, Suspense } from 'react'
import Navbar from './components/Navbar/Navbar.jsx'
import Hero from './components/Hero.jsx'

const About = lazy(() => import('./components/About/About'))

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Suspense fallback={null}>
        <About />
      </Suspense>
    </>
  )
}
```

**Step 6: Run all tests**

```bash
npm test
```
Expected: all pass.

**Step 7: Commit**

```bash
git add src/components/About/ src/App.jsx
git commit -m "feat(about): add About section with bio, tech stack, and scroll animations

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 8: Experience Section

**Goal:** Vertical timeline of work experience. Each card flies in from alternating sides on scroll using GSAP ScrollTrigger.

**Files:**
- Create: `src/components/Experience/Experience.jsx`
- Create: `src/components/Experience/Experience.test.jsx`
- Modify: `src/App.jsx`

**Step 1: Write the failing test**

```jsx
import { render, screen } from '@testing-library/react'
import Experience from './Experience'
import { experience } from '../../data/index.js'

describe('Experience', () => {
  it('renders the section heading', () => {
    render(<Experience />)
    expect(screen.getByRole('heading', { name: /experience/i })).toBeInTheDocument()
  })

  it('renders all experience items', () => {
    render(<Experience />)
    experience.forEach(({ company }) => {
      expect(screen.getByText(company)).toBeInTheDocument()
    })
  })

  it('renders roles for each experience', () => {
    render(<Experience />)
    experience.forEach(({ role }) => {
      expect(screen.getByText(role)).toBeInTheDocument()
    })
  })

  it('has a section with id="experience"', () => {
    render(<Experience />)
    expect(document.querySelector('#experience')).toBeInTheDocument()
  })
})
```

**Step 2: Run to verify fails**

```bash
npm test -- Experience
```
Expected: FAIL — "Cannot find module"

**Step 3: Create `src/components/Experience/Experience.jsx`**

```jsx
import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { experience } from '../../data/index.js'

gsap.registerPlugin(ScrollTrigger)

function ExperienceCard({ item, index }) {
  const isLeft = index % 2 === 0

  return (
    <div
      className={`experience-card relative flex ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-start gap-8 mb-16`}
    >
      {/* Timeline dot */}
      <div
        className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center justify-center w-4 h-4 rounded-full border-2 mt-2"
        style={{
          borderColor: 'var(--color-accent-cyan)',
          backgroundColor: 'var(--color-bg-primary)',
          boxShadow: '0 0 12px rgba(0,245,255,0.5)',
        }}
      />

      {/* Card */}
      <div
        className="w-full md:w-5/12 p-6 rounded-lg border"
        style={{
          backgroundColor: 'rgba(13,13,20,0.8)',
          borderColor: 'rgba(0,245,255,0.15)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3
              className="font-display font-semibold text-lg"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {item.role}
            </h3>
            <p
              className="font-medium"
              style={{ color: 'var(--color-accent-cyan)' }}
            >
              {item.company}
            </p>
          </div>
          <span
            className="font-mono text-xs ml-4 whitespace-nowrap"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {item.period}
          </span>
        </div>

        <p
          className="text-sm mb-4"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {item.description}
        </p>

        <ul className="space-y-1 mb-4">
          {item.achievements.map((ach, i) => (
            <li
              key={i}
              className="text-sm flex gap-2"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <span style={{ color: 'var(--color-accent-cyan)' }}>▸</span>
              {ach}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2">
          {item.tech.map((t) => (
            <span
              key={t}
              className="font-mono text-xs px-2 py-0.5 rounded"
              style={{
                backgroundColor: 'rgba(139,92,246,0.15)',
                color: 'var(--color-accent-purple)',
                border: '1px solid rgba(139,92,246,0.3)',
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Experience() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.experience-card', {
        opacity: 0,
        x: (i) => (i % 2 === 0 ? -60 : 60),
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="min-h-screen py-24 px-6"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-16">
          <span
            className="font-mono text-sm"
            style={{ color: 'var(--color-accent-cyan)' }}
          >
            02.
          </span>
          <h2
            className="font-display font-bold"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'var(--color-text-primary)' }}
          >
            Experience
          </h2>
          <div
            className="flex-1 h-px ml-4"
            style={{ backgroundColor: 'rgba(0,245,255,0.2)' }}
          />
        </div>

        {/* Timeline line */}
        <div className="relative">
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block"
            style={{ backgroundColor: 'rgba(0,245,255,0.15)' }}
          />
          {experience.map((item, index) => (
            <ExperienceCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
```

**Step 4: Run tests**

```bash
npm test -- Experience
```
Expected: PASS (4 tests)

**Step 5: Add Experience to `src/App.jsx`**

```jsx
import { lazy, Suspense } from 'react'
import Navbar from './components/Navbar/Navbar.jsx'
import Hero from './components/Hero.jsx'

const About = lazy(() => import('./components/About/About'))
const Experience = lazy(() => import('./components/Experience/Experience'))

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Suspense fallback={null}>
        <About />
        <Experience />
      </Suspense>
    </>
  )
}
```

**Step 6: Run all tests**

```bash
npm test
```
Expected: all pass.

**Step 7: Commit**

```bash
git add src/components/Experience/ src/App.jsx
git commit -m "feat(experience): add Experience section with timeline and scroll animations

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 9: Projects Section

**Goal:** 3×2 grid of project cards with 3D CSS tilt effect on hover and cyan glow border. Featured project gets a wider card.

**Files:**
- Create: `src/components/Projects/Projects.jsx`
- Create: `src/components/Projects/Projects.test.jsx`
- Modify: `src/App.jsx`

**Step 1: Write the failing test**

```jsx
import { render, screen } from '@testing-library/react'
import Projects from './Projects'
import { projects } from '../../data/index.js'

describe('Projects', () => {
  it('renders the section heading', () => {
    render(<Projects />)
    expect(screen.getByRole('heading', { name: /projects/i })).toBeInTheDocument()
  })

  it('renders all project titles', () => {
    render(<Projects />)
    projects.forEach(({ title }) => {
      expect(screen.getByText(title)).toBeInTheDocument()
    })
  })

  it('renders GitHub links', () => {
    render(<Projects />)
    const ghLinks = screen.getAllByRole('link', { name: /github/i })
    expect(ghLinks.length).toBeGreaterThan(0)
  })

  it('has a section with id="projects"', () => {
    render(<Projects />)
    expect(document.querySelector('#projects')).toBeInTheDocument()
  })
})
```

**Step 2: Run to verify fails**

```bash
npm test -- Projects
```
Expected: FAIL

**Step 3: Create `src/components/Projects/Projects.jsx`**

```jsx
import { useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../../data/index.js'

gsap.registerPlugin(ScrollTrigger)

function ProjectCard({ project }) {
  const cardRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    gsap.to(card, {
      rotateY: x * 10,
      rotateX: -y * 10,
      duration: 0.3,
      ease: 'power2.out',
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)',
    })
  }, [])

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="project-card p-6 rounded-lg border flex flex-col group"
      style={{
        backgroundColor: 'rgba(13,13,20,0.8)',
        borderColor: 'rgba(0,245,255,0.15)',
        transformStyle: 'preserve-3d',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0,245,255,0.5)'
        e.currentTarget.style.boxShadow = '0 0 25px rgba(0,245,255,0.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0,245,255,0.15)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <span
          className="font-mono text-2xl"
          style={{ color: 'var(--color-accent-cyan)' }}
        >
          ⬡
        </span>
        <div className="flex gap-4">
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="font-mono text-xs transition-colors duration-200"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-accent-cyan)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)' }}
          >
            GitHub ↗
          </a>
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              aria-label="Live demo"
              className="font-mono text-xs transition-colors duration-200"
              style={{ color: 'var(--color-text-muted)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-accent-cyan)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)' }}
            >
              Live ↗
            </a>
          )}
        </div>
      </div>

      <h3
        className="font-display font-semibold text-lg mb-2"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {project.title}
      </h3>

      <p
        className="text-sm mb-4 flex-1"
        style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}
      >
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {project.tech.map((t) => (
          <span
            key={t}
            className="font-mono text-xs"
            style={{ color: 'var(--color-accent-purple)' }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Projects() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.project-card', {
        opacity: 0,
        y: 40,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="min-h-screen py-24 px-6"
      style={{ backgroundColor: 'var(--color-bg-secondary)' }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-16">
          <span
            className="font-mono text-sm"
            style={{ color: 'var(--color-accent-cyan)' }}
          >
            03.
          </span>
          <h2
            className="font-display font-bold"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'var(--color-text-primary)' }}
          >
            Projects
          </h2>
          <div
            className="flex-1 h-px ml-4"
            style={{ backgroundColor: 'rgba(0,245,255,0.2)' }}
          />
        </div>

        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
```

**Step 4: Run tests**

```bash
npm test -- Projects
```
Expected: PASS (4 tests)

**Step 5: Add Projects to `src/App.jsx`**

```jsx
import { lazy, Suspense } from 'react'
import Navbar from './components/Navbar/Navbar.jsx'
import Hero from './components/Hero.jsx'

const About = lazy(() => import('./components/About/About'))
const Experience = lazy(() => import('./components/Experience/Experience'))
const Projects = lazy(() => import('./components/Projects/Projects'))

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Suspense fallback={null}>
        <About />
        <Experience />
        <Projects />
      </Suspense>
    </>
  )
}
```

**Step 6: Run all tests**

```bash
npm test
```
Expected: all pass.

**Step 7: Commit**

```bash
git add src/components/Projects/ src/App.jsx
git commit -m "feat(projects): add Projects section with 3D tilt cards and glow effects

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 10: Contact Section

**Goal:** Final section with a closing message and three large social link buttons (GitHub, LinkedIn, Email) on a pulsing gradient background.

**Files:**
- Create: `src/components/Contact/Contact.jsx`
- Create: `src/components/Contact/Contact.test.jsx`
- Modify: `src/App.jsx`

**Step 1: Write the failing test**

```jsx
import { render, screen } from '@testing-library/react'
import Contact from './Contact'
import { profile } from '../../data/index.js'

describe('Contact', () => {
  it('renders the section heading', () => {
    render(<Contact />)
    expect(screen.getByRole('heading', { name: /contact/i })).toBeInTheDocument()
  })

  it('renders the GitHub link', () => {
    render(<Contact />)
    const link = screen.getByRole('link', { name: /github/i })
    expect(link).toHaveAttribute('href', profile.social.github)
  })

  it('renders the LinkedIn link', () => {
    render(<Contact />)
    const link = screen.getByRole('link', { name: /linkedin/i })
    expect(link).toHaveAttribute('href', profile.social.linkedin)
  })

  it('renders the email link', () => {
    render(<Contact />)
    const link = screen.getByRole('link', { name: /email/i })
    expect(link).toHaveAttribute('href', `mailto:${profile.email}`)
  })

  it('has a section with id="contact"', () => {
    render(<Contact />)
    expect(document.querySelector('#contact')).toBeInTheDocument()
  })
})
```

**Step 2: Run to verify fails**

```bash
npm test -- Contact
```
Expected: FAIL

**Step 3: Create `src/components/Contact/Contact.jsx`**

```jsx
import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { profile } from '../../data/index.js'

gsap.registerPlugin(ScrollTrigger)

const SOCIAL_LINKS = [
  {
    label: 'GitHub',
    href: (p) => p.social.github,
    icon: '⌥',
  },
  {
    label: 'LinkedIn',
    href: (p) => p.social.linkedin,
    icon: '◈',
  },
  {
    label: 'Email',
    href: (p) => `mailto:${p.email}`,
    icon: '◉',
  },
]

export default function Contact() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-animate', {
        opacity: 0,
        y: 40,
        stagger: 0.2,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center py-24 px-6 relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      {/* Pulsing gradient background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,245,255,0.04) 0%, rgba(139,92,246,0.04) 50%, transparent 70%)',
          animation: 'pulse 4s ease-in-out infinite',
        }}
      />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
      `}</style>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-12 justify-center contact-animate">
          <span
            className="font-mono text-sm"
            style={{ color: 'var(--color-accent-cyan)' }}
          >
            04.
          </span>
          <h2
            className="font-display font-bold"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'var(--color-text-primary)' }}
          >
            Contact
          </h2>
        </div>

        <p
          className="font-display text-2xl font-semibold mb-4 contact-animate"
          style={{ color: 'var(--color-text-primary)' }}
        >
          ¿Tienes un proyecto en mente?
        </p>
        <p
          className="mb-12 contact-animate"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Estoy disponible para proyectos freelance, colaboraciones y nuevas oportunidades.
          No dudes en contactarme.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 contact-animate">
          {SOCIAL_LINKS.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href(profile)}
              target={label !== 'Email' ? '_blank' : undefined}
              rel="noreferrer"
              aria-label={label}
              className="flex items-center gap-3 px-8 py-4 rounded-lg border font-mono text-sm font-medium w-full sm:w-auto justify-center transition-all duration-300"
              style={{
                borderColor: 'rgba(0,245,255,0.2)',
                color: 'var(--color-text-primary)',
                backgroundColor: 'rgba(0,245,255,0.03)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-accent-cyan)'
                e.currentTarget.style.color = 'var(--color-accent-cyan)'
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0,245,255,0.2)'
                e.currentTarget.style.backgroundColor = 'rgba(0,245,255,0.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0,245,255,0.2)'
                e.currentTarget.style.color = 'var(--color-text-primary)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.backgroundColor = 'rgba(0,245,255,0.03)'
              }}
            >
              <span>{icon}</span>
              {label}
            </a>
          ))}
        </div>

        <p
          className="mt-16 contact-animate font-mono text-xs"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Diseñado y desarrollado con React + Three.js
        </p>
      </div>
    </section>
  )
}
```

**Step 4: Run tests**

```bash
npm test -- Contact
```
Expected: PASS (5 tests)

**Step 5: Add Contact to `src/App.jsx` — final assembly**

```jsx
import { lazy, Suspense } from 'react'
import Navbar from './components/Navbar/Navbar.jsx'
import Hero from './components/Hero.jsx'

const About = lazy(() => import('./components/About/About'))
const Experience = lazy(() => import('./components/Experience/Experience'))
const Projects = lazy(() => import('./components/Projects/Projects'))
const Contact = lazy(() => import('./components/Contact/Contact'))

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Suspense fallback={null}>
        <About />
        <Experience />
        <Projects />
        <Contact />
      </Suspense>
    </>
  )
}
```

**Step 6: Run all tests**

```bash
npm test
```
Expected: all pass.

**Step 7: Build verification**

```bash
npm run build
```
Expected: build succeeds, dist/ contains index.html + assets.

**Step 8: Commit**

```bash
git add src/components/Contact/ src/App.jsx
git commit -m "feat(contact): add Contact section with social links and pulse gradient

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 11: GitHub Actions — CI Workflow

**Goal:** Run tests and lint on every pull request targeting `master`.

**Files:**
- Create: `.github/workflows/ci.yml`

**Step 1: Create `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  pull_request:
    branches: [master]
  push:
    branches: [master]

jobs:
  test-and-lint:
    name: Test & Lint
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Test
        run: npm test

      - name: Build (verify it compiles)
        run: npm run build
        env:
          NODE_ENV: production
```

**Step 2: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add GitHub Actions CI workflow (test, lint, build on PR)

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 12: GitHub Actions — Deploy to GitHub Pages

**Goal:** Automatically build and deploy to GitHub Pages on every push to `master`.

**Important:** The `base` in `vite.config.js` must match your GitHub repository name (e.g., if repo is `github.com/username/portfolio`, set `base: '/portfolio/'`).

**Files:**
- Modify: `vite.config.js`
- Create: `.github/workflows/deploy.yml`

**Step 1: Update `vite.config.js` — add base path**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/portfolio/',    // ← must match your GitHub repo name exactly
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.js'],
  },
})
```

**Step 2: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]

permissions:
  contents: write

jobs:
  deploy:
    name: Build & Deploy
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          NODE_ENV: production

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          publish_branch: gh-pages
          cname: ''   # leave empty unless you have a custom domain
```

**Step 3: Run tests and build locally to verify**

```bash
npm test && npm run build
```
Expected: tests pass, dist/ built successfully.

**Step 4: Commit**

```bash
git add vite.config.js .github/workflows/deploy.yml
git commit -m "ci: add GitHub Pages deploy workflow and set vite base path

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

**Step 5: Push to master to trigger deploy**

```bash
git push origin master
```

Then go to: `https://github.com/<username>/portfolio/actions` to watch the deploy workflow. After completion, enable GitHub Pages in repo Settings → Pages → Source: `gh-pages` branch.

---

## Task 13: Update README

**Goal:** Replace the developer-facing architecture README with a clean, user-facing portfolio README that includes a live demo link and setup instructions.

**Files:**
- Modify: `README.md`

**Step 1: Overwrite `README.md`**

```markdown
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
```

**Step 2: Commit**

```bash
git add README.md
git commit -m "docs(readme): update with live demo link, sections overview, and setup guide

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Summary

| Task | Component | Tests | Key Commit |
|------|-----------|-------|------------|
| 1 | Foundation Cleanup | existing pass | chore: remove Vite demo |
| 2 | Design Tokens | — | style: dark tech tokens |
| 3 | Vitest Setup | all pass | test: jest-dom setup |
| 4 | Data Layer | — | feat(data): static data files |
| 5 | Navbar | 2 tests | feat(navbar): fixed navbar |
| 6 | Hero (Space) | 3 new tests | feat(hero): space scene |
| 7 | About | 4 tests | feat(about): about section |
| 8 | Experience | 4 tests | feat(experience): timeline |
| 9 | Projects | 4 tests | feat(projects): 3D tilt cards |
| 10 | Contact | 5 tests | feat(contact): social links |
| 11 | CI Workflow | — | ci: GitHub Actions CI |
| 12 | Deploy Workflow | — | ci: GitHub Pages deploy |
| 13 | README | — | docs: update README |

**Total new tests added: 22**  
**Result:** Production-ready portfolio deployed to GitHub Pages with automated CI/CD
