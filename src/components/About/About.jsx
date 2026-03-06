import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { profile } from '../../data/index.js'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-animate', {
        opacity: 0,
        y: 50,
        stagger: 0.15,
        duration: 0.8,
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
      id="about"
      ref={sectionRef}
      className="min-h-screen flex items-center py-24 px-6"
      style={{ backgroundColor: 'var(--color-bg-secondary)' }}
    >
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-12 about-animate">
          <span
            className="font-mono text-sm"
            style={{ color: 'var(--color-accent-cyan)' }}
          >
            01.
          </span>
          <h2
            className="font-display font-bold"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'var(--color-text-primary)' }}
          >
            About
          </h2>
          <div
            className="flex-1 h-px ml-4"
            style={{ backgroundColor: 'rgba(0,245,255,0.2)' }}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          <div className="space-y-4 about-animate">
            {profile.bio.map((paragraph, i) => (
              <p
                key={i}
                style={{ color: 'var(--color-text-muted)', lineHeight: 1.8 }}
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="about-animate">
            <p
              className="font-mono text-sm mb-6 uppercase tracking-widest"
              style={{ color: 'var(--color-accent-cyan)' }}
            >
              Tech Stack
            </p>
            <div className="flex flex-wrap gap-3">
              {profile.techStack.map(({ name, color }) => (
                <span
                  key={name}
                  className="font-mono text-sm px-3 py-1 rounded border transition-all duration-200"
                  style={{
                    borderColor: `${color}40`,
                    color: color,
                    backgroundColor: `${color}10`,
                  }}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
