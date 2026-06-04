import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { createContactIntro } from './create-contact-intro';

const CONTACT_REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const CONTACT_MOBILE_BREAKPOINT = 768;

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

  return window.matchMedia(CONTACT_REDUCED_MOTION_QUERY).matches;
}

function resolveContactVariant() {
  if (typeof window === 'undefined') {
    return 'desktop' as const;
  }

  if (window.innerWidth <= CONTACT_MOBILE_BREAKPOINT) {
    return 'mobile' as const;
  }

  return 'desktop' as const;
}

function triggerReducedMotionRevealStub(root: HTMLElement) {
  root.dataset.contactIntroReveal = 'soft';
}

export function initContactIntro(root: HTMLElement) {
  ensureScrollTriggerRegistered();

  if (prefersReducedMotion()) {
    triggerReducedMotionRevealStub(root);
    return () => {};
  }

  const controller = createContactIntro(root, resolveContactVariant());
  const trigger = ScrollTrigger.create({
    once: true,
    onEnter: () => {
      void controller.play();
    },
    start: 'top 72%',
    trigger: root,
  });

  return () => {
    trigger.kill();
    controller.destroy();
  };
}
