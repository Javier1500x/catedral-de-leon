import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

/** A one-time, palette-matched color sweep that runs when visit information enters view. */
export default function DiaTextReveal({ as: Tag = 'span', className = '', children }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.25 })
  const reduceMotion = useReducedMotion()

  return (
    <Tag ref={ref} className={`dia-text-reveal ${className}`}>
      <span className="dia-text-reveal-base">{children}</span>
      {!reduceMotion && (
        <motion.span
          aria-hidden="true"
          className="dia-text-reveal-color"
          initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 1 }}
          animate={inView ? {
            clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)', 'inset(0 0% 0 0)'],
            opacity: [1, 1, 0],
          } : {}}
          transition={{ duration: 1.35, times: [0, 0.78, 1], ease: 'easeOut' }}
        >
          {children}
        </motion.span>
      )}
    </Tag>
  )
}
