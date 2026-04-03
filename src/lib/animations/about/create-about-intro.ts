import { gsap } from 'gsap';

const ABOUT_SELECTORS = {
  body: '[data-about-body]',
  eyebrow: '[data-about-eyebrow]',
  halo: '[data-about-halo]',
  image: '[data-about-image]',
  media: '[data-about-media]',
  paragraphs: '[data-about-paragraph]',
  stats: '[data-about-stats]',
  statItems: '[data-about-stat]',
  title: '[data-about-title]',
} as const;

type AboutMotionVariant = 'desktop' | 'mobile' | 'reduced';

type AboutIntroElements = {
  body: HTMLElement;
  eyebrow: HTMLElement;
  halo: HTMLElement;
  image: HTMLElement;
  media: HTMLElement;
  paragraphs: HTMLElement[];
  stats: HTMLElement;
  statItems: HTMLElement[];
  title: HTMLElement;
};

export interface AboutIntroController {
  timeline: gsap.core.Timeline;
  play(): Promise<void>;
  destroy(): void;
}

function createCancellationError() {
  const error = new Error('About intro cancelled');
  error.name = 'AbortError';
  return error;
}

function queryRequiredElement(root: HTMLElement, selector: string) {
  const element = root.querySelector(selector);

  if (!(element instanceof HTMLElement)) {
    throw new Error(`Missing about intro element for selector: ${selector}`);
  }

  return element;
}

function queryElementList(root: HTMLElement, selector: string) {
  const elements = Array.from(root.querySelectorAll(selector)).filter(
    (element): element is HTMLElement => element instanceof HTMLElement,
  );

  if (elements.length === 0) {
    throw new Error(`Missing about intro elements for selector: ${selector}`);
  }

  return elements;
}

function resolveAboutIntroElements(root: HTMLElement): AboutIntroElements {
  return {
    media: queryRequiredElement(root, ABOUT_SELECTORS.media),
    halo: queryRequiredElement(root, ABOUT_SELECTORS.halo),
    image: queryRequiredElement(root, ABOUT_SELECTORS.image),
    eyebrow: queryRequiredElement(root, ABOUT_SELECTORS.eyebrow),
    title: queryRequiredElement(root, ABOUT_SELECTORS.title),
    body: queryRequiredElement(root, ABOUT_SELECTORS.body),
    paragraphs: queryElementList(root, ABOUT_SELECTORS.paragraphs),
    stats: queryRequiredElement(root, ABOUT_SELECTORS.stats),
    statItems: queryElementList(root, ABOUT_SELECTORS.statItems),
  };
}

function applyInitialState(elements: AboutIntroElements, variant: AboutMotionVariant) {
  const mediaOffset = variant === 'mobile' ? 18 : 28;
  const textOffset = variant === 'mobile' ? 14 : 20;
  const statOffset = variant === 'mobile' ? 10 : 14;

  gsap.set(elements.media, { autoAlpha: 0, x: -mediaOffset });
  gsap.set(elements.image, { autoAlpha: 0, scale: 0.965 });
  gsap.set(elements.halo, { autoAlpha: 0 });
  gsap.set([elements.eyebrow, elements.title, elements.paragraphs], {
    autoAlpha: 0,
    y: textOffset,
  });
  gsap.set(elements.stats, { autoAlpha: 0, y: statOffset });
  gsap.set(elements.statItems, { autoAlpha: 0, y: statOffset, scale: 0.985 });
}

function buildTimeline(
  timeline: gsap.core.Timeline,
  elements: AboutIntroElements,
  variant: AboutMotionVariant,
) {
  const textOffset = variant === 'mobile' ? 14 : 20;
  const statOffset = variant === 'mobile' ? 10 : 14;

  timeline.fromTo(
    elements.media,
    { autoAlpha: 0, x: variant === 'mobile' ? -18 : -28 },
    { autoAlpha: 1, duration: 0.7, x: 0 },
  );
  timeline.fromTo(elements.halo, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45 }, '<0.08');
  timeline.fromTo(
    elements.image,
    { autoAlpha: 0, scale: 0.965 },
    { autoAlpha: 1, duration: 0.72, scale: 1 },
    '<',
  );
  timeline.fromTo(
    elements.eyebrow,
    { autoAlpha: 0, y: textOffset },
    { autoAlpha: 1, duration: 0.38, y: 0 },
    '>-0.22',
  );
  timeline.fromTo(
    elements.title,
    { autoAlpha: 0, y: textOffset },
    { autoAlpha: 1, duration: 0.5, y: 0 },
    '<0.08',
  );
  timeline.fromTo(
    elements.paragraphs,
    { autoAlpha: 0, y: textOffset },
    { autoAlpha: 1, duration: 0.42, stagger: variant === 'reduced' ? 0 : 0.08, y: 0 },
    '<0.1',
  );
  timeline.fromTo(
    elements.stats,
    { autoAlpha: 0, y: statOffset },
    { autoAlpha: 1, duration: 0.3, y: 0 },
    '>-0.06',
  );
  timeline.fromTo(
    elements.statItems,
    { autoAlpha: 0, y: statOffset, scale: 0.985 },
    { autoAlpha: 1, duration: 0.34, scale: 1, stagger: variant === 'reduced' ? 0 : 0.06, y: 0 },
    '<0.04',
  );
}

export function createAboutIntro(
  root: HTMLElement,
  variant: AboutMotionVariant = 'desktop',
): AboutIntroController {
  const elements = resolveAboutIntroElements(root);
  const timeline = gsap.timeline({ defaults: { ease: 'power2.out' }, paused: true });
  let destroyed = false;
  let playPromise: Promise<void> | null = null;
  let resolvePlay: (() => void) | null = null;
  let rejectPlay: ((error: unknown) => void) | null = null;

  const settlePlay = (callback: (() => void) | ((error: unknown) => void), error?: unknown) => {
    if (!playPromise) {
      return;
    }

    playPromise = null;
    resolvePlay = null;
    rejectPlay = null;

    if (error === undefined) {
      (callback as () => void)();
      return;
    }

    (callback as (reason: unknown) => void)(error);
  };

  applyInitialState(elements, variant);
  buildTimeline(timeline, elements, variant);
  timeline.add(() => {
    settlePlay(resolvePlay ?? (() => {}));
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
      const pendingPlay = playPromise;

      try {
        timeline.restart();
      } catch (error) {
        settlePlay(rejectPlay ?? (() => {}), error);
      }

      return pendingPlay;
    },
    destroy() {
      if (destroyed) {
        return;
      }

      destroyed = true;

      if (rejectPlay) {
        settlePlay(rejectPlay, createCancellationError());
      }

      timeline.kill();
    },
  };
}
