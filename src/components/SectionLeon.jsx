import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const LUGARES = [
  {
    stop: 1, type: 'Circuito Creativo Dariano · Casa museo', name: 'Casa Museo y Archivo Rubén Darío',
    text: 'La casa donde el poeta vivió sus primeros catorce años conserva objetos, manuscritos y recuerdos de su vida en León.',
    image: 'https://www.visitleon.info/uploads/1/2/0/4/120453990/casa-archivo-museo-ruben-dario-top-10-visit-leon-nicaragua_1_orig.jpg',
    source: 'https://www.visitleon.info/casa-museo-archivo-ruben-dario.html', query: 'Casa Museo Archivo Rubén Darío León Nicaragua', x: 17, y: 70,
  },
  {
    stop: 2, type: 'Circuito Creativo Dariano · Escultura', name: 'Motivos del Lobo · San Francisco',
    text: 'Escultura de Maruca Gómez inspirada en el poema de Darío, situada en el atrio del histórico Santuario de San Francisco de Asís.',
    image: 'https://www.visitleon.info/uploads/1/2/0/4/120453990/escultura-paz-hermano-lobo-ruta-ruben-dario-leon-nicaragua_orig.jpg',
    source: 'https://www.visitleon.info/escultura-paz-hermano-lobo.html', query: 'Iglesia San Francisco León Nicaragua', x: 30, y: 66,
  },
  {
    stop: 3, type: 'Circuito Creativo Dariano · Parque', name: 'Parque de los Poetas',
    text: 'Un pequeño anfiteatro urbano homenajea a Darío y a cuatro poetas leoneses con bustos y versos grabados.',
    image: 'https://www.visitleon.info/uploads/1/2/0/4/120453990/estatua-de-ruben-dario-en-el-parque-de-los-poetas-en-leon-nicaragua.jpg',
    source: 'https://www.visitleon.info/parque-de-los-poetas.html', query: 'Parque de los Poetas León Nicaragua', x: 53, y: 68,
  },
  {
    stop: 4, type: 'Circuito Creativo Dariano · Teatro', name: 'Teatro Municipal José de la Cruz Mena',
    text: 'Escenario cultural leonés dedicado al compositor José de la Cruz Mena, donde Rubén Darío se presentó en dos ocasiones.',
    image: 'https://www.visitleon.info/uploads/1/2/0/4/120453990/teatro-municipal-jose-de-la-cruz-menan-ruta-ruben-dario_orig.jpg',
    source: 'https://www.visitleon.info/teatro-municipal-jose-de-la-cruz-mena.html', query: 'Teatro Municipal José de la Cruz Mena León Nicaragua', x: 55, y: 27,
  },
  {
    stop: 5, type: 'Circuito Creativo Dariano · Cultura', name: 'Centro Cultural Rubén Darío',
    text: 'Una parada cultural vinculada al legado del poeta y a la vida artística de León.',
    image: 'https://images.squarespace-cdn.com/content/v1/5ebad507d10b510f862a1bbb/1599621995686-1SJYYVSUNYGH6EHYC4CH/LeonbuildingRubenDariopoetryfestival.jpg',
    source: 'https://www.nicaraguacreativa.com/2021/05/27/ciudad-creativa-leon/', query: 'Centro Cultural Rubén Darío León Nicaragua', x: 55, y: 27,
  },
  {
    stop: 6, type: 'Circuito Creativo Dariano · Exposición', name: 'Vallas informativas · Vida y obra de Darío',
    text: 'La exposición permanente de la UNAN-León recorre en catorce paneles ilustrados la vida y obra del poeta.',
    image: 'https://www.visitleon.info/uploads/1/2/0/4/120453990/exposici-n-pict-rica-de-rub-n-dar-o-en-la-unan-leon-de-nicaragua.jpg',
    source: 'https://www.visitleon.info/exposicion-pictorica-permanente-de-la-vida-y-obra-de-ruben-dario.html', query: 'Exposición Rubén Darío UNAN León Nicaragua', x: 66, y: 29,
  },
  {
    stop: 7, type: 'Circuito Creativo Dariano · Catedral', name: 'Catedral y tumba de Rubén Darío',
    text: 'En la Catedral Basílica de la Asunción descansan los restos del poeta, junto a la pila bautismal donde fue bautizado.',
    image: 'https://cloudfront-us-east-1.images.arcpublishing.com/gruponacion/IZNPAM5CVJAM7LPJ4OSMNSY7DE.jpg',
    source: 'https://www.visitleon.info/catedral-de-leon.html', query: 'Catedral de León Nicaragua', x: 77, y: 65,
  },
  {
    stop: 8, type: 'Circuito Creativo Dariano · Artes', name: 'Escuela de Bellas Artes Mariana Sansón Argüello',
    text: 'Centro de formación artística en un edificio histórico de León, nombrado en honor a la poeta y pintora nicaragüense.',
    image: 'https://www.el19digital.com/files/notas/source/2023/JULIO/17Jul/ESCUELA/escuela3.jpg',
    source: 'https://www.vivanicaragua.com.ni/2023/07/17/sociales/leon-mariana-sanson-arguello/', query: 'Escuela Bellas Artes Mariana Sansón Argüello León', x: 88, y: 83,
  },
  {
    type: 'Patrimonio Mundial · UNESCO', name: 'Ruinas de León Viejo',
    text: 'El primer asentamiento de León, fundado en 1524 y abandonado tras terremotos y actividad volcánica. Sus vestigios muestran cómo se organizaban las primeras ciudades coloniales de la región.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK-SjgJy0q2iupwZsJcaZwk6lPp4aISeCwaN-6tCMdiQ&s=10',
    source: 'https://whc.unesco.org/es/list/613', query: 'Ruinas de León Viejo Nicaragua',
  },
  {
    type: 'Historia contemporánea', name: 'Museo de la Revolución',
    text: 'Un espacio de memoria oral y objetos relacionados con la historia revolucionaria de León, a pocos minutos a pie del Parque Central.',
    image: 'https://www.visitleon.info/uploads/1/2/0/4/120453990/museo-de-la-revolucion-en-leon-nicaragua-visit-leon-nicaragua-orig_orig.jpg',
    source: 'https://www.visitleon.info/museo-de-la-revolucion.html', query: 'Museo de la Revolución León Nicaragua',
  },
  {
    type: 'Arquitectura religiosa', name: 'Iglesia La Recolección',
    text: 'Su fachada barroca de cantería es uno de los conjuntos arquitectónicos más reconocibles del centro histórico, a pocas cuadras de la Catedral.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq1xOgcS8OF0xLQ8_przQiCYNZgSGWq2_JDzpiWA8tjXQGsZ67UUh7fdrv&s=10',
    source: 'https://www.visitleon.info/iglesia-la-recoleccion.html', query: 'Iglesia La Recolección León Nicaragua',
  },
  {
    type: 'Arte · colección del siglo XV a la actualidad', name: 'Centro de Arte Fundación Ortiz Gurdián',
    text: 'Dos casas históricas albergan obras de arte nicaragüense e internacional, en una visita que revela otra cara del patrimonio leonés.',
    image: 'https://www.el19digital.com/files/notas/source/juventud/Amor/1_Museo_Ortiz_Gurdian_4.jpg',
    source: 'https://www.visitleon.info/centro-de-arte-fundacion-ortiz-gurdian.html', query: 'Centro de Arte Fundación Ortiz Gurdián León Nicaragua',
  },
]

function CircuitMap() {
  const route = 'M 141 297 L 242 281 L 421 289 L 437 121 L 523 129 L 609 277 L 694 350'
  return (
    <div className="leon-map-frame">
      <div className="leon-map-topline"><span>LEÓN · NICARAGUA</span><span>RUTA URBANA · 8 PARADAS</span></div>
      <svg className="leon-map-svg" viewBox="0 0 800 430" role="img" aria-label="Mapa ilustrado del Circuito Creativo Dariano en el centro de León">
        <rect width="800" height="430" fill="#f3f5f4" />
        <g fill="#e1e5e5" opacity=".92">
          <path d="M0 20h138v80H0zM153 0h115v95H153zM286 0h125v104H286zM430 0h118v91H430zM565 0h117v110H565zM698 0h102v95H698z" />
          <path d="M0 118h122v83H0zM152 110h120v91H152zM290 119h112v79H290zM420 111h120v91H420zM557 126h114v75H557zM688 110h112v91H688z" />
          <path d="M0 220h135v73H0zM157 218h118v76H157zM290 214h120v84H290zM427 216h122v74H427zM566 218h111v78H566zM693 217h107v82H693z" />
          <path d="M0 311h125v97H0zM148 311h128v96H148zM293 310h113v98H293zM422 309h126v99H422zM565 312h116v96H565zM696 310h104v98H696z" />
        </g>
        <g fill="#c9d4d8"><path d="M134 0h17v430h-17zM274 0h15v430h-15zM409 0h13v430h-13zM548 0h14v430h-14zM680 0h14v430h-14z"/><path d="M0 99h800v16H0zM0 202h800v14H0zM0 296h800v15H0z"/></g>
        <g fill="#26b653"><rect x="296" y="230" width="76" height="50" rx="3"/><rect x="621" y="95" width="38" height="31" rx="2"/><rect x="184" y="344" width="29" height="33" rx="2"/></g>
        <g fill="#eaa233"><rect x="80" y="302" width="78" height="12"/><rect x="627" y="335" width="112" height="13"/></g>
        <path d={route} fill="none" stroke="#d82134" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        {LUGARES.filter((place) => place.stop).map((place) => {
          const x = 8 + place.x * 7.8
          const y = 10 + place.y * 4.1
          return <g key={place.stop} transform={`translate(${x} ${y})`}><circle r="15" fill="#fff" stroke="#d82134" strokeWidth="4"/><circle r="10" fill="#d82134"/><text y="4" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700">{place.stop}</text></g>
        })}
        <g fill="#334155" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="700"><text x="18" y="25">BARRIO EL CALVARIO</text><text x="590" y="402">CENTRO HISTÓRICO</text></g>
      </svg>
      <div className="leon-map-legend"><span><i /> Inicio del circuito</span><span><b /> Fin del circuito</span><span className="legend-route" /> Recorrido</div>
    </div>
  )
}

export default function SectionLeon() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <section id="leon" ref={ref} className="relative py-24 bg-slate-50/70 border-t border-slate-200/80">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-12">
          <motion.h2 className="font-serif leading-tight mb-4 text-slate-900 font-bold" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)' }} initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <span>Más por</span> descubrir en León
          </motion.h2>
          <p className="font-sans text-slate-600 text-base md:text-lg leading-relaxed">La Catedral puede ser el comienzo de una ruta por la memoria, las iglesias y el arte de la ciudad.</p>
        </div>
        <div className="leon-circuit-heading"><div><span className="leon-circuit-kicker">CIRCUITO CREATIVO · LEÓN</span><h3>Descubrí León</h3><p>Ciudad llena de historia, cultura y vida.</p></div></div>
        <div className="leon-stop-board" aria-label="Paradas del Circuito Creativo Dariano">
          {LUGARES.filter((place) => place.stop).map((place) => <a key={place.stop} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.query)}`} target="_blank" rel="noreferrer"><span>{String(place.stop).padStart(2, '0')}</span>{place.name}</a>)}
        </div>
        <CircuitMap />
        <div className="leon-places-heading"><span>CONOCÉ CADA PARADA</span><p>Ocho sitios del circuito y otros lugares que completan tu visita por León.</p></div>
        <div className="leon-places-grid">
          {LUGARES.map((lugar, index) => (
            <motion.article className="leon-place" key={lugar.name} initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: index * 0.04 }}>
              <div className="leon-place-image-wrap"><img src={lugar.image} alt={lugar.name} loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none' }} />{lugar.stop && <span className="leon-place-stop">PARADA {String(lugar.stop).padStart(2, '0')}</span>}</div>
              <div className="leon-place-copy"><span className="leon-place-type">{lugar.type}</span><h3>{lugar.name}</h3><p>{lugar.text}</p><div className="leon-place-links"><a href={lugar.source} target="_blank" rel="noreferrer">Historia y foto ↗</a><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lugar.query)}`} target="_blank" rel="noreferrer">Cómo llegar ↗</a></div></div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
