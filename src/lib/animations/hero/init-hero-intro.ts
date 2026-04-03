import { createHeroIntro } from './create-hero-intro';
import { resolveHeroMotionVariant } from './hero-motion-config';
import { activateIntro, enterPendingIntro, failOpenIntro, releaseIntro } from './hero-motion-state';

function registerTeardown(onTeardown: () => void) {
  if (typeof window.addEventListener !== 'function') {
    return () => {};
  }

  const events = ['pagehide', 'beforeunload'] as const;

  events.forEach((eventName) => {
    window.addEventListener(eventName, onTeardown, { once: true });
  });

  return () => {
    if (typeof window.removeEventListener !== 'function') {
      return;
    }

    events.forEach((eventName) => {
      window.removeEventListener(eventName, onTeardown);
    });
  };
}

function triggerReducedMotionRevealStub(root: HTMLElement) {
  root.dataset.heroIntroReveal = 'soft';
}

export async function initHeroIntro(root: HTMLElement) {
  let controller: ReturnType<typeof createHeroIntro> | null = null;
  let releaseTeardown = () => {};

  try {
    enterPendingIntro();

    const variant = resolveHeroMotionVariant();

    if (variant === 'reduced') {
      releaseIntro();
      triggerReducedMotionRevealStub(root);
      return;
    }

    controller = createHeroIntro(root, variant);

    const teardown = () => {
      controller?.destroy();
    };

    releaseTeardown = registerTeardown(teardown);

    activateIntro();
    await controller.play();
    releaseTeardown();
    releaseIntro();
  } catch {
    releaseTeardown();
    controller?.destroy();
    failOpenIntro();
  }
}
