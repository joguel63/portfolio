import { gsap } from 'gsap';

const PROJECTS_SELECTORS = {
  cards: '[data-projects-card]',
  eyebrow: '[data-projects-eyebrow]',
  featured: '[data-projects-featured]',
  header: '[data-projects-header]',
  heading: '[data-projects-heading]',
} as const;

type ProjectsMotionVariant = 'desktop' | 'tablet' | 'mobile' | 'reduced';

type ProjectsIntroElements = {
  cards: HTMLElement[];
  eyebrow: HTMLElement;
  featured: HTMLElement;
  header: HTMLElement;
  heading: HTMLElement;
};

export interface ProjectsIntroController {
  timeline: gsap.core.Timeline;
  play(): Promise<void>;
  destroy(): void;
}

function createCancellationError() {
  const error = new Error('Projects intro cancelled');
  error.name = 'AbortError';
  return error;
}

function queryRequiredElement(root: HTMLElement, selector: string) {
  const element = root.querySelector(selector);

  if (!(element instanceof HTMLElement)) {
    throw new Error(`Missing projects intro element for selector: ${selector}`);
  }

  return element;
}

function queryElementList(root: HTMLElement, selector: string) {
  const elements = Array.from(root.querySelectorAll(selector)).filter(
    (element): element is HTMLElement => element instanceof HTMLElement,
  );

  if (elements.length === 0) {
    throw new Error(`Missing projects intro elements for selector: ${selector}`);
  }

  return elements;
}

function resolveProjectsIntroElements(root: HTMLElement): ProjectsIntroElements {
  return {
    header: queryRequiredElement(root, PROJECTS_SELECTORS.header),
    eyebrow: queryRequiredElement(root, PROJECTS_SELECTORS.eyebrow),
    heading: queryRequiredElement(root, PROJECTS_SELECTORS.heading),
    featured: queryRequiredElement(root, PROJECTS_SELECTORS.featured),
    cards: queryElementList(root, PROJECTS_SELECTORS.cards),
  };
}

function getOffsets(variant: ProjectsMotionVariant) {
  switch (variant) {
    case 'mobile':
      return { cardY: 18, cardScale: 0.988, headerY: 12, stagger: 0.05 };
    case 'tablet':
      return { cardY: 20, cardScale: 0.985, headerY: 14, stagger: 0.06 };
    case 'reduced':
      return { cardY: 0, cardScale: 1, headerY: 0, stagger: 0 };
    case 'desktop':
    default:
      return { cardY: 24, cardScale: 0.98, headerY: 18, stagger: 0.08 };
  }
}

function applyInitialState(elements: ProjectsIntroElements, variant: ProjectsMotionVariant) {
  const offsets = getOffsets(variant);

  gsap.set([elements.eyebrow, elements.heading], {
    autoAlpha: 0,
    y: offsets.headerY,
  });
  gsap.set(elements.featured, {
    autoAlpha: 0,
    y: offsets.cardY,
    scale: offsets.cardScale,
  });
  gsap.set(elements.cards, {
    autoAlpha: 0,
    y: offsets.cardY,
    scale: offsets.cardScale,
  });
}

function buildTimeline(
  timeline: gsap.core.Timeline,
  elements: ProjectsIntroElements,
  variant: ProjectsMotionVariant,
) {
  const offsets = getOffsets(variant);

  timeline.fromTo(
    elements.eyebrow,
    { autoAlpha: 0, y: offsets.headerY },
    { autoAlpha: 1, duration: 0.34, y: 0 },
  );
  timeline.fromTo(
    elements.heading,
    { autoAlpha: 0, y: offsets.headerY },
    { autoAlpha: 1, duration: 0.46, y: 0 },
    '<0.08',
  );
  timeline.fromTo(
    elements.featured,
    { autoAlpha: 0, y: offsets.cardY, scale: offsets.cardScale },
    { autoAlpha: 1, duration: 0.55, scale: 1, y: 0 },
    '>-0.06',
  );
  timeline.fromTo(
    elements.cards,
    { autoAlpha: 0, y: offsets.cardY, scale: offsets.cardScale },
    {
      autoAlpha: 1,
      duration: variant === 'reduced' ? 0.16 : 0.4,
      scale: 1,
      stagger:
        variant === 'reduced'
          ? 0
          : {
              each: offsets.stagger,
              from: 'start',
              grid: 'auto',
            },
      y: 0,
    },
    '<0.06',
  );
}

export function createProjectsIntro(
  root: HTMLElement,
  variant: ProjectsMotionVariant = 'desktop',
): ProjectsIntroController {
  const elements = resolveProjectsIntroElements(root);
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
