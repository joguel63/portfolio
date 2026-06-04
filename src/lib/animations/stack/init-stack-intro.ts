import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { createStackIntro } from './create-stack-intro';

const STACK_REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const STACK_DESKTOP_BREAKPOINT = 1024;
const STACK_MOBILE_BREAKPOINT = 768;

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

  return window.matchMedia(STACK_REDUCED_MOTION_QUERY).matches;
}

function resolveStackVariant() {
  if (typeof window === 'undefined') {
    return 'desktop' as const;
  }

  if (window.innerWidth <= STACK_MOBILE_BREAKPOINT) {
    return 'mobile' as const;
  }

  if (window.innerWidth < STACK_DESKTOP_BREAKPOINT) {
    return 'tablet' as const;
  }

  return 'desktop' as const;
}

function triggerReducedMotionRevealStub(root: HTMLElement) {
  root.dataset.stackIntroReveal = 'soft';
}

export function initStackIntro(root: HTMLElement) {
  ensureScrollTriggerRegistered();

  if (prefersReducedMotion()) {
    triggerReducedMotionRevealStub(root);
    return () => {};
  }

  const controller = createStackIntro(root, resolveStackVariant());
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
