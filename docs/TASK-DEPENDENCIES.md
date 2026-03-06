# Task Dependencies & Merge Order

This document defines the safe merge order for layer branches into `master`.
Agents must respect this order to avoid broken integrations.

## Merge Order

```
layer/animations  ──┐
                    ├──► master
layer/ui          ──┘  (merge animations first, then ui)

layer/cicd        ──► master  (independent — merge after build is confirmed stable)
layer/docs        ──► master  (fully independent — no blocking dependencies)
```

## Rationale

- **Animations before UI:** `Hero.jsx` imports from `src/animations/`. If UI merges first
  without the animations layer, imports will break.
- **UI before CI/CD:** CI/CD workflows run `npm run build`. A passing build requires UI
  components to be complete.
- **Docs is always independent:** Documentation files (`README.md`, `docs/`) have no runtime
  dependencies.

## Layer Ownership Table

| Layer | Branch | Worktree | Files Owned |
|-------|--------|----------|-------------|
| Animations | `layer/animations` | `worktrees/layer-animations` | `src/animations/`, `src/contracts/animations.contract.js` |
| UI | `layer/ui` | `worktrees/layer-ui` | `src/components/**/*.jsx`, `src/App.jsx`, `src/index.css`, `src/contracts/hero.contract.js` |
| CI/CD | `layer/cicd` | `worktrees/layer-cicd` | `.github/workflows/`, `vite.config.js`, `package.json`, `eslint.config.js` |
| Docs | `layer/docs` | `worktrees/layer-docs` | `README.md`, `docs/` |

## Creating a Layer Worktree

To spin up a new agent worktree for a layer:

```bash
# Example: create the UI layer worktree
git worktree add worktrees/layer-ui -b layer/ui

# Then give the agent its worktree path as its working directory
```

## Cross-Layer Coordination

When a change requires touching files in two layers:
1. Make the change in the layer that owns the file.
2. Update the relevant contract file (`src/contracts/`) to document the new interface.
3. Reference the contract change in your PR description so the other layer's agent is aware.
