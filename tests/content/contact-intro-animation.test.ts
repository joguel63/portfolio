// @ts-expect-error Astro check in this repo does not include Node builtin typings for tests.
import { readFileSync } from 'node:fs';
// @ts-expect-error Astro check in this repo does not include Node builtin typings for tests.
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import contactSource from '../../src/components/organisms/ContactSection.astro?raw';
import initSource from '../../src/lib/animations/contact/init-contact-intro.ts?raw';

const contactCssSource = readFileSync(
  fileURLToPath(new URL('../../src/styles/components/contact.css', import.meta.url)),
  'utf8',
);

describe('contact intro animation contract', () => {
  it('wires contact intro bootstrap hooks and base motion selectors', () => {
    expect(contactSource).toContain('data-contact-root');
    expect(contactSource).toContain('data-contact-card');
    expect(contactSource).toContain('data-contact-eyebrow');
    expect(contactSource).toContain('data-contact-heading');
    expect(contactSource).toContain('data-contact-description');
    expect(contactSource).toContain('data-contact-actions');
    expect(contactSource).toContain('initContactIntro');
    expect(contactSource).toContain("import { initContactIntro } from '../../lib/animations/contact/init-contact-intro.ts';");
    expect(contactSource).not.toContain('?url');
    expect(initSource).toContain('export function initContactIntro');
    expect(initSource).toContain('ScrollTrigger');
    expect(initSource).toContain('createContactIntro');
    expect(initSource).toContain('prefers-reduced-motion');
    expect(initSource).toContain('matchMedia');
    expect(initSource).toContain('once: true');
    expect(contactCssSource).toContain('.contact-card');
    expect(contactCssSource).toContain('.contact-actions');
    expect(contactCssSource).toContain('.contact__heading');
  });
});
