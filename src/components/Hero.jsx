import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { initHeroEntrance } from '../animations/index.js'
import { HERO_DEFAULTS } from '../contracts/hero.contract.js'

function Box({ color = HERO_DEFAULTS.boxColor }) {
  const ref = useRef()
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.01
  })
  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

export default function Hero({ boxColor, className = '' }) {
  const heroRef = useRef(null)

  useEffect(() => {
    const tl = initHeroEntrance(heroRef)
    return () => tl.kill()
  }, [])

  return (
    <section ref={heroRef} className={[HERO_DEFAULTS.canvasHeight, className].filter(Boolean).join(' ')}>
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box color={boxColor} />
      </Canvas>
    </section>
  )
}
