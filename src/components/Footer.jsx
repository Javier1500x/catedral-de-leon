export default function Footer() {
  return (
    <footer
      className="relative py-14 bg-slate-900 text-white overflow-hidden"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
          {/* Marca / Tipografía limpia sin logos de la catedral */}
          <div className="text-center md:text-left">
            <p className="font-serif font-bold text-white text-2xl mb-1">
              Catedral de León
            </p>
            <p className="font-sans text-xs uppercase tracking-widest text-blue-400 font-semibold">
              Real e Insigne Basílica de la Asunción · León, Nicaragua
            </p>
          </div>

          {/* Info y Créditos */}
          <div className="flex flex-col items-center md:items-end gap-1 text-center md:text-right">
            <p className="font-sans text-slate-300 text-xs tracking-wider uppercase font-semibold">
              Patrimonio Mundial de la UNESCO · 2011
            </p>
            <p className="font-sans text-slate-400 text-xs">
              Fotografías, modelos 3D y documentación: Dominio Público &amp; UNESCO
            </p>
          </div>
        </div>

        {/* Cita de cierre sobria */}
        <div className="mt-8 text-center text-slate-400 text-xs font-sans">
          <p>
            © {new Date().getFullYear()} Catedral de León — Monografía Histórica y Arquitectónica.
          </p>
        </div>
      </div>
    </footer>
  )
}

