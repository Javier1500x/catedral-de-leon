import { lazy, Suspense, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import LoadingFrame from './ui/LoadingFrame'

const GlbModelViewer = lazy(() => import('./ui/GlbModelViewer'))

const MODELOS_3D = [
  {
    title: 'Fachada de la Catedral de León',
    src: 'https://sketchfab.com/models/66d1c8d6d6d94ad6b2df6573b13d43c2/embed',
    href: 'https://sketchfab.com/3d-models/fachada-de-la-catedral-de-leon-nicaragua-66d1c8d6d6d94ad6b2df6573b13d43c2',
    type: 'sketchfab',
  },
  {
    title: 'Tumba de Rubén Darío',
    subtitle: 'Mausoleo del poeta ',
    src: 'https://sketchfab.com/models/0e2b8358fb374ce3b962ec846935219f/embed',
    href: 'https://sketchfab.com/3d-models/tumba-de-ruben-dario-leon-nicaragua-0e2b8358fb374ce3b962ec846935219f',
    type: 'sketchfab',
  },
  {
    title: 'León de la Catedral',
    subtitle: 'Modelo etiquetado como león ',
    src: 'https://sketchfab.com/models/5084519b07f04a9b958f61d8b7c2626a/embed',
    href: 'https://sketchfab.com/3d-models/leon-catedral-de-leon-nicaragua-5084519b07f04a9b958f61d8b7c2626a',
    type: 'sketchfab',
  },
  {
    title: 'Retablo La Última Cena',
    subtitle: 'Modelo de Anante Estudio ',
    src: 'https://sketchfab.com/models/1a99e14592e44e85a038993298e89389/embed',
    href: 'https://sketchfab.com/3d-models/retablo-la-ultima-cena-leon-de-nicaragua-1a99e14592e44e85a038993298e89389',
    type: 'sketchfab',
  },
  {
    title: 'Catedral de León',
    subtitle: 'Modelo GLB · Recorre el interior en primera persona',
    src: '/models/catedral-leon/catedral_leon.glb',
    href: '#',
    type: 'glb',
    walkable: true,
  },
]

function Modelo3D({ modelo, index, inView, onGlbClick }) {
  if (modelo.type === 'glb') {
    return (
      <motion.article
        className="vista3d-panel"
        initial={{ opacity: 0, y: 22 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="vista3d-panel-header">
          <span className="vista3d-panel-subtitle">{modelo.subtitle}</span>
          <h3 className="vista3d-panel-title">{modelo.title}</h3>
        </div>
        <div className="vista3d-iframe-wrap">
          <div
            className="glb-preview-badge flex flex-col items-center justify-center py-6 border-2 border-slate-300/50 rounded-md hover:border-slate-400 transition-colors"
            aria-label="Ver modelo 3D GLB de la Catedral de León"
          >
            <svg
              className="glb-preview-icon text-slate-400 mb-2 h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span className="text-xs text-slate-500">Ver modelo 3D</span>
          </div>
        </div>
        <a
          className="modelo3d-source"
          href={modelo.href}
          target="_blank"
          rel="noreferrer"
          onClick={e => {
            e.preventDefault()
            onGlbClick(modelo)
          }}
        >
          Ver modelo 3D
        </a>
      </motion.article>
    )
  }

  return (
    <motion.article
      className="vista3d-panel"
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="vista3d-panel-header">
        <span className="vista3d-panel-subtitle">{modelo.subtitle}</span>
        <h3 className="vista3d-panel-title">{modelo.title}</h3>
      </div>
      <div className="vista3d-iframe-wrap">
        <LoadingFrame
          title={modelo.title}
          src={modelo.src}
          width="100%"
          height="100%"
          allowFullScreen
          allow="autoplay; fullscreen; xr-spatial-tracking"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <a className="modelo3d-source" href={modelo.href} target="_blank" rel="noreferrer">
        Ficha y créditos del modelo en Sketchfab
      </a>
    </motion.article>
  )
}

export default function SectionVista3D() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [showGlbModel, setShowGlbModel] = useState(false)
  const [glbModel, setGlbModel] = useState(null)

  const handleGlbOpen = modelo => {
    setGlbModel(modelo)
    setShowGlbModel(true)
  }

  const handleGlbClose = () => {
    setShowGlbModel(false)
    setGlbModel(null)
  }

  return (
    <section id="vista3d" ref={ref} className="relative py-24 overflow-hidden bg-slate-50/70 border-b border-slate-200/80">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-12">
          <motion.h2
            className="font-serif leading-tight mb-4 text-slate-900 font-bold"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)' }}
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span>Modelos</span> tridimensionales
          </motion.h2>
          <p className="font-sans text-slate-600 text-base md:text-lg leading-relaxed">
            Explora los modelos 3D de la fachada, la tumba de Rubén Darío y otras piezas patrimoniales de León.
           .
          </p>
        </div>

<div className="vista3d-model-grid">
          {MODELOS_3D.map((modelo, index) => (
            <Modelo3D
              key={modelo.src}
              modelo={modelo}
              index={index}
              inView={inView}
              onGlbClick={handleGlbOpen}
            />
          ))}
        </div>
        {showGlbModel && glbModel && (
          <Suspense fallback={<div className="glb-viewer-loading-fallback">Preparando el modelo 3D…</div>}>
            <GlbModelViewer
              src={glbModel.src}
              title={glbModel.title}
              walkable={Boolean(glbModel.walkable)}
              onClose={handleGlbClose}
            />
          </Suspense>
        )}
      </div>
    </section>
  )
}
