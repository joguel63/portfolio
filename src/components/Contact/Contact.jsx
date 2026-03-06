import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { profile } from '../../data/index.js'

gsap.registerPlugin(ScrollTrigger)

const SOCIAL_LINKS = [
  {
    label: 'GitHub',
    href: (p) => p.social.github,
    icon: '⌥',
  },
  {
    label: 'LinkedIn',
    href: (p) => p.social.linkedin,
    icon: '◈',
  },
  {
    label: 'Email',
    href: (p) => `mailto:${p.email}`,
    icon: '◉',
  },
]

export default function Contact() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
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
    }, sectionRef)

    return () => ctx.revert()
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

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-12 justify-center contact-animate">
          <span
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

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 contact-animate">
          {SOCIAL_LINKS.map(({ label, href, icon }) => (
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
              <span>{icon}</span>
              {label}
            </a>
          ))}
        </div>

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
