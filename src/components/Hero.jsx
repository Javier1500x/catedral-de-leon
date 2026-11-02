import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'


export default function Hero() {
  const heroRef = useRef(null)

  useEffect(() => {
    const hero = heroRef.current
    const background = hero?.querySelector('.hero-bg-image')
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!hero || !background || !finePointer || reducedMotion) return undefined

    let frame = 0
    let x = 0
    let y = 0
    const move = event => {
      if (event.pointerType !== 'mouse') return
      const bounds = hero.getBoundingClientRect()
      x = ((event.clientX - bounds.left) / bounds.width - 0.5) * -12
      y = ((event.clientY - bounds.top) / bounds.height - 0.5) * -8
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        background.style.transform = `scale(1.08) translate3d(${x}px, ${y}px, 0)`
        frame = 0
      })
    }
    const reset = () => {
      if (frame) window.cancelAnimationFrame(frame)
      frame = 0
      background.style.transform = 'scale(1.05) translate3d(0, 0, 0)'
    }

    hero.addEventListener('pointermove', move, { passive: true })
    hero.addEventListener('pointerleave', reset, { passive: true })
    return () => {
      hero.removeEventListener('pointermove', move)
      hero.removeEventListener('pointerleave', reset)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section id="inicio" ref={heroRef} className="hero-full">

      {/* Imagen de fondo */}
      <div
        className="hero-bg-image"
        style={{
          backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/1/18/Leon_Cathedral_2018.jpg')`,
        }}
        aria-hidden="true"
      />

      {/* Overlays de oscurecimiento */}
      <div className="hero-overlay-dark"     aria-hidden="true" />
      <div className="hero-overlay-bottom"   aria-hidden="true" />
      <div className="hero-overlay-vignette" aria-hidden="true" />
      <div className="hero-dot-overlay"      aria-hidden="true" />

      {/* Contenido principal */}
      <div className="hero-content">

        {/* Título */}
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="hero-title-light">Catedral</span>
          <span className="hero-title-gold">de León</span>
        </motion.h1>

        {/* Subtítulo auténtico */}
        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          Real e Insigne Basílica Catedral de la Asunción — León, Nicaragua
        </motion.p>

        {/* Botones CTA */}
        <motion.div
          className="hero-cta-group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
        >
          <button
            className="hero-btn-gold inline-flex items-center gap-2"
            onClick={() => document.querySelector('#historia')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span>Ver historia</span>
          </button>
          <button
            className="hero-btn-ghost inline-flex items-center gap-2"
            onClick={() => document.querySelector('#vista3d')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span>Explorar modelos 3D</span>
          </button>
        </motion.div>

        {/* Datos clave sin cajas pesadas */}
        <motion.div
          className="hero-stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <div className="hero-stat">
            <span className="hero-stat-value">1,790 m²</span>
            <span className="hero-stat-label">Área interior</span>
          </div>
          <div className="hero-stat-divider" aria-hidden="true" />
          <div className="hero-stat">
            <span className="hero-stat-value">1524</span>
            <span className="hero-stat-label">Año de origen</span>
          </div>
          <div className="hero-stat-divider" aria-hidden="true" />
          <div className="hero-stat">
            <span className="hero-stat-value">34</span>
            <span className="hero-stat-label">Cúpulas encaladas</span>
          </div>
        </motion.div>
      </div>

      {/* Indicador de scroll */}
      <motion.div
        className="hero-scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
      >
        <span className="hero-scroll-label">Desplazar</span>
        <motion.svg
          className="hero-scroll-arrows"
          viewBox="0 0 24 28"
          fill="none"
          aria-hidden="true"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="m5 7 7 7 7-7M5 14l7 7 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </motion.div>

    </section>
  )
}
