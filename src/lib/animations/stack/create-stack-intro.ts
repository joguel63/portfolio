import { gsap } from 'gsap';

const STACK_SELECTORS = {
  cards: '[data-stack-card]',
  eyebrow: '[data-stack-eyebrow]',
  grid: '[data-stack-grid]',
  header: '[data-stack-header]',
  title: '[data-stack-title]',
} as const;

type StackMotionVariant = 'desktop' | 'tablet' | 'mobile' | 'reduced';

type StackIntroElements = {
  cards: HTMLElement[];
  eyebrow: HTMLElement;
  grid: HTMLElement;
  header: HTMLElement;
  title: HTMLElement;
};

export interface StackIntroController {
  timeline: gsap.core.Timeline;
  play(): Promise<void>;
  destroy(): void;
}

function createCancellationError() {
  const error = new Error('Stack intro cancelled');
  error.name = 'AbortError';
  return error;
}

function queryRequiredElement(root: HTMLElement, selector: string) {
  const element = root.querySelector(selector);

  if (!(element instanceof HTMLElement)) {
    throw new Error(`Missing stack intro element for selector: ${selector}`);
  }

  return element;
}

function queryElementList(root: HTMLElement, selector: string) {
  const elements = Array.from(root.querySelectorAll(selector)).filter(
    (element): element is HTMLElement => element instanceof HTMLElement,
  );

  if (elements.length === 0) {
    throw new Error(`Missing stack intro elements for selector: ${selector}`);
  }

  return elements;
}

function resolveStackIntroElements(root: HTMLElement): StackIntroElements {
  return {
    header: queryRequiredElement(root, STACK_SELECTORS.header),
    eyebrow: queryRequiredElement(root, STACK_SELECTORS.eyebrow),
    title: queryRequiredElement(root, STACK_SELECTORS.title),
    grid: queryRequiredElement(root, STACK_SELECTORS.grid),
    cards: queryElementList(root, STACK_SELECTORS.cards),
  };
}

function getOffsets(variant: StackMotionVariant) {
  switch (variant) {
    case 'mobile':
      return { cardY: 16, headerY: 12, scale: 0.988, stagger: 0.045 };
    case 'tablet':
      return { cardY: 18, headerY: 14, scale: 0.986, stagger: 0.055 };
    case 'reduced':
      return { cardY: 0, headerY: 0, scale: 1, stagger: 0 };
    case 'desktop':
    default:
      return { cardY: 22, headerY: 16, scale: 0.984, stagger: 0.07 };
  }
}

function applyInitialState(elements: StackIntroElements, variant: StackMotionVariant) {
  const offsets = getOffsets(variant);

  gsap.set([elements.eyebrow, elements.title], {
    autoAlpha: 0,
    y: offsets.headerY,
  });
  gsap.set(elements.cards, {
    autoAlpha: 0,
    y: offsets.cardY,
    scale: offsets.scale,
  });
}

function buildTimeline(
  timeline: gsap.core.Timeline,
  elements: StackIntroElements,
  variant: StackMotionVariant,
) {
  const offsets = getOffsets(variant);

  timeline.fromTo(
    elements.eyebrow,
    { autoAlpha: 0, y: offsets.headerY },
    { autoAlpha: 1, duration: 0.32, y: 0 },
  );
  timeline.fromTo(
    elements.title,
    { autoAlpha: 0, y: offsets.headerY },
    { autoAlpha: 1, duration: 0.44, y: 0 },
    '<0.08',
  );
  timeline.fromTo(
    elements.cards,
    { autoAlpha: 0, y: offsets.cardY, scale: offsets.scale },
    {
      autoAlpha: 1,
      duration: variant === 'reduced' ? 0.16 : 0.38,
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
    '>-0.06',
  );
}

export function createStackIntro(
  root: HTMLElement,
  variant: StackMotionVariant = 'desktop',
): StackIntroController {
  const elements = resolveStackIntroElements(root);
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
