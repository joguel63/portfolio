/**
 * HERO COMPONENT CONTRACT
 *
 * This file defines the props interface and defaults for the Hero component.
 * - The UI layer (Hero.jsx) owns markup and layout.
 * - The Animations layer calls initHeroEntrance() from src/animations/.
 * - Neither layer accesses the other's internals directly.
 */

export const HERO_DEFAULTS = Object.freeze({
  canvasHeight: 'h-screen',
  boxColor: '#00f5ff',
  entranceDuration: 1.2,
  starsCount: 5000,
  starsRadius: 100,
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
