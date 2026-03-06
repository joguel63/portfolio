import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import gsap from 'gsap'

function Box() {
  const ref = useRef()
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.01
  })
  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

export default function Hero() {
  useEffect(() => {
    const tl = gsap.timeline()
    tl.from('.hero', { opacity: 0, y: -20, duration: 1 })
    return () => tl.kill()
  }, [])

  return (
    <section className="hero h-screen">
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box />
      </Canvas>
    </section>
  )
}
