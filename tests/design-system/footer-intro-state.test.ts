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

function createFooterRoot() {
  const content = new ElementShim();
  const line = new ElementShim();
  const links = [new ElementShim(), new ElementShim(), new ElementShim()];

  const root = new ElementShim(
    new Map([
      ['[data-footer-content]', [content]],
      ['[data-footer-line]', [line]],
      ['[data-footer-link]', links],
    ]),
  );

  return { content, line, links, root };
}

describe('footer intro controller', () => {
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

    const { root } = createFooterRoot();
    const { createFooterIntro } = await import('../../src/lib/animations/footer/create-footer-intro');

    const controller = createFooterIntro(root as unknown as HTMLElement, 'desktop');
    const playPromise = controller.play();

    await expect(playPromise).resolves.toBeUndefined();
    controller.destroy();

    expect(controller.timeline).toBe(timeline);
    expect(timeline.restart).toHaveBeenCalledTimes(1);
    expect(kill).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalled();
    expect(fromTo).toHaveBeenCalled();
  });

  it('does not leave the content wrapper hidden while animating links', async () => {
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

    const { root, content } = createFooterRoot();
    const { createFooterIntro } = await import('../../src/lib/animations/footer/create-footer-intro');

    createFooterIntro(root as unknown as HTMLElement, 'desktop');

    expect(
      set.mock.calls.some(
        ([target]) => target === content || (Array.isArray(target) && target.includes(content)),
      ),
    ).toBe(false);
  });

  it('throws when a required footer selector is missing', async () => {
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

    const { createFooterIntro } = await import('../../src/lib/animations/footer/create-footer-intro');

    expect(() => createFooterIntro(root as unknown as HTMLElement, 'desktop')).toThrow(
      'Missing footer intro element for selector: [data-footer-content]',
    );
  });
});

describe('footer intro runtime', () => {
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
      innerWidth: 1440,
      matchMedia: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
      })),
      removeEventListener: vi.fn(),
    });

    vi.doMock('../../src/lib/animations/footer/create-footer-intro', () => ({
      createFooterIntro: create,
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

    const { root } = createFooterRoot();
    const { initFooterIntro } = await import('../../src/lib/animations/footer/init-footer-intro');

    const cleanup = initFooterIntro(root as unknown as HTMLElement);

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
      innerWidth: 1440,
      matchMedia: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
      })),
      removeEventListener: vi.fn(),
    });

    vi.doMock('../../src/lib/animations/footer/create-footer-intro', () => ({
      createFooterIntro: create,
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

    const { root } = createFooterRoot();
    const { initFooterIntro } = await import('../../src/lib/animations/footer/init-footer-intro');

    const cleanup = initFooterIntro(root as unknown as HTMLElement);
    cleanup();

    expect(registerPlugin).toHaveBeenCalledTimes(1);
    expect(create).not.toHaveBeenCalled();
    expect(createTrigger).not.toHaveBeenCalled();
    expect(root.dataset.footerIntroReveal).toBe('soft');
  });
});
