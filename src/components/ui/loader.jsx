import React from 'react'
import { motion } from 'framer-motion'

export function LoaderOne({ className = '' }) {
  return (
    <div
      className={`relative flex items-center justify-center gap-1.5 py-2 ${className}`}
      role="status"
      aria-label="Cargando"
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-8 rounded-full bg-gradient-to-t from-[#1d4ed8] via-[#2563eb] to-[#60a5fa] shadow-[0_0_14px_rgba(37,99,235,0.4)]"
          animate={{
            scaleY: [0.3, 1.25, 0.3],
            opacity: [0.35, 1, 0.35],
          }}
          transition={{
            duration: 1.05,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  )
}

export function LoaderOneDemo() {
  return <LoaderOne />
}

