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

function createStackRoot(cardCount = 5) {
  const header = new ElementShim();
  const eyebrow = new ElementShim();
  const title = new ElementShim();
  const grid = new ElementShim();
  const cards = Array.from({ length: cardCount }, () => new ElementShim());

  const root = new ElementShim(
    new Map([
      ['[data-stack-header]', [header]],
      ['[data-stack-eyebrow]', [eyebrow]],
      ['[data-stack-title]', [title]],
      ['[data-stack-grid]', [grid]],
      ['[data-stack-card]', cards],
    ]),
  );

  return { cards, eyebrow, grid, header, root, title };
}

describe('stack intro controller', () => {
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

    const { root } = createStackRoot();
    const { createStackIntro } = await import('../../src/lib/animations/stack/create-stack-intro');

    const controller = createStackIntro(root as unknown as HTMLElement, 'desktop');
    const playPromise = controller.play();

    await expect(playPromise).resolves.toBeUndefined();
    controller.destroy();

    expect(controller.timeline).toBe(timeline);
    expect(timeline.restart).toHaveBeenCalledTimes(1);
    expect(kill).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalled();
    expect(fromTo).toHaveBeenCalled();
  });

  it('animates stack cards as units without requiring internal card selectors', async () => {
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

    const { root, cards } = createStackRoot();
    const { createStackIntro } = await import('../../src/lib/animations/stack/create-stack-intro');

    createStackIntro(root as unknown as HTMLElement, 'desktop');

    expect(
      set.mock.calls.some(
        ([target]) => Array.isArray(target) && cards.every((card) => target.includes(card)),
      ),
    ).toBe(true);
  });

  it('uses true grid-aware stagger behavior for the card collection', async () => {
    const timeline = {
      add: vi.fn().mockReturnThis(),
      fromTo: vi.fn().mockReturnThis(),
      kill: vi.fn(),
      restart: vi.fn(),
    };

    vi.doMock('gsap', () => ({
      gsap: {
        set: vi.fn(),
        timeline: vi.fn(() => timeline),
      },
    }));

    const { root } = createStackRoot();
    const { createStackIntro } = await import('../../src/lib/animations/stack/create-stack-intro');

    createStackIntro(root as unknown as HTMLElement, 'desktop');

    expect(
      timeline.fromTo.mock.calls.some(([, , vars]) => vars?.stagger?.grid === 'auto'),
    ).toBe(true);
  });

  it('throws when a required stack selector is missing', async () => {
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

    const { createStackIntro } = await import('../../src/lib/animations/stack/create-stack-intro');

    expect(() => createStackIntro(root as unknown as HTMLElement, 'desktop')).toThrow(
      'Missing stack intro element for selector: [data-stack-header]',
    );
  });
});

describe('stack intro runtime', () => {
  const originalWindow = globalThis.window;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    globalThis.window = originalWindow;
  });

  it('registers ScrollTrigger and plays once on enter with the desktop variant', async () => {
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
      innerWidth: 1280,
      matchMedia: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
      })),
      removeEventListener: vi.fn(),
    });

    vi.doMock('../../src/lib/animations/stack/create-stack-intro', () => ({
      createStackIntro: create,
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

    const { root } = createStackRoot();
    const { initStackIntro } = await import('../../src/lib/animations/stack/init-stack-intro');

    const cleanup = initStackIntro(root as unknown as HTMLElement);

    expect(registerPlugin).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledWith(root, 'desktop');
    expect(createTrigger).toHaveBeenCalledTimes(1);
    expect(createTrigger.mock.calls[0]?.[0]).toMatchObject({ once: true, trigger: root });

    cleanup();

    expect(triggerKill).toHaveBeenCalledTimes(1);
  });

  it('selects the tablet variant inside the medium breakpoint range', async () => {
    const create = vi.fn(() => ({
      destroy: vi.fn(),
      play: vi.fn().mockResolvedValue(undefined),
      timeline: {},
    }));

    vi.stubGlobal('window', {
      addEventListener: vi.fn(),
      innerWidth: 900,
      matchMedia: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
      })),
      removeEventListener: vi.fn(),
    });

    vi.doMock('../../src/lib/animations/stack/create-stack-intro', () => ({
      createStackIntro: create,
    }));
    vi.doMock('gsap', () => ({
      gsap: {
        registerPlugin: vi.fn(),
      },
    }));
    vi.doMock('gsap/ScrollTrigger', () => ({
      ScrollTrigger: {
        create: vi.fn(() => ({ kill: vi.fn() })),
      },
    }));

    const { root } = createStackRoot();
    const { initStackIntro } = await import('../../src/lib/animations/stack/init-stack-intro');

    const cleanup = initStackIntro(root as unknown as HTMLElement);
    cleanup();

    expect(create).toHaveBeenCalledWith(root, 'tablet');
  });

  it('selects the mobile variant at or below the mobile breakpoint', async () => {
    const create = vi.fn(() => ({
      destroy: vi.fn(),
      play: vi.fn().mockResolvedValue(undefined),
      timeline: {},
    }));

    vi.stubGlobal('window', {
      addEventListener: vi.fn(),
      innerWidth: 768,
      matchMedia: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
      })),
      removeEventListener: vi.fn(),
    });

    vi.doMock('../../src/lib/animations/stack/create-stack-intro', () => ({
      createStackIntro: create,
    }));
    vi.doMock('gsap', () => ({
      gsap: {
        registerPlugin: vi.fn(),
      },
    }));
    vi.doMock('gsap/ScrollTrigger', () => ({
      ScrollTrigger: {
        create: vi.fn(() => ({ kill: vi.fn() })),
      },
    }));

    const { root } = createStackRoot();
    const { initStackIntro } = await import('../../src/lib/animations/stack/init-stack-intro');

    const cleanup = initStackIntro(root as unknown as HTMLElement);
    cleanup();

    expect(create).toHaveBeenCalledWith(root, 'mobile');
  });

  it('skips ScrollTrigger and controller in reduced motion', async () => {
    const create = vi.fn();
    const registerPlugin = vi.fn();
    const createTrigger = vi.fn();

    vi.stubGlobal('window', {
      addEventListener: vi.fn(),
      innerWidth: 1280,
      matchMedia: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
      })),
      removeEventListener: vi.fn(),
    });

    vi.doMock('../../src/lib/animations/stack/create-stack-intro', () => ({
      createStackIntro: create,
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

    const { root } = createStackRoot();
    const { initStackIntro } = await import('../../src/lib/animations/stack/init-stack-intro');

    const cleanup = initStackIntro(root as unknown as HTMLElement);
    cleanup();

    expect(registerPlugin).toHaveBeenCalledTimes(1);
    expect(create).not.toHaveBeenCalled();
    expect(createTrigger).not.toHaveBeenCalled();
    expect(root.dataset.stackIntroReveal).toBe('soft');
  });
});
