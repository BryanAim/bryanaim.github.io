'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { designProjects as allDesignProjects } from './designProjects'
import { devProjects, DevProject } from './devProjects'
import QuoteModal from '../components/QuoteModal'
import DesignGallery from '../components/DesignGallery'
const PAGE_SIZE = 9
const SPRING = [0.16, 1, 0.3, 1] as const

/* ─── Dev project card ─── */
function DevCard({ p }: { p: DevProject }) {
  return (
    <motion.div
      className="wk-dev-card"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, ease: SPRING }}
      whileHover={{ y: -4, boxShadow: '0 20px 50px rgba(0,0,0,0.45), 0 0 0 1px rgba(0,221,215,0.3)' }}
    >
      <div className="wk-dev-img-wrap">
        <img src={p.img} alt={p.title} className="wk-dev-img" />
        <div className="wk-dev-img-overlay">
          <a href={p.url} target="_blank" rel="noopener noreferrer" className="wk-dev-btn">
            <i className="fas fa-eye" /> View
          </a>
          {p.github && (
            <a href={p.github} target="_blank" rel="noopener noreferrer" className="wk-dev-btn">
              <i className="fab fa-github" /> GitHub
            </a>
          )}
        </div>
      </div>
      <div className="wk-dev-body">
        <h3 className="wk-dev-title">{p.title}</h3>
        <p className="wk-dev-desc">{p.desc}</p>
        <div className="wk-dev-tags">
          {p.tags.map(t => <span key={t} className="wk-dev-tag">{t}</span>)}
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Services data ─── */
const services = [
  {
    serviceId: 'website',
    icon: 'fas fa-laptop-code',
    title: 'Website Design & Development',
    color: '#00ddd7',
    desc: 'Custom websites built fast and clean — from landing pages to full web apps. WordPress, Next.js, or plain HTML/CSS depending on what fits.',
    deliverables: ['Responsive design', 'SEO-ready markup', 'CMS integration', 'Hosting setup'],
    pricing: 'From KES 15,000',
    turnaround: '1–3 weeks',
  },
  {
    serviceId: 'logo',
    icon: 'fas fa-paint-brush',
    title: 'Logo & Brand Identity',
    color: '#b1db00',
    desc: 'A brand that looks intentional. Logo design, colour palettes, typography, and brand guidelines delivered in editable files.',
    deliverables: ['Primary + secondary logo', 'Color palette & fonts', 'Brand guidelines PDF', 'All file formats (AI, PNG, SVG)'],
    pricing: 'From KES 5,000',
    turnaround: '3–7 days',
  },
  {
    serviceId: 'motion',
    icon: 'fas fa-film',
    title: 'Motion Graphics & Social Media',
    color: '#ff8c42',
    desc: 'Animated graphics for social media, presentations, or video intros. Eye-catching visuals that stop the scroll.',
    deliverables: ['Animated logo / intro', 'Social media post templates', 'Story & reel graphics', 'MP4 + GIF exports'],
    pricing: 'From KES 3,000',
    turnaround: '2–5 days',
  },
  {
    serviceId: 'uiux',
    icon: 'fas fa-pen-ruler',
    title: 'UI/UX Design',
    color: '#a78bfa',
    desc: 'Wireframes and high-fidelity mockups for apps and websites. Figma files you can hand off to any developer — or me.',
    deliverables: ['Wireframes', 'High-fidelity mockups', 'Interactive prototype', 'Figma source file'],
    pricing: 'From KES 8,000',
    turnaround: '1–2 weeks',
  },
  {
    serviceId: 'email',
    icon: 'fas fa-envelope-open-text',
    title: 'Email Marketing Setup',
    color: '#f472b6',
    desc: 'Mailchimp campaigns, templates, and automation flows set up and ready to send. Great for small businesses and community organisations.',
    deliverables: ['Account & list setup', 'Custom email template', 'Automation flow', 'Sending guide'],
    pricing: 'From KES 4,000',
    turnaround: '3–5 days',
  },
  {
    serviceId: 'mentorship',
    icon: 'fas fa-chalkboard-teacher',
    title: 'Coding Mentorship',
    color: '#34d399',
    desc: '1-on-1 sessions for students learning web development. HTML, CSS, JavaScript, or React — structured around your pace and goals.',
    deliverables: ['Personalised learning plan', 'Session notes & resources', 'Code review', 'Ongoing support via WhatsApp'],
    pricing: 'KES 800 / hr',
    turnaround: 'Flexible schedule',
  },
]

/* ─── Service card ─── */
function ServiceCard({ s, index, onQuote }: { s: typeof services[0]; index: number; onQuote: () => void }) {
  return (
    <motion.div
      className="sv-card"
      style={{ '--sv-color': s.color } as React.CSSProperties}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, boxShadow: `0 20px 50px rgba(0,0,0,0.45), 0 0 0 1px ${s.color}55` }}
    >
      <div className="sv-card-top">
        <span className="sv-icon" style={{ color: s.color, background: `${s.color}18` }}>
          <i className={s.icon} />
        </span>
        <div className="sv-meta">
          <span className="sv-price" style={{ color: s.color }}>{s.pricing}</span>
          <span className="sv-turnaround"><i className="fas fa-clock" /> {s.turnaround}</span>
        </div>
      </div>
      <h3 className="sv-title">{s.title}</h3>
      <p className="sv-desc">{s.desc}</p>
      <ul className="sv-deliverables">
        {s.deliverables.map(d => (
          <li key={d}><i className="fas fa-check" style={{ color: s.color }} /> {d}</li>
        ))}
      </ul>
      <button className="sv-cta" style={{ borderColor: s.color, color: s.color }} onClick={onQuote}>
        Get a quote <i className="fas fa-calculator" />
      </button>
    </motion.div>
  )
}

/* ─── Page ─── */
type Tab = 'dev' | 'design' | 'services'

interface ActiveQuote { serviceId: string; serviceName: string; color: string }

export default function Work() {
  const [tab, setTab] = useState<Tab>('services')
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
        className="wk-tabs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
      >
        <button
          className={`wk-tab wk-tab--services${tab === 'services' ? ' active' : ''}`}
          onClick={() => switchTab('services')}
        >
          <i className="fas fa-handshake" /> Services
          <span className="wk-tab-count">{services.length}</span>
        </button>
        <button
          className={`wk-tab${tab === 'design' ? ' active' : ''}`}
          onClick={() => switchTab('design')}
        >
          <i className="fas fa-pen-nib" /> Design
          <span className="wk-tab-count">{allDesignProjects.length}</span>
        </button>
        <button
          className={`wk-tab${tab === 'dev' ? ' active' : ''}`}
          onClick={() => switchTab('dev')}
        >
          <i className="fas fa-code" /> Development
          <span className="wk-tab-count">{devProjects.length}</span>
        </button>
      </motion.div>

      {/* ── Tab content ── */}
      <AnimatePresence mode="wait">
        {tab === 'dev' && (
          <motion.section
            key="dev"
            className="wk-section"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div className="wk-dev-grid">
              {shuffledDevProjects.map(p => <DevCard key={p.title} p={p} />)}
            </div>
            <div className="wk-dev-footer">
              <a
                href="https://github.com/BryanAim"
                target="_blank"
                rel="noopener noreferrer"
                className="wk-github-link"
              >
                <i className="fab fa-github" /> More on GitHub
              </a>
            </div>
          </motion.section>
        )}
        {tab === 'design' && (
          <motion.section
            key="design"
            className="wk-section"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <DesignGallery shuffleSeed={shuffleSeed} />
            <div className="wk-dev-footer">
              <a
                href="https://behance.net/isalebryan"
                target="_blank"
                rel="noopener noreferrer"
                className="wk-github-link"
              >
                <i className="fab fa-behance" /> Full portfolio on Behance
              </a>
            </div>
          </motion.section>
        )}
        {tab === 'services' && (
          <motion.section
            key="services"
            className="wk-section"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <p className="sv-intro">
              Need something built or designed? Here&apos;s what I do — all prices are starting points, final cost depends on scope.
            </p>
            <div className="sv-grid">
              {services.map((s, i) => (
                <ServiceCard
                  key={s.title}
                  s={s}
                  index={i}
                  onQuote={() => setActiveQuote({ serviceId: s.serviceId, serviceName: s.title, color: s.color })}
                />
              ))}
            </div>
            <div className="sv-footer">
              <p>Not sure what you need? <a href="/contact" className="sv-footer-link">Let&apos;s talk it through.</a></p>
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
