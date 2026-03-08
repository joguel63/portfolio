import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { initSpaceHeroEntrance } from '../animations/hero.space.animations.js'
import { profile } from '../data/index.js'

function SpaceScene({ scrollProgressRef }) {
  const starsGroupRef = useRef()

  useFrame((_, delta) => {
    if (!starsGroupRef.current) return
    const speed = 0.03 + (scrollProgressRef.current || 0) * 0.8
    starsGroupRef.current.rotation.y += delta * speed
    starsGroupRef.current.rotation.x += delta * speed * 0.1
  })

  return (
    <group ref={starsGroupRef}>
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0.2}
        fade
      />
      <fog attach="fog" args={['#050508', 80, 200]} />
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#00f5ff" distance={50} />
    </group>
  )
}

function SplitText({ text, className }) {
  const chars = useMemo(() => [...text], [text])
  return (
    <span className={className}>
      {chars.map((char, i) => (
        <span key={i} className="hero-char inline-block">
          {char === ' ' ? '\u00a0' : char}
        </span>
      ))}
    </span>
  )
}

export default function Hero() {
  const heroRef = useRef(null)
  const scrollProgressRef = useRef(0)
  const animationTlRef = useRef(null)

  useEffect(() => {
    return () => animationTlRef.current?.revert()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = heroRef.current?.offsetHeight || window.innerHeight
      scrollProgressRef.current = Math.min(window.scrollY / heroHeight, 1)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      <div className="absolute inset-0" style={{ width: '100%', height: '100%' }}>
        <Canvas
          camera={{ position: [0, 0, 1], fov: 75 }}
          style={{ background: 'transparent', width: '100%', height: '100%' }}
          onCreated={() => {
            animationTlRef.current = initSpaceHeroEntrance(heroRef)
          }}
        >
          <SpaceScene scrollProgressRef={scrollProgressRef} />
        </Canvas>
      </div>

      <div className="relative z-10 text-center px-6 select-none">
        <p
          className="hero-fade font-mono text-sm mb-4 tracking-widest uppercase"
          style={{ color: 'var(--color-accent-cyan)' }}
        >
          Hola, soy
        </p>

        <h1
          className="font-display font-bold leading-none mb-4"
          style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', color: 'var(--color-text-primary)' }}
        >
          <SplitText text={profile.name} />
        </h1>

        <h2
          className="hero-fade font-display font-medium mb-6"
          style={{
            fontSize: 'clamp(1.2rem, 3vw, 2rem)',
            color: 'var(--color-accent-purple)',
          }}
        >
          {profile.title}
        </h2>

        <p
          className="hero-fade max-w-xl mx-auto mb-10 text-base"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {profile.tagline}
        </p>

        <a
          href="#projects"
          onClick={(e) => {
            e.preventDefault()
            document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="hero-fade inline-block font-mono text-sm font-medium px-8 py-3 rounded border transition-all duration-300"
          style={{
            borderColor: 'var(--color-accent-cyan)',
            color: 'var(--color-accent-cyan)',
            boxShadow: '0 0 20px rgba(0,245,255,0.2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0,245,255,0.1)'
            e.currentTarget.style.boxShadow = '0 0 30px rgba(0,245,255,0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.boxShadow = '0 0 20px rgba(0,245,255,0.2)'
          }}
        >
          Ver proyectos →
        </a>
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hero-fade flex flex-col items-center gap-2"
        style={{ color: 'var(--color-text-muted)' }}
      >
        <span className="font-mono text-xs tracking-widest uppercase">scroll</span>
        <div
          className="w-px h-12 origin-top animate-pulse"
          style={{ backgroundColor: 'var(--color-accent-cyan)' }}
        />
      </div>
    </section>
  )
}
