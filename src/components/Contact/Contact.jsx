import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { profile } from '../../data/index.js'

gsap.registerPlugin(ScrollTrigger)

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
)

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const EmailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)

const SOCIAL_LINKS = [
  { label: 'GitHub',   href: (p) => p.social.github,          Icon: GitHubIcon },
  { label: 'LinkedIn', href: (p) => p.social.linkedin,         Icon: LinkedInIcon },
  { label: 'Email',    href: (p) => `mailto:${p.email}`,       Icon: EmailIcon },
]

export default function Contact() {
  const sectionRef = useRef(null)
  const resetTimerRef = useRef(null)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const subject = encodeURIComponent(`Contacto desde portfolio: ${formData.name}`)
    const body = encodeURIComponent(`Nombre: ${formData.name}\nEmail: ${formData.email}\n\nMensaje:\n${formData.message}`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
    setSubmitted(true)
    clearTimeout(resetTimerRef.current)
    resetTimerRef.current = setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', message: '' })
    }, 3000)
  }

  const inputStyle = (field) => ({
    width: '100%',
    backgroundColor: 'rgba(0,245,255,0.03)',
    border: `1px solid ${focusedField === field ? 'var(--color-accent-cyan)' : 'rgba(0,245,255,0.2)'}`,
    borderRadius: '0.5rem',
    padding: '0.75rem 1rem',
    color: 'var(--color-text-primary)',
    outline: 'none',
    fontFamily: 'inherit',
    fontSize: '0.875rem',
  })

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.contact-animate', {
          opacity: 0,
          y: 40,
          stagger: 0.2,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        })
      })
    }, sectionRef)

    return () => {
      ctx.revert()
      clearTimeout(resetTimerRef.current)
    }
  }, [])

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center py-24 px-6 relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,245,255,0.04) 0%, rgba(139,92,246,0.04) 50%, transparent 70%)',
          animation: 'pulse 4s ease-in-out infinite',
        }}
      />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
      `}</style>

      <div className="relative z-10 text-center max-w-2xl mx-auto" style={{ maxWidth: '42rem', margin: '0 auto', width: '100%' }}>
        <div className="flex items-center gap-4 mb-12 justify-center contact-animate">
          <span
            aria-hidden="true"
            className="font-mono text-sm"
            style={{ color: 'var(--color-accent-cyan)' }}
          >
            04.
          </span>
          <h2
            className="font-display font-bold"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'var(--color-text-primary)' }}
          >
            Contact
          </h2>
        </div>

        <p
          className="font-display text-2xl font-semibold mb-4 contact-animate"
          style={{ color: 'var(--color-text-primary)' }}
        >
          ¿Tienes un proyecto en mente?
        </p>
        <p
          className="mb-12 contact-animate"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Estoy disponible para proyectos freelance, colaboraciones y nuevas oportunidades.
          No dudes en contactarme.
        </p>

        <form
          aria-label="Formulario de contacto"
          onSubmit={handleSubmit}
          className="w-full mb-12 contact-animate"
          style={{ textAlign: 'left' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="contact-name" className="font-mono text-xs mb-2 block" style={{ color: 'var(--color-text-muted)' }}>
                Nombre
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                placeholder="Tu nombre"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                style={inputStyle('name')}
                className="font-mono text-sm"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="font-mono text-xs mb-2 block" style={{ color: 'var(--color-text-muted)' }}>
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                style={inputStyle('email')}
                className="font-mono text-sm"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="contact-message" className="font-mono text-xs mb-2 block" style={{ color: 'var(--color-text-muted)' }}>
              Mensaje
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={5}
              placeholder="Cuéntame sobre tu proyecto..."
              value={formData.message}
              onChange={handleChange}
              onFocus={() => setFocusedField('message')}
              onBlur={() => setFocusedField(null)}
              style={{ ...inputStyle('message'), resize: 'vertical' }}
              className="font-mono text-sm"
            />
          </div>

          {submitted ? (
            <p role="status" className="font-mono text-sm" style={{ color: 'var(--color-accent-cyan)' }}>
              ¡Mensaje preparado! Se abrirá tu cliente de correo.
            </p>
          ) : (
            <button
              type="submit"
              aria-label="Enviar mensaje por correo"
              className="px-8 py-4 rounded-lg border font-mono text-sm font-medium transition-all duration-300"
              style={{
                borderColor: 'rgba(0,245,255,0.2)',
                color: 'var(--color-text-primary)',
                backgroundColor: 'rgba(0,245,255,0.03)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-accent-cyan)'
                e.currentTarget.style.color = 'var(--color-accent-cyan)'
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0,245,255,0.2)'
                e.currentTarget.style.backgroundColor = 'rgba(0,245,255,0.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0,245,255,0.2)'
                e.currentTarget.style.color = 'var(--color-text-primary)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.backgroundColor = 'rgba(0,245,255,0.03)'
              }}
            >
              Enviar mensaje
            </button>
          )}
        </form>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap contact-animate">
          {SOCIAL_LINKS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href(profile)}
              target={label !== 'Email' ? '_blank' : undefined}
              rel="noreferrer"
              aria-label={label}
              className="flex items-center gap-3 px-8 py-4 rounded-lg border font-mono text-sm font-medium w-full sm:w-auto justify-center transition-all duration-300"
              style={{
                borderColor: 'rgba(0,245,255,0.2)',
                color: 'var(--color-text-primary)',
                backgroundColor: 'rgba(0,245,255,0.03)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-accent-cyan)'
                e.currentTarget.style.color = 'var(--color-accent-cyan)'
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0,245,255,0.2)'
                e.currentTarget.style.backgroundColor = 'rgba(0,245,255,0.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0,245,255,0.2)'
                e.currentTarget.style.color = 'var(--color-text-primary)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.backgroundColor = 'rgba(0,245,255,0.03)'
              }}
            >
              <Icon />
              {label}
            </a>
          ))}
        </div>

        <p
          className="mt-4 contact-animate font-mono text-xs"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {profile.email}
        </p>

        <p
          className="mt-16 contact-animate font-mono text-xs"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Diseñado y desarrollado con React + Three.js
        </p>
      </div>
    </section>
  )
}
