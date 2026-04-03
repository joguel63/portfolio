export type HeroMotionVariant = 'desktop' | 'mobile' | 'reduced';

export const HERO_MOBILE_BREAKPOINT = '(max-width: 48rem)';
export const HERO_REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export type HeroMotionProfile = {
  activeOrbitCount: number;
  ambientOrbitBaseDuration: number;
  ambientOrbitDurationStep: number;
  coreDuration: number;
  coreStartAlpha: number;
  coreStartScale: number;
  orbitSettleAngle: number;
  orbitSettleDuration: number;
  ringBaseDuration: number;
  ringDurationStep: number;
  ringStartScale: number;
  satelliteDuration: number;
  satelliteScale: number;
  satelliteStagger: number;
  scrollDuration: number;
  scrollOffset: number;
  textDuration: number;
  textOffset: number;
};

export const HERO_MOTION_PROFILES: Record<HeroMotionVariant, HeroMotionProfile> = {
  desktop: {
    activeOrbitCount: 3,
    ambientOrbitBaseDuration: 12,
    ambientOrbitDurationStep: 1.2,
    coreDuration: 0.24,
    coreStartAlpha: 0.2,
    coreStartScale: 0.55,
    orbitSettleAngle: 24,
    orbitSettleDuration: 0.3,
    ringBaseDuration: 0.22,
    ringDurationStep: 0.05,
    ringStartScale: 0.4,
    satelliteDuration: 0.3,
    satelliteScale: 0.5,
    satelliteStagger: 0.08,
    scrollDuration: 0.24,
    scrollOffset: 14,
    textDuration: 0.38,
    textOffset: 24,
  },
  mobile: {
    activeOrbitCount: 3,
    ambientOrbitBaseDuration: 10,
    ambientOrbitDurationStep: 1,
    coreDuration: 0.2,
    coreStartAlpha: 0.24,
    coreStartScale: 0.62,
    orbitSettleAngle: 16,
    orbitSettleDuration: 0.22,
    ringBaseDuration: 0.2,
    ringDurationStep: 0.04,
    ringStartScale: 0.48,
    satelliteDuration: 0.24,
    satelliteScale: 0.58,
    satelliteStagger: 0.06,
    scrollDuration: 0.22,
    scrollOffset: 10,
    textDuration: 0.32,
    textOffset: 18,
  },
  reduced: {
    activeOrbitCount: 0,
    ambientOrbitBaseDuration: 0,
    ambientOrbitDurationStep: 0,
    coreDuration: 0.16,
    coreStartAlpha: 0.72,
    coreStartScale: 0.9,
    orbitSettleAngle: 0,
    orbitSettleDuration: 0,
    ringBaseDuration: 0.14,
    ringDurationStep: 0.03,
    ringStartScale: 0.94,
    satelliteDuration: 0.16,
    satelliteScale: 0.92,
    satelliteStagger: 0.03,
    scrollDuration: 0.18,
    scrollOffset: 6,
    textDuration: 0.22,
    textOffset: 8,
  },
};

export function getHeroMotionProfile(variant: HeroMotionVariant) {
  return HERO_MOTION_PROFILES[variant];
}

export function resolveHeroMotionVariant() {
  if (window.matchMedia(HERO_REDUCED_MOTION_QUERY).matches) {
    return 'reduced';
  }

  if (window.matchMedia(HERO_MOBILE_BREAKPOINT).matches) {
    return 'mobile';
  }

  return 'desktop';
}
