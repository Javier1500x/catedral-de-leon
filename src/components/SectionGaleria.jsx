import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import DepthCarousel from './DepthCarousel'

/* ════════════════════════════════════════════════════════════════════
   📸 CONFIGURACIÓN DE IMÁGENES DE LA GALERÍA:
   Pega aquí tus enlaces o rutas locales de imagen en cada item.
   Ejemplo: image: 'https://tusitio.com/foto.jpg' o '/fotos/foto1.jpg'
   ════════════════════════════════════════════════════════════════════ */
const GALERIA_ITEMS = [
  {
    image: '/images/galeria/galeria-1.jpg',
    fallbackImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlHqroPfdmA7oYqTb5Q5sHz_ofpXKXnUWEs9K40pSfmQ&s=10',
    alt: 'Detalle del retablo y la Virgen de la Catedral de León',
  },
  {
    image: '/images/galeria/galeria-2.jpg',
    fallbackImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfgXlLh2vapTf5ECX4y2ddXR7CufASJUlmmnGaAMTAw9Be2kZtIeMSoN8G&s=10',
    alt: 'Columna y esculturas del interior de la Catedral de León',
  },
  {
    image: '/images/galeria/galeria-3.jpg',
    fallbackImage: 'https://www.visitleon.info/uploads/1/2/0/4/120453990/interior-de-la-catedral-de-leon-de-nicaragua_orig.jpg',
    alt: 'Arcos y esculturas en el interior de la Catedral de León',
  },
  {
    image: '/images/galeria/galeria-4.jpg',
    fallbackImage: 'https://www.nadaincluido.com/wp-content/uploads/3a-Catedral-de-Le%C3%B3n-interior-3.jpg',
    alt: 'Vista central de la nave y altar de la Catedral de León',
  },
  {
    image: '/images/galeria/galeria-5.jpg',
    fallbackImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjN7FnLYM1Tx3wENO1TCc_v1IRB4j9R7tSQnfn7MELSuYjMIPe3Jj3Ve4&s=10',
    alt: 'Cúpulas de la Catedral bajo la luz del atardecer',
  },
  {
    image: '/images/galeria/galeria-6.jpg',
    fallbackImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSabcx7ceQC13_my9cM3hSuc5khB---NVC2NpTUDqRL_S7LASBNBowtpKM7&s=10',
    alt: 'Crucifijo y retablo de la Catedral de León',
  },
  {
    image: '/images/galeria/galeria-7.jpg',
    fallbackImage: 'https://www.nadaincluido.com/wp-content/uploads/3a-Catedral-de-Le%C3%B3n-interior-4.jpg',
    alt: 'Detalle del retablo bajo las bóvedas de la Catedral',
  },
  {
    image: '/images/galeria/galeria-8.jpg',
    fallbackImage: 'https://lh3.googleusercontent.com/ci/AL18g_Tx83bNSQSwFstMb5z5e6q_9ygYb0ktaNgXUUjTN_c46_vj1dkIBhEV3Ms87_bmbYMPfjvv8Hg=s1200',
    alt: 'Terraza de la Catedral de León al atardecer',
  },
]

export default function SectionGaleria() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="galeria"
      ref={ref}
      className="relative py-24 overflow-hidden bg-white border-b border-slate-200/80"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* ── Encabezado sobrio ── */}
        <div className="max-w-3xl mb-14">
          <motion.h2
            className="font-serif leading-tight mb-4 text-slate-900 organic-underline font-bold"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="highlight-blue">Galería</span> <span className="highlight-orange">Fotográfica</span> <span className="highlight-orange">de</span> <span className="highlight-orange">la</span> <span className="highlight-orange">Basílica</span>
          </motion.h2>

          <motion.p
            className="font-sans text-slate-600 text-base md:text-lg leading-relaxed font-normal"
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            Perspectivas arquitectónicas de la fachada barroco-neoclásica, la terraza de cúpulas blancas y el interior de cinco naves.
          </motion.p>
        </div>

        {/* ── DepthCarousel ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: 'clamp(560px, 58vw, 740px)', position: 'relative' }}
        >
          <DepthCarousel
            items={GALERIA_ITEMS}
            cardWidth={410}
            cardHeight={520}
            radius={12}
            tint="#0f172a"
            depth={150}
            spread={40}
            tilt={18}
            tiltDirection="right"
            perspective={1400}
            visibleCards={3}
            falloff={0.22}
            blur={0}
            duration={480}
            ease="power3.out"
            autoplay
            autoplayDelay={3200}
            loop
            showControls
            showIndicators
          />
        </motion.div>

        {/* Hint de interacción con icono limpio */}
        <motion.div
          className="flex items-center justify-center gap-2 text-center font-sans text-xs tracking-wider uppercase mt-8 text-slate-400 font-medium"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-blue-600">
            <path d="M8 3 4 7l4 4M4 7h16M16 21l4-4-4-4M20 17H4" />
          </svg>
          <span>Arrastra o utiliza los controles para explorar las fotografías</span>
        </motion.div>

      </div>
    </section>
  )
}

