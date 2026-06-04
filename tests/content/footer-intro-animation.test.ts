// @ts-expect-error Astro check in this repo does not include Node builtin typings for tests.
import { readFileSync } from 'node:fs';
// @ts-expect-error Astro check in this repo does not include Node builtin typings for tests.
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import footerSource from '../../src/components/organisms/Footer.astro?raw';
import initSource from '../../src/lib/animations/footer/init-footer-intro.ts?raw';

const footerCssSource = readFileSync(
  fileURLToPath(new URL('../../src/styles/components/header.css', import.meta.url)),
  'utf8',
);

describe('footer intro animation contract', () => {
  it('wires footer intro bootstrap hooks and base motion selectors', () => {
    expect(footerSource).toContain('data-footer-root');
    expect(footerSource).toContain('data-footer-content');
    expect(footerSource).toContain('data-footer-line');
    expect(footerSource).toContain('data-footer-link');
    expect(footerSource).toContain('initFooterIntro');
    expect(footerSource).toContain("import { initFooterIntro } from '../../lib/animations/footer/init-footer-intro.ts';");
    expect(footerSource).not.toContain('?url');
    expect(initSource).toContain('export function initFooterIntro');
    expect(initSource).toContain('ScrollTrigger');
    expect(initSource).toContain('createFooterIntro');
    expect(initSource).toContain('prefers-reduced-motion');
    expect(initSource).toContain('matchMedia');
    expect(initSource).toContain('once: true');
    expect(initSource).toContain('top 92%');
    expect(footerCssSource).toContain('.site-footer');
    expect(footerCssSource).toContain('.site-footer__content');
  });
});
