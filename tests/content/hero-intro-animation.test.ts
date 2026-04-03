import { describe, expect, it } from 'vitest';

import homeTemplateSource from '../../src/components/templates/HomeTemplate.astro?raw';
import layoutSource from '../../src/layouts/BaseLayout.astro?raw';
import enIndexSource from '../../src/pages/en/index.astro?raw';
import indexSource from '../../src/pages/index.astro?raw';

describe('hero intro animation contract', () => {
  it('declares hero intro eligibility only on the two home pages via the layout', () => {
    expect(indexSource).toContain('enableHeroIntro');
    expect(enIndexSource).toContain('enableHeroIntro');
    expect(layoutSource).toContain('enableHeroIntro?: boolean');
    expect(layoutSource).toContain('data-hero-intro-eligible');
    expect(homeTemplateSource).not.toContain('enableHeroIntro');
  });
});
