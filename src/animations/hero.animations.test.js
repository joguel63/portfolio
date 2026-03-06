import { initHeroEntrance } from './hero.animations.js'

describe('hero animations', () => {
  it('exports initHeroEntrance function', () => {
    expect(typeof initHeroEntrance).toBe('function')
  })

  it('initHeroEntrance returns a GSAP timeline with one tween', () => {
    const fakeRef = { current: { style: {} } }
    const tl = initHeroEntrance(fakeRef)
    expect(tl).toBeDefined()
    expect(typeof tl.kill).toBe('function')
    expect(tl.getChildren().length).toBe(1)
  })

  it('initHeroEntrance returns an empty timeline when ref is null', () => {
    const tl = initHeroEntrance(null)
    expect(tl).toBeDefined()
    expect(tl.getChildren().length).toBe(0)
  })
})
