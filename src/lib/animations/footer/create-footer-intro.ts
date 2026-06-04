import { gsap } from 'gsap';

const FOOTER_SELECTORS = {
  content: '[data-footer-content]',
  links: '[data-footer-link]',
  line: '[data-footer-line]',
} as const;

type FooterMotionVariant = 'desktop' | 'mobile' | 'reduced';

type FooterIntroElements = {
  content: HTMLElement;
  line: HTMLElement;
  links: HTMLElement[];
};

export interface FooterIntroController {
  timeline: gsap.core.Timeline;
  play(): Promise<void>;
  destroy(): void;
}

function createCancellationError() {
  const error = new Error('Footer intro cancelled');
  error.name = 'AbortError';
  return error;
}

function queryRequiredElement(root: HTMLElement, selector: string) {
  const element = root.querySelector(selector);

  if (!(element instanceof HTMLElement)) {
    throw new Error(`Missing footer intro element for selector: ${selector}`);
  }

  return element;
}

function queryElementList(root: HTMLElement, selector: string) {
  const elements = Array.from(root.querySelectorAll(selector)).filter(
    (element): element is HTMLElement => element instanceof HTMLElement,
  );

  if (elements.length === 0) {
    throw new Error(`Missing footer intro elements for selector: ${selector}`);
  }

  return elements;
}

function resolveFooterIntroElements(root: HTMLElement): FooterIntroElements {
  return {
    content: queryRequiredElement(root, FOOTER_SELECTORS.content),
    line: queryRequiredElement(root, FOOTER_SELECTORS.line),
    links: queryElementList(root, FOOTER_SELECTORS.links),
  };
}

function getOffsets(variant: FooterMotionVariant) {
  switch (variant) {
    case 'mobile':
      return { itemY: 10, stagger: 0.06 };
    case 'reduced':
      return { itemY: 0, stagger: 0 };
    case 'desktop':
    default:
      return { itemY: 16, stagger: 0.08 };
  }
}

function applyInitialState(elements: FooterIntroElements, variant: FooterMotionVariant) {
  const offsets = getOffsets(variant);

  gsap.set(elements.line, { autoAlpha: 0, y: offsets.itemY });
  gsap.set(elements.links, { autoAlpha: 0, y: offsets.itemY });
}

function buildTimeline(
  timeline: gsap.core.Timeline,
  elements: FooterIntroElements,
  variant: FooterMotionVariant,
) {
  const offsets = getOffsets(variant);

  timeline.fromTo(
    elements.line,
    { autoAlpha: 0, y: offsets.itemY },
    { autoAlpha: 1, duration: 0.4, y: 0 },
  );
  timeline.fromTo(
    elements.links,
    { autoAlpha: 0, y: offsets.itemY },
    {
      autoAlpha: 1,
      duration: variant === 'reduced' ? 0.14 : 0.32,
      stagger: offsets.stagger,
      y: 0,
    },
    '<0.08',
  );
}

export function createFooterIntro(
  root: HTMLElement,
  variant: FooterMotionVariant = 'desktop',
): FooterIntroController {
  const elements = resolveFooterIntroElements(root);
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
