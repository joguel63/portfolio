import { initHeroEntrance } from './hero.animations.js'

describe('hero animations', () => {
  it('exports initHeroEntrance function', () => {
    expect(typeof initHeroEntrance).toBe('function')
  })

  it('initHeroEntrance returns a GSAP timeline', () => {
    const fakeRef = { current: { style: {} } }
    const tl = initHeroEntrance(fakeRef)
    expect(tl).toBeDefined()
    expect(typeof tl.kill).toBe('function')
  })
})
