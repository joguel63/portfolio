# Tech Stack Reorganization Design

## Goal
Reorganize the Tech Stack section from 3 cards to 5 cards by updating the content model only, while preserving the current visual style and keeping all cards at the same perceived height.

## Context
- The Tech Stack section is rendered by `src/components/organisms/StackSection.astro`.
- The section currently maps over localized JSON content from `src/content/stack/stack.es.json` and `src/content/stack/stack.en.json`.
- Each card is rendered through the existing `SkillChip` component, so style is already centralized.
- The user explicitly does not want a style redesign.
- The user wants the content reorganized and expanded from 3 cards to 5 cards.
- The user also requires the cards to keep the same height.

## Approved Product Decisions

### Scope
- Keep the current section structure and visual language.
- Do not redesign the cards.
- Do not change the overall tone or styling of the section.
- Update both Spanish and English content.
- Add 2 new cards, ending with 5 total.

### Content Model
- Keep the existing card schema: `id`, `label`, `category`, `order`, `description`, `skills`.
- Prefer content-only updates first.
- Updating the icon mapping for the new categories is explicitly allowed.
- Only adjust section CSS if needed to preserve equal card heights after the new copy is added.

### Layout Requirement
- All 5 cards must keep the same visual height.
- Height consistency matters on desktop and mobile.
- On desktop, equal-height behavior must be enforced, not just visually approximated.
- On mobile, preserve the existing responsive style and avoid obvious height imbalance; visual QA is sufficient if the layout remains single-column.
- If content length introduces imbalance, use the smallest possible layout adjustment instead of changing the card design.

### Icon Mapping Decision
- The new semantic categories are approved even if they do not match the current icon map.
- The implementation may update the internal icon mapping to support the new categories.
- The visual style must remain consistent with the current design system even if the icon labels change internally.

## Final Approved Card Content

### Spanish
1. `Frontend Engineering`
   - ID: `frontend-engineering`
   - Category: `Frontend`
   - Order: `1`
   - Description: `Interfaces modernas, performantes y escalables.`
   - Skills: `React`, `Next.js`, `Vite`, `TypeScript`, `Material UI`, `Tailwind`, `Ant Design`

2. `Backend & APIs`
   - ID: `backend-apis`
   - Category: `Backend`
   - Order: `2`
   - Description: `Arquitectura robusta y servicios escalables.`
   - Skills: `Node.js`, `NestJS`, `Express`, `Prisma ORM`, `REST APIs`

3. `AI & Automation`
   - ID: `ai-automation`
   - Category: `Automation`
   - Order: `3`
   - Description: `Ecosistemas autónomos y flujos inteligentes.`
   - Skills: `LangChain`, `LLMs`, `Agentes`, `RAG`

4. `Cloud & Infrastructure`
   - ID: `cloud-infrastructure`
   - Category: `Cloud`
   - Order: `4`
   - Description: `Despliegue, contenedores y sistemas distribuidos.`
   - Skills: `Docker`, `AWS`, `OpenShift`, `Azure`, `CI/CD`

5. `Databases`
   - ID: `databases`
   - Category: `Data`
   - Order: `5`
   - Description: `Gestión de datos relacionales y NoSQL.`
   - Skills: `PostgreSQL`, `MongoDB`, `DynamoDB`

### English
1. `Frontend Engineering`
   - ID: `frontend-engineering`
   - Category: `Frontend`
   - Order: `1`
   - Description: `Modern, performant, and scalable interfaces.`
   - Skills: `React`, `Next.js`, `Vite`, `TypeScript`, `Material UI`, `Tailwind`, `Ant Design`

2. `Backend & APIs`
   - ID: `backend-apis`
   - Category: `Backend`
   - Order: `2`
   - Description: `Robust architecture and scalable services.`
   - Skills: `Node.js`, `NestJS`, `Express`, `Prisma ORM`, `REST APIs`

3. `AI & Automation`
   - ID: `ai-automation`
   - Category: `Automation`
   - Order: `3`
   - Description: `Autonomous ecosystems and intelligent workflows.`
   - Skills: `LangChain`, `LLMs`, `Agents`, `RAG`

4. `Cloud & Infrastructure`
   - ID: `cloud-infrastructure`
   - Category: `Cloud`
   - Order: `4`
   - Description: `Deployment, containers, and distributed systems.`
   - Skills: `Docker`, `AWS`, `OpenShift`, `Azure`, `CI/CD`

5. `Databases`
   - ID: `databases`
   - Category: `Data`
   - Order: `5`
   - Description: `Relational and NoSQL data management.`
   - Skills: `PostgreSQL`, `MongoDB`, `DynamoDB`

## Recommended Approach

### Primary Strategy
Update the two localized stack JSON files first and preserve the existing rendering component where possible.

This is the right approach because:
- the current component already supports arbitrary card count
- the user asked for content reorganization, not design work
- the schema already supports the target fields
- the smallest correct change is to update content, then verify layout

### Icon Mapping Update
Because `SkillChip.astro` currently maps icons from `category`, implementation should update the internal category-to-icon mapping for the approved categories.

Recommended mapping:
- `Frontend` -> `layers`
- `Backend` -> `terminal`
- `Automation` -> `neurology`
- `Cloud` -> `settings_input_component`
- `Data` -> `database`

### Fallback Layout Adjustment
If the longer descriptions or skill lists cause uneven card heights, make the smallest CSS adjustment necessary in `src/styles/components/stack.css` to preserve equal heights.

Acceptable adjustment types:
- reinforce equal-height card layout in the existing grid
- ensure card wrappers stretch to full height
- ensure internal card body uses a stable vertical structure

Not acceptable:
- redesigning card spacing, typography, or visual identity
- introducing new variants or custom layouts per card

## Files Expected To Change
- `src/content/stack/stack.es.json`
- `src/content/stack/stack.en.json`
- `src/components/molecules/SkillChip.astro`
- `tests/content/map-home-page.test.ts`
- `tests/content/load-site-content.test.ts`
- `tests/content/site-schema.test.ts`

Possible minimal style adjustment if needed:
- `src/styles/components/stack.css`

## Verification Requirements
- The Tech Stack section renders 5 cards in Spanish and English.
- The approved labels, descriptions, and skill lists appear in both locales.
- The current style remains intact.
- Cards maintain equal visual height.
- Existing content/schema tests continue to pass.
- `npm run check` and `npm run build` pass after the update.

## Risks
- Longer copy can make one card visually taller than the others.
- Adding more skills may wrap tags unevenly depending on viewport width.
- Changing labels without updating tests will break raw-source assertions.
- A content-only update may still require a small CSS correction to preserve equal height.

## Success Criteria
- The section has 5 cards instead of 3.
- The information architecture matches the approved content exactly.
- No visible style regression is introduced.
- Card heights remain consistent.
- Both locales stay aligned.
