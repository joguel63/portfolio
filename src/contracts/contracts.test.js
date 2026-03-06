import { ANIMATION_IDS } from './animations.contract.js'
import { HERO_DEFAULTS } from './hero.contract.js'

describe('contracts', () => {
  it('ANIMATION_IDS exports expected keys', () => {
    expect(ANIMATION_IDS).toHaveProperty('HERO_ENTRANCE')
    expect(typeof ANIMATION_IDS.HERO_ENTRANCE).toBe('string')
  })

  it('ANIMATION_IDS.HERO_ENTRANCE has the correct string value', () => {
    expect(ANIMATION_IDS.HERO_ENTRANCE).toBe('hero-entrance')
  })

  it('HERO_DEFAULTS exports expected shape', () => {
    expect(HERO_DEFAULTS).toHaveProperty('canvasHeight')
    expect(HERO_DEFAULTS).toHaveProperty('boxColor')
  })

  it('HERO_DEFAULTS exports expected shape and values', () => {
    expect(HERO_DEFAULTS).toHaveProperty('canvasHeight', 'h-screen')
    expect(HERO_DEFAULTS).toHaveProperty('boxColor', '#00f5ff')
    expect(HERO_DEFAULTS).toHaveProperty('entranceDuration', 1.2)
    expect(typeof HERO_DEFAULTS.entranceDuration).toBe('number')
  })

  it('contract objects are frozen', () => {
    expect(Object.isFrozen(ANIMATION_IDS)).toBe(true)
    expect(Object.isFrozen(HERO_DEFAULTS)).toBe(true)
  })
})
