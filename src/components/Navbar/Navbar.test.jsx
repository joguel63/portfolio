import { render, screen, fireEvent } from '@testing-library/react'
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

  it('hamburger button is not visible on desktop (has md:hidden class)', () => {
    render(<Navbar />)
    const button = screen.getByRole('button', { name: /open menu/i })
    expect(button.className).toMatch(/md:hidden/)
  })

  it('hamburger button opens the mobile drawer', () => {
    render(<Navbar />)
    const button = screen.getByRole('button', { name: /open menu/i })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    fireEvent.click(button)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /close menu/i })).toBeInTheDocument()
  })

  it('mobile drawer closes when a nav link is clicked', () => {
    render(<Navbar />)
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    const drawerLinks = screen.getAllByRole('link', { name: /about/i })
    fireEvent.click(drawerLinks[drawerLinks.length - 1])
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('mobile drawer closes on Escape key', () => {
    render(<Navbar />)
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
