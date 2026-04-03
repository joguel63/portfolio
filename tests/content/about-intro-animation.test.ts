// @ts-expect-error Astro check in this repo does not include Node builtin typings for tests.
import { readFileSync } from 'node:fs';
// @ts-expect-error Astro check in this repo does not include Node builtin typings for tests.
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import aboutSource from '../../src/components/organisms/AboutSection.astro?raw';
import initSource from '../../src/lib/animations/about/init-about-intro.ts?raw';

const aboutCssSource = readFileSync(
  fileURLToPath(new URL('../../src/styles/components/about.css', import.meta.url)),
  'utf8',
);

describe('about intro animation contract', () => {
  it('wires about intro bootstrap hooks and base motion selectors', () => {
    expect(aboutSource).toContain('data-about-root');
    expect(aboutSource).toContain('data-about-media');
    expect(aboutSource).toContain('data-about-halo');
    expect(aboutSource).toContain('data-about-image');
    expect(aboutSource).toContain('data-about-heading-group');
    expect(aboutSource).toContain('data-about-eyebrow');
    expect(aboutSource).toContain('data-about-title');
    expect(aboutSource).toContain('data-about-body');
    expect(aboutSource).toContain('data-about-paragraph');
    expect(aboutSource).toContain('data-about-stats');
    expect(aboutSource).toContain('data-about-stat');
    expect(aboutSource).toContain('initAboutIntro');
    expect(aboutSource).toContain("import { initAboutIntro } from '../../lib/animations/about/init-about-intro.ts';");
    expect(aboutSource).not.toContain('?url');
    expect(initSource).toContain('export function initAboutIntro');
    expect(initSource).toContain('ScrollTrigger');
    expect(initSource).toContain('createAboutIntro');
    expect(initSource).toContain('prefers-reduced-motion');
    expect(initSource).toContain('matchMedia');
    expect(initSource).toContain('once: true');
    expect(aboutCssSource).toContain('.about__portrait-shell');
    expect(aboutCssSource).toContain('overflow: visible');
    expect(aboutCssSource).toContain('isolation: isolate');
    expect(aboutCssSource).toContain('.about__portrait-halo');
    expect(aboutCssSource).toContain('z-index: 0');
    expect(aboutCssSource).toContain('transform-origin: center center');
    expect(aboutCssSource).toContain('.about__stats');
  });
});
