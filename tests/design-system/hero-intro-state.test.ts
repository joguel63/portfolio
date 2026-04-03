import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type HeaderShim = {
  hasAttribute(name: string): boolean;
  removeAttribute(name: string): void;
  setAttribute(name: string, value: string): void;
};

type BodyShim = {
  dataset: Record<string, string | undefined>;
  querySelector(selector: string): HeaderShim | null;
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
      return selector === '.site-header' ? header : null;
    },
  };

  return { body, header, states };
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

  it('activateIntro is the only state that locks the header', async () => {
    const { body, header } = createBodyShim();
    const documentShim = { body };

    vi.stubGlobal('document', documentShim);

    const { activateIntro, enterPendingIntro, releaseIntro } = await import(
      '../../src/lib/animations/hero/hero-motion-state'
    );

    enterPendingIntro();
    expect(documentShim.body.dataset.heroIntroState).toBe('pending');
    expect(header.hasAttribute('inert')).toBe(false);

    activateIntro();
    expect(documentShim.body.dataset.heroIntroState).toBe('active');
    expect(header.hasAttribute('inert')).toBe(true);

    releaseIntro();
    expect(documentShim.body.dataset.heroIntroState).toBe('released');
    expect(header.hasAttribute('inert')).toBe(false);
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

    initHeroIntro({} as HTMLElement);

    expect(documentShim.body.dataset.heroIntroState).toBe('released');
    expect(states).toContain('pending');
    expect(states).not.toContain('active');
  });
});
