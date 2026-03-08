import gsap from 'gsap'
import { ANIMATION_IDS } from '../contracts/animations.contract.js'

/**
 * Animates the Hero space scene entrance.
 * Fades in the canvas + slides title characters up from below with a blur.
 * @param {React.RefObject} heroRef - ref to the hero <section>
 * @returns {gsap.core.Timeline|null}
 */
export function initSpaceHeroEntrance(heroRef) {
  if (!heroRef?.current) return null

  const chars = heroRef.current.querySelectorAll('.hero-char')
  const fades = heroRef.current.querySelectorAll('.hero-fade')
  const canvas = heroRef.current.querySelector('canvas')

  const mm = gsap.matchMedia()

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.killTweensOf([...chars, ...fades, canvas].filter(Boolean))

    gsap.set(chars, { opacity: 0, y: 40, filter: 'blur(10px)' })
    gsap.set(fades, { opacity: 0, y: 20 })
    if (canvas) gsap.set(canvas, { opacity: 0 })

    const tl = gsap.timeline({ id: ANIMATION_IDS.HERO_ENTRANCE })

    if (canvas) {
      tl.to(canvas, { opacity: 1, duration: 2, ease: 'power2.out' }, 0)
    }
    tl.to(chars, { opacity: 1, y: 0, filter: 'blur(0px)', stagger: 0.03, duration: 1.2, ease: 'power3.out' }, 0.5)
    tl.to(fades, { opacity: 1, y: 0, stagger: 0.2, duration: 0.8, ease: 'power2.out' }, 1.2)
  })

  mm.add('(prefers-reduced-motion: reduce)', () => {
    gsap.set([...chars, ...fades, canvas].filter(Boolean), { opacity: 1, y: 0, filter: 'none' })
  })

  return mm
}
