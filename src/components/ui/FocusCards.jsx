import { lazy, Suspense, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const GlbModelViewer = lazy(() => import('./GlbModelViewer'))

export default function FocusCards({ cards }) {
  const [selected, setSelected] = useState(null)
  const [focused, setFocused] = useState(null)
  const [activeImage, setActiveImage] = useState(0)
  const [showModel, setShowModel] = useState(false)

  const selectedImages = selected?.images?.length ? selected.images : selected?.src ? [selected.src] : []
  const showImage = index => setActiveImage((index + selectedImages.length) % selectedImages.length)

  useEffect(() => {
    if (!selected) return undefined
    const onKeyDown = event => {
      if (event.key === 'Escape') {
        if (showModel) setShowModel(false)
        else setSelected(null)
      }
      if (!showModel && selectedImages.length > 1 && event.key === 'ArrowRight') showImage(activeImage + 1)
      if (!showModel && selectedImages.length > 1 && event.key === 'ArrowLeft') showImage(activeImage - 1)
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [selected, showModel, activeImage, selectedImages.length])

  return (
    <>
      <div className={`focus-reliquias${focused !== null ? ' has-focus' : ''}`} role="region" aria-label="Reliquias de la Catedral">
        {cards.map((card, index) => (
          <button
            key={card.title}
            type="button"
            className={`focus-reliquia-card${focused === index ? ' is-focused' : ''}`}
            onMouseEnter={() => setFocused(index)}
            onMouseLeave={() => setFocused(null)}
            onFocus={() => setFocused(index)}
            onBlur={() => setFocused(null)}
            onClick={() => { setSelected(card); setActiveImage(0); setShowModel(false) }}
            aria-label={`Ampliar ${card.title}`}
          >
            {card.src ? <img src={card.src} alt="" loading="lazy" /> : <span className="focus-reliquia-placeholder">{card.title}</span>}
            <span className="focus-reliquia-shade" />
            <span className="focus-reliquia-copy">
              <span className="focus-reliquia-period">{card.period}</span>
              <span className="focus-reliquia-title">{card.title}</span>
              <span className="focus-reliquia-hint">Ver pieza y descripción</span>
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="focus-reliquia-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reliquia-detalle-titulo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onMouseDown={event => { if (event.target === event.currentTarget) setSelected(null) }}
          >
            <motion.article
              className="focus-reliquia-dialog"
              initial={{ opacity: 0, scale: 0.97, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="focus-reliquia-large-image">
                {selectedImages.length ? <img src={selectedImages[activeImage]} alt={`${selected.title}, fotografía ${activeImage + 1} de ${selectedImages.length}`} /> : <div className="focus-reliquia-large-placeholder">{selected.title}</div>}
                {selectedImages.length > 1 && (
                  <>
                    <button type="button" className="focus-reliquia-image-nav is-previous" aria-label="Fotografía anterior" onClick={() => showImage(activeImage - 1)}>‹</button>
                    <button type="button" className="focus-reliquia-image-nav is-next" aria-label="Fotografía siguiente" onClick={() => showImage(activeImage + 1)}>›</button>
                  <div className="focus-reliquia-photo-strip" aria-label={`Fotografías de ${selected.title}`}>
                    {selectedImages.map((src, index) => (
                      <button key={src} type="button" className={`focus-reliquia-thumbnail${activeImage === index ? ' is-active' : ''}`} aria-label={`Ver fotografía ${index + 1} de ${selected.title}`} aria-pressed={activeImage === index} onClick={() => showImage(index)}>
                        <img src={src} alt="" loading="lazy" />
                      </button>
                    ))}
                  </div>
                  </>
                )}
              </div>
              <div className="focus-reliquia-detail">
                <button type="button" className="focus-reliquia-close" autoFocus onClick={() => setSelected(null)}>Cerrar</button>
                <p className="focus-reliquia-period">{selected.period}</p>
                <h3 id="reliquia-detalle-titulo">{selected.title}</h3>
                <p className="focus-reliquia-full-description">{selected.description}</p>
                {selected.sourceUrl && <a className="focus-reliquia-source" href={selected.sourceUrl} target="_blank" rel="noreferrer">Leer la nota de investigación de 2022</a>}
                {selected.modelUrl && <a className="focus-reliquia-source" href={selected.modelUrl} target="_blank" rel="noreferrer">↗ Ver el modelo 3D de {selected.title} en Meshy</a>}
                {selected.model3d && <button type="button" className="focus-reliquia-model-button" onClick={() => setShowModel(true)} aria-label={`Ver modelo 3D de ${selected.title}`}>Ver</button>}
                <span className="focus-reliquia-origin">Patrimonio sacro · Catedral de León, Nicaragua</span>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModel && selected?.model3d && (
          <motion.div className="glb-viewer-layer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Suspense fallback={<div className="glb-viewer-loading-fallback">Preparando el modelo 3D…</div>}>
              <GlbModelViewer src={selected.model3d} title={selected.title} onClose={() => setShowModel(false)} />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
