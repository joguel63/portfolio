import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { createProjectsIntro } from './create-projects-intro';

const PROJECTS_REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const PROJECTS_DESKTOP_BREAKPOINT = 1024;
const PROJECTS_MOBILE_BREAKPOINT = 768;

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

  return window.matchMedia(PROJECTS_REDUCED_MOTION_QUERY).matches;
}

function resolveProjectsVariant() {
  if (typeof window === 'undefined') {
    return 'desktop' as const;
  }

  if (window.innerWidth <= PROJECTS_MOBILE_BREAKPOINT) {
    return 'mobile' as const;
  }

  if (window.innerWidth < PROJECTS_DESKTOP_BREAKPOINT) {
    return 'tablet' as const;
  }

  return 'desktop' as const;
}

function triggerReducedMotionRevealStub(root: HTMLElement) {
  root.dataset.projectsIntroReveal = 'soft';
}

export function initProjectsIntro(root: HTMLElement) {
  ensureScrollTriggerRegistered();

  if (prefersReducedMotion()) {
    triggerReducedMotionRevealStub(root);
    return () => {};
  }

  const controller = createProjectsIntro(root, resolveProjectsVariant());
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
