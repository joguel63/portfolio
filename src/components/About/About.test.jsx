import { render, screen } from '@testing-library/react'
import About from './About'
import { profile } from '../../data/index.js'

describe('About', () => {
  it('renders the section heading', () => {
    render(<About />)
    expect(screen.getByRole('heading', { name: /about/i })).toBeInTheDocument()
  })

  it('renders bio paragraphs', () => {
    render(<About />)
    expect(screen.getByText(profile.bio[0])).toBeInTheDocument()
  })

  it('renders tech stack items', () => {
    render(<About />)
    profile.techStack.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument()
    })
  })

  it('has a section with id="about"', () => {
    render(<About />)
    expect(document.querySelector('#about')).toBeInTheDocument()
  })

  it('section has scroll-margin and padding-top for mobile navbar clearance', () => {
    render(<About />)
    const section = document.getElementById('about')
    expect(section.className).toMatch(/scroll-mt-20/)
    expect(section.className).toMatch(/pt-20/)
  })
})
