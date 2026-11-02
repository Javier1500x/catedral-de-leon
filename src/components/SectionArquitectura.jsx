import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

/* ════════════════════════════════════════════════════════════════════
   📸 CONFIGURACIÓN DE IMAGEN DESTACADA DE ARQUITECTURA:
   Pega aquí tu enlace de imagen para la azotea / fachada.
   ════════════════════════════════════════════════════════════════════ */
const ARQUITECTURA_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/1/18/Leon_Cathedral_2018.jpg'

const ARQUITECTURA_TABS = [
  {
    id: 'terraza',
    title: 'Azotea y Cúpulas',
    subtitle: 'Cubierta de 34 cúpulas encaladas',
    text: 'La azotea blanca de la Catedral de León es su elemento más emblemático. Sus 34 cúpulas abovedadas encaladas y linternillas permiten una vista panorámica hacia la cordillera de los Maribios y el volcán Momotombo. Se transita descalzo para preservar el revestimiento de cal viva.',
  },
  {
    id: 'fachada',
    title: 'Fachada y Torres',
    subtitle: 'Cantería volcánica y campanarios',
    text: 'Proyectada por Diego José de Porres Esquivel, la fachada exhibe pilastras y dos torres cuadrangulares de 38 metros de altura. Sus muros de cantera volcánica y caliza han soportado más de dos siglos de sismos y erupciones.',
  },
  {
    id: 'criptas',
    title: 'Criptas y Catacumbas',
    subtitle: 'Nivel subterráneo histórico',
    text: 'Bajo el pavimento de la basílica se extiende una red de sótanos y criptas funerarias donde reposan próceres de la independencia, poetas como Salomón de la Selva y prelados de la diócesis leonesa.',
  },
  {
    id: 'naves',
    title: 'Cinco Naves y Bóvedas',
    subtitle: 'Distribución espacial interior',
    text: 'El interior consta de cinco amplias naves sostenidas por diez hileras de pilastras cruciformes. El crucero está coronado por una linterna central que ilumina con luz natural el retablo mayor de madera tallada y plata.',
  },
]

export default function SectionArquitectura() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [active, setActive] = useState(ARQUITECTURA_TABS[0].id)

  const activeTab = ARQUITECTURA_TABS.find(t => t.id === active)

  return (
    <section id="arquitectura" ref={ref} className="relative py-24 overflow-hidden bg-white">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* Header sobrio */}
        <div className="max-w-3xl mb-14">
          <motion.h2
            className="font-serif leading-tight mb-4 text-slate-900 organic-underline font-bold"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="highlight-blue">Arquitectura</span> y <span className="highlight-orange">Sistema</span> <span className="highlight-orange">Constructivo</span>
          </motion.h2>

          <motion.p
            className="font-sans text-slate-600 text-base md:text-lg leading-relaxed font-normal"
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            Edificada con muros antisísmicos de más de 2 metros de grosor en cantería volcánica, cal y arena. Una planta monumental de 113 metros de longitud.
          </motion.p>
        </div>

        {/* Tab Selector — Sin cajas pesadas, estilo píldoras modernas */}
        <motion.div
          className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-slate-200/80"
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          {ARQUITECTURA_TABS.map((tab) => {
            const isCurrent = active === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                aria-pressed={isCurrent}
                className={`px-4 py-2 rounded-full font-sans text-xs uppercase tracking-wider font-semibold transition-all duration-200 ${
                  isCurrent
                    ? 'bg-white text-blue-600 shadow-md shadow-blue-500/30'
                    : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 hover:scale-105'
                }`}
              >
                <span>{tab.title}</span>
              </button>
            )
          })}
        </motion.div>

        {/* Tab Detail Panel — Layout editorial abierto, sin cuadro contenedor pesado */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="mb-14 py-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="grid md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-4 border-l-2 border-blue-600 pl-4">
                <span className="text-xs font-sans tracking-widest text-blue-600 font-bold uppercase block mb-1">
                  {activeTab?.subtitle}
                </span>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-slate-900">
                  {activeTab?.title}
                </h3>
              </div>
              <div className="md:col-span-8">
                <p className="font-sans text-slate-600 text-base md:text-lg leading-relaxed">
                  {activeTab?.text}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Imagen panorámica de las cúpulas */}
        <motion.div
          className="relative overflow-hidden rounded-2xl border border-slate-200/90 shadow-md group"
          style={{ height: '420px' }}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.45 }}
        >
          <img
            src={ARQUITECTURA_IMAGE}
            alt="Cúpulas de la Catedral de León, Nicaragua"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 flex flex-col md:flex-row justify-between items-start md:items-end gap-3 rounded-xl border border-white/15 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/55 p-5 text-white shadow-lg backdrop-blur-sm md:bottom-6 md:left-6 md:right-6 md:p-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-blue-300 font-sans font-semibold block mb-1">
                Monumento Histórico Nacional
              </span>
              <p className="font-serif text-xl md:text-2xl drop-shadow">
                Azotea de cal viva y 34 cúpulas frente a los volcanes
              </p>
            </div>
            <span className="font-sans text-xs tracking-wider uppercase bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/30 text-white font-medium">
              León · Nicaragua
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

