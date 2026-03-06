import { lazy, Suspense } from 'react'
import Navbar from './components/Navbar/Navbar.jsx'
import Hero from './components/Hero.jsx'

const About = lazy(() => import('./components/About/About'))

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Suspense fallback={null}>
        <About />
      </Suspense>
    </>
  )
}
