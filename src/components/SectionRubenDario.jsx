import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function SectionRubenDario() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="ruben-dario" ref={ref} className="section-soft-edge relative py-24 overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_78%_25%,rgba(37,99,235,0.2),transparent_45%)]" aria-hidden="true" />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="ruben-layout">
          <motion.div
            className="ruben-image-wrap"
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6anVlDfmr35dCSBHB_cUE5fc8iOcJgGdw-5wvmxr3Tsp9V2u8bZgWjUE&s=10"
              alt="Escultura del León Doliente sobre la tumba de Rubén Darío"
              loading="lazy"
            />
            <span>El León Doliente · Jorge Navas Cordonero</span>
          </motion.div>

          <motion.div
            className="ruben-copy"
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="ruben-kicker">Un vínculo entre la poesía y la Catedral</span>
            <h2 className="font-serif leading-tight font-bold" style={{ fontSize: 'clamp(2.4rem, 5vw, 4.4rem)' }}>
              <span>Rubén Darío</span> y el León Doliente
            </h2>
            <p>Rubén Darío fue sepultado en la Catedral el 13 de febrero de 1916. Su tumba se encuentra bajo la escultura de un león abatido, obra del escultor granadino Jorge Navas Cordonero. La figura, conocida como el León Doliente, convirtió el duelo de la ciudad por el poeta en una imagen que todavía recibe a quienes visitan el templo.</p>
            <p>En las criptas cercanas también descansan los poetas Salomón de la Selva y Alfonso Cortés, junto a otras figuras de la historia nicaragüense.</p>
   
          </motion.div>
        </div>
      </div>
    </section>
  )
}
