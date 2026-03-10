import { useEffect, useState, useCallback } from 'react'
import { profile } from '../../data/index.js'

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [active, setActive] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { threshold: 0.3, rootMargin: '-10% 0px -60% 0px' }
    )
    sections.forEach((s) => observer.observe(s))
    // One-time scan for sections already in viewport on load
    sections.forEach((s) => {
      const rect = s.getBoundingClientRect()
      if (rect.top >= 0 && rect.top <= window.innerHeight * 0.4) {
        setActive(s.id)
      }
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  const handleNavClick = useCallback((e, href) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) target.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? 'rgba(5, 5, 8, 0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0,245,255,0.1)' : 'none',
        }}
      >
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero')}
          className="font-display font-bold text-lg tracking-tight whitespace-nowrap"
          style={{ color: 'var(--color-accent-cyan)' }}
        >
          {profile.name}
        </a>

        <ul className="hidden md:flex gap-8 list-none">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                onClick={(e) => handleNavClick(e, href)}
                className="font-medium text-sm tracking-wide transition-colors duration-200"
                style={{
                  color: active === href.slice(1)
                    ? 'var(--color-accent-cyan)'
                    : 'var(--color-text-muted)',
                  fontFamily: 'var(--font-mono)',
                }}
                onMouseEnter={(e) => {
                  if (active !== href.slice(1)) {
                    e.currentTarget.style.color = 'var(--color-text-primary)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (active !== href.slice(1)) {
                    e.currentTarget.style.color = 'var(--color-text-muted)'
                  }
                }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="flex md:hidden items-center justify-center w-10 h-10 text-2xl"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
          style={{ color: 'var(--color-accent-cyan)' }}
        >
          {menuOpen ? '×' : '☰'}
        </button>
      </nav>

      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center"
          style={{ backgroundColor: 'rgba(5,5,8,0.96)' }}
        >
          <ul className="flex flex-col items-center gap-10 list-none">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={(e) => {
                    handleNavClick(e, href)
                    setMenuOpen(false)
                  }}
                  className="text-3xl font-medium tracking-wide transition-colors duration-200"
                  style={{
                    color: active === href.slice(1)
                      ? 'var(--color-accent-cyan)'
                      : 'var(--color-text-primary)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
