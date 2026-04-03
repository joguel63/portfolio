import { gsap } from 'gsap';

type HeroMotionVariant = 'desktop' | 'mobile' | 'reduced';

const HERO_SELECTORS = {
  core: '[data-hero-core]',
  descriptors: '[data-hero-descriptors]',
  orbits: '[data-hero-orbit]',
  rings: '[data-hero-ring]',
  satellites: '[data-hero-satellite]',
  scroll: '[data-hero-scroll]',
  support: '[data-hero-support]',
  title: '[data-hero-title]',
} as const;

type HeroIntroElements = {
  core: HTMLElement;
  descriptors: HTMLElement;
  orbits: HTMLElement[];
  rings: HTMLElement[];
  satellites: HTMLElement[];
  scroll: HTMLElement;
  support: HTMLElement;
  title: HTMLElement;
};

type HeroIntroProfile = {
  ambientOrbitDuration: number;
  ambientPulseDuration: number;
  coreDuration: number;
  orbitSettleDuration: number;
  satelliteDuration: number;
  scrollOffset: number;
  textDuration: number;
  textOffset: number;
};

type ListenerCleanup = () => void;

export interface HeroIntroController {
  timeline: gsap.core.Timeline;
  play(): Promise<void>;
  destroy(): void;
}

function createCancellationError() {
  const error = new Error('Hero intro cancelled');
  error.name = 'AbortError';
  return error;
}

function getProfile(variant: HeroMotionVariant): HeroIntroProfile {
  if (variant === 'mobile') {
    return {
      ambientOrbitDuration: 10,
      ambientPulseDuration: 2.4,
      coreDuration: 0.2,
      orbitSettleDuration: 0.22,
      satelliteDuration: 0.24,
      scrollOffset: 10,
      textDuration: 0.32,
      textOffset: 18,
    };
  }

  return {
    ambientOrbitDuration: 12,
    ambientPulseDuration: 2.8,
    coreDuration: 0.24,
    orbitSettleDuration: 0.3,
    satelliteDuration: 0.3,
    scrollOffset: 14,
    textDuration: 0.38,
    textOffset: 24,
  };
}

function queryRequiredElement(root: HTMLElement, selector: string) {
  const element = root.querySelector(selector);

  if (!(element instanceof HTMLElement)) {
    throw new Error(`Missing hero intro element for selector: ${selector}`);
  }

  return element;
}

function queryElementList(root: HTMLElement, selector: string) {
  const elements = Array.from(root.querySelectorAll(selector)).filter(
    (element): element is HTMLElement => element instanceof HTMLElement,
  );

  if (elements.length === 0) {
    throw new Error(`Missing hero intro elements for selector: ${selector}`);
  }

  return elements;
}

function resolveHeroIntroElements(root: HTMLElement): HeroIntroElements {
  return {
    core: queryRequiredElement(root, HERO_SELECTORS.core),
    descriptors: queryRequiredElement(root, HERO_SELECTORS.descriptors),
    orbits: queryElementList(root, HERO_SELECTORS.orbits),
    rings: queryElementList(root, HERO_SELECTORS.rings),
    satellites: queryElementList(root, HERO_SELECTORS.satellites),
    scroll: queryRequiredElement(root, HERO_SELECTORS.scroll),
    support: queryRequiredElement(root, HERO_SELECTORS.support),
    title: queryRequiredElement(root, HERO_SELECTORS.title),
  };
}

function createAmbientLoops(elements: HeroIntroElements, profile: HeroIntroProfile) {
  return [
    ...elements.orbits.map((orbit, index) =>
      gsap.to(orbit, {
        duration: profile.ambientOrbitDuration + index * 1.2,
        ease: 'none',
        repeat: -1,
        rotate: index % 2 === 0 ? '+=360' : '-=360',
      }),
    ),
    gsap.to(elements.core, {
      duration: profile.ambientPulseDuration,
      ease: 'sine.inOut',
      repeat: -1,
      scale: 1.04,
      yoyo: true,
    }),
  ];
}

export function createHeroIntro(root: HTMLElement, variant: HeroMotionVariant): HeroIntroController {
  const elements = resolveHeroIntroElements(root);
  const profile = getProfile(variant);
  const listeners = new Set<ListenerCleanup>();
  const ambientLoops: gsap.core.Animation[] = [];
  let ambientStarted = false;
  let destroyed = false;
  let playPromise: Promise<void> | null = null;
  let resolvePlay: (() => void) | null = null;
  let rejectPlay: ((error: unknown) => void) | null = null;

  const settlePlay = (callback: (() => void) | ((error: unknown) => void), error?: unknown) => {
    if (!playPromise) {
      return;
    }

    const complete = callback;
    playPromise = null;
    resolvePlay = null;
    rejectPlay = null;

    if (error === undefined) {
      (complete as () => void)();
      return;
    }

    (complete as (reason: unknown) => void)(error);
  };

  const startAmbientLoops = () => {
    if (ambientStarted || destroyed) {
      return;
    }

    ambientStarted = true;
    ambientLoops.push(...createAmbientLoops(elements, profile));
  };

  const timeline = gsap.timeline({
    defaults: { ease: 'power2.out' },
    paused: true,
  });

  gsap.set(elements.core, { autoAlpha: 0.2, scale: 0.55 });
  gsap.set(elements.rings, { autoAlpha: 0, scale: 0.4 });
  gsap.set(elements.satellites, { autoAlpha: 0, scale: 0.5 });
  gsap.set(elements.orbits, { rotate: 0 });
  gsap.set([elements.title, elements.support, elements.descriptors], {
    autoAlpha: 0,
    y: profile.textOffset,
  });
  gsap.set(elements.scroll, { autoAlpha: 0, y: profile.scrollOffset });

  // Phase A: Silent Origin.
  timeline.fromTo(
    elements.core,
    { autoAlpha: 0.2, scale: 0.55 },
    { autoAlpha: 1, duration: profile.coreDuration, scale: 1 },
  );

  // Phase B: Structural Expansion.
  elements.rings.forEach((ring, index) => {
    timeline.fromTo(
      ring,
      { autoAlpha: 0, scale: 0.4 },
      { autoAlpha: 1, duration: 0.22 + index * 0.05, scale: 1 },
      index === 0 ? '>-0.02' : '<0.08',
    );
  });

  // Phase C: Secondary Orb Arrival.
  timeline.fromTo(
    elements.satellites,
    { autoAlpha: 0, scale: 0.5 },
    { autoAlpha: 1, duration: profile.satelliteDuration, scale: 1, stagger: 0.08 },
    '>-0.04',
  );

  // Phase D: Live System Activation.
  timeline.to(
    elements.orbits,
    { duration: profile.orbitSettleDuration, rotate: (_, target) => target.dataset.heroOrbit === 'beta' ? -24 : 24 },
    '<',
  );
  timeline.add(() => {
    startAmbientLoops();
  });

  // Phase E: Hero Content Entrance.
  timeline.fromTo(
    [elements.title, elements.support, elements.descriptors],
    { autoAlpha: 0, y: profile.textOffset },
    { autoAlpha: 1, duration: profile.textDuration, stagger: 0.08, y: 0 },
    '>-0.04',
  );
  timeline.fromTo(
    elements.scroll,
    { autoAlpha: 0, y: profile.scrollOffset },
    { autoAlpha: 1, duration: 0.24, y: 0 },
    '<0.16',
  );

  // Phase F: Intro Release.
  timeline.add(() => {
    try {
      startAmbientLoops();
      settlePlay(resolvePlay ?? (() => {}));
    } catch (error) {
      settlePlay(rejectPlay ?? (() => {}), error);
    }
  });

  return {
    timeline,
    play(): Promise<void> {
      if (destroyed) {
        return Promise.reject(createCancellationError());
      }

      if (playPromise) {
        return playPromise;
      }

      playPromise = new Promise<void>((resolve, reject) => {
        resolvePlay = resolve;
        rejectPlay = reject;
      });

      try {
        timeline.restart();
      } catch (error) {
        settlePlay(rejectPlay ?? (() => {}), error);
      }

      return playPromise;
    },
    destroy() {
      if (destroyed) {
        return;
      }

      destroyed = true;

      listeners.forEach((cleanup) => {
        cleanup();
      });
      listeners.clear();

      if (rejectPlay) {
        settlePlay(rejectPlay, createCancellationError());
      }

      timeline.kill();
      ambientLoops.forEach((animation) => {
        animation.kill();
      });
      ambientLoops.length = 0;
    },
  };
}
