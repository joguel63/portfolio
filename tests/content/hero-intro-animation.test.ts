import { describe, expect, it } from 'vitest';

import homeTemplateSource from '../../src/components/templates/HomeTemplate.astro?raw';
import configSource from '../../src/lib/animations/hero/hero-motion-config.ts?raw';
import initSource from '../../src/lib/animations/hero/init-hero-intro.ts?raw';
import layoutSource from '../../src/layouts/BaseLayout.astro?raw';
import enIndexSource from '../../src/pages/en/index.astro?raw';
import indexSource from '../../src/pages/index.astro?raw';
import stateSource from '../../src/lib/animations/hero/hero-motion-state.ts?raw';

describe('hero intro animation contract', () => {
  it('declares hero intro eligibility only on the two home pages via the layout', () => {
    expect(indexSource).toContain('enableHeroIntro');
    expect(enIndexSource).toContain('enableHeroIntro');
    expect(layoutSource).toContain('enableHeroIntro?: boolean');
    expect(layoutSource).toContain('data-hero-intro-eligible');
    expect(homeTemplateSource).not.toContain('enableHeroIntro');
  });

  it('defines the runtime hero motion module skeleton', () => {
    expect(initSource).toContain('initHeroIntro');
    expect(stateSource).toContain('enterPendingIntro');
    expect(stateSource).toContain('activateIntro');
    expect(stateSource).toContain('releaseIntro');
    expect(stateSource).toContain('failOpenIntro');
    expect(stateSource).toContain('data-hero-intro-state');
    expect(configSource).toContain('48rem');
    expect(configSource).toContain('prefers-reduced-motion');
  });
});
