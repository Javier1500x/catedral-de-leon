import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const CRITERIA = [
  {
    
    title: 'Una mezcla de influencias',
    text: 'La Catedral combina aportes de la arquitectura española, el barroco europeo, el neoclásico y la tradición de Antigua Guatemala, adaptados por los constructores locales al paisaje y a la sociedad de Centroamérica.',
  },
  {
    
    title: 'Un ejemplo arquitectónico singular',
    text: 'Es una interpretación centroamericana excepcional de una iglesia monumental: integra varias corrientes artísticas en un conjunto coherente que también ha tenido un papel importante en la vida social de León.',
  },
]

export default function SectionPatrimonio() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="patrimonio" ref={ref} className="relative py-24 bg-white border-b border-slate-200/80">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="patrimonio-layout">
          <motion.div
            className="patrimonio-intro"
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="visit-eyebrow">Reconocimiento mundial · 2011</span>
            <h2 className="font-serif leading-tight text-slate-900 font-bold" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)' }}>
              <span>¿Por qué</span> es Patrimonio de la Humanidad?
            </h2>
            <p>La UNESCO la inscribió por dos razones que se entienden al mirar su arquitectura y su historia: representa un encuentro de culturas y constituye un ejemplo destacado de iglesia monumental centroamericana.</p>
           
          </motion.div>

          <div className="patrimonio-criteria">
            {CRITERIA.map((criterion, index) => (
              <motion.article
                className="patrimonio-criterion patrimonio-paper-stack"
                key={criterion.number}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.12 + index * 0.1 }}
              >
                <span className="paper-layer paper-layer-purple" aria-hidden="true" />
                <span className="paper-layer paper-layer-yellow" aria-hidden="true" />
                <span className="paper-layer paper-layer-green" aria-hidden="true" />
                <div className="patrimonio-paper">
                  <span className="patrimonio-number"> {criterion.number}</span>
                  <h3>{criterion.title}</h3>
                  <p>{criterion.text}</p>
                </div>
                <svg className="paperclip" viewBox="0 0 180 220" fill="none" aria-hidden="true">
                  <path d="M137 15 45 123a39 39 0 0 0 58 52l66-77a27 27 0 0 0-41-35l-74 86a15 15 0 0 0 23 20l68-79" stroke="#111" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M137 15 45 123a39 39 0 0 0 58 52l66-77a27 27 0 0 0-41-35l-74 86a15 15 0 0 0 23 20l68-79" stroke="#e5e7eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
