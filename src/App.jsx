import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import IntroSplash from './components/IntroSplash'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import SectionGaleria from './components/SectionGaleria'
import SectionHistoria from './components/SectionHistoria'
import SectionArquitectura from './components/SectionArquitectura'
import SectionVista3D from './components/SectionVista3D'
import SectionVisita from './components/SectionVisita'
import SectionPatrimonio from './components/SectionPatrimonio'
import SectionRubenDario from './components/SectionRubenDario'
import SectionCuriosidades from './components/SectionCuriosidades'
import SectionLeon from './components/SectionLeon'
import Footer from './components/Footer'

export default function App() {
  const [introComplete, setIntroComplete] = useState(false)

  return (
    <>
      <AnimatePresence>
        {!introComplete && (
          <IntroSplash onComplete={() => setIntroComplete(true)} />
        )}
      </AnimatePresence>

      <div
        style={{
          opacity: introComplete ? 1 : 0,
          transition: 'opacity 0.8s ease',
          pointerEvents: introComplete ? 'auto' : 'none',
        }}
      >
        <Navbar />
        <main>
          <Hero />
          <SectionVisita />
          <SectionGaleria />
          <SectionHistoria />
          <SectionArquitectura />
          <SectionVista3D />
          <SectionPatrimonio />
          <SectionRubenDario />
          <SectionCuriosidades />
          <SectionLeon />
        </main>
        <Footer />
      </div>
    </>
  )
}
