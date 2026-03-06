# Multi-Agent Architecture Design

**Date:** 2026-03-06  
**Project:** React Portfolio  
**Status:** Approved

---

## Problem Statement

The portfolio project is being developed with the help of multiple AI agents working in parallel.
Without a clear architecture, agents risk creating conflicting changes to the same files (Git
conflicts), inconsistent shared state in React components, and blocked tasks due to unclear
dependencies between layers.

This document defines a layer-based architecture using Git worktrees to allow agents to work in
parallel safely.

---

## Approach: Worktree per Layer

Each agent owns a dedicated layer of the codebase. Ownership is enforced by convention: an agent
only modifies files in its designated domain. Git worktrees provide physical isolation — each layer
has its own working directory, preventing simultaneous file edits from causing conflicts.

---

## Layer Definitions

| Layer | Worktree | Branch | Files Owned |
|-------|----------|--------|-------------|
| **UI** | `worktrees/layer-ui` | `layer/ui` | `src/components/**/*.jsx`, `src/App.jsx`, `src/index.css`, `src/App.css` |
| **Animations** | `worktrees/layer-animations` | `layer/animations` | `src/animations/`, `src/hooks/useGSAP*.js`, Three.js scene files |
| **CI/CD** | `worktrees/layer-cicd` | `layer/cicd` | `.github/workflows/`, `vite.config.js`, `package.json`, `eslint.config.js` |
| **Docs** | `worktrees/layer-docs` | `layer/docs` | `README.md`, `docs/`, `src/features/*.md` |

### Integration Branch

`master` is the single integration branch. No agent commits directly to `master`. All changes flow
through a worktree branch and are merged via PR (or local merge) after review.

---

## Contracts: Preventing State Conflicts

### The Problem

The `Hero.jsx` component is touched by both the UI agent (markup, layout) and the Animations agent
(GSAP timelines, Three.js interactions). Without a contract, each agent may break the other's
assumptions.

### The Solution

A `src/contracts/` directory contains interface definitions shared across layers:

```
src/
  contracts/
    hero.contract.js       ← JSDoc types for Hero component props
    animations.contract.js ← Named list of GSAP timeline IDs and animation hook signatures
```

**Rules:**

1. The **Animations agent** only exposes functions from `src/animations/` that accept a `ref` or
   DOM `id`. It never imports UI components directly.
2. The **UI agent** only calls animation functions from `src/animations/`. It never writes GSAP or
   Three.js logic directly in component files.
3. Both agents may read from `src/contracts/` but changes to contracts require coordination
   (comment in the PR mentioning the other layer).

---

## Task Dependency Order

When merging to `master`, respect this order to avoid broken integrations:

```
layer/animations  ──┐
                    ├──► master
layer/ui          ──┘
layer/cicd        ──► master  (independent, can merge after build is stable)
layer/docs        ──► master  (fully independent, no blocking)
```

This dependency chain is documented in `docs/TASK-DEPENDENCIES.md`.

---

## README.md Structure

The `README.md` will be rewritten to serve as the primary entry point for agents and developers:

1. **Project Summary** — what it is, tech stack, live demo link
2. **Quick Setup** — `npm install`, `npm run dev`, `npm test`
3. **Component Architecture** — ASCII diagram of `src/` structure
4. **Multi-Agent System** — link to `docs/architecture.md`, layer table, coexistence rules
5. **Code Conventions** — naming, file structure, how to add a new component
6. **Available Scripts** — table of all `npm run *` commands
7. **Contribution Flow** — how to use worktrees, merge order

---

## File Outputs

This design produces two files:

| File | Purpose |
|------|---------|
| `README.md` | Developer/agent-oriented project documentation |
| `docs/architecture.md` | Technical reference for the multi-agent layer system |

Supporting files created as part of implementation:

| File | Purpose |
|------|---------|
| `src/contracts/hero.contract.js` | Hero component interface contract |
| `src/contracts/animations.contract.js` | Animations layer interface contract |
| `docs/TASK-DEPENDENCIES.md` | Merge order and task dependency map |

---

## Success Criteria

- A new agent can onboard by reading `README.md` alone and know which files it can touch
- No two agents need to edit the same file simultaneously during normal development
- When a shared file must be touched, the contract system makes the interface explicit
- The merge order in `docs/TASK-DEPENDENCIES.md` prevents broken integrations
