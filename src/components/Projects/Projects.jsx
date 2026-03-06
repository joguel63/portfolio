import { useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../../data/index.js'

gsap.registerPlugin(ScrollTrigger)

function ProjectCard({ project }) {
  const cardRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    gsap.to(card, {
      rotateY: x * 10,
      rotateX: -y * 10,
      duration: 0.3,
      ease: 'power2.out',
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)',
    })
  }, [])

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="project-card p-6 rounded-lg border flex flex-col group"
      style={{
        backgroundColor: 'rgba(13,13,20,0.8)',
        borderColor: 'rgba(0,245,255,0.15)',
        transformStyle: 'preserve-3d',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0,245,255,0.5)'
        e.currentTarget.style.boxShadow = '0 0 25px rgba(0,245,255,0.15)'
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <span
          className="font-mono text-2xl"
          style={{ color: 'var(--color-accent-cyan)' }}
        >
          ⬡
        </span>
        <div className="flex gap-4">
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="font-mono text-xs transition-colors duration-200"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-accent-cyan)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)' }}
          >
            GitHub ↗
          </a>
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              aria-label="Live demo"
              className="font-mono text-xs transition-colors duration-200"
              style={{ color: 'var(--color-text-muted)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-accent-cyan)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)' }}
            >
              Live ↗
            </a>
          )}
        </div>
      </div>

      <h3
        className="font-display font-semibold text-lg mb-2"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {project.title}
      </h3>

      <p
        className="text-sm mb-4 flex-1"
        style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}
      >
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {project.tech.map((t) => (
          <span
            key={t}
            className="font-mono text-xs"
            style={{ color: 'var(--color-accent-purple)' }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Projects() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.project-card', {
        opacity: 0,
        y: 40,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="min-h-screen py-24 px-6"
      style={{ backgroundColor: 'var(--color-bg-secondary)' }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-16">
          <span
            className="font-mono text-sm"
            style={{ color: 'var(--color-accent-cyan)' }}
          >
            03.
          </span>
          <h2
            className="font-display font-bold"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'var(--color-text-primary)' }}
          >
            Projects
          </h2>
          <div
            className="flex-1 h-px ml-4"
            style={{ backgroundColor: 'rgba(0,245,255,0.2)' }}
          />
        </div>

        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
