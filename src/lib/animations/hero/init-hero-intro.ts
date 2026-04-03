import { resolveHeroMotionVariant } from './hero-motion-config';
import { enterPendingIntro, failOpenIntro, releaseIntro } from './hero-motion-state';

function triggerReducedMotionRevealStub(root: HTMLElement) {
  root.dataset.heroIntroReveal = 'soft';
}

export function initHeroIntro(root: HTMLElement) {
  try {
    enterPendingIntro();

    const variant = resolveHeroMotionVariant();

    if (variant === 'reduced') {
      releaseIntro();
      triggerReducedMotionRevealStub(root);
      return;
    }

    releaseIntro();
  } catch {
    failOpenIntro();
  }
}
