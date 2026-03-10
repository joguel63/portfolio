# Visual Audit Fix Plan — 20260310-0939

**Source incident:** incidents/20260310-0939/
**Findings:** [findings.md](../../incidents/20260310-0939/findings.md)
**Mirrored at:** incidents/20260310-0939/plan.md

---

## Fix Items (ordered by severity)

### 🔴 Critical Fixes

| # | Finding | Section | File | Change Needed |
|---|---------|---------|------|---------------|
| F-1 | Navbar brand wraps to 2 lines on mobile; nav items overflow / truncate | All (Mobile) | `src/components/Navbar/Navbar.jsx` | Add `whitespace-nowrap` to brand `<a>`; hide the link list on `< md` and replace with a hamburger icon that toggles a full-screen drawer. |
| F-2 | About section heading invisible, content starts at y≈0 on mobile | About (Mobile) | `src/components/About/About.jsx`, `src/index.css` | Add `scroll-margin-top: 5rem` (Tailwind: `scroll-mt-20`) to `#about` and matching `padding-top: 5rem` so content clears the navbar. |
| F-3 | Experience section heading hidden, first card clips behind navbar on mobile | Experience (Mobile) | `src/components/Experience/Experience.jsx` | Same pattern as F-2: add `scroll-mt-20` to `#experience` and `pt-20` to section top. Verify GSAP `ScrollTrigger` start offsets include navbar height. |
| F-4 | Projects section first card GitHub/Live links clipped on mobile | Projects (Mobile) | `src/components/Projects/Projects.jsx` | Same pattern: add `scroll-mt-20` and `pt-20` to `#projects`. Ensure section heading is painted before GSAP animation triggers. |
| F-5 | Contact section missing form (only social links, no form) | Contact (Both) | `src/components/Contact/Contact.jsx` | Add a controlled form (`name`, `email`, `message`, Send button) above the social links. Wire to `mailto:` fallback or a serverless endpoint. Add form labels for accessibility. |

---

### 🟡 Warning Fixes

| # | Finding | Section | File | Change Needed |
|---|---------|---------|------|---------------|
| F-6 | Three.js globe not rendering — hero shows star-field only | Hero (Both) | `src/components/Hero.jsx`, `src/animations/` | Debug `WebGLRenderer` init; verify canvas is appended to the DOM; test in a headed browser to distinguish WebGL headless limitation from a real bug. If headless-only, no code change needed — document as known limitation. **Critical* pending headed browser verification; downgrade to Warning if headless-only.** |
| F-7 | About section: ≈ 50 % blank space above content on desktop | About (Desktop) | `src/components/About/About.jsx`, `src/index.css` | Reduce `section` `padding-top` / `min-height`; review GSAP `ScrollTrigger` pin configuration to avoid over-pinning. |
| F-8 | Experience heading clips behind navbar; large blank area below cards on desktop | Experience (Desktop) | `src/components/Experience/Experience.jsx` | Add `scroll-margin-top` ≥ navbar height (~40 px) to `#experience`; reduce `min-height` or `padding-bottom` so blank space below cards is eliminated. |
| F-9 | Projects section: ≈ 55 % blank viewport below card rows on desktop | Projects (Desktop) | `src/components/Projects/Projects.jsx` | Reduce `min-height` / `padding-bottom` on `#projects`; let the card grid define section height naturally. |
| F-10 | Hero subtitle low color contrast (est. 3 : 1, below WCAG AA 4.5 : 1) | Hero (Desktop) | `src/components/Hero.jsx`, `src/index.css` | Increase subtitle text color to `rgba(255,255,255,0.72)` or `#b0b0b0`; re-check with axe / Chrome DevTools contrast checker. |

---

### 🟢 Suggestions

| # | Finding | Section | File | Change Needed |
|---|---------|---------|------|---------------|
| F-11 | Mobile nav lacks hamburger / drawer — horizontal list truncates items | All (Mobile) | `src/components/Navbar/Navbar.jsx` | **Subsumed by F-1** — implementing F-1's hamburger drawer fully resolves this. No separate action needed. |
| F-12 | All project cards use placeholder descriptions and names | Projects (Both) | `src/data/projects.js` | Replace placeholder strings with real project names, descriptions, tech stacks, GitHub URLs, and live demo URLs. |
| F-13 | Contact section sparse on desktop after adding form | Contact (Desktop) | `src/components/Contact/Contact.jsx` | After form is added (F-5), recalibrate section `min-height`; consider a subtle decorative divider or background pattern at section top to avoid visual jump from Projects. |

---

## Implementation Order

1. **F-1** (Navbar mobile) — unblocks F-2, F-3, F-4 visually
2. **F-2 + F-3 + F-4** — section scroll-margin fixes (parallel, same pattern)
3. **F-10** — hero contrast (trivial, 1-line color change)
4. **F-7 + F-8 + F-9** — section spacing cleanup (parallel)
5. **F-5 + F-11** — contact form + hamburger nav (F-11 subsumed by F-1; only F-5 needs separate work)
6. **F-6** — globe debug (investigation first)
7. **F-12 + F-13** — content + polish
