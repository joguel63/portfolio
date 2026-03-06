import { render, screen } from '@testing-library/react'
import Experience from './Experience'
import { experience } from '../../data/index.js'

describe('Experience', () => {
  it('renders the section heading', () => {
    render(<Experience />)
    expect(screen.getByRole('heading', { name: /experience/i })).toBeInTheDocument()
  })

  it('renders all experience items', () => {
    render(<Experience />)
    experience.forEach(({ company }) => {
      expect(screen.getByText(company)).toBeInTheDocument()
    })
  })

  it('renders roles for each experience', () => {
    render(<Experience />)
    experience.forEach(({ role }) => {
      expect(screen.getByText(role)).toBeInTheDocument()
    })
  })

  it('has a section with id="experience"', () => {
    render(<Experience />)
    expect(document.querySelector('#experience')).toBeInTheDocument()
  })
})
