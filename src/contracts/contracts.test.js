import { ANIMATION_IDS } from './animations.contract.js'
import { HERO_DEFAULTS } from './hero.contract.js'

describe('contracts', () => {
  it('ANIMATION_IDS exports expected keys', () => {
    expect(ANIMATION_IDS).toHaveProperty('HERO_ENTRANCE')
    expect(typeof ANIMATION_IDS.HERO_ENTRANCE).toBe('string')
  })

  it('HERO_DEFAULTS exports expected shape', () => {
    expect(HERO_DEFAULTS).toHaveProperty('canvasHeight')
    expect(HERO_DEFAULTS).toHaveProperty('boxColor')
  })
})
