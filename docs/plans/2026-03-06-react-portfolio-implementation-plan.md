# React + Vite Portfolio Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Construir un sitio one-page con React + Vite, Tailwind, Three.js (r3f) y GSAP con una animación hero inicial interactiva.

**Architecture:** Single-page React app. Hero renderizado con @react-three/fiber y animado con GSAP timelines; secciones inferiores cargadas de forma perezosa.

**Tech Stack:** React, Vite, Tailwind CSS, @react-three/fiber, three, gsap, Vitest, Playwright, Vercel

---

### Task 1: Scaffold project

**Files:**
- Create: `package.json` (via `npm init`)
- Create: `vite` project files under `src/` (Vite React template)
- Create: `tailwind.config.cjs`, `postcss.config.cjs`, `index.html`

**Step 1: Initialize project**

Run: `npm create vite@latest . -- --template react`
Expected: Vite project scaffolded

**Step 2: Install dependencies**

Run: `npm install && npm install -D tailwindcss postcss autoprefixer`
Run: `npx tailwindcss init -p`
Run: `npm install three @react-three/fiber @react-three/drei gsap`

**Step 3: Commit scaffold**

Run:
```
git add .
git commit -m "chore: scaffold vite react project with tailwind"
```

### Task 2: App layout and routing

**Files:**
- Create: `src/main.jsx`
- Create: `src/App.jsx`
- Create: `src/index.css` (Tailwind entry)

... (plan continues with exact steps for Hero, components, tests, CI, deploy)

---

Plan saved. Choose execution mode:
1) Subagent-Driven (execute tasks here step-by-step)
2) Parallel Session (separate executing session)

Reply with: "Subagent-Driven" or "Parallel Session" to choose next.
