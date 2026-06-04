// @ts-expect-error Astro check in this repo does not include Node builtin typings for tests.
import { readFileSync } from 'node:fs';
// @ts-expect-error Astro check in this repo does not include Node builtin typings for tests.
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import stackSource from '../../src/components/organisms/StackSection.astro?raw';
import initSource from '../../src/lib/animations/stack/init-stack-intro.ts?raw';

const stackCssSource = readFileSync(
  fileURLToPath(new URL('../../src/styles/components/stack.css', import.meta.url)),
  'utf8',
);

describe('stack intro animation contract', () => {
  it('wires stack intro hooks and runtime bootstrap', () => {
    expect(stackSource).toContain('data-stack-root');
    expect(stackSource).toContain('data-stack-header');
    expect(stackSource).toContain('data-stack-eyebrow');
    expect(stackSource).toContain('data-stack-title');
    expect(stackSource).toContain('data-stack-grid');
    expect(stackSource).toContain('data-stack-card');
    expect(stackSource).toContain('initStackIntro');
    expect(stackSource).toContain("import { initStackIntro } from '../../lib/animations/stack/init-stack-intro.ts';");
    expect(stackSource).not.toContain('?url');
    expect(initSource).toContain('export function initStackIntro');
    expect(initSource).toContain('ScrollTrigger');
    expect(initSource).toContain('createStackIntro');
    expect(initSource).toContain('prefers-reduced-motion');
    expect(initSource).toContain('matchMedia');
    expect(initSource).toContain('once: true');
    expect(stackCssSource).toContain('.stack__grid');
    expect(stackCssSource).toContain('.stack__item');
    expect(stackCssSource).toContain('.stack-card');
  });
});
