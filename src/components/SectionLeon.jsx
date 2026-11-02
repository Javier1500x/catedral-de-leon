import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const LUGARES = [
  {
    type: 'Patrimonio Mundial · UNESCO',
    name: 'Ruinas de León Viejo',
    text: 'El primer asentamiento de León, fundado en 1524 y abandonado tras terremotos y actividad volcánica. Sus vestigios muestran cómo se organizaban las primeras ciudades coloniales de la región.',
    source: 'https://whc.unesco.org/es/list/613',
    map: 'https://www.google.com/maps/search/?api=1&query=Ruinas+de+Le%C3%B3n+Viejo+Nicaragua',
  },
  {
    type: 'Historia contemporánea',
    name: 'Museo de la Revolución',
    text: 'Un espacio de memoria oral y objetos relacionados con la historia revolucionaria de León, a pocos minutos a pie del Parque Central.',
    source: 'https://www.visitleon.info/museo-de-la-revolucion.html',
    map: 'https://www.google.com/maps/search/?api=1&query=Museo+de+la+Revoluci%C3%B3n+Le%C3%B3n+Nicaragua',
  },
  {
    type: 'Arquitectura religiosa',
    name: 'Iglesia La Recolección',
    text: 'Su fachada barroca de cantería es uno de los conjuntos arquitectónicos más reconocibles del centro histórico; está aproximadamente a 300 metros de la Catedral.',
    source: 'https://www.visitleon.info/iglesia-la-recoleccion.html',
    map: 'https://www.google.com/maps/search/?api=1&query=Iglesia+La+Recolecci%C3%B3n+Le%C3%B3n+Nicaragua',
  },
  {
    type: 'Arte · colección del siglo XV a la actualidad',
    name: 'Centro de Arte Fundación Ortiz Gurdián',
    text: 'Dos casas históricas albergan obras de arte nicaragüense e internacional. Una visita complementaria para descubrir otra cara del patrimonio cultural de León.',
    source: 'https://www.visitleon.info/centro-de-arte-fundacion-ortiz-gurdian.html',
    map: 'https://www.google.com/maps/search/?api=1&query=Centro+de+Arte+Fundaci%C3%B3n+Ortiz+Gurdi%C3%A1n+Le%C3%B3n+Nicaragua',
  },
]

export default function SectionLeon() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="leon" ref={ref} className="relative py-24 bg-slate-50/70 border-t border-slate-200/80">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-12">
          <motion.h2
            className="font-serif leading-tight mb-4 text-slate-900 font-bold"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)' }}
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span>Más por</span> descubrir en León
          </motion.h2>
          <p className="font-sans text-slate-600 text-base md:text-lg leading-relaxed">
            La Catedral puede ser el comienzo de una ruta por la memoria, las iglesias y el arte de la ciudad.
          </p>
        </div>

        <div className="leon-places-grid">
          {LUGARES.map((lugar, index) => (
            <motion.article
              className="leon-place"
              key={lugar.name}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.07 }}
            >
              <span className="leon-place-type">{lugar.type}</span>
              <h3>{lugar.name}</h3>
              <p>{lugar.text}</p>
              <div className="leon-place-links">
                <a href={lugar.source} target="_blank" rel="noreferrer">Más información</a>
                <a href={lugar.map} target="_blank" rel="noreferrer">Ver en el mapa</a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
