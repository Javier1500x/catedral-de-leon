import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LoaderOne } from './ui/loader'

/**
 * IntroSplash — Pantalla de bienvenida minimalista
 * Fases: loading → reveal → exit
 */
export default function IntroSplash({ onComplete }) {
  const [phase, setPhase] = useState('loading')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('reveal'), 1600)
    const t2 = setTimeout(() => setPhase('exit'), 3800)
    const t3 = setTimeout(() => onComplete?.(), 4600)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onComplete])

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-white"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === 'exit' ? 0 : 1 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          onAnimationComplete={() => { if (phase === 'exit') onComplete?.() }}
        >
          {/* Fondo sutil con resplandor suave */}
          <div
            className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, rgba(255,255,255,0) 70%)',
              filter: 'blur(70px)',
            }}
            aria-hidden="true"
          />

          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'radial-gradient(#94a3b8 0.75px, transparent 0.75px)',
              backgroundSize: '24px 24px',
            }}
            aria-hidden="true"
          />

          {/* ── Loader ── */}
          <motion.div
            className="relative mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <LoaderOne />
          </motion.div>

          {/* ── Texto de carga y reveal ── */}
          <AnimatePresence mode="wait">
            {phase === 'loading' && (
              <motion.div
                key="loading-text"
                className="text-center"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
              >
                <p className="font-sans text-slate-500 tracking-[0.35em] text-xs font-semibold uppercase">
                  Un momento
                </p>
              </motion.div>
            )}

            {phase === 'reveal' && (
              <motion.div
                key="title"
                className="text-center px-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1
                  className="font-serif text-slate-900 leading-none mb-3 font-bold"
                  style={{ fontSize: 'clamp(2.6rem, 7vw, 5.5rem)', letterSpacing: '-0.02em' }}
                >
                 
                </h1>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Línea decorativa inferior */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'reveal' ? 0.7 : 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
          
            <motion.div
              className="w-px h-7 bg-gradient-to-b from-blue-500 to-transparent"
              animate={{ scaleY: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

