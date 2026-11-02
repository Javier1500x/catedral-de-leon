import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import LoadingFrame from './ui/LoadingFrame'
import DiaTextReveal from './ui/DiaTextReveal'

const GOOGLE_MAPS_EMBED = 'https://www.google.com/maps?q=Catedral+de+Le%C3%B3n,+Nicaragua&output=embed'
const GOOGLE_STREET_VIEW = 'https://www.google.com/maps/embed?pb=!4v1792861860567!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQzQzOHJhTFE.!2m2!1d12.43504162555334!2d-86.87812332249554!3f93.71201195902684!4f16.38869245873346!5f0.7820865974627469'
const GOOGLE_MAPS_DIRECTIONS = 'https://www.google.com/maps/dir/?api=1&destination=Catedral+de+Le%C3%B3n,+Nicaragua'

export default function SectionVisita() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="visita" ref={ref} className="relative py-24 bg-slate-50/70 border-b border-slate-200/80">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-12">
          <motion.h2
            className="font-serif leading-tight mb-4 text-slate-900 font-bold"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)' }}
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span>Planifica</span> tu visita
          </motion.h2>
          <p className="font-sans text-slate-600 text-base md:text-lg leading-relaxed">
            Ubicación, horarios, tarifas y recomendaciones para recorrer la basílica y sus terrazas.
          </p>
        </div>

        <div className="visit-layout">
          <motion.div
            className="visit-map-panel"
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <LoadingFrame
              className="visit-map-frame"
              title="Mapa de ubicación de la Catedral de León, Nicaragua"
              src={GOOGLE_MAPS_EMBED}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className="visit-map-caption">
              <div>
                <span className="visit-eyebrow">Ubicación</span>
                <h3>Catedral de León</h3>
                <p>Frente al Parque Central Juan José Quezada, en el centro histórico de León.</p>
              </div>
              <a href={GOOGLE_MAPS_DIRECTIONS} target="_blank" rel="noreferrer">Cómo llegar</a>
            </div>
          </motion.div>

          <motion.div
            className="visit-details"
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.18 }}
          >
            <div className="visit-info-block">
              <DiaTextReveal as="span" className="visit-eyebrow">Horario de recorridos</DiaTextReveal>
              <h3><DiaTextReveal as="span">Todo el año</DiaTextReveal></h3>
              <DiaTextReveal as="p"><strong>Lunes a sábado</strong><br />8:30 a. m.–12:00 m. · 2:00–4:30 p. m.</DiaTextReveal>
              <DiaTextReveal as="p"><strong>Domingos</strong><br />8:30 a. m.–12:30 p. m.</DiaTextReveal>
              <DiaTextReveal as="p"><strong>Semana Santa</strong><br />Lunes a miércoles, 8:30 a. m.–12:00 m.</DiaTextReveal>
              <DiaTextReveal as="p" className="visit-small-note">Último acceso 30 minutos antes del cierre. No hay visitas durante misa.</DiaTextReveal>
            </div>

            <div className="visit-info-block">
              <DiaTextReveal as="span" className="visit-eyebrow">Tarifas por sitio</DiaTextReveal>
              <DiaTextReveal as="div" className="visit-price-row"><span>Planta media · nacional</span><strong>Entrada libre</strong></DiaTextReveal>
              <DiaTextReveal as="div" className="visit-price-row"><span>Cúpulas, sótanos o patio · nacional</span><strong>C$55</strong></DiaTextReveal>
              <DiaTextReveal as="div" className="visit-price-row"><span>Estudiantes con identificación</span><strong>C$20</strong></DiaTextReveal>
              <DiaTextReveal as="div" className="visit-price-row"><span>Planta media · extranjero</span><strong>US$1</strong></DiaTextReveal>
              <DiaTextReveal as="div" className="visit-price-row"><span>Cúpulas, sótanos o patio · extranjero</span><strong>US$3</strong></DiaTextReveal>
            </div>

            <div className="visit-tip">
              <DiaTextReveal as="span" className="visit-eyebrow">Recomendación</DiaTextReveal>
              <DiaTextReveal as="p">Para subir a las terrazas, considera llegar al inicio del horario de la mañana. Tendrás más margen para el recorrido y evitarás las horas de mayor calor. La última entrada se realiza media hora antes del cierre.</DiaTextReveal>
            </div>

            <p className="visit-rules">No se admiten perros. Los grupos de más de 20 personas requieren reservación. Los horarios pueden cambiar durante celebraciones religiosas o días festivos; confirma antes de viajar.</p>
        
          </motion.div>
        </div>

        <motion.div
          className="visit-streetview-panel"
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.22 }}
        >
          <div className="visit-streetview-heading">
            <div>
              <span className="visit-eyebrow">Explora antes de llegar</span>
              <h3>La fachada desde Google Maps</h3>
            </div>
            <p>Vista panorámica de la Catedral junto al Parque Central.</p>
          </div>
          <LoadingFrame
            className="visit-streetview-frame"
            title="Vista panorámica de la fachada de la Catedral de León en Google Maps"
            src={GOOGLE_STREET_VIEW}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </motion.div>
      </div>
    </section>
  )
}
