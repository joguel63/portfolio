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

  it('sets hero-char elements to opacity 0 before timeline', () => {
    const section = document.createElement('div')
    const char = document.createElement('span')
    char.className = 'hero-char'
    section.appendChild(char)
    initSpaceHeroEntrance({ current: section })
    expect(char.style.opacity).toBe('0')
  })

  it('sets canvas opacity to 0 when canvas is present', () => {
    const section = document.createElement('div')
    const canvas = document.createElement('canvas')
    section.appendChild(canvas)
    initSpaceHeroEntrance({ current: section })
    expect(canvas.style.opacity).toBe('0')
  })

  it('does not throw when canvas is absent', () => {
    const section = document.createElement('div')
    expect(() => initSpaceHeroEntrance({ current: section })).not.toThrow()
  })
})
