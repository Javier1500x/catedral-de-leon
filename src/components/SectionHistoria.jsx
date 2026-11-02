import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Folder from './ui/Folder'

/* ════════════════════════════════════════════════════════════════════
   📸 CONFIGURACIÓN DE FICHAS E IMÁGENES DEL FOLDER HISTÓRICO:
   Pega aquí tus enlaces de imagen en el campo "image".
   Si dejas el campo image vacío o con '', se mostrará la ficha documental.
   ════════════════════════════════════════════════════════════════════ */
const FOLDER_HISTORIA_ITEMS = [
  {
    year: '1524',
    title: 'Fundación en León Viejo',
    description: 'Primer templo erigido junto al lago Xolotlán. Tras los terremotos y la erupción del volcán Momotombo en 1610, la ciudad y sede episcopal se trasladan a su ubicación actual.',
  },
  {
    /* ── LINK DE IMAGEN 1 (Puedes cambiar este link por el tuyo) ── */
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Leon_Cathedral_2018.jpg',
    title: 'Fachada Principal y Torres',
    alt: 'Fachada y torres campanario de la Catedral de León',
    year: 'León · Nicaragua',
    description: 'Vista de la fachada monumental y sus campanarios, levantados en piedra y parte del conjunto arquitectónico de la basílica.',
  },
  {
    year: '1747',
    title: 'Traza de la Gran Basílica',
    description: 'Comienza la obra proyectada por Diego José de Porres Esquivel. La construcción empleó cantería y cal, y se prolongó durante varias décadas hasta completar el gran templo.',
  },
  {
    year: '1814',
    title: 'Consagración Episcopal',
    description: 'La basílica fue consagrada tras una larga etapa constructiva. Su interior reúne cinco naves y su cubierta destaca por las cúpulas y linternillas que definen la silueta del edificio.',
  },
  {
    /* ── LINK DE IMAGEN 2 (Puedes cambiar este link por el tuyo) ── */
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Altar_in_the_cathedral_of_Leon_%28Nicaragua%29.jpg',
    title: 'Altar Mayor y Crucero',
    alt: 'Altar mayor de la Catedral de León',
    year: 'Interior de la basílica',
    description: 'El presbiterio y el crucero concentran retablos, imaginería y detalles de la vida litúrgica de la Catedral.',
  },
  {
    year: '2011',
    title: 'Patrimonio de la Humanidad',
    description: 'La UNESCO inscribió la Catedral de León en la Lista del Patrimonio Mundial, reconociendo su valor arquitectónico e histórico y su lugar central en la identidad cultural nicaragüense.',
  },
]

const CRONOLOGIA_LIST = [
  {
    year: '1747',
    title: 'Colocación de la primera piedra',
    text: 'Aprobación de los planos del maestro guatemalteco Diego José de Porres. Se utilizó piedra cantera volcánica extraída del cerro Asososca, unida con argamasa de cal y arena volcánica.',
  },
  {
    year: '1814',
    title: 'Finalización de la fábrica y consagración',
    text: 'Concluyen las cinco naves monumentales, el presbiterio y las 34 cúpulas que componen la cubierta más extensa de Centroamérica.',
  },
  {
    year: '1916',
    title: 'Entierro solemne de Rubén Darío',
    text: 'El poeta cumbre del Modernismo es sepultado a los pies de la estatua de San Pablo. Se erige el célebre León Doliente en mármol de Carrara tallado por Jorge Navas Cordonero.',
  },
  {
    year: '2011',
    title: 'Declaratoria UNESCO como Patrimonio Mundial',
    text: 'Reconocimiento internacional como monumento representativo de la arquitectura virreinal tardía y símbolo vivo de la identidad cultural nicaragüense.',
  },
]

export default function SectionHistoria() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [selectedItem, setSelectedItem] = useState(null)
  const [folderSize, setFolderSize] = useState(1.25)

  useEffect(() => {
    const updateFolderSize = () => setFolderSize(window.innerWidth <= 640 ? 1 : 1.25)
    updateFolderSize()
    window.addEventListener('resize', updateFolderSize, { passive: true })
    return () => window.removeEventListener('resize', updateFolderSize)
  }, [])

  return (
    <section id="historia" className="relative py-24 overflow-hidden bg-slate-50/70" ref={ref}>
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* ── Encabezado limpio, sin retórica de IA ── */}
        <div className="max-w-3xl mb-16">
          <motion.h2
            className="font-serif leading-tight mb-4 text-slate-900 organic-underline font-bold"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="highlight-blue">Cronología</span> y <span className="highlight-orange">Memoria</span> de la <span className="highlight-orange">Real</span> <span className="highlight-blue">Basílica</span>
          </motion.h2>

          <motion.p
            className="font-sans text-slate-600 text-base md:text-lg leading-relaxed font-normal"
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            Desde su trazado fundacional en 1524 tras la erupción del volcán Momotombo hasta su declaratoria como Patrimonio Mundial de la UNESCO en 2011.
          </motion.p>
        </div>

{/* ── INTERACTIVE FOLDER TIMELINE (Diseño Folder de react-bits) ── */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="history-folder-panel flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-12 bg-white/90 p-4 sm:p-6 md:p-12 rounded-2xl border border-slate-200/80 shadow-sm">
            
            {/* Folder 3D interactivo */}
            <div className="flex flex-col items-center justify-center w-full lg:w-1/2 py-6">
              <div className="relative flex w-full max-w-full items-center justify-center min-h-[300px]">
                <Folder
                  label="1524-2011"
                  items={FOLDER_HISTORIA_ITEMS}
                  mode="flap"
                  variant="solid"
                  layout="spread"
                  color="#2563eb"
                  paperColor="#ffffff"
                  tabPosition="right"
                  openOn="click"
                  size={folderSize}
                  frost={0.04}
                  tilt={0.4}
                  speed={1}
                  bounce={0.35}
                  peek
                  intro={false}
                  draggable
                  zoomOnClick
                  theme="light"
                  onItemClick={(item, index) => setSelectedItem(item)}
                />
              </div>

              {/* Indicador de interacción */}
              <p className="mt-8 text-xs font-sans text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-2">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600">
                  <path d="M15 15l5-5-5-5" />
                  <path d="M4 20v-7a4 4 0 0 1 4-4h12" />
                </svg>
                Haz clic en el folder para abrir los documentos o arrastra las fichas
              </p>
            </div>

            {/* Ficha explicativa activa o guía rápida */}
            <div className="w-full lg:w-1/2 lg:pl-6 lg:border-l border-slate-200">
              <div className="space-y-4">
                <span className="text-xs font-sans tracking-widest text-slate-500 font-bold uppercase block">
                  Documento Seleccionado
                </span>
                <h3 className="break-words font-serif text-2xl md:text-3xl font-bold text-slate-900 [overflow-wrap:anywhere]">
                  {selectedItem?.title || 'Expediente Documental de la Catedral'}
                </h3>
                {selectedItem?.year && (
                  <span className="inline-block px-3 py-1 rounded-full bg-slate-50 text-slate-700 text-xs font-sans font-bold uppercase tracking-wider">
                    {/^[0-9]{4}$/.test(selectedItem.year) ? 'Año ' : ''}{selectedItem.year}
                  </span>
                )}
                <p className="font-sans text-slate-600 text-base leading-relaxed">
                  {selectedItem?.description ||
                    'Este expediente reúne los principales hitos de la Catedral: el traslado de León Viejo, el inicio de la gran obra bajo los planos de Diego José de Porres Esquivel, su consagración y su reconocimiento como Patrimonio Mundial. Abre la carpeta y selecciona cada ficha para consultar el contexto de una fecha o pieza.'}
                </p>

                <div className="pt-4 border-t border-slate-200/80">
                  <span className="block mb-2 text-xs font-sans tracking-widest text-slate-500 font-bold uppercase">
                    Datos del expediente
                  </span>
                  <p className="font-sans text-slate-600 text-sm leading-relaxed">
                    La cronología enlaza la fundación de 1524 con el traslado de 1610, la construcción iniciada en 1747 y la consagración de 1814. Las fichas documentan las cinco naves, las cúpulas, los altares y la declaratoria de la UNESCO de 2011, para recorrer la historia junto con los elementos arquitectónicos del templo.
                  </p>
                </div>

                {selectedItem?.image && (
                  <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 max-h-56">
                    <img src={selectedItem.image} alt={selectedItem.title} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── LÍNEA DE TIEMPO EDITORIAL (Sin cuadros pesados) ── */}
        <div className="relative pl-6 md:pl-10 border-l-2 border-slate-200 space-y-12 max-w-4xl">
          {CRONOLOGIA_LIST.map((item, idx) => (
            <motion.div
              key={item.year}
              className="relative group"
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Punto indicador */}
              <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-blue-600 shadow-sm" />

              <div>
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="font-sans font-bold text-blue-600 text-sm tracking-wider uppercase">
                    {item.year}
                  </span>
                  <span className="text-slate-300">·</span>
                  <h4 className="font-serif font-bold text-slate-900 text-xl md:text-2xl">
                    {item.title}
                  </h4>
                </div>
                <p className="font-sans text-slate-600 text-base leading-relaxed max-w-2xl">
                  {item.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

