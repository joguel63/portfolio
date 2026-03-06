import { lazy, Suspense } from 'react'
import Navbar from './components/Navbar/Navbar.jsx'
import Hero from './components/Hero.jsx'

const About = lazy(() => import('./components/About/About'))
const Experience = lazy(() => import('./components/Experience/Experience'))
const Projects = lazy(() => import('./components/Projects/Projects'))
const Contact = lazy(() => import('./components/Contact/Contact'))

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Suspense fallback={null}>
        <About />
        <Experience />
        <Projects />
        <Contact />
      </Suspense>
    </>
  )
}
