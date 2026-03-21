'use client'
import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'

/* ─── Animation variants ─── */
const ease = 'easeOut' as const
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}
const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease } },
}
const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease } },
}
const stagger = (delay = 0.1) => ({
  hidden: {},
  show: { transition: { staggerChildren: delay } },
})

/* ─── Data ─── */
const progression = [
  {
    year: 'Jan 2025',
    phase: 'Day One',
    color: '#b1db00',
    tricks: ['Getting on the bike', 'Basic balance', 'Rolling straight', 'Braking'],
    note: 'Picked up my first BMX in January 2025. Zero background — just pure curiosity and a desire to learn something totally outside the comfort zone.',
  },
  {
    year: 'Feb–Apr 2025',
    phase: 'First Wins',
    color: '#00ddd7',
    tricks: ['Bunny hop ✓', 'Backwards riding ✓', 'Standing on pegs ✓', 'Slow balance'],
    note: 'Dialed in the fundamentals. Bunny hops felt impossible at first — then one day it just clicked. Backwards riding and peg stands came shortly after.',
  },
  {
    year: 'Now',
    phase: 'Building Consistency',
    color: '#ff8c42',
    tricks: ['Consistent bunny hops', 'Riding switch', 'Peg stands in motion', 'Reading spots'],
    note: 'Still a beginner — and owning it. The focus right now is consistency and building the foundation that makes harder tricks possible.',
  },
]

const goals2026 = [
  { trick: 'Manuals', target: 60, color: '#b1db00', note: 'Balance point is the key — working it daily' },
  { trick: 'Barspins', target: 10, color: '#f472b6', note: 'The scary one. Building up confidence off low hops first' },
  { trick: 'Fakies', target: 5, color: '#00ddd7', note: 'Getting comfy rolling backwards into and out of them' },
  { trick: 'Crankflips', target: 5, color: '#ff8c42', note: 'Pure foot coordination — lots of slams ahead probably' },
]

const photos = [
  { src: '/img/bmx/bmx1.jpg', caption: 'The weapon of choice', span: 'wide' },
  { src: '/img/bmx/bmx2.jpg', caption: 'Manual session, Nakuru CBD' },
  { src: '/img/bmx/bmx3.jpg', caption: 'Street spot hunt' },
  { src: '/img/bmx/bmx4.jpg', caption: 'Early morning ride' },
  { src: '/img/bmx/bmx5.jpg', caption: 'Session with the crew' },
  { src: '/img/bmx/bmx1.jpg', caption: 'Finding spots' },
]

const clips = [
  {
    label: 'Street Session #1',
    sub: 'Nakuru CBD ledges',
    icon: 'fab fa-instagram',
    url: 'https://www.instagram.com/isalebryan/',
    color: '#e1306c',
    note: 'Manual → bar spin combo attempt',
  },
  {
    label: 'Grind Clips',
    sub: 'Feeble & crooked grinds',
    icon: 'fab fa-tiktok',
    url: 'https://tiktok.com/@bmxbrian',
    color: '#e0e0e0',
    note: 'Low angle TikTok edits',
  },
  {
    label: 'Full Sessions',
    sub: 'Raw unedited footage',
    icon: 'fab fa-youtube',
    url: 'https://youtube.com/@bryanaim',
    color: '#ff0000',
    note: 'Long-form session vlogs',
  },
]

const gear = [
  { label: 'Frame', value: 'Redline Lieutenant BMX"', icon: '🚲' },
  { label: 'Bars', value: '9" rise chromoly', icon: '⬛' },
  { label: 'Tyres', value: 'HARTEX 2.4', icon: '⭕' },
  { label: 'Pegs', value: '4x chromoly steel', icon: '🔩' },
  { label: 'Brakes', value: 'None', icon: '✋' },
  { label: 'Riding style', value: 'Street / Park', icon: '🏙️' },
]

/* ─── Progress bar ─── */
function SkillPhase({ phase, index }: { phase: typeof progression[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const isEven = index % 2 === 0

  return (
    <motion.div
      ref={ref}
      className="bmx-phase"
      variants={isEven ? fadeLeft : fadeRight}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
    >
      <div className="bmx-phase-year" style={{ color: phase.color }}>{phase.year}</div>
      <div className="bmx-phase-card" style={{ borderColor: phase.color }}>
        <div className="bmx-phase-header">
          <span className="bmx-phase-dot" style={{ background: phase.color }} />
          <h3 className="bmx-phase-title" style={{ color: phase.color }}>{phase.phase}</h3>
        </div>
        <p className="bmx-phase-note">{phase.note}</p>
        <div className="bmx-tricks-wrap">
          {phase.tricks.map((t, i) => (
            <motion.span
              key={t}
              className="bmx-trick-tag"
              style={{ borderColor: phase.color, color: phase.color }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.3, ease }}
            >
              {t}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Photo tile ─── */
function PhotoTile({ photo, index }: { photo: typeof photos[0]; index: number }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      className={`bmx-photo-tile${photo.span === 'wide' ? ' wide' : ''}`}
      variants={fadeUp}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img src={photo.src} alt={photo.caption} />
      <motion.div
        className="bmx-photo-overlay"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <span>{photo.caption}</span>
      </motion.div>
    </motion.div>
  )
}

/* ─── Goal Card ─── */
function GoalCard({ goal }: { goal: typeof goals2026[0] }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div ref={ref} className="bmx-goal-card" variants={fadeUp}>
      <div className="bmx-goal-header">
        <span className="bmx-goal-trick" style={{ color: goal.color }}>{goal.trick}</span>
        <span className="bmx-goal-pct" style={{ color: goal.color }}>{goal.target}%</span>
      </div>
      <p className="bmx-goal-note">{goal.note}</p>
      <div className="bmx-goal-track">
        <motion.div
          className="bmx-goal-fill"
          style={{ background: `linear-gradient(90deg, ${goal.color}88, ${goal.color})` }}
          initial={{ width: '0%' }}
          animate={inView ? { width: `${goal.target}%` } : {}}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        />
      </div>
    </motion.div>
  )
}

/* ─── Page ─── */
export default function BMX() {
  return (
    <main id="bmx">
      {/* ── Hero heading ── */}
      <motion.h1
        className="lg-heading"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        BMX <span className="text-secondary">Life</span>
      </motion.h1>
      <motion.h2
        className="sm-heading"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
      >
        Streets are my playground — always learning, always riding
      </motion.h2>

      {/* ── Intro banner ── */}
      <motion.div
        className="bmx-intro"
        variants={fadeUp} initial="hidden"
        whileInView="show" viewport={{ once: true }}
      >
        <div className="bmx-intro-img">
          <img src="/img/bmx/bmx2.jpg" alt="BMX bike" />
        </div>
        <div className="bmx-intro-text">
          <h3>Why <span className="text-secondary">BMX?</span></h3>
          <p>
            When the laptop closes, the bike comes out. Started in January 2025 with zero riding
            background — just curiosity and stubbornness. BMX demands full presence, punishes
            half-heartedness, and rewards patience the exact same way coding does.
          </p>
          <p>
            Still a beginner and proud of it. Already dialed in bunny hops, backwards riding, and
            standing on the pegs while rolling. The foundation is there — now it&apos;s about building on it.
          </p>
          <div className="bmx-intro-tags">
            <span style={{ borderColor: '#f472b6', color: '#f472b6' }}>Street Style</span>
            <span style={{ borderColor: '#b1db00', color: '#b1db00' }}>Self-Taught</span>
            <span style={{ borderColor: '#00ddd7', color: '#00ddd7' }}>Nakuru, Kenya</span>
            <span style={{ borderColor: '#ff8c42', color: '#ff8c42' }}>Since Jan 2025</span>
          </div>
        </div>
      </motion.div>

      {/* ── Skills Progression ── */}
      <div className="bmx-section">
        <motion.div className="bmx-section-label" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <span className="text-secondary">—</span> Skills Progression
        </motion.div>
        <div className="bmx-timeline">
          <div className="bmx-timeline-line" />
          {progression.map((phase, i) => (
            <SkillPhase key={phase.year} phase={phase} index={i} />
          ))}
        </div>
      </div>

      {/* ── 2026 Goals ── */}
      <div className="bmx-section">
        <motion.div className="bmx-section-label" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <span className="text-secondary">—</span> 2026 Goals
        </motion.div>
        <motion.p className="bmx-goals-sub" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          Tricks I&apos;m chasing this year — with honest progress targets
        </motion.p>
        <motion.div
          className="bmx-goals-grid"
          variants={stagger(0.1)} initial="hidden"
          whileInView="show" viewport={{ once: true, margin: '-40px' }}
        >
          {goals2026.map(g => (
            <GoalCard key={g.trick} goal={g} />
          ))}
        </motion.div>
      </div>

      {/* ── Photo Gallery ── */}
      <div className="bmx-section">
        <motion.div className="bmx-section-label" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <span className="text-secondary">—</span> Gallery
        </motion.div>
<motion.div
          className="bmx-photo-grid"
          variants={stagger(0.07)} initial="hidden"
          whileInView="show" viewport={{ once: true, margin: '-40px' }}
        >
          {photos.map((photo, i) => (
            <PhotoTile key={i} photo={photo} index={i} />
          ))}
        </motion.div>
      </div>

      {/* ── Clips ── */}
      <div className="bmx-section">
        <motion.div className="bmx-section-label" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <span className="text-secondary">—</span> Clips & Videos
        </motion.div>
        <motion.div
          className="bmx-clips-grid"
          variants={stagger(0.1)} initial="hidden"
          whileInView="show" viewport={{ once: true, margin: '-40px' }}
        >
          {clips.map(c => (
            <motion.a
              key={c.label}
              href={c.url} target="_blank" rel="noopener noreferrer"
              className="bmx-clip-card"
              style={{ '--clip-color': c.color } as React.CSSProperties}
              variants={fadeUp}
              whileHover={{ y: -6, boxShadow: `0 20px 50px rgba(0,0,0,0.4), 0 0 0 1px ${c.color}` }}
            >
              <div className="bmx-clip-icon" style={{ color: c.color }}>
                <i className={c.icon} />
              </div>
              <div className="bmx-clip-body">
                <p className="bmx-clip-label" style={{ color: c.color }}>{c.label}</p>
                <p className="bmx-clip-sub">{c.sub}</p>
                <p className="bmx-clip-note">{c.note}</p>
              </div>
              <i className="fas fa-arrow-right bmx-clip-arrow" style={{ color: c.color }} />
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* ── Gear ── */}
      <div className="bmx-section">
        <motion.div className="bmx-section-label" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <span className="text-secondary">—</span> The Setup
        </motion.div>
        <motion.div
          className="bmx-gear-grid"
          variants={stagger(0.08)} initial="hidden"
          whileInView="show" viewport={{ once: true, margin: '-40px' }}
        >
          {gear.map(g => (
            <motion.div key={g.label} className="bmx-gear-item" variants={fadeUp}>
              <span className="bmx-gear-icon">{g.icon}</span>
              <div>
                <p className="bmx-gear-label">{g.label}</p>
                <p className="bmx-gear-value">{g.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Follow ── */}
      <motion.div
        className="bmx-follow"
        variants={fadeUp} initial="hidden"
        whileInView="show" viewport={{ once: true }}
      >
        <p>Follow the sessions</p>
        <div className="bmx-follow-links">
          <a href="https://www.instagram.com/isalebryan/" target="_blank" rel="noopener noreferrer"
            className="bmx-follow-btn" style={{ '--fb-color': '#e1306c' } as React.CSSProperties}>
            <i className="fab fa-instagram" /> Instagram
          </a>
          <a href="https://tiktok.com/@bmxbrian" target="_blank" rel="noopener noreferrer"
            className="bmx-follow-btn" style={{ '--fb-color': '#e0e0e0' } as React.CSSProperties}>
            <i className="fab fa-tiktok" /> TikTok
          </a>
          <a href="https://youtube.com/@bryanaim" target="_blank" rel="noopener noreferrer"
            className="bmx-follow-btn" style={{ '--fb-color': '#ff0000' } as React.CSSProperties}>
            <i className="fab fa-youtube" /> YouTube
          </a>
        </div>
      </motion.div>
    </main>
  )
}
