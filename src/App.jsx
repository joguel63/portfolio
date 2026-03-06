import { lazy, Suspense } from 'react'
import Hero from './components/Hero.jsx'

const About = lazy(() => import('./components/About/About'))

export default function App() {
  return (
    <>
      <Hero />
      <Suspense fallback={null}>
        <About />
      </Suspense>
    </>
  )
}
