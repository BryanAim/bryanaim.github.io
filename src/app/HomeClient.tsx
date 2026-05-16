'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { m, AnimatePresence } from 'framer-motion'
import Typed from 'typed.js'
import Image from 'next/image'
import Link from 'next/link'
import { SOCIALS } from '@/lib/siteConfig'
import { TestimonialsStrip } from './components/TestimonialsStrip'

const TYPED_STRINGS = [
  'Full Stack Developer.',
  'Creative Designer.',
  'Community Builder.',
]

// Bio for each typed string — fires after typing finishes, before deletion starts
const TYPED_BIOS = [
  "Writing clean code and shipping fast products. From Google Africa Scholar to full-stack developer — the terminal is home.",
  "Where art meets technology. Crafting brand identities, motion graphics, and interfaces that actually mean something.",
  "Art and technology enthusiast on a mission. Building for Africa, mentoring the next generation, beyond the screen.",
]

const BG_IMAGES = [
  '/img/background.jpg',
  '/img/projects/design/compositions/avril-music.jpg',
  '/img/projects/design/compositions/mike-explode.jpg',
  '/img/bmx/bmx23-bg.jpg',
]

/* ─── Background portal — rendered into document.body to escape PageTransition's
   transform containing block, which breaks position:fixed on descendant elements ─── */
function HomeBg({ bgIndex }: { bgIndex: number }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-0" aria-hidden="true">
      {BG_IMAGES.map((src, i) => (
        <m.div
          key={src}
          className="home-bg-slide absolute inset-0 overflow-hidden"
          animate={{ opacity: i === bgIndex ? 1 : 0 }}
          transition={{ duration: 1.4 }}
        >
          <Image
            src={src}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority={i === 0}
          />
        </m.div>
      ))}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(105deg, rgba(34,34,34,0.96) 0%, rgba(34,34,34,0.82) 45%, rgba(34,34,34,0.35) 100%)' }}
      />
    </div>,
    document.body
  )
}

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
        <m.div
          className="home-scroll-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 2.5, duration: 0.6 }}
        >
          <span>Scroll</span>
          <div className="home-scroll-line" />
        </m.div>
      )}
    </AnimatePresence>
  )
}

/* ─── Page ─── */
export default function Home() {
  const typeRef = useRef<HTMLSpanElement>(null)
  const [bgIndex, setBgIndex] = useState(0)
  const [bioIndex, setBioIndex] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => setBgIndex(c => (c + 1) % BG_IMAGES.length), 7000)
  }

  // Background cycles independently — slow enough to read
  useEffect(() => {
    startInterval()
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  const goToSlide = (i: number) => {
    setBgIndex(i)
    startInterval()
  }

  // Bio syncs to Typed.js — updates only after a string is fully typed
  useEffect(() => {
    const typed = new Typed(typeRef.current, {
      strings: TYPED_STRINGS,
      startDelay: 800,
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
    <main id="home" className="relative overflow-hidden px-0 py-0 bg-none">
      <HomeBg bgIndex={bgIndex} />

      {/* ── Hero row: content + portrait side by side ── */}
      <div className="relative z-10 min-h-screen flex items-center">
      <div className="flex items-center justify-between gap-12 px-20 w-full max-lg:flex-col max-lg:gap-6 max-lg:px-8 max-sm:px-6 max-sm:pt-20 max-sm:pb-10 max-sm:text-center">
        <div className="flex-1 max-w-2xl">
          <m.p
            className="flex items-center gap-2 text-[10px] max-sm:text-[9px] font-bold uppercase tracking-widest text-white/35 mb-4 max-lg:justify-center"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          >
            <span className="inline-block w-6 h-px bg-lime/60 shrink-0 max-sm:hidden" />
            Based in Nakuru, Kenya
          </m.p>

          <m.h1
            className="font-black leading-tight tracking-tighter text-white mb-4"
            style={{ fontSize: 'clamp(2.8rem, 10vw, 6.5rem)' }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            Isale<br />
            <span className="block text-lime">Brian.</span>
          </m.h1>

          <m.div
            className="flex items-center gap-2 mb-5 min-h-8 max-sm:justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <span className="text-xl font-bold text-teal shrink-0" aria-hidden="true">›</span>
            <span ref={typeRef} className="text-base max-sm:text-sm text-white/75 font-medium" aria-hidden="true" />
            <span className="sr-only" aria-live="polite" aria-atomic="true">{TYPED_STRINGS[bioIndex]}</span>
          </m.div>

          {/* Bio — synced to Typed.js string completion */}
          <div className="min-h-16 mb-7 max-sm:min-h-14">
            <AnimatePresence mode="wait">
              <m.p
                key={bioIndex}
                className="text-sm max-sm:text-xs leading-relaxed text-white/65 max-w-xl max-sm:max-w-xs max-sm:mx-auto"
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -1.5 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                {TYPED_BIOS[bioIndex]}
              </m.p>
            </AnimatePresence>
          </div>

          <m.div
            className="flex flex-wrap gap-3 mb-8 max-sm:flex-col max-sm:items-center"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.05, ease: 'easeOut' }}
          >
            <Link href="/about" className="inline-flex items-center gap-2 px-5 py-2.5 bg-lime text-black font-black text-xs uppercase tracking-widest rounded-md transition-all duration-200 hover:bg-[#c8f000] hover:-translate-y-0.5 hover:shadow-lg" style={{boxShadow: 'none'}}>
              About Me <i className="fas fa-arrow-right text-xs transition-transform duration-200" />
            </Link>
            <Link href="/work#services" className="inline-flex items-center justify-center px-5 py-2.5 border border-white/20 text-white font-bold text-xs uppercase tracking-widest rounded-md bg-black/40 backdrop-blur transition-all duration-200 hover:border-teal hover:text-teal hover:bg-teal/6">
              Services
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center px-5 py-2.5 border border-white/20 text-white font-bold text-xs uppercase tracking-widest rounded-md bg-black/40 backdrop-blur transition-all duration-200 hover:border-teal hover:text-teal hover:bg-teal/6">
              Get in touch
            </Link>
          </m.div>

          <m.div
            className="flex flex-wrap gap-1 max-sm:justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.3 }}
          >
            {SOCIALS.map((s, i) => (
              <m.a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-10 h-10 inline-flex items-center justify-center text-sm text-white/35 rounded-lg transition-all duration-200 hover:bg-white/[0.07]"
                initial={{ opacity: 0, y: 2.5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + i * 0.07, duration: 0.35 }}
                whileHover={{ y: -0.75, color: s.color }}
              >
                <i className={s.icon} aria-hidden="true" />
              </m.a>
            ))}
          </m.div>

          {/* ── Slide dots ── */}
          <m.div
            className="flex gap-2 mt-3 max-sm:justify-center"
            role="group"
            aria-label="Background slide controls"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.5 }}
          >
            {BG_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === bgIndex ? 'true' : undefined}
                className={`h-1 rounded transition-all duration-400 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime ${i === bgIndex ? 'w-9 bg-lime' : 'w-5 bg-white/20 hover:bg-white/40'}`}
              />
            ))}
          </m.div>

          {/* ── Personal aside ── */}
          <m.div
            className="mt-4 max-sm:justify-center flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.7 }}
          >
            <Link
              href="/bmx"
              className="text-[11px] text-white/30 hover:text-white/55 transition-colors duration-200 tracking-wide"
            >
              Off the clock: BMX rider, lifelong learner &amp; friend &rarr;
            </Link>
          </m.div>
        </div>

        {/* Portrait — flex sibling, no absolute positioning */}
        <div className="shrink-0 w-72 aspect-square pointer-events-none max-lg:hidden" aria-hidden="true">
          <m.div
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
              sizes="(max-width: 1023px) 208px, 288px"
              priority
            />
          </m.div>
        </div>
      </div>
      </div>

      <div className="relative z-10">
        <TestimonialsStrip />
      </div>

      <ScrollHint />
    </main>
  )
}
