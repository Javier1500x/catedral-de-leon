import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_ITEMS = [
  { label: 'Galería',      href: '#galeria'      },
  { label: 'Visita',       href: '#visita'       },
  { label: 'Historia',     href: '#historia'     },
  { label: 'Arquitectura', href: '#arquitectura' },
  { label: 'Modelos 3D',   href: '#vista3d'      },
  { label: 'Patrimonio',   href: '#patrimonio'   },
  { label: 'Rubén Darío',  href: '#ruben-dario'  },
  { label: 'Curiosidades', href: '#curiosidades' },
  { label: 'León',         href: '#leon'         },
  { label: 'Reliquias',    href: '#reliquias'    },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const sections = NAV_ITEMS
      .map(item => document.querySelector(item.href))
      .filter(Boolean)
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        let current = ''
        sections.forEach(section => {
          if (window.scrollY >= section.offsetTop - 160) current = `#${section.id}`
        })
        setActive(previous => previous === current ? previous : current)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return undefined
    const previousOverflow = document.body.style.overflow
    const onKeyDown = event => { if (event.key === 'Escape') setMenuOpen(false) }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  const handleNav = href => {
    setMenuOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.header
        className="fixed top-4 left-0 right-0 z-50 pointer-events-none flex justify-center items-center px-4"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Desktop Floating Navigation — Barra blanca semi-transparente, botones resaltados */}
        <nav className="pointer-events-auto hidden md:flex max-w-[calc(100vw-2rem)] flex-nowrap items-center gap-0.5 p-1 rounded-full bg-white/90 backdrop-blur-xl border border-slate-200/60 shadow-lg shadow-slate-100/25 overflow-x-auto navbar-scroll">
          {NAV_ITEMS.map(({ label, href }) => {
            const isSelected = active === href
            return (
              <button
                key={href}
                onClick={() => handleNav(href)}
                className={`relative px-2.5 py-2 rounded-full font-sans text-[0.65rem] tracking-[0.08em] uppercase font-semibold transition-all duration-200 ${
                  isSelected
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-700 hover:text-blue-800 hover:bg-blue-50 active:scale-95'
                }`}
              >
                {label}
              </button>
            )
          })}
        </nav>

        {/* Mobile Navigation Trigger */}
        <div className="pointer-events-auto md:hidden w-full flex justify-end">
          <button
            className="mobile-menu-trigger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span
                className={`h-0.5 w-full bg-white rounded-full transition-transform duration-300 ${
                  menuOpen ? 'rotate-45 translate-y-1.5' : ''
                }`}
              />
              <span
                className={`h-0.5 w-full bg-white rounded-full transition-opacity duration-300 ${
                  menuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`h-0.5 w-full bg-white rounded-full transition-transform duration-300 ${
                  menuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu-overlay fixed inset-0 z-40 bg-slate-950/95 flex flex-col items-center p-6 md:hidden overflow-y-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            onKeyDown={event => { if (event.key === 'Escape') setMenuOpen(false) }}
          >
            <div className="flex flex-col gap-2 text-center w-full max-w-xs">
              {NAV_ITEMS.map(({ label, href }, idx) => {
                const isSelected = active === href
                return (
                  <motion.button
                    key={href}
                    onClick={() => handleNav(href)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`min-h-11 py-2.5 px-6 rounded-2xl font-serif text-lg tracking-wide uppercase transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {label}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

