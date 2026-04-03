// @ts-expect-error Astro check in this repo does not include Node builtin typings for tests.
import { readFileSync } from 'node:fs';
// @ts-expect-error Astro check in this repo does not include Node builtin typings for tests.
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import heroOrbSource from '../../src/components/atoms/HeroOrb.astro?raw';
import homeTemplateSource from '../../src/components/templates/HomeTemplate.astro?raw';
import configSource from '../../src/lib/animations/hero/hero-motion-config.ts?raw';
import createSource from '../../src/lib/animations/hero/create-hero-intro.ts?raw';
import heroSource from '../../src/components/organisms/HeroSection.astro?raw';
import initSource from '../../src/lib/animations/hero/init-hero-intro.ts?raw';
import layoutSource from '../../src/layouts/BaseLayout.astro?raw';
import enIndexSource from '../../src/pages/en/index.astro?raw';
import indexSource from '../../src/pages/index.astro?raw';
import stateSource from '../../src/lib/animations/hero/hero-motion-state.ts?raw';

const heroCssSource = readFileSync(
  fileURLToPath(new URL('../../src/styles/components/hero.css', import.meta.url)),
  'utf8',
);
const headerCssSource = readFileSync(
  fileURLToPath(new URL('../../src/styles/components/header.css', import.meta.url)),
  'utf8',
);
const heroOrbCssSource = readFileSync(
  fileURLToPath(new URL('../../src/styles/components/hero-orb.css', import.meta.url)),
  'utf8',
);

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
    expect(createSource).toContain('export function createHeroIntro');
    expect(createSource).toContain('play(): Promise<void>');
    expect(createSource).toContain('destroy()');
    expect(stateSource).toContain('enterPendingIntro');
    expect(stateSource).toContain('activateIntro');
    expect(stateSource).toContain('releaseIntro');
    expect(stateSource).toContain('failOpenIntro');
    expect(stateSource).toContain('data-hero-intro-state');
    expect(stateSource).toContain('inert');
    expect(initSource).toContain('createHeroIntro');
    expect(initSource).toContain('releaseIntro()');
    expect(initSource).toContain('failOpenIntro()');
    expect(configSource).toContain('48rem');
    expect(configSource).toContain('prefers-reduced-motion');
  });

  it('defines explicit desktop, mobile, and reduced motion variant contracts', () => {
    expect(configSource).toContain('HERO_MOBILE_BREAKPOINT');
    expect(configSource).toContain('HERO_REDUCED_MOTION_QUERY');
    expect(createSource).toContain('desktop');
    expect(createSource).toContain('mobile');
    expect(createSource).toContain('reduced');
    expect(createSource).toContain("variant === 'mobile'");
    expect(createSource).toContain("variant === 'reduced'");
    expect(heroOrbCssSource).toContain('@media (max-width: 48rem)');
    expect(heroOrbCssSource).toContain('@keyframes hero-orb-core-breathe');
    expect(heroOrbCssSource).toContain('@keyframes hero-orb-satellite-pulse');
    expect(heroCssSource).toContain('@media (prefers-reduced-motion: reduce)');
  });

  it('keeps explicit orb animation layers stable for selector-based motion hooks', () => {
    expect(heroOrbSource).toContain('hero__orb-rings');
    expect(heroOrbSource).toContain('hero__orb-ring hero__orb-ring--inner');
    expect(heroOrbSource).toContain('hero__orb-ring hero__orb-ring--middle');
    expect(heroOrbSource).toContain('hero__orb-ring hero__orb-ring--outer');
    expect(heroOrbSource).toContain('hero__orb-orbit hero__orb-orbit--alpha');
    expect(heroOrbSource).toContain('hero__orb-orbit hero__orb-orbit--beta');
    expect(heroOrbSource).toContain('hero__orb-orbit hero__orb-orbit--gamma');
    expect(heroOrbSource).toContain('hero__orb-satellite');
  });

  it('wires hero intro bootstrap hooks and active-state styles', () => {
    expect(heroSource).toContain('data-hero-root');
    expect(heroSource).toContain('document.body.dataset.heroIntroEligible');
    expect(heroSource).toContain('data-hero-title');
    expect(heroSource).toContain('data-hero-support');
    expect(heroSource).toContain('data-hero-descriptors');
    expect(heroSource).toContain('data-hero-scroll');
    expect(heroSource).toContain('initHeroIntro');
    expect(heroCssSource).toContain('data-hero-intro-state');
    expect(headerCssSource).toContain('data-hero-intro-state="active"');
  });
});
