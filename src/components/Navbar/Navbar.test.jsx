import { render, screen } from '@testing-library/react'
import Navbar from './Navbar'
import { profile } from '../../data/index.js'

describe('Navbar', () => {
  it('renders the developer name', () => {
    render(<Navbar />)
    expect(screen.getByText(profile.name)).toBeInTheDocument()
  })

  it('renders all navigation links', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /experience/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument()
  })
})
