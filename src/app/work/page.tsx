'use client'

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { designProjects as allDesignProjects } from './designProjects'
import { devProjects, DevProject } from './devProjects'
import QuoteModal from '../components/QuoteModal'
import DesignGallery from '../components/DesignGallery'
import { services } from './services'
const SPRING = [0.16, 1, 0.3, 1] as const

/* ─── Dev project card ─── */
function DevCard({ p }: { p: DevProject }) {
  return (
    <motion.div
      className="group bg-white/[0.04] border border-white/[0.08] rounded-[10px] overflow-hidden transition-[border-color] duration-200 cursor-default"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, ease: SPRING }}
      whileHover={{ y: -4, boxShadow: '0 20px 50px rgba(0,0,0,0.45), 0 0 0 1px rgba(0,221,215,0.3)' }}
    >
      <div className="relative aspect-video overflow-hidden">
        <img src={p.img} alt={p.title} className="wk-dev-img w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-3 opacity-0 transition-opacity duration-[250ms] group-hover:opacity-100">
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-[0.35rem] px-[0.9rem] py-[0.45rem] bg-teal/15 border border-teal rounded-[5px] text-teal text-[0.82rem] no-underline transition-colors duration-200 hover:bg-teal/[0.28]"
          >
            <i className="fas fa-eye" /> View
          </a>
          {p.github && (
            <a
              href={p.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-[0.35rem] px-[0.9rem] py-[0.45rem] bg-teal/15 border border-teal rounded-[5px] text-teal text-[0.82rem] no-underline transition-colors duration-200 hover:bg-teal/[0.28]"
            >
              <i className="fab fa-github" /> GitHub
            </a>
          )}
        </div>
      </div>
      <div className="px-[1.1rem] pt-4 pb-[1.2rem]">
        <h3 className="text-base font-semibold text-white mb-[0.4rem]">{p.title}</h3>
        <p className="text-[0.85rem] text-[#aaa] leading-[1.55] mb-3">{p.desc}</p>
        <div className="flex flex-wrap gap-[0.35rem]">
          {p.tags.map(t => (
            <span
              key={t}
              className="text-[0.72rem] px-[0.55rem] py-[0.15rem] border border-teal/30 rounded-full text-teal"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Service card ─── */
function ServiceCard({ s, index, onQuote }: { s: (typeof services)[0]; index: number; onQuote: () => void }) {
  return (
    <motion.div
      className="sv-card bg-white/[0.04] border border-white/[0.08] rounded-xl p-6 flex flex-col gap-3 cursor-default"
      style={{ '--sv-color': s.color } as React.CSSProperties}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, boxShadow: `0 20px 50px rgba(0,0,0,0.45), 0 0 0 1px ${s.color}55` }}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className="w-11 h-11 rounded-[10px] flex items-center justify-center text-[1.1rem] shrink-0"
          style={{ color: s.color, background: `${s.color}18` }}
        >
          <i className={s.icon} />
        </span>
        <div className="flex flex-col items-end gap-[0.2rem]">
          <span className="text-[0.9rem] font-bold" style={{ color: s.color }}>{s.pricing}</span>
          <span className="text-[0.75rem] text-[#888] flex items-center gap-[0.3rem]">
            <i className="fas fa-clock" /> {s.turnaround}
          </span>
        </div>
      </div>
      <h3 className="text-[1.05rem] font-bold text-white">{s.title}</h3>
      <p className="text-[0.85rem] text-[#aaa] leading-[1.6]">{s.desc}</p>
      <ul className="list-none p-0 m-0 flex flex-col gap-[0.35rem] flex-1">
        {s.deliverables.map(d => (
          <li key={d} className="text-[0.82rem] text-[#ccc] flex items-center gap-[0.45rem]">
            <i className="fas fa-check text-[0.7rem] shrink-0" style={{ color: s.color }} /> {d}
          </li>
        ))}
      </ul>
      <button
        className="inline-flex items-center gap-[0.45rem] mt-2 px-[1.1rem] py-2 border rounded-md text-[0.85rem] font-semibold self-start transition-[background] duration-200 bg-transparent cursor-pointer hover:bg-white/[0.06]"
        style={{ borderColor: s.color, color: s.color }}
        onClick={onQuote}
      >
        Get a quote <i className="fas fa-calculator" />
      </button>
    </motion.div>
  )
}

/* ─── Page ─── */
type Tab = 'dev' | 'design' | 'services'

interface ActiveQuote { serviceId: string; serviceName: string; color: string }

function WorkInner() {
  const searchParams = useSearchParams()
  const paramTab = searchParams.get('tab')
  const paramTag  = searchParams.get('tag') ?? ''
  const paramFrom = searchParams.get('from') ?? undefined

  const [tab, setTab] = useState<Tab>(() =>
    paramTab === 'design' || paramTab === 'dev' ? paramTab : 'services'
  )
  const [activeQuote, setActiveQuote] = useState<ActiveQuote | null>(null)
  // New seed on mount (page refresh) and on every tab click → re-shuffles project order
  const [shuffleSeed, setShuffleSeed] = useState(() => Math.random())

  function switchTab(t: Tab) {
    setTab(t)
    setShuffleSeed(Math.random())
  }

  // Shuffled dev projects — recalculated whenever seed changes
  const shuffledDevProjects = useMemo(
    () => [...devProjects].sort(() => Math.random() - 0.5),
    [shuffleSeed], // eslint-disable-line react-hooks/exhaustive-deps
  )

  /* ── Shared tab base classes ── */
  const tabBase =
    'flex items-center gap-2 px-[1.2rem] py-[0.55rem] border rounded-md text-[0.95rem] cursor-pointer transition-[color,border-color,background] duration-200 shrink-0'
  const tabInactive =
    'border-white/[0.12] bg-transparent text-[#aaa] hover:text-white hover:border-white/30'

  return (
    <main id="work-page">
      {/* ── Heading ── */}
      <motion.h1
        className="lg-heading"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        My <span className="text-secondary">Work</span>
      </motion.h1>
      <motion.h2
        className="sm-heading"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
      >
        Development · Design · Services
      </motion.h2>

      {/* ── Tabs ── */}
      <motion.div
        className="flex gap-2 mx-8 mt-8 flex-nowrap overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden max-sm:mx-4 max-sm:mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
      >
        {/* Services tab — uses emerald-400 (#34d399) when active */}
        <button
          className={`${tabBase} ${
            tab === 'services'
              ? 'text-emerald-400 border-emerald-400 bg-emerald-400/[0.07]'
              : tabInactive
          }`}
          onClick={() => switchTab('services')}
        >
          <i className="fas fa-handshake" /> Services
          <span
            className={`text-[0.75rem] px-[0.4rem] py-[0.1rem] rounded-full ${
              tab === 'services' ? 'bg-emerald-400/15' : 'bg-white/[0.08]'
            }`}
          >
            {services.length}
          </span>
        </button>

        {/* Design tab */}
        <button
          className={`${tabBase} ${
            tab === 'design'
              ? 'text-teal border-teal bg-teal/[0.07]'
              : tabInactive
          }`}
          onClick={() => switchTab('design')}
        >
          <i className="fas fa-pen-nib" /> Design
          <span
            className={`text-[0.75rem] px-[0.4rem] py-[0.1rem] rounded-full ${
              tab === 'design' ? 'bg-teal/15' : 'bg-white/[0.08]'
            }`}
          >
            {allDesignProjects.length}
          </span>
        </button>

        {/* Dev tab */}
        <button
          className={`${tabBase} ${
            tab === 'dev'
              ? 'text-teal border-teal bg-teal/[0.07]'
              : tabInactive
          }`}
          onClick={() => switchTab('dev')}
        >
          <i className="fas fa-code" /> Development
          <span
            className={`text-[0.75rem] px-[0.4rem] py-[0.1rem] rounded-full ${
              tab === 'dev' ? 'bg-teal/15' : 'bg-white/[0.08]'
            }`}
          >
            {devProjects.length}
          </span>
        </button>
      </motion.div>

      {/* ── Tab content ── */}
      <AnimatePresence mode="wait">
        {tab === 'dev' && (
          <motion.section
            key="dev"
            className="px-8 pt-8 pb-16 max-sm:px-4 max-sm:pt-6 max-sm:pb-12"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 mt-6 max-sm:grid-cols-1 max-sm:gap-4">
              {shuffledDevProjects.map(p => <DevCard key={p.title} p={p} />)}
            </div>
            <div className="flex justify-center mt-10">
              <a
                href="https://github.com/BryanAim"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-[0.65rem] border border-white/20 rounded-md text-[#ccc] text-[0.9rem] no-underline transition-[color,border-color,background] duration-200 hover:text-white hover:border-white/40 hover:bg-white/[0.04]"
              >
                <i className="fab fa-github" /> More on GitHub
              </a>
            </div>
          </motion.section>
        )}
        {tab === 'design' && (
          <motion.section
            key="design"
            className="px-8 pt-8 pb-16 max-sm:px-4 max-sm:pt-6 max-sm:pb-12"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <DesignGallery shuffleSeed={shuffleSeed} initialTag={paramTag} backSlug={paramFrom} />
            <div className="flex justify-center mt-10">
              <a
                href="https://behance.net/isalebryan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-[0.65rem] border border-white/20 rounded-md text-[#ccc] text-[0.9rem] no-underline transition-[color,border-color,background] duration-200 hover:text-white hover:border-white/40 hover:bg-white/[0.04]"
              >
                <i className="fab fa-behance" /> Full portfolio on Behance
              </a>
            </div>
          </motion.section>
        )}
        {tab === 'services' && (
          <motion.section
            key="services"
            className="px-8 pt-8 pb-16 max-sm:px-4 max-sm:pt-6 max-sm:pb-12"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <p className="text-[#aaa] text-[0.95rem] mb-8 max-w-[600px]">
              Need something built or designed? Here&apos;s what I do — all prices are starting points, final cost depends on scope.
            </p>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 max-sm:grid-cols-1">
              {services.map((s, i) => (
                <ServiceCard
                  key={s.title}
                  s={s}
                  index={i}
                  onQuote={() => setActiveQuote({ serviceId: s.serviceId, serviceName: s.title, color: s.color })}
                />
              ))}
            </div>
            <div className="text-center mt-10 text-[#888] text-[0.9rem]">
              <p>
                Not sure what you need?{' '}
                <a
                  href="/contact"
                  className="text-teal underline underline-offset-[3px] hover:text-white transition-colors duration-200"
                >
                  Let&apos;s talk it through.
                </a>
              </p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Quote modal */}
      <AnimatePresence>
        {activeQuote && (
          <QuoteModal
            serviceId={activeQuote.serviceId}
            serviceName={activeQuote.serviceName}
            color={activeQuote.color}
            onClose={() => setActiveQuote(null)}
          />
        )}
      </AnimatePresence>
    </main>
  )
}

export default function Work() {
  return (
    <Suspense fallback={null}>
      <WorkInner />
    </Suspense>
  )
}
