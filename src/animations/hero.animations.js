import gsap from 'gsap'
import { ANIMATION_IDS } from '../contracts/animations.contract.js'

/**
 * Animates the hero section entrance.
 * @param {React.RefObject<HTMLElement>} heroRef - ref attached to the .hero element
 * @returns {gsap.core.Timeline}
 * @see {import('../contracts/animations.contract.js').AnimationFn}
 */
export function initHeroEntrance(heroRef) {
  const tl = gsap.timeline({ id: ANIMATION_IDS.HERO_ENTRANCE })
  if (heroRef?.current) {
    tl.from(heroRef.current, { opacity: 0, y: -20, duration: 1 })
  }
  return tl
}
