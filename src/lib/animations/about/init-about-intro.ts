import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { createAboutIntro } from './create-about-intro';

const ABOUT_REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

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

  return window.matchMedia(ABOUT_REDUCED_MOTION_QUERY).matches;
}

function triggerReducedMotionRevealStub(root: HTMLElement) {
  root.dataset.aboutIntroReveal = 'soft';
}

export function initAboutIntro(root: HTMLElement) {
  ensureScrollTriggerRegistered();

  if (prefersReducedMotion()) {
    triggerReducedMotionRevealStub(root);
    return () => {};
  }

  const controller = createAboutIntro(root, 'desktop');
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
