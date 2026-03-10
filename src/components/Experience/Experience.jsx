import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { experience } from '../../data/index.js'

gsap.registerPlugin(ScrollTrigger)

function ExperienceCard({ item, index }) {
  const isLeft = index % 2 === 0

  return (
    <div
      className={`experience-card relative flex ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-start gap-8 mb-16`}
      style={{ gap: '2rem', marginBottom: '4rem' }}
    >
      <div
        aria-hidden="true"
        className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center justify-center w-4 h-4 rounded-full border-2 mt-2"
        style={{
          borderColor: 'var(--color-accent-cyan)',
          backgroundColor: 'var(--color-bg-primary)',
          boxShadow: '0 0 12px rgba(0,245,255,0.5)',
          transform: 'translateX(-50%)',
          width: '1rem',
          height: '1rem',
        }}
      />

      <div
        className="w-full md:w-5/12 p-6 rounded-lg border"
        style={{
          backgroundColor: 'rgba(13,13,20,0.8)',
          borderColor: 'rgba(0,245,255,0.15)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3
              className="font-display font-semibold text-lg"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {item.role}
            </h3>
            <p
              className="font-medium"
              style={{ color: 'var(--color-accent-cyan)' }}
            >
              {item.company}
            </p>
          </div>
          <time
            className="font-mono text-xs ml-4 whitespace-nowrap"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {item.period}
          </time>
        </div>

        <p
          className="text-sm mb-4"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {item.description}
        </p>

        <ul className="space-y-1 mb-4">
          {item.achievements.map((ach, i) => (
            <li
              key={i}
              className="text-sm flex gap-2"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <span style={{ color: 'var(--color-accent-cyan)' }}>▸</span>
              {ach}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2">
          {item.tech.map((t) => (
            <span
              key={t}
              className="font-mono text-xs px-2 py-0.5 rounded"
              style={{
                backgroundColor: 'rgba(139,92,246,0.15)',
                color: 'var(--color-accent-purple)',
                border: '1px solid rgba(139,92,246,0.3)',
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Experience() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.from('.experience-card', {
          opacity: 0,
          x: (i) => (i % 2 === 0 ? -60 : 60),
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        })
      })

      mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.from('.experience-card', {
          opacity: 0,
          y: 20,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="experience"
      ref={sectionRef}
      aria-labelledby="experience-heading"
      className="min-h-screen py-24 px-6 scroll-mt-20 pt-20"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      <div className="max-w-5xl mx-auto" style={{ maxWidth: '64rem', margin: '0 auto', width: '100%' }}>
        <div className="flex items-center gap-4 mb-16">
          <span
            aria-hidden="true"
            className="font-mono text-sm"
            style={{ color: 'var(--color-accent-cyan)' }}
          >
            02.
          </span>
          <h2
            id="experience-heading"
            className="font-display font-bold"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'var(--color-text-primary)' }}
          >
            Experience
          </h2>
          <div
            className="flex-1 h-px ml-4"
            style={{ backgroundColor: 'rgba(0,245,255,0.2)', flexGrow: 1 }}
          />
        </div>

        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block"
            style={{ backgroundColor: 'rgba(0,245,255,0.15)' }}
          />
          {experience.map((item, index) => (
            <ExperienceCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
