// @ts-expect-error Astro check in this repo does not include Node builtin typings for tests.
import { readFileSync } from 'node:fs';
// @ts-expect-error Astro check in this repo does not include Node builtin typings for tests.
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import projectsSource from '../../src/components/organisms/ProjectsSection.astro?raw';
import initSource from '../../src/lib/animations/projects/init-projects-intro.ts?raw';

const projectsCssSource = readFileSync(
  fileURLToPath(new URL('../../src/styles/components/projects.css', import.meta.url)),
  'utf8',
);

describe('projects intro animation contract', () => {
  it('wires projects intro bootstrap hooks and base motion selectors', () => {
    expect(projectsSource).toContain('data-projects-root');
    expect(projectsSource).toContain('data-projects-header');
    expect(projectsSource).toContain('data-projects-eyebrow');
    expect(projectsSource).toContain('data-projects-heading');
    expect(projectsSource).toContain('data-projects-featured');
    expect(projectsSource).toContain('data-projects-card');
    expect(projectsSource).toContain('initProjectsIntro');
    expect(projectsSource).toContain("import { initProjectsIntro } from '../../lib/animations/projects/init-projects-intro.ts';");
    expect(projectsSource).not.toContain('?url');
    expect(initSource).toContain('export function initProjectsIntro');
    expect(initSource).toContain('ScrollTrigger');
    expect(initSource).toContain('createProjectsIntro');
    expect(initSource).toContain('prefers-reduced-motion');
    expect(initSource).toContain('matchMedia');
    expect(initSource).toContain('once: true');
    expect(projectsCssSource).toContain('.project-card');
    expect(projectsCssSource).toContain('.projects__composition');
  });
});
