import { render, screen } from '@testing-library/react'
import Contact from './Contact'
import { profile } from '../../data/index.js'

describe('Contact', () => {
  it('renders the section heading', () => {
    render(<Contact />)
    expect(screen.getByRole('heading', { name: /contact/i })).toBeInTheDocument()
  })

  it('renders the GitHub link', () => {
    render(<Contact />)
    const link = screen.getByRole('link', { name: /github/i })
    expect(link).toHaveAttribute('href', profile.social.github)
  })

  it('renders the LinkedIn link', () => {
    render(<Contact />)
    const link = screen.getByRole('link', { name: /linkedin/i })
    expect(link).toHaveAttribute('href', profile.social.linkedin)
  })

  it('renders the email link', () => {
    render(<Contact />)
    const link = screen.getByRole('link', { name: /email/i })
    expect(link).toHaveAttribute('href', `mailto:${profile.email}`)
  })

  it('has a section with id="contact"', () => {
    render(<Contact />)
    expect(document.querySelector('#contact')).toBeInTheDocument()
  })
})
