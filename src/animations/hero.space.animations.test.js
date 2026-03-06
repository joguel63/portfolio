import { describe, it, expect } from 'vitest'
import { initSpaceHeroEntrance } from './hero.space.animations.js'

describe('initSpaceHeroEntrance', () => {
  it('is a function', () => {
    expect(typeof initSpaceHeroEntrance).toBe('function')
  })

  it('returns null gracefully when ref is null', () => {
    const result = initSpaceHeroEntrance(null)
    expect(result).toBeNull()
  })

  it('returns a GSAP timeline when ref has current', () => {
    const mockRef = { current: document.createElement('div') }
    const tl = initSpaceHeroEntrance(mockRef)
    expect(tl).not.toBeNull()
    expect(typeof tl.kill).toBe('function')
    tl.kill()
  })
})
