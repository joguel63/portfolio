import { render, screen, fireEvent, within, act } from '@testing-library/react'
import { vi } from 'vitest'
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

  it('has scroll-mt-20 for navbar offset', () => {
    render(<Contact />)
    const section = document.querySelector('#contact')
    expect(section.className).toContain('scroll-mt-20')
  })

  it('renders the contact form', () => {
    render(<Contact />)
    const form = document.querySelector('form[aria-label="Formulario de contacto"]')
    expect(form).toBeInTheDocument()
  })

  it('renders name, email, and message inputs', () => {
    render(<Contact />)
    const form = document.querySelector('form[aria-label="Formulario de contacto"]')
    expect(within(form).getByLabelText('Nombre')).toBeInTheDocument()
    expect(within(form).getByLabelText('Email')).toBeInTheDocument()
    expect(within(form).getByLabelText('Mensaje')).toBeInTheDocument()
  })

  it('renders submit button', () => {
    render(<Contact />)
    expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument()
  })

  it('updates form fields on input change', () => {
    render(<Contact />)
    const form = document.querySelector('form[aria-label="Formulario de contacto"]')
    const nameInput = within(form).getByLabelText('Nombre')
    const emailInput = within(form).getByLabelText('Email')
    const messageInput = within(form).getByLabelText('Mensaje')

    fireEvent.change(nameInput, { target: { value: 'Miguel' } })
    fireEvent.change(emailInput, { target: { value: 'miguel@test.com' } })
    fireEvent.change(messageInput, { target: { value: 'Hola!' } })

    expect(nameInput.value).toBe('Miguel')
    expect(emailInput.value).toBe('miguel@test.com')
    expect(messageInput.value).toBe('Hola!')
  })

  it('shows success message after form submit', () => {
    const mockLocation = { href: '' }
    vi.stubGlobal('location', mockLocation)
    render(<Contact />)
    const form = document.querySelector('form[aria-label="Formulario de contacto"]')
    fireEvent.change(within(form).getByLabelText('Nombre'), { target: { value: 'Ana' } })
    fireEvent.change(within(form).getByLabelText('Email'), { target: { value: 'ana@x.com' } })
    fireEvent.change(within(form).getByLabelText('Mensaje'), { target: { value: 'Hola' } })
    fireEvent.submit(form)
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(mockLocation.href).toContain('mailto:')
    vi.unstubAllGlobals()
  })

  it('resets form and hides success message after 3s', async () => {
    vi.useFakeTimers()
    vi.stubGlobal('location', { href: '' })
    render(<Contact />)
    const form = document.querySelector('form[aria-label="Formulario de contacto"]')
    fireEvent.change(within(form).getByLabelText('Nombre'), { target: { value: 'Ana' } })
    fireEvent.change(within(form).getByLabelText('Email'), { target: { value: 'ana@x.com' } })
    fireEvent.change(within(form).getByLabelText('Mensaje'), { target: { value: 'Hola' } })
    fireEvent.submit(form)
    expect(screen.getByRole('status')).toBeInTheDocument()
    await act(async () => { vi.advanceTimersByTime(3000) })
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(within(form).getByLabelText('Nombre').value).toBe('')
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })
})
