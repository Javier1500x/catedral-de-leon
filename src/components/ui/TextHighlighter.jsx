import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

export function TextHighlighter({ children, variant = 'blue-marker', delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (inView) setVisible(true)
  }, [inView])

  const arr = String(children).split(' ')

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {arr.map((word, i) => (
        <span key={i} className="relative inline-block">
          <span className="relative">{word}{i < arr.length - 1 && ' '}</span>
          <span
            className="absolute inset-0 pointer-events-none opacity-0"
            style={{
              background:
                variant === 'orange-underline'
                  ? 'linear-gradient(135deg, transparent 49%, orange 50%), linear-gradient(135deg, orange 50%, transparent 51%)'
                  : 'linear-gradient(135deg, transparent 49%, blue 50%), linear-gradient(135deg, blue 50%, transparent 51%)',
              backgroundSize: '200% 2px',
            }}
          />
        </span>
      ))}
    </motion.span>
  )
}
