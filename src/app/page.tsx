'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Typed from 'typed.js'
import Image from 'next/image'
import Link from 'next/link'

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
    <main id="home" className="relative overflow-hidden px-0 py-0 min-h-screen flex items-center bg-none">
      {/* ── Background slideshow ── */}
      <div className="fixed inset-0 z-0" aria-hidden="true">
        {BG_IMAGES.map((src, i) => (
          <div
            key={src}
            className="home-bg-slide absolute inset-0 bg-cover bg-center transition-opacity duration-1400"
            style={{ backgroundImage: `url('${src}')`, opacity: i === bgIndex ? 1 : 0 }}
          />
        ))}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(105deg, rgba(34,34,34,0.96) 0%, rgba(34,34,34,0.82) 45%, rgba(34,34,34,0.35) 100%)' }}
        />
      </div>

      {/* ── Hero row: content + portrait side by side ── */}
      <div className="relative z-10 flex items-center justify-between gap-12 px-20 w-full max-lg:flex-col max-lg:gap-6 max-lg:px-8 max-sm:px-4 max-sm:pt-24 max-sm:text-center">
        <div className="flex-1 max-w-2xl">
          <motion.p
            className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/40 mb-5 max-lg:justify-center"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          >
            <span className="inline-block w-8 h-px bg-lime flex-shrink-0" />
            Based in Nakuru, Kenya
          </motion.p>

          <motion.h1
            className="text-6xl font-black leading-tight tracking-tighter text-white mb-5 max-2xl:text-5xl max-lg:text-5xl max-sm:text-4xl"
            style={{ fontSize: 'clamp(3.2rem, 8vw, 6.5rem)' }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            Isale<br />
            <span className="block text-lime">Brian.</span>
          </motion.h1>

          <motion.div
            className="flex items-center gap-2 mb-6 min-h-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <span className="text-xl font-bold text-teal flex-shrink-0" aria-hidden="true">›</span>
            <span ref={typeRef} className="text-lg text-white/75 font-medium" aria-live="polite" aria-atomic="true" />
          </motion.div>

          {/* Bio — synced to Typed.js string completion */}
          <div className="min-h-20 mb-8">
            <AnimatePresence mode="wait">
              <motion.p
                key={bioIndex}
                className="text-sm leading-relaxed text-white/50 max-w-xl"
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -1.5 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                {TYPED_BIOS[bioIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          <motion.div
            className="flex flex-wrap gap-4 mb-10 max-sm:flex-col max-sm:items-center"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.05, ease: 'easeOut' }}
          >
            <Link href="/about" className="inline-flex items-center gap-2 px-6 py-3 bg-lime text-black font-black text-sm uppercase tracking-widest rounded-md transition-all duration-200 hover:bg-[#c8f000] hover:-translate-y-0.5 hover:shadow-lg" style={{boxShadow: 'none'}}>
              About Me <i className="fas fa-arrow-right text-xs transition-transform duration-200" />
            </Link>
            <Link href="/work#services" className="inline-flex items-center justify-center px-6 py-3 border border-white/20 text-white font-bold text-sm uppercase tracking-widest rounded-md bg-black/40 backdrop-blur transition-all duration-200 hover:border-teal hover:text-teal hover:bg-teal/6">
              Services
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center px-6 py-3 border border-white/20 text-white font-bold text-sm uppercase tracking-widest rounded-md bg-black/40 backdrop-blur transition-all duration-200 hover:border-teal hover:text-teal hover:bg-teal/6">
              Get in touch
            </Link>
          </motion.div>

          <motion.div
            className="flex gap-1"
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
                aria-label={s.label}
                className="w-11 h-11 inline-flex items-center justify-center text-base text-white/35 rounded-lg transition-all duration-200 hover:bg-white/[0.07]"
                initial={{ opacity: 0, y: 2.5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + i * 0.07, duration: 0.35 }}
                whileHover={{ y: -0.75, color: s.color }}
              >
                <i className={s.icon} aria-hidden="true" />
              </motion.a>
            ))}
          </motion.div>

          {/* ── Slide dots ── */}
          <motion.div
            className="flex gap-2 mt-4 pointer-events-none max-sm:justify-center"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.5 }}
          >
            {BG_IMAGES.map((_, i) => (
              <div key={i} className={`h-1 rounded transition-all duration-400 ${i === bgIndex ? 'w-9 bg-lime' : 'w-5 bg-white/20'}`} />
            ))}
          </motion.div>
        </div>

        {/* Portrait — flex sibling, no absolute positioning */}
        <div className="flex-shrink-0 w-72 aspect-square pointer-events-none max-lg:hidden" aria-hidden="true">
          <motion.div
            className="relative w-full h-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="absolute rounded-full pointer-events-none -z-10"
              style={{ inset: '-25%', background: 'radial-gradient(circle, rgba(177,219,0,0.12) 0%, transparent 65%)' }}
            />
            <div className="home-portrait-ring" />
            <Image
              src="/img/portrait.jpg"
              alt="Brian Isale"
              className="w-full h-full object-cover object-top rounded-full block"
              style={{ boxShadow: '0 0 0 5px rgba(177,219,0,0.15), 0 0 0 12px rgba(177,219,0,0.05), 0 24px 64px rgba(0,0,0,0.65)' }}
              width={800}
              height={1000}
              priority
            />
          </motion.div>
        </div>
      </div>

      <ScrollHint />
    </main>
  )
}
