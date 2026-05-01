'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SITE } from '@/lib/siteConfig'

const WA_URL = `https://wa.me/${SITE.waNumber}?text=${encodeURIComponent(SITE.waMessage)}`

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false)

  return (
    <div className="wa-wrap">
      <AnimatePresence>
        {hovered && (
          <motion.span
            className="wa-label"
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            Chat on WhatsApp
          </motion.span>
        )}
      </AnimatePresence>

      <motion.a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-btn"
        aria-label="Chat on WhatsApp"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <i className="fab fa-whatsapp" />
      </motion.a>
    </div>
  )
}
