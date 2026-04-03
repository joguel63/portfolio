# Tech Stack Reorganization Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize the Tech Stack section from 3 cards to 5 localized cards, preserve the current visual style, and keep card heights visually consistent.

**Architecture:** The implementation should treat this as a content-first update. Update the Spanish and English stack JSON files, then adapt the internal icon mapping in `SkillChip.astro` to support the new semantic categories. Only if the larger content causes visible height imbalance should `stack.css` receive a minimal equal-height reinforcement.

**Tech Stack:** Astro, localized JSON content, Zod schemas, Vitest, global CSS

---

## File Structure

### Content Sources
- Modify: `src/content/stack/stack.es.json`
  - Replace the existing 3 cards with the approved 5-card Spanish set.
- Modify: `src/content/stack/stack.en.json`
  - Replace the existing 3 cards with the approved 5-card English set.

### UI Mapping
- Modify: `src/components/molecules/SkillChip.astro`
  - Update the `category` to icon mapping to support `Frontend`, `Backend`, `Automation`, `Cloud`, and `Data` without changing card styling.

### Layout Support
- Modify if needed: `src/styles/components/stack.css`
  - Only adjust if the new copy breaks equal card heights or grid balance.

### Tests
- Modify: `tests/content/load-site-content.test.ts`
  - Update expectations for the new first stack card and skill list.
- Modify: `tests/content/site-schema.test.ts`
  - Update the accepted sample stack card to the new approved structure.
- Modify: `tests/content/map-home-page.test.ts`
  - Update raw-source and mapped-content assertions for the new labels, card count assumptions, or icon/category literals if needed.

## Approved Content Snapshot

### Spanish
1. `frontend-engineering` / `Frontend Engineering` / `Frontend` / order `1`
   - `Interfaces modernas, performantes y escalables.`
   - `React`, `Next.js`, `Vite`, `TypeScript`, `Material UI`, `Tailwind`, `Ant Design`
2. `backend-apis` / `Backend & APIs` / `Backend` / order `2`
   - `Arquitectura robusta y servicios escalables.`
   - `Node.js`, `NestJS`, `Express`, `Prisma ORM`, `REST APIs`
3. `ai-automation` / `AI & Automation` / `Automation` / order `3`
   - `Ecosistemas autónomos y flujos inteligentes.`
   - `LangChain`, `LLMs`, `Agentes`, `RAG`
4. `cloud-infrastructure` / `Cloud & Infrastructure` / `Cloud` / order `4`
   - `Despliegue, contenedores y sistemas distribuidos.`
   - `Docker`, `AWS`, `OpenShift`, `Azure`, `CI/CD`
5. `databases` / `Databases` / `Data` / order `5`
   - `Gestión de datos relacionales y NoSQL.`
   - `PostgreSQL`, `MongoDB`, `DynamoDB`

### English
1. `frontend-engineering` / `Frontend Engineering` / `Frontend` / order `1`
   - `Modern, performant, and scalable interfaces.`
   - `React`, `Next.js`, `Vite`, `TypeScript`, `Material UI`, `Tailwind`, `Ant Design`
2. `backend-apis` / `Backend & APIs` / `Backend` / order `2`
   - `Robust architecture and scalable services.`
   - `Node.js`, `NestJS`, `Express`, `Prisma ORM`, `REST APIs`
3. `ai-automation` / `AI & Automation` / `Automation` / order `3`
   - `Autonomous ecosystems and intelligent workflows.`
   - `LangChain`, `LLMs`, `Agents`, `RAG`
4. `cloud-infrastructure` / `Cloud & Infrastructure` / `Cloud` / order `4`
   - `Deployment, containers, and distributed systems.`
   - `Docker`, `AWS`, `OpenShift`, `Azure`, `CI/CD`
5. `databases` / `Databases` / `Data` / order `5`
   - `Relational and NoSQL data management.`
   - `PostgreSQL`, `MongoDB`, `DynamoDB`

### Approved Icon Mapping
- `Frontend` -> `layers`
- `Backend` -> `terminal`
- `Automation` -> `neurology`
- `Cloud` -> `settings_input_component`
- `Data` -> `database`

## Chunk 1: Content Contracts

### Task 1: Lock the new localized stack content in tests

**Files:**
- Modify: `tests/content/load-site-content.test.ts`
- Modify: `tests/content/site-schema.test.ts`
- Modify: `tests/content/map-home-page.test.ts`

- [ ] **Step 1: Write the failing test updates for localized stack content**

Add assertions that require:
- 5 stack cards instead of relying on the old 3-card structure
- the first Spanish card to be `frontend-engineering` / `Frontend Engineering`
- the first English card to be `frontend-engineering` / `Frontend Engineering`
- the updated Spanish skills list to include `Material UI`, `Tailwind`, and `Ant Design`
- the updated English skills list to include `Material UI`, `Tailwind`, and `Ant Design`
- the accepted schema example to use the new category model and approved IDs/orders

- [ ] **Step 2: Run the focused content tests to verify they fail**

Run: `npm test -- tests/content/load-site-content.test.ts tests/content/site-schema.test.ts tests/content/map-home-page.test.ts`

Expected:
- FAIL because the JSON content and stack expectations still match the old 3-card structure

- [ ] **Step 3: Update the localized stack JSON files with the approved 5-card data**

Modify:
- `src/content/stack/stack.es.json`
- `src/content/stack/stack.en.json`

Implement exactly:
- approved `id`
- approved `label`
- approved `category`
- approved `order`
- approved `description`
- approved `skills`

- [ ] **Step 4: Update the tests to the approved bilingual data**

Make the assertions exact and literal where practical so regressions are obvious in both locales.

- [ ] **Step 5: Re-run the focused content tests**

Run: `npm test -- tests/content/load-site-content.test.ts tests/content/site-schema.test.ts tests/content/map-home-page.test.ts`

Expected:
- PASS

- [ ] **Step 6: Commit the content reorganization**

```bash
git add src/content/stack/stack.es.json src/content/stack/stack.en.json tests/content/load-site-content.test.ts tests/content/site-schema.test.ts tests/content/map-home-page.test.ts
git commit -m "feat: reorganize stack content"
```

## Chunk 2: Icon Mapping

### Task 2: Support the new categories in `SkillChip`

**Files:**
- Modify: `src/components/molecules/SkillChip.astro`
- Modify: `tests/content/map-home-page.test.ts`

- [ ] **Step 1: Write the failing test for the new category icon mapping**

Add assertions that `SkillChip.astro` maps:
- `Frontend`
- `Backend`
- `Automation`
- `Cloud`
- `Data`

to the approved icon names.

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- tests/content/map-home-page.test.ts`

Expected:
- FAIL because the file still only maps `Autonomy`, `Product`, and `Systems`

- [ ] **Step 3: Update `SkillChip.astro` with the new icon map**

Keep the implementation minimal:
- replace or expand the existing `iconMap`
- do not redesign the component
- preserve existing fallback behavior

- [ ] **Step 4: Re-run the focused test**

Run: `npm test -- tests/content/map-home-page.test.ts`

Expected:
- PASS

- [ ] **Step 5: Commit the icon mapping update**

```bash
git add src/components/molecules/SkillChip.astro tests/content/map-home-page.test.ts
git commit -m "feat: map stack icons for new categories"
```

## Chunk 3: Equal Height Verification

### Task 3: Reinforce equal-height card behavior only if needed

**Files:**
- Modify if needed: `src/styles/components/stack.css`
- Test: `tests/content/map-home-page.test.ts`

- [ ] **Step 1: Inspect the existing stack CSS and identify whether equal-height behavior is already guaranteed**

Check:
- `.stack__grid`
- `.stack__item`
- `.skill-card`
- `.stack-card`

Determine whether the new content can stretch all cards equally on desktop without extra CSS.

- [ ] **Step 2: Write or update the test contract for equal-height support**

Add a focused raw-source assertion in `tests/content/map-home-page.test.ts` that locks the desktop equal-height support contract.

At minimum, the test should prove the layout keeps all cards stretchable at desktop via the existing selectors or a new minimal selector contract.

- [ ] **Step 3: Run the focused test to verify it fails if the contract is missing**

Run: `npm test -- tests/content/map-home-page.test.ts`

Expected:
- FAIL if the equal-height contract is not explicit enough

- [ ] **Step 4: Apply the minimal CSS fix only if the existing contract is insufficient**

Allowed examples:
- make `.stack__item` stretch to full height
- ensure the grid aligns stretch consistently
- ensure the card body occupies full height cleanly

Do not:
- redesign spacing
- change typography scale
- change hover behavior
- create per-card layout variants

- [ ] **Step 5: Re-run the focused test**

Run: `npm test -- tests/content/map-home-page.test.ts`

Expected:
- PASS

- [ ] **Step 6: Manual browser verification of equal heights**

Verify on desktop and mobile:
- all cards remain visually balanced
- desktop cards have equal height
- mobile cards keep the existing single-column style and do not look obviously uneven

- [ ] **Step 7: Commit the minimal CSS adjustment only if one was needed**

```bash
git add src/styles/components/stack.css tests/content/map-home-page.test.ts
git commit -m "fix: preserve equal stack card heights"
```

## Final Verification

- [ ] **Step 1: Run the full test suite**

Run: `npm test`

Expected:
- PASS with 0 failures

- [ ] **Step 2: Run Astro diagnostics**

Run: `npm run check`

Expected:
- 0 errors

- [ ] **Step 3: Run the production build**

Run: `npm run build`

Expected:
- build completes successfully

- [ ] **Step 4: Manual browser verification**

Verify:
- 5 stack cards render in Spanish and English
- approved labels, descriptions, and technologies are correct
- style is unchanged
- icon mapping is coherent with the new categories
- card heights remain uniform

## Execution Notes

- Execute in the current branch and current workspace only.
- Do not use worktrees or parallel workflows.
- Keep changes minimal and localized.
- If equal heights already hold with the new content, do not edit `stack.css` just to “clean up.”

Plan complete and saved to `docs/superpowers/plans/2026-04-03-tech-stack-reorganization.md`. Ready to execute?
