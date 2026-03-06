import { render, screen } from '@testing-library/react'
import Projects from './Projects'
import { projects } from '../../data/index.js'

describe('Projects', () => {
  it('renders the section heading', () => {
    render(<Projects />)
    expect(screen.getByRole('heading', { name: /projects/i })).toBeInTheDocument()
  })

  it('renders all project titles', () => {
    render(<Projects />)
    projects.forEach(({ title }) => {
      expect(screen.getByText(title)).toBeInTheDocument()
    })
  })

  it('renders GitHub links', () => {
    render(<Projects />)
    const ghLinks = screen.getAllByRole('link', { name: /github/i })
    expect(ghLinks.length).toBeGreaterThan(0)
  })

  it('has a section with id="projects"', () => {
    render(<Projects />)
    expect(document.querySelector('#projects')).toBeInTheDocument()
  })
})
