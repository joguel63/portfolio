import { gsap } from 'gsap';

const CONTACT_SELECTORS = {
  actions: '[data-contact-actions]',
  card: '[data-contact-card]',
  description: '[data-contact-description]',
  eyebrow: '[data-contact-eyebrow]',
  heading: '[data-contact-heading]',
} as const;

type ContactMotionVariant = 'desktop' | 'mobile' | 'reduced';

type ContactIntroElements = {
  actions: HTMLElement;
  card: HTMLElement;
  description: HTMLElement;
  eyebrow: HTMLElement;
  heading: HTMLElement;
};

export interface ContactIntroController {
  timeline: gsap.core.Timeline;
  play(): Promise<void>;
  destroy(): void;
}

function createCancellationError() {
  const error = new Error('Contact intro cancelled');
  error.name = 'AbortError';
  return error;
}

function queryRequiredElement(root: HTMLElement, selector: string) {
  const element = root.querySelector(selector);

  if (!(element instanceof HTMLElement)) {
    throw new Error(`Missing contact intro element for selector: ${selector}`);
  }

  return element;
}

function resolveContactIntroElements(root: HTMLElement): ContactIntroElements {
  return {
    card: queryRequiredElement(root, CONTACT_SELECTORS.card),
    eyebrow: queryRequiredElement(root, CONTACT_SELECTORS.eyebrow),
    heading: queryRequiredElement(root, CONTACT_SELECTORS.heading),
    description: queryRequiredElement(root, CONTACT_SELECTORS.description),
    actions: queryRequiredElement(root, CONTACT_SELECTORS.actions),
  };
}

function getOffsets(variant: ContactMotionVariant) {
  switch (variant) {
    case 'mobile':
      return { bodyY: 12, headerY: 10 };
    case 'reduced':
      return { bodyY: 0, headerY: 0 };
    case 'desktop':
    default:
      return { bodyY: 18, headerY: 14 };
  }
}

function applyInitialState(elements: ContactIntroElements, variant: ContactMotionVariant) {
  const offsets = getOffsets(variant);

  gsap.set(elements.card, { autoAlpha: 0, y: offsets.bodyY, scale: 0.985 });
  gsap.set([elements.eyebrow, elements.heading, elements.description, elements.actions], {
    autoAlpha: 0,
    y: offsets.headerY,
  });
}

function buildTimeline(
  timeline: gsap.core.Timeline,
  elements: ContactIntroElements,
  variant: ContactMotionVariant,
) {
  const offsets = getOffsets(variant);

  timeline.fromTo(
    elements.card,
    { autoAlpha: 0, y: offsets.bodyY, scale: 0.985 },
    { autoAlpha: 1, duration: 0.55, scale: 1, y: 0 },
  );
  timeline.fromTo(
    elements.eyebrow,
    { autoAlpha: 0, y: offsets.headerY },
    { autoAlpha: 1, duration: 0.32, y: 0 },
    '<0.06',
  );
  timeline.fromTo(
    elements.heading,
    { autoAlpha: 0, y: offsets.headerY },
    { autoAlpha: 1, duration: 0.44, y: 0 },
    '<0.06',
  );
  timeline.fromTo(
    elements.description,
    { autoAlpha: 0, y: offsets.headerY },
    { autoAlpha: 1, duration: 0.38, y: 0 },
    '<0.06',
  );
  timeline.fromTo(
    elements.actions,
    { autoAlpha: 0, y: offsets.headerY },
    { autoAlpha: 1, duration: 0.42, y: 0 },
    '<0.06',
  );
}

export function createContactIntro(
  root: HTMLElement,
  variant: ContactMotionVariant = 'desktop',
): ContactIntroController {
  const elements = resolveContactIntroElements(root);
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
