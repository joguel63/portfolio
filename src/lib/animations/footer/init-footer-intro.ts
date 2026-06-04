import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { createFooterIntro } from './create-footer-intro';

const FOOTER_REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const FOOTER_MOBILE_BREAKPOINT = 768;

let scrollTriggerRegistered = false;

function ensureScrollTriggerRegistered() {
  if (scrollTriggerRegistered) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  scrollTriggerRegistered = true;
}

function prefersReducedMotion() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }

  return window.matchMedia(FOOTER_REDUCED_MOTION_QUERY).matches;
}

function resolveFooterVariant() {
  if (typeof window === 'undefined') {
    return 'desktop' as const;
  }

  if (window.innerWidth <= FOOTER_MOBILE_BREAKPOINT) {
    return 'mobile' as const;
  }

  return 'desktop' as const;
}

function triggerReducedMotionRevealStub(root: HTMLElement) {
  root.dataset.footerIntroReveal = 'soft';
}

export function initFooterIntro(root: HTMLElement) {
  ensureScrollTriggerRegistered();

  if (prefersReducedMotion()) {
    triggerReducedMotionRevealStub(root);
    return () => {};
  }

  const controller = createFooterIntro(root, resolveFooterVariant());
  const trigger = ScrollTrigger.create({
    once: true,
    onEnter: () => {
      void controller.play();
    },
    start: 'top 92%',
    trigger: root,
  });

  return () => {
    trigger.kill();
    controller.destroy();
  };
}
