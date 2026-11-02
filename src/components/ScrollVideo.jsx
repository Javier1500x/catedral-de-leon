import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/**
 * ScrollVideo — Sección con video pag.mp4 controlado por scroll.
 * El wrapper es 300vh de alto; el video queda sticky y avanza/retrocede
 * exactamente según cuánto ha bajado el usuario.
 */
export default function ScrollVideo() {
  const wrapperRef = useRef(null)
  const videoRef   = useRef(null)

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end start'],
  })

  // Conectar progreso de scroll → currentTime del video
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.pause()
    video.currentTime = 0

    const unsub = scrollYProgress.on('change', (progress) => {
      if (!video.duration || isNaN(video.duration)) return
      video.currentTime = progress * video.duration
    })

    return () => unsub()
  }, [scrollYProgress])

  // Opacidad del texto UI: desaparece al final del scroll
  const uiOpacity = useTransform(scrollYProgress, [0, 0.08, 0.92, 1], [0, 1, 1, 0])
  // Barra de progreso
  const barWidth  = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <div
      ref={wrapperRef}
      style={{ height: '300vh', position: 'relative', background: '#000' }}
    >
      {/* Panel sticky */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {/* ── Video a pantalla completa ── */}
        <video
          ref={videoRef}
          src="https://javier1500x.github.io/Educ-In/pag.mp4"
          muted
          playsInline
          preload="auto"
          aria-label="Recorrido visual interior de la Catedral de León"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />

        {/* Overlay gradiente oscuro */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.55) 100%)',
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />

        {/* Líneas de escaneo CRT */}
        <div className="scrollvideo-scanlines" aria-hidden="true" />

        {/* ── UI superpuesta ── */}
        <motion.div
          className="scrollvideo-ui"
          style={{ opacity: uiOpacity }}
        >
          {/* Esquina superior izquierda */}
          <div className="scrollvideo-corner-info">
            <span className="scrollvideo-label">RECORRIDO VISUAL</span>
            <span className="scrollvideo-sublabel">Catedral de León · Nicaragua</span>
          </div>

          {/* Esquina superior derecha */}
          <div className="scrollvideo-corner-badge">
            <span className="scrollvideo-rec">■ REC</span>
          </div>

          {/* Barra de progreso inferior */}
          <div className="scrollvideo-progress-wrap">
            <div className="scrollvideo-progress-track">
              <motion.div
                className="scrollvideo-progress-fill"
                style={{ width: barWidth }}
              />
            </div>
            <div className="scrollvideo-progress-labels">
              <span>Inicio</span>
              <span>← Desplázate para avanzar →</span>
              <span>Fin</span>
            </div>
          </div>

          {/* Brackets decorativos */}
          <span className="scrollvideo-bracket tl" aria-hidden="true" />
          <span className="scrollvideo-bracket br" aria-hidden="true" />
        </motion.div>
      </div>
    </div>
  )
}

