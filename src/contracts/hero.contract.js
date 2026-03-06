/**
 * HERO COMPONENT CONTRACT
 *
 * This file defines the props interface and defaults for the Hero component.
 * - The UI layer (Hero.jsx) owns markup and layout.
 * - The Animations layer calls initHeroEntrance() from src/animations/.
 * - Neither layer accesses the other's internals directly.
 */

/** Default configuration values for the Hero component. */
export const HERO_DEFAULTS = Object.freeze({
  /** CSS height class applied to the hero section */
  canvasHeight: 'h-screen',
  /** Default color for the rotating 3D box */
  boxColor: 'orange',
  /** Duration in seconds for the entrance animation */
  entranceDuration: 1,
})

/**
 * Hero component props shape (JSDoc type for editors and agents).
 *
 * @typedef {Object} HeroProps
 * @property {string} [boxColor] - Override the box color. Defaults to HERO_DEFAULTS.boxColor.
 * @property {string} [canvasHeight] - Tailwind height class. Defaults to HERO_DEFAULTS.canvasHeight.
 * @property {number} [entranceDuration] - Entrance animation duration in seconds. Defaults to HERO_DEFAULTS.entranceDuration.
 * @property {string} [className] - Additional CSS classes for the section element.
 */
