import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type HeaderShim = {
  hasAttribute(name: string): boolean;
  removeAttribute(name: string): void;
  setAttribute(name: string, value: string): void;
};

type HeroAffordanceShim = HeaderShim;

type BodyShim = {
  dataset: Record<string, string | undefined>;
  querySelector(selector: string): HeaderShim | HeroAffordanceShim | null;
};

function createHeaderShim(): HeaderShim {
  const attributes = new Set<string>();

  return {
    hasAttribute(name) {
      return attributes.has(name);
    },
    removeAttribute(name) {
      attributes.delete(name);
    },
    setAttribute(name) {
      attributes.add(name);
    },
  };
}

function createBodyShim() {
  const states: string[] = [];
  const header = createHeaderShim();
  const scroll = createHeaderShim();
  const dataset = {} as Record<string, string | undefined>;

  Object.defineProperty(dataset, 'heroIntroState', {
    configurable: true,
    enumerable: true,
    get() {
      return states.at(-1);
    },
    set(value: string | undefined) {
      if (value === undefined) {
        return;
      }

      states.push(value);
    },
  });

  const body: BodyShim = {
    dataset,
    querySelector(selector) {
      if (selector === '.site-header') {
        return header;
      }

      if (selector === '[data-hero-scroll]') {
        return scroll;
      }

      return null;
    },
  };

  return { body, header, scroll, states };
}

describe('hero intro state lifecycle', () => {
  const originalDocument = globalThis.document;
  const originalWindow = globalThis.window;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    globalThis.document = originalDocument;
    globalThis.window = originalWindow;
  });

  it('failOpenIntro ends in released', async () => {
    const { body } = createBodyShim();
    const documentShim = { body };

    vi.stubGlobal('document', documentShim);

    const { failOpenIntro } = await import('../../src/lib/animations/hero/hero-motion-state');

    failOpenIntro();

    expect(documentShim.body.dataset.heroIntroState).toBe('released');
  });

  it('desktop lifecycle transitions pending to active to released', async () => {
    const { body, header, scroll } = createBodyShim();
    const documentShim = { body };

    vi.stubGlobal('document', documentShim);

    const { activateIntro, enterPendingIntro, releaseIntro } = await import(
      '../../src/lib/animations/hero/hero-motion-state'
    );

    enterPendingIntro();
    expect(documentShim.body.dataset.heroIntroState).toBe('pending');
    expect(header.hasAttribute('inert')).toBe(false);
    expect(scroll.hasAttribute('inert')).toBe(false);

    activateIntro();
    expect(documentShim.body.dataset.heroIntroState).toBe('active');
    expect(header.hasAttribute('inert')).toBe(true);
    expect(scroll.hasAttribute('inert')).toBe(true);

    releaseIntro();
    expect(documentShim.body.dataset.heroIntroState).toBe('released');
    expect(header.hasAttribute('inert')).toBe(false);
    expect(scroll.hasAttribute('inert')).toBe(false);
  });

  it('releaseIntro and failOpenIntro are idempotent', async () => {
    const { body, header, scroll, states } = createBodyShim();
    const documentShim = { body };

    vi.stubGlobal('document', documentShim);

    const { activateIntro, failOpenIntro, releaseIntro } = await import(
      '../../src/lib/animations/hero/hero-motion-state'
    );

    activateIntro();
    releaseIntro();
    releaseIntro();
    failOpenIntro();
    failOpenIntro();

    expect(documentShim.body.dataset.heroIntroState).toBe('released');
    expect(header.hasAttribute('inert')).toBe(false);
    expect(scroll.hasAttribute('inert')).toBe(false);
    expect(states.filter((state) => state === 'released')).toHaveLength(1);
  });

  it('initHeroIntro desktop orchestration activates, plays, and releases', async () => {
    const { body, states } = createBodyShim();
    const documentShim = { body };
    const play = vi.fn().mockResolvedValue(undefined);

    vi.stubGlobal('document', documentShim);
    vi.stubGlobal('window', {
      matchMedia: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
      })),
    });

    vi.doMock('../../src/lib/animations/hero/create-hero-intro', () => ({
      createHeroIntro: vi.fn(() => ({
        timeline: {},
        play,
        destroy: vi.fn(),
      })),
    }));

    const { initHeroIntro } = await import('../../src/lib/animations/hero/init-hero-intro');

    await initHeroIntro({} as HTMLElement);

    expect(play).toHaveBeenCalledTimes(1);
    expect(states).toEqual(['pending', 'active', 'released']);
  });

  it('initHeroIntro reduced-motion path never enters active', async () => {
    const { body, states } = createBodyShim();
    const documentShim = { body };
    const matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
    }));

    vi.stubGlobal('document', documentShim);
    vi.stubGlobal('window', { matchMedia });

    const { initHeroIntro } = await import('../../src/lib/animations/hero/init-hero-intro');

    await initHeroIntro({} as HTMLElement);

    expect(documentShim.body.dataset.heroIntroState).toBe('released');
    expect(states).toEqual(['pending', 'released']);
  });

  it('initHeroIntro fail-open path destroys the controller and releases', async () => {
    const { body, states } = createBodyShim();
    const documentShim = { body };
    const destroy = vi.fn();
    const play = vi.fn().mockRejectedValue(new Error('boom'));

    vi.stubGlobal('document', documentShim);
    vi.stubGlobal('window', {
      matchMedia: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
      })),
    });

    vi.doMock('../../src/lib/animations/hero/create-hero-intro', () => ({
      createHeroIntro: vi.fn(() => ({
        timeline: {},
        play,
        destroy,
      })),
    }));

    const { initHeroIntro } = await import('../../src/lib/animations/hero/init-hero-intro');

    await initHeroIntro({} as HTMLElement);

    expect(destroy).toHaveBeenCalledTimes(1);
    expect(states).toEqual(['pending', 'active', 'released']);
  });
});
