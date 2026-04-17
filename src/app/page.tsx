'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Typed from 'typed.js'
import Image from 'next/image'

// Bio for each typed string — fires after typing finishes, before deletion starts
// Typed string order: Full Stack Dev, Creative Designer, Community Builder, BMX Rider, Lifelong Learner, Friend
const TYPED_BIOS = [
  "Writing clean code and shipping fast products. From Google Africa Scholar to full-stack developer — the terminal is home.",
  "Where art meets technology. Crafting brand identities, motion graphics, and interfaces that actually mean something.",
  "Art and technology enthusiast on a mission. Building for Africa, mentoring the next generation, beyond the screen.",
  "When the laptop closes, the bike comes out. Learning BMX on Nakuru's streets since 2025 — every slam is a lesson.",
  "Always reading, always building, always questioning. Growth isn't a destination — it's a daily habit.",
  "At the end of the day, people matter most. Developer, designer, rider — but first, a friend.",
]

const BG_IMAGES = [
  '/img/background.jpg',
  '/img/projects/design/compositions/avril-music.jpg',
  '/img/projects/design/compositions/mike-explode.jpg',
  '/img/bmx/bmx23-bg.jpg',
]

const SOCIALS = [
  { icon: 'fab fa-github',    url: 'https://github.com/BryanAim',             label: 'GitHub',    color: '#b1db00' },
  { icon: 'fab fa-linkedin',  url: 'https://linkedin.com/in/brian-isale/',     label: 'LinkedIn',  color: '#b1db00' },
  { icon: 'fab fa-behance',   url: 'https://behance.net/isalebryan',           label: 'Behance',   color: '#1769ff' },
  { icon: 'fab fa-instagram', url: 'https://www.instagram.com/bryanisale/',    label: 'Instagram', color: '#e1306c' },
  { icon: 'fab fa-twitter',   url: 'https://twitter.com/IsaleBryan',           label: 'Twitter',   color: '#1d9bf0' },
  { icon: 'fab fa-dev',       url: 'https://dev.to/bryanaim',                  label: 'Dev.to',    color: '#b1db00' },
]

/* ─── Scroll hint ─── */
function ScrollHint() {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY < 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="home-scroll-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 2.5, duration: 0.6 }}
        >
          <span>Scroll</span>
          <div className="home-scroll-line" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─── Page ─── */
export default function Home() {
  const typeRef = useRef<HTMLSpanElement>(null)
  const [bgIndex, setBgIndex] = useState(0)
  const [bioIndex, setBioIndex] = useState(0)

  // Background cycles independently — slow enough to read
  useEffect(() => {
    const id = setInterval(() => setBgIndex(c => (c + 1) % BG_IMAGES.length), 7000)
    return () => clearInterval(id)
  }, [])

  // Bio syncs to Typed.js — updates only after a string is fully typed
  useEffect(() => {
    const typed = new Typed(typeRef.current, {
      strings: [
        'Full Stack Developer.',
        'Creative Designer.',
        'Community Builder.',
        'BMX Rider.',
        'Lifelong Learner.',
        'Friend.^1500',
      ],
      typeSpeed: 70,
      backSpeed: 35,
      backDelay: 2200, // hold the typed string long enough to read the bio
      loop: true,
      smartBackspace: true,
      onStringTyped: (arrayPos) => {
        setBioIndex(arrayPos % TYPED_BIOS.length)
      },
    })
    return () => typed.destroy()
  }, [])

  return (
    <main id="home">
      {/* ── Background slideshow ── */}
      <div className="home-bg-wrap" aria-hidden="true">
        {BG_IMAGES.map((src, i) => (
          <div
            key={src}
            className="home-bg-slide"
            style={{ backgroundImage: `url('${src}')`, opacity: i === bgIndex ? 1 : 0 }}
          />
        ))}
        <div className="home-bg-gradient" />
      </div>

      {/* ── Hero row: content + portrait side by side ── */}
      <div className="home-row">
        <div className="home-content">
          <motion.p
            className="home-eyebrow"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          >
            <span className="home-eyebrow-line" />
            Based in Nakuru, Kenya
          </motion.p>

          <motion.h1
            className="home-name"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            Isale<br />
            <span className="home-name-accent">Brian.</span>
          </motion.h1>

          <motion.div
            className="home-role-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <span className="home-role-cursor" aria-hidden="true">›</span>
            <span ref={typeRef} className="home-role" aria-live="polite" aria-atomic="true" />
          </motion.div>

          {/* Bio — synced to Typed.js string completion */}
          <div className="home-bio-wrap">
            <AnimatePresence mode="wait">
              <motion.p
                key={bioIndex}
                className="home-bio"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                {TYPED_BIOS[bioIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          <motion.div
            className="home-ctas"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.05, ease: 'easeOut' }}
          >
            <a href="/about" className="home-cta-primary">
              About Me <i className="fas fa-arrow-right" />
            </a>
            <a href="/work#services" className="home-cta-ghost">
              <i className="" /> Services
            </a>
            <a href="/contact" className="home-cta-ghost">
              Get in touch
            </a>
          </motion.div>

          <motion.div
            className="home-socials"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.3 }}
          >
            {SOCIALS.map((s, i) => (
              <motion.a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="home-social-btn"
                title={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + i * 0.07, duration: 0.35 }}
                whileHover={{ y: -3, color: s.color }}
              >
                <i className={s.icon} />
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Portrait — flex sibling, no absolute positioning */}
        <div className="home-portrait-wrap" aria-hidden="true">
          <motion.div
            className="home-portrait-inner"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="home-portrait-glow" />
            <div className="home-portrait-ring" />
            <Image src="/img/portrait.jpg" alt="Brian Isale" className="home-portrait-img" width={800} height={1000} priority />
          </motion.div>
        </div>
      </div>

      {/* ── Slide dots ── */}
      <div className="home-dots" aria-hidden="true">
        {BG_IMAGES.map((_, i) => (
          <div key={i} className={`home-dot${i === bgIndex ? ' active' : ''}`} />
        ))}
      </div>

      <ScrollHint />
    </main>
  )
}
