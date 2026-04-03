import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type ElementMap = Map<string, ElementShim[]>;

class ElementShim {
  dataset: Record<string, string | undefined> = {};

  constructor(private readonly elements: ElementMap = new Map()) {}

  querySelector(selector: string) {
    return this.elements.get(selector)?.[0] ?? null;
  }

  querySelectorAll(selector: string) {
    return this.elements.get(selector) ?? [];
  }
}

function createAboutRoot() {
  const media = new ElementShim();
  const halo = new ElementShim();
  const image = new ElementShim();
  const eyebrow = new ElementShim();
  const title = new ElementShim();
  const body = new ElementShim();
  const stats = new ElementShim();
  const paragraphs = [new ElementShim(), new ElementShim()];
  const statItems = [new ElementShim(), new ElementShim()];

  const root = new ElementShim(
    new Map([
      ['[data-about-media]', [media]],
      ['[data-about-halo]', [halo]],
      ['[data-about-image]', [image]],
      ['[data-about-eyebrow]', [eyebrow]],
      ['[data-about-title]', [title]],
      ['[data-about-body]', [body]],
      ['[data-about-paragraph]', paragraphs],
      ['[data-about-stats]', [stats]],
      ['[data-about-stat]', statItems],
    ]),
  );

  return { body, eyebrow, halo, image, media, paragraphs, root, statItems, stats, title };
}

describe('about intro controller', () => {
  const originalHTMLElement = globalThis.HTMLElement;

  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal('HTMLElement', ElementShim as unknown as typeof HTMLElement);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    globalThis.HTMLElement = originalHTMLElement;
  });

  it('creates a paused timeline and resolves it through play/destroy', async () => {
    let onComplete: (() => void) | undefined;
    const kill = vi.fn();
    const fromTo = vi.fn().mockReturnThis();
    const add = vi.fn((callback?: () => void) => {
      onComplete = callback;
      return timeline;
    });

    const timeline = {
      add,
      fromTo,
      kill,
      restart: vi.fn(() => {
        onComplete?.();
      }),
    };

    const set = vi.fn();

    vi.doMock('gsap', () => ({
      gsap: {
        set,
        timeline: vi.fn(() => timeline),
      },
    }));

    const { root } = createAboutRoot();
    const { createAboutIntro } = await import('../../src/lib/animations/about/create-about-intro');

    const controller = createAboutIntro(root as unknown as HTMLElement, 'desktop');
    const playPromise = controller.play();

    await expect(playPromise).resolves.toBeUndefined();
    controller.destroy();

    expect(controller.timeline).toBe(timeline);
    expect(timeline.restart).toHaveBeenCalledTimes(1);
    expect(kill).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalled();
    expect(fromTo).toHaveBeenCalled();
  });

  it('does not leave the body wrapper hidden while animating paragraphs', async () => {
    const timeline = {
      add: vi.fn().mockReturnThis(),
      fromTo: vi.fn().mockReturnThis(),
      kill: vi.fn(),
      restart: vi.fn(),
    };
    const set = vi.fn();

    vi.doMock('gsap', () => ({
      gsap: {
        set,
        timeline: vi.fn(() => timeline),
      },
    }));

    const { root, body } = createAboutRoot();
    const { createAboutIntro } = await import('../../src/lib/animations/about/create-about-intro');

    createAboutIntro(root as unknown as HTMLElement, 'desktop');

    expect(
      set.mock.calls.some(
        ([target]) => target === body || (Array.isArray(target) && target.includes(body)),
      ),
    ).toBe(false);
  });

  it('throws when a required about selector is missing', async () => {
    const root = new ElementShim(new Map());

    vi.doMock('gsap', () => ({
      gsap: {
        set: vi.fn(),
        timeline: vi.fn(() => ({
          add: vi.fn().mockReturnThis(),
          fromTo: vi.fn().mockReturnThis(),
          kill: vi.fn(),
          restart: vi.fn(),
        })),
      },
    }));

    const { createAboutIntro } = await import('../../src/lib/animations/about/create-about-intro');

    expect(() => createAboutIntro(root as unknown as HTMLElement, 'desktop')).toThrow(
      'Missing about intro element for selector: [data-about-media]',
    );
  });
});

describe('about intro runtime', () => {
  const originalWindow = globalThis.window;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    globalThis.window = originalWindow;
  });

  it('registers ScrollTrigger and plays once on enter', async () => {
    const create = vi.fn(() => ({
      destroy: vi.fn(),
      play: vi.fn().mockResolvedValue(undefined),
      timeline: {},
    }));
    const registerPlugin = vi.fn();
    const triggerKill = vi.fn();
    const createTrigger = vi.fn((config: { onEnter?: () => void }) => {
      config.onEnter?.();
      return { kill: triggerKill };
    });

    vi.stubGlobal('window', {
      addEventListener: vi.fn(),
      matchMedia: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
      })),
      removeEventListener: vi.fn(),
    });

    vi.doMock('../../src/lib/animations/about/create-about-intro', () => ({
      createAboutIntro: create,
    }));
    vi.doMock('gsap', () => ({
      gsap: {
        registerPlugin,
      },
    }));
    vi.doMock('gsap/ScrollTrigger', () => ({
      ScrollTrigger: {
        create: createTrigger,
      },
    }));

    const { root } = createAboutRoot();
    const { initAboutIntro } = await import('../../src/lib/animations/about/init-about-intro');

    const cleanup = initAboutIntro(root as unknown as HTMLElement);

    expect(registerPlugin).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledWith(root, 'desktop');
    expect(createTrigger).toHaveBeenCalledTimes(1);
    expect(createTrigger.mock.calls[0]?.[0]).toMatchObject({ once: true, trigger: root });

    cleanup();

    expect(triggerKill).toHaveBeenCalledTimes(1);
  });

  it('skips ScrollTrigger and controller in reduced motion', async () => {
    const create = vi.fn();
    const registerPlugin = vi.fn();
    const createTrigger = vi.fn();

    vi.stubGlobal('window', {
      addEventListener: vi.fn(),
      matchMedia: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
      })),
      removeEventListener: vi.fn(),
    });

    vi.doMock('../../src/lib/animations/about/create-about-intro', () => ({
      createAboutIntro: create,
    }));
    vi.doMock('gsap', () => ({
      gsap: {
        registerPlugin,
      },
    }));
    vi.doMock('gsap/ScrollTrigger', () => ({
      ScrollTrigger: {
        create: createTrigger,
      },
    }));

    const { root } = createAboutRoot();
    const { initAboutIntro } = await import('../../src/lib/animations/about/init-about-intro');

    const cleanup = initAboutIntro(root as unknown as HTMLElement);
    cleanup();

    expect(registerPlugin).toHaveBeenCalledTimes(1);
    expect(create).not.toHaveBeenCalled();
    expect(createTrigger).not.toHaveBeenCalled();
    expect(root.dataset.aboutIntroReveal).toBe('soft');
  });
});
