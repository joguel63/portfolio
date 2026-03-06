import gsap from 'gsap'

/**
 * Animates the hero section entrance.
 * @param {React.RefObject} heroRef - ref attached to the .hero element
 * @returns {gsap.core.Timeline}
 */
export function initHeroEntrance(heroRef) {
  const tl = gsap.timeline()
  if (heroRef?.current) {
    tl.from(heroRef.current, { opacity: 0, y: -20, duration: 1 })
  }
  return tl
}
