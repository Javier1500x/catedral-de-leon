import { useRef } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import FocusCards from '@/components/ui/FocusCards'

const CRISTO_PEDRARIAS_MODEL = new URL('../../Meshy_AI_Gilded_Crucifixion_Ta_1025131833_texture.glb', import.meta.url).href

/* ════════════════════════════════════════════════════════════════════
   📸 CONFIGURACIÓN DE IMÁGENES DE LAS RELIQUIAS Y TESOROS:
   Pega aquí el enlace de la imagen de cada reliquia en el campo "image".
   Puedes usar enlaces web (https://...) o rutas locales (ej: '/fotos/reliquia1.jpg').
   Si dejas el campo vacío: image: '', aparecerá un espacio en blanco
   diseñado como marcador de posición para que coloques tu foto.
   ════════════════════════════════════════════════════════════════════ */
const RELIQUIAS_DATA = [
  {
    id: 'reliquia-1',
    title: 'Mausoleo del León Doliente',
    period: 'Año 1916 · Escultura en Mármol de Carrara',
    /* ── LINK DE IMAGEN 1: Tumba de Rubén Darío ── */
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6anVlDfmr35dCSBHB_cUE5fc8iOcJgGdw-5wvmxr3Tsp9V2u8bZgWjUE&s=10',
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6anVlDfmr35dCSBHB_cUE5fc8iOcJgGdw-5wvmxr3Tsp9V2u8bZgWjUE&s=10',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Tomb_of_Rub%C3%A9n_Dar%C3%ADo%2C_Le%C3%B3n_Cathedral%2C_Nicaragua.jpg/800px-Tomb_of_Rub%C3%A9n_Dar%C3%ADo%2C_Le%C3%B3n_Cathedral%2C_Nicaragua.jpg',
    ],
    desc: 'Escultura fúnebre labrada por el escultor Jorge Navas Cordonero. Representa a un león abatido y triste sobre el escudo de armas de Nicaragua, resguardando los restos del inmortal poeta modernista Rubén Darío.',
  },
  {
    id: 'reliquia-2',
    title: 'Custodia Mayor y Platería Virreinal',
    period: 'Siglos XVII–XVIII · Orfebrería Sacra',
    /* ── LINK DE IMAGEN 2: Custodia y Platería ── */
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Altar_in_the_cathedral_of_Leon_%28Nicaragua%29.jpg',
    desc: 'Conjunto de piezas litúrgicas coloniales labradas en plata fina sobredorada. Incluye cálices cincelados, incensarios virreinales y la gran custodia procesional utilizada en la festividad del Corpus Christi.',
  },
  {
    id: 'reliquia-3',
    title: 'Cristo Negro de Pedrarias',
    period: 'Siglo XVI · Talla Sacra en Madera Oscura',
    /* ── LINK DE IMAGEN 3: Cristo Negro (Espacio para imagen) ── */
    image: 'https://www.visitleon.info/uploads/1/2/0/4/120453990/editor/cristo-de-pedrarias-en-la-catedral-de-leon-nicaragua.jpg?1663446773',
    images: [
      'https://www.visitleon.info/uploads/1/2/0/4/120453990/editor/cristo-de-pedrarias-en-la-catedral-de-leon-nicaragua.jpg?1663446773',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRK20XoGR5B1DDTVValWKdRjm_9K7UzHQiHX-zYhBssN_rWj6d4ngLCbvsa&s=10',
    ],
    model3d: CRISTO_PEDRARIAS_MODEL,
    desc: 'Venerada talla de Cristo crucificado rescatada de la primitiva ciudad de León Viejo antes del violento cataclismo y erupción del volcán Momotombo en 1610. Una de las imágenes cristianas más antiguas de América Continental.',
  },
  {
    id: 'reliquia-4',
    title: 'Relicario del Lignum Crucis',
    period: 'Época Virreinal · Reliquia de Primer Grado',
    /* ── LINK DE IMAGEN 4: Lignum Crucis (Espacio para imagen) ── */
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTWt5z6R9jHMOrSa-tg1MaICVd06-_OqLpHgQkP3viICn2H2axb9usCbE&s=10',
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTWt5z6R9jHMOrSa-tg1MaICVd06-_OqLpHgQkP3viICn2H2axb9usCbE&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLIqMhYM4T2-iPA_rDBFckqSc9FL-Gdounv0llzw-uSwFU9gPGW5Ot8ss&s=10',
    ],
    modelUrl: 'https://www.meshy.ai/s/BBfrRm',
    desc: 'Astilla certificada del madero de la Santa Cruz conservada en el tesoro cathedralicio dentro de una teca de cristal de roca engastada en plata labrada y piedras ornamentales.',
  },
  {
    id: 'reliquia-5',
    title: 'Piezas de Luigi Valadier (1726–1785)',
    period: 'Orfebrería romana · Investigación publicada en 2022',
    image: 'https://s3.laprensani.com/wp-content/uploads/2022/06/catedral-leon-4.jpeg',
    images: [
      'https://s3.laprensani.com/wp-content/uploads/2022/06/catedral-leon-4.jpeg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ64kDJ6n4REGd-cKUXP6PugsXeT8k8kzikcIkMyb8mo_jq2KkHzcUzM4X1&s=10',
    ],
    desc: 'La colección atribuida al orfebre italiano reúne doce candelabros, dos custodias, un cáliz, un copón y muy probablemente nueve relicarios, entre ellos el Lignum Crucis. En 2022, Xavier F. Salomon identificó y atribuyó estas piezas a Valadier mediante documentos, comparación con sus diseños y sellos presentes en algunas obras. Se creían perdidas en México desde el siglo XVIII.',
    sourceUrl: 'https://www.laprensani.com/2022/06/09/nacionales/3005481-es-de-los-mas-grandes-tesoros-artisticos-en-nicaragua-senala-investigador-italiano-sobre-piezas-en-la-catedral-de-leon',
  },
]

const CURIOSIDADES = [
  {
    title: 'La tradición de caminar descalzo sobre la cal viva',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuTEuW68A6OCS3sxx4F_29KBfuA0yhqQZT-ztj5AZXOlzAcJ1K5ajocJw&s=10',
    text: 'Las 34 cúpulas de la azotea están encaladas periódicamente con una mezcla tradicional de cal viva y arena volcánica. Para proteger el revestimiento mineral y evitar el desgaste de las bóvedas, los visitantes y custodios transitan sin calzado.',
  },
  {
    title: 'Red de túneles y refugio ante asaltos piratas',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzVNT20aNDqkz_GTR79IbL3lXEXGzSmDuQBxaWmQNKxN0bf3S30Nvku2I&s=10',
    text: 'Bajo el presbiterio y las naves se construyeron pasadizos abovedados que conectaban estratégicamente la Catedral con las iglesias de La Merced, San Francisco y El Calvario, brindando refugio a la población durante incursiones corsarias en el Mar del Sur.',
  },
  {
    title: 'Panteón histórico de las letras y la independencia',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2Kx_3YGODJFbA9DpnOK-zY4eaGj-RcbYaC_Hrxr3L0ugnw_3Sq-Og6dE&s=10',
    text: 'En el suelo sagrado de la basílica yacen figuras cumbres: el prócer Miguel Larreynaga, los poetas Salomón de la Selva y Alfonso Cortés, el músico José de la Cruz Mena y destacados obispos de la diócesis colonial.',
  },
  {
    title: 'Muros de 2.20 metros contra la furia sísmica',
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5d/Catedral_de_Le%C3%B3n_Nicaragua2.JPG/330px-Catedral_de_Le%C3%B3n_Nicaragua2.JPG?utm_source=es.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    text: 'A diferencia de las catedrales europeas estilizadas con grandes arbotantes, Porres concibió muros macizos de cantera volcánica y contrafuertes robustos capaces de disipar las ondas telúricas de la cadena volcánica de los Maribios.',
  },
  {
    title: 'Una obra que reúne siglos de historia',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl_HuJ8KX8FtR7G-ERMpJAIrFbdEt0j_CgcnpezkFm5DZ2WNGST3C9Jb8E&s=10',
    text: 'La Catedral fue construida entre 1747 y 1814. Sus espacios, obras y criptas reúnen relatos de la ciudad desde la época colonial hasta la vida cultural contemporánea.',
  },
]

export default function SectionCuriosidades() {
  const ref = useRef(null)
  const stackRef = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ['start start', 'end end'],
  })

  return (
    <>
      {/* ── CURIOSIDADES Y DATOS HISTÓRICOS ── */}
      <section
        id="curiosidades"
        ref={ref}
        className="relative py-24 bg-white"
      >
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          
          {/* Encabezado sin títulos artificiales */}
          <div className="max-w-3xl mb-14">
            <motion.h2
              className="font-serif leading-tight mb-4 text-slate-900 organic-underline font-bold"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="highlight-blue">Aspectos</span> <span className="highlight-orange">Notables</span> <span className="highlight-orange">y</span> <span className="highlight-orange">Tradiciones</span> <span className="highlight-orange">de</span> <span className="highlight-orange">la</span> <span className="highlight-orange">Catedral</span>
            </motion.h2>

            <motion.p
              className="font-sans text-slate-600 text-base md:text-lg leading-relaxed font-normal"
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              Detalles constructivos, túneles subterráneos coloniales y costumbres preservadas a través de los siglos.
            </motion.p>
          </div>

          {reduceMotion ? (
            <div className="curiosidades-static-list">
              {CURIOSIDADES.map(item => <CuriosidadCard key={item.title} item={item} />)}
            </div>
          ) : (
            <div
              ref={stackRef}
              className="curiosidades-stack"
              style={{
                '--stack-height-desktop': `${CURIOSIDADES.length * 100}vh`,
                '--stack-height-mobile': `${CURIOSIDADES.length * 88}vh`,
              }}
              aria-label="Curiosidades de la Catedral de León; desplázate para descubrirlas"
            >
              <div className="curiosidades-stack-stage">
                {CURIOSIDADES.map((item, index) => (
                  <CuriosidadStackCard
                    key={item.title}
                    item={item}
                    index={index}
                    count={CURIOSIDADES.length}
                    progress={scrollYProgress}
                  />
                ))}
                <span className="curiosidades-stack-hint" aria-hidden="true">Desliza para descubrir · {CURIOSIDADES.length} relatos</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── SECCIÓN DE RELIQUIAS Y TESOROS CON FOTOS Y ESPACIOS EN BLANCO ── */}
      <ReliquiasSection inViewParent={inView} />

    </>
  )
}

function CuriosidadCard({ item, className = '' }) {
  const { title, text, image } = item
  return (
    <article className={`curiosidad-stack-card ${className}`}>
      <img src={image} alt={title} loading="lazy" decoding="async" />
      <div className="curiosidad-stack-copy">
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </article>
  )
}

function CuriosidadStackCard({ item, index, count, progress }) {
  const start = index === 0 ? 0 : (index / count) * 0.82
  const finish = Math.min(start + 0.2, 1)
  const tilt = index % 2 === 0 ? -1.2 : 1.2
  const y = (index - (count - 1)) * 15
  const x = (index - (count - 1) / 2) * 9
  const transform = useTransform(
    progress,
    [start, finish],
    ['translate3d(0, 105svh, 0) rotate(0deg) scale(.94)', `translate3d(${x}px, ${y}px, 0) rotate(${tilt}deg) scale(1)`],
  )
  const opacity = useTransform(progress, [start, Math.min(start + 0.08, finish)], [0, 1])

  return (
    <motion.div className="curiosidad-stack-layer" style={{ transform, opacity, zIndex: index + 1 }}>
      <CuriosidadCard item={item} />
    </motion.div>
  )
}

function ReliquiasSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="reliquias"
      ref={ref}
      className="relative py-24 overflow-hidden bg-slate-50/70 border-t border-slate-200/80"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* Encabezado */}
        <div className="max-w-3xl mb-14">
          <motion.h2
            className="font-serif leading-tight mb-4 text-slate-900 organic-underline font-bold"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <span>Reliquias</span> y Tesoro de la Catedral
          </motion.h2>

          <motion.p
            className="font-sans text-slate-600 text-base md:text-lg leading-relaxed font-normal"
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            Obras maestras escultóricas, orfebrería de plata virreinal y piezas sacras custodiadas en el templo.
          </motion.p>
        </div>

        {/* ── Grid de Reliquias con Fotos y Espacios en Blanco ── */}
        <FocusCards cards={RELIQUIAS_DATA.map(item => ({ title: item.title, period: item.period, src: item.image, images: item.images || [item.image], description: item.desc, sourceUrl: item.sourceUrl, modelUrl: item.modelUrl, model3d: item.model3d }))} />
      </div>
    </section>
  )
}



