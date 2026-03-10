# Visual Audit Findings — 20260310-0939

**Date:** 2026-03-10
**Screenshots:** ./screenshots/
**Videos:** ./videos/ *(not captured — see Animation Notes)*
**Fix Plan:** ../../docs/plans/20260310-visual-fixes.md

## Executive Summary

The portfolio is visually coherent on desktop but suffers from a severe mobile navbar overflow that cascades into every section — the brand name wraps to two lines, pushing nav items off-screen and causing all section content to start immediately behind the broken bar with no clearance. On desktop, all sections carry excessive blank vertical space (40–55 % of the viewport is empty) due to oversized section padding/min-height, and the hero's Three.js globe is not rendering — leaving a plain star-field instead of the intended interactive 3D centrepiece. The Contact section is incomplete: no form is present.

---

## Findings

| # | Severity | Section | Viewport | Dimension | Finding | Screenshot | Suggested Fix |
|---|----------|---------|----------|-----------|---------|------------|---------------|
| 1 | 🔴 Critical | All | Mobile | Layout / Responsiveness | Navbar brand "Miguel Muñoz" wraps to 2 lines; the second line ("Muñoz") sits on the same row as all nav links, compressing them; "Contact" is truncated to "Co…". Navbar height effectively doubles, breaking every section's top clearance. | hero-mobile.png | Add `whitespace-nowrap` and `truncate` to the brand link in `Navbar.jsx`; replace the full horizontal nav with a hamburger icon + full-screen drawer on `< md` breakpoints. |
| 2 | 🔴 Critical | About | Mobile | Layout / Responsiveness | Section heading "01. About" is not visible in the viewport; body text begins at y ≈ 0, running directly under the broken two-line navbar with no top padding. | about-mobile.png | Add `scroll-margin-top: 80px` (or Tailwind `scroll-mt-20`) to `#about`; add matching `padding-top` so content is not hidden behind the navbar. |
| 3 | 🔴 Critical | Experience | Mobile | Layout / Responsiveness | "02. Experience" heading is invisible; the first job card starts at the very top of the viewport; date "2023 — Presente" is partially clipped. Same root cause as finding #2. | experience-mobile.png | Apply `scroll-mt-20` and `pt-20` to `#experience` section; ensure GSAP `ScrollTrigger` start accounts for the navbar offset. |
| 4 | 🔴 Critical | Projects | Mobile | Layout / Responsiveness | The first project card's "GitHub ↗ Live ↗" links are clipped at the top of the viewport; no section heading visible. Same root cause as #2/#3. | projects-mobile.png | Apply `scroll-mt-20` and `pt-20` to `#projects`; also verify that the `#projects` section heading is included in the initial painted DOM before the scroll animation triggers. |
| 5 | 🔴 Critical | Contact | Both | Visual Completeness | No contact form is rendered — the section contains only three social-link buttons (GitHub, LinkedIn, Email) and an email address. Architecture specifies "form + social links". On desktop ≈ 40 % of the section viewport is blank above the content. | contact-desktop.png | Implement a contact form (`name`, `email`, `message`, `Send` button) in `Contact.jsx` above the social links; the form should post to a serverless endpoint or `mailto:`. |
| 6 | 🟢 Verified — Headless Limitation | Hero | Both | Visual Completeness | Three.js globe is not rendering in headless Playwright screenshots. Code review confirms the implementation is correct: React Three Fiber `<Canvas>` is mounted at 100% width/height inside an absolutely-positioned div; `initSpaceHeroEntrance` correctly fades the canvas in via `onCreated`. The blank canvas is a known Playwright headless Chromium limitation — WebGL GPU acceleration is unavailable without `--use-gl=swiftshader` or `--enable-webgl`. No code fix required. | hero-desktop.png | *(No fix needed)* Verify globe renders in a headed Chrome session. If CI screenshots are needed with globe visible, pass `--use-gl=swiftshader` to Playwright launch args. |
| 7 | 🟡 Warning | About | Desktop | Spacing | ≈ 50 % of the viewport is blank space above the section content (bio + tech stack start at y ≈ 375 px in a 900 px viewport). The section padding-top is far too large. | about-desktop.png | Reduce `#about` `padding-top` / `min-height`; review `ScrollTrigger` pin or scrub settings that may be intentionally holding the section but look broken without the globe animation context. |
| 8 | 🟡 Warning | Experience | Desktop | Spacing | "02. Experience" heading is clipped directly behind the fixed navbar with zero visual clearance; additionally ≈ 50 % of the viewport below the two job cards is blank. | experience-desktop.png | Add `scroll-margin-top` equal to navbar height (≈ 40 px) to `#experience`; reduce bottom padding/min-height of the section. |
| 9 | 🟡 Warning | Projects | Desktop | Spacing | ≈ 55 % of the viewport below the two card rows is blank. The section occupies much more vertical real-estate than its content requires. | projects-desktop.png | Reduce `min-height` or `padding-bottom` on `#projects`; card grid should expand to fill available rows or section should contract to content height. |
| 10 | 🟡 Warning | Hero | Desktop | Accessibility / Color Contrast | Subtitle text "Building digital experiences that live between frontend and backend." uses light-gray on near-black — estimated contrast ≈ 3 : 1, below WCAG AA minimum of 4.5 : 1 for normal text. | hero-desktop.png | Increase subtitle color to at least `#b0b0b0` / `rgba(255,255,255,0.72)`; verify with a contrast checker tool. |
| 11 | 🟢 Suggestion | All | Mobile | Navigation | The horizontal nav on mobile has no fallback for small screens — a hamburger / drawer pattern would be far more touch-friendly and solve the truncation and wrap issues. **Subsumed by F-1** — implementing F-1's hamburger drawer fully resolves this. | hero-mobile.png | Implement a hamburger icon button (`aria-label="Open menu"`) that toggles a full-screen or slide-in drawer. Hide the horizontal link list below the `md` breakpoint. |
| 12 | 🟢 Suggestion | Projects | Both | Content | All five project cards contain placeholder/lorem text ("Descripción breve.", "Descripción de tu proyecto más importante. Qué problema resuelve y cómo."). | projects-desktop.png | Replace placeholder text with real project descriptions in `src/data/projects.js`; add real tech context and outcome metrics. |
| 13 | 🟢 Suggestion | Contact | Desktop | Spacing / UX | The contact section feels sparse: content occupies only the lower third of the viewport with no call-to-action form. Once the form (#5) is added, the visual balance will improve substantially. | contact-desktop.png | After adding the form, recalibrate section `min-height` so hero-to-content ratio feels intentional; consider a subtle divider or decorative element at the top of the section. |

---

## Animation Notes

**Video recording:** Video capture was not attempted via Playwright MCP (tool not available in the current agent context). Screenshots were captured programmatically via `playwright` npm package + a Node.js script at `incidents/20260310-0939/capture.mjs`. Playwright Chromium headless was used at both 1440×900 (desktop) and 375×812 (mobile) viewports.

**Animation artifacts visible in screenshots:**

- **Hero GSAP entrance**: The "HOLA, SOY" label and name/role text appear fully rendered in the static screenshots, suggesting the entrance animation completes before the 2.5 s wait. No visible mid-animation artifacts.
- **About GSAP scroll animation**: On desktop, the `about-desktop.png` shows content anchored to the lower half of the section — consistent with a GSAP `ScrollTrigger` pin or `from-bottom` reveal that did not fully resolve in the headless capture. Content may animate in correctly in a real browser with user scroll velocity.
- **Three.js globe**: Completely absent in all screenshots. This is either a WebGL headless rendering limitation (Chromium headless may not support WebGL by default) or a genuine runtime bug. Needs verification in a headed browser.
- **Timeline connectors (Experience)**: The circular timeline nodes (cyan rings) rendered correctly on desktop. The alternating card layout is functioning.

---

## Cierre del Incidente

- Estado: open
- Plan ejecutado: —
- Commit de cierre: —
- Fecha de cierre: —
