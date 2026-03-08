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

  // Set initial states BEFORE creating the timeline
  gsap.set(heroRef.current.querySelectorAll('.hero-char'), { opacity: 0 })
  gsap.set(heroRef.current.querySelectorAll('.hero-fade'), { opacity: 0 })
  const canvas = heroRef.current.querySelector('canvas')
  if (canvas) gsap.set(canvas, { opacity: 0 })

  const tl = gsap.timeline({ id: ANIMATION_IDS.HERO_ENTRANCE })

  tl.from(heroRef.current.querySelector('canvas'), {
    opacity: 0,
    duration: 2,
    ease: 'power2.out',
  }, 0)

  tl.from(heroRef.current.querySelectorAll('.hero-char'), {
    opacity: 0,
    y: 40,
    filter: 'blur(10px)',
    stagger: 0.03,
    duration: 1.2,
    ease: 'power3.out',
  }, 0.5)

  tl.from(heroRef.current.querySelectorAll('.hero-fade'), {
    opacity: 0,
    y: 20,
    stagger: 0.2,
    duration: 0.8,
    ease: 'power2.out',
  }, 1.2)

  return tl
}
