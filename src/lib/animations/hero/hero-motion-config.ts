export const HERO_MOBILE_BREAKPOINT = '(max-width: 48rem)';
export const HERO_REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export function resolveHeroMotionVariant() {
  if (window.matchMedia(HERO_REDUCED_MOTION_QUERY).matches) {
    return 'reduced';
  }

  if (window.matchMedia(HERO_MOBILE_BREAKPOINT).matches) {
    return 'mobile';
  }

  return 'desktop';
}
