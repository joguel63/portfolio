/**
 * ANIMATIONS LAYER CONTRACT
 *
 * This file defines the public interface of the Animations layer.
 * - The UI layer calls functions from src/animations/ using these IDs.
 * - The Animations layer owns all logic inside src/animations/.
 * - Never write GSAP or Three.js logic directly in component files.
 */

/** Named identifiers for GSAP timelines. Use these as keys, never magic strings. */
export const ANIMATION_IDS = Object.freeze({
  /** Hero section entrance animation (fade + slide from top) */
  HERO_ENTRANCE: 'hero-entrance',
})

/**
 * Signature contract for animation functions.
 * Every function in src/animations/ must match this shape:
 *
 * @typedef {function(React.RefObject): gsap.core.Timeline} AnimationFn
 */
