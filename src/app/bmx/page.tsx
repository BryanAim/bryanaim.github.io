'use client'
import { AnimatePresence, motion, useMotionValue, useTransform, useInView, useScroll, useSpring } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

/* ─── Animation variants ─── */
const ease = 'easeOut' as const
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}
const fadeLeft = {
  hidden: { opacity: 0, x: -50 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease } },
}
const fadeRight = {
  hidden: { opacity: 0, x: 50 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease } },
}
const stagger = (delay = 0.1) => ({
  hidden: {},
  show: { transition: { staggerChildren: delay } },
})

/* ─── Current quarter detection ─── */
function getCurrentQuarter(): number {
  const month = new Date().getMonth() // 0-indexed
  if (month <= 2) return 1
  if (month <= 5) return 2
  if (month <= 8) return 3
  return 4
}
const CURRENT_Q = getCurrentQuarter()

/* ─── Data ─── */
const progression = [
  {
    period: 'Mar 2025',
    phase: 'Day One',
    color: '#b1db00',
    tricks: ['First time on a BMX', 'Pure riding — no tricks', 'Learning to roll straight', 'Getting used to the feel'],
    note: 'Picked up my first BMX in March 2025. Zero background — just curiosity and a desire to learn something totally outside the comfort zone. The first few sessions were just riding around getting comfortable.',
  },
  {
    period: 'Mar – Apr 2025',
    phase: 'Bike Control',
    color: '#00ddd7',
    tricks: ['Basic balance', 'Smooth braking', 'Cornering', 'Riding in a straight line at speed'],
    note: 'First two months were purely about bike control — getting comfortable enough that the bike felt like an extension of the body. No tricks, just miles.',
  },
  {
    period: 'May – Aug 2025',
    phase: 'Foundation Building',
    color: '#f472b6',
    tricks: ['Weight shifts', 'Balancing tricks', 'Building confidence', 'Standing on pegs'],
    note: 'Started exploring balance-focused movements — shifting weight, learning to stand on the pegs while rolling. Building the body awareness that makes harder tricks possible.',
  },
  {
    period: 'Sep 2025 – Now',
    phase: 'Getting Technical',
    color: '#ff8c42',
    tricks: ['Bunny hops ✓', 'Backwards riding ✓', 'Peg stands in motion ✓', 'Reading street spots'],
    note: 'The foundation started paying off. Bunny hops felt impossible at first — then one day it just clicked. Backwards riding and peg stands in motion followed. Still a beginner — and owning it.',
  },
]

type VideoClip = { src?: string; label: string }

type Quarter = {
  q: number
  range: string
  color: string
  mainTrick: string
  mainNote: string
  otherTricks: string[]
  videos: VideoClip[]
}

const quarters2026: Quarter[] = [
  {
    q: 1,
    range: 'Jan – Mar 2026',
    color: '#b1db00',
    mainTrick: 'Manuals',
    mainNote: 'The balance point is everything — front end up, find the sweet spot, hold it. Working this daily on flat ground before adding distance.',
    otherTricks: ['Chicken Barspins', 'Footjams'],
    videos: [
      { label: 'Manual attempt — flat ground' },
      { label: 'Chicken barspin practice' },
      { label: 'Footjam exploration' },
    ],
  },
  {
    q: 2,
    range: 'Apr – Jun 2026',
    color: '#f472b6',
    mainTrick: 'Barspins',
    mainNote: 'The scary one. Building up to it off low hops first — hands need to trust letting go. Street style, so flat-ground and curb setups.',
    otherTricks: ['Crankflips', 'X-Up', 'Pick Up Barspins'],
    videos: [
      { label: 'Barspin low hop attempts' },
      { label: 'Crankflip foot coord drills' },
      { label: 'X-Up stretch practice' },
    ],
  },
  {
    q: 3,
    range: 'Jul – Sep 2026',
    color: '#00ddd7',
    mainTrick: 'Fakies',
    mainNote: 'Getting comfortable rolling backwards into and out of them. Already ride backwards, so this is about controlled entries and clean exits.',
    otherTricks: ['Halfcabs', 'Footplants'],
    videos: [
      { label: 'Fakie roll-in attempts' },
      { label: 'Halfcab rotation drills' },
      { label: 'Footplant spot hunt' },
    ],
  },
  {
    q: 4,
    range: 'Oct – Dec 2026',
    color: '#fbbf24',
    mainTrick: '180',
    mainNote: 'The first real spin. Half a rotation — commit to it, spot the landing, roll out clean. Starting off small hops on flat ground, then curb drops.',
    otherTricks: ['Fakie 180', '180 to Manual', 'Nose Manual'],
    videos: [
      { label: '180 flat ground attempts' },
      { label: 'Fakie 180 entry drills' },
      { label: '180 to manual combos' },
    ],
  },
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
    sub: 'Nakuru CBD',
    icon: 'fab fa-instagram',
    url: 'https://www.instagram.com/isalebryan/',
    color: '#e1306c',
    note: 'Manual practice clips',
  },
  {
    label: 'Practice Clips',
    sub: 'Raw session footage',
    icon: 'fab fa-tiktok',
    url: 'https://tiktok.com/@bmxbrian',
    color: '#e0e0e0',
    note: 'Short-form trick attempts',
  },
  {
    label: 'Full Sessions',
    sub: 'Unedited footage',
    icon: 'fab fa-youtube',
    url: 'https://youtube.com/@bryanaim',
    color: '#ff0000',
    note: 'Long-form session vlogs',
  },
]

const gear = [
  { label: 'Frame', value: 'Redline Lieutenant BMX', icon: '🚲' },
  { label: 'Bars', value: '9" rise chromoly', icon: '⬛' },
  { label: 'Tyres', value: 'HARTEX 2.4', icon: '⭕' },
  { label: 'Pegs', value: '4x chromoly steel', icon: '🔩' },
  { label: 'Brakes', value: 'None', icon: '✋' },
  { label: 'Riding style', value: 'Street only — no parks nearby', icon: '🏙️' },
]

/* ─── Horizontal Timeline Phase Card ─── */
const CARD_WIDTH = 420
const CARD_GAP = 32

function HPhaseCard({ phase, index, scrollYProgress }: {
  phase: typeof progression[0]
  index: number
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']
}) {
  // Center of this card in scroll progress (0 = first card centered, 1 = last card centered)
  const cardCenter = index / (progression.length - 1)
  const halfWindow = 0.45
  const lo = Math.max(0, cardCenter - halfWindow)
  const hi = Math.min(1, cardCenter + halfWindow)
  const inputRange = Array.from(new Set([lo, cardCenter, hi]))
  const opacity = useTransform(scrollYProgress, inputRange, inputRange.map(v => v === cardCenter ? 1 : 0.5))
  const scale = useTransform(scrollYProgress, inputRange, inputRange.map(v => v === cardCenter ? 1.1 : 0.88))

  return (
    <motion.div className="bmx-htl-phase" style={{ opacity, scale }}>
      <div className="bmx-htl-card" style={{ borderColor: `${phase.color}50` }}>
        <div className="bmx-htl-card-top">
          <span className="bmx-htl-phase-name" style={{ color: phase.color }}>{phase.phase}</span>
        </div>
        <p className="bmx-htl-note">{phase.note}</p>
        <div className="bmx-tricks-wrap">
          {phase.tricks.map((t) => (
            <span
              key={t}
              className="bmx-trick-tag"
              style={{ borderColor: phase.color, color: phase.color }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="bmx-htl-connector" style={{ background: phase.color }} />
      <div
        className="bmx-htl-dot"
        style={{ background: phase.color, boxShadow: `0 0 14px ${phase.color}70` }}
      />
      <span className="bmx-htl-year" style={{ color: `${phase.color}99` }}>{phase.period}</span>
    </motion.div>
  )
}

/* ─── Horizontal Timeline — scroll-driven (vertical scroll → horizontal movement) ─── */
function SkillsTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null)

  // With centered padding (50vw - CARD_WIDTH/2) on each side, the overhang
  // equals exactly (n-1) * (CARD_WIDTH + CARD_GAP) — no DOM measurement needed
  const totalDistance = (progression.length - 1) * (CARD_WIDTH + CARD_GAP)
  const sectionHeight = `calc(100vh + ${totalDistance}px)`

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const rawX = useTransform(scrollYProgress, [0, 1], [0, -totalDistance])
  const x = useSpring(rawX, { damping: 60, mass: 1, stiffness: 500 })

  return (
    <div ref={sectionRef} style={{ height: sectionHeight }} className="bmx-htl-section">
      <div className="bmx-htl-sticky">

        <div className="bmx-htl-scroll-hint">
          <motion.span
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          >
            ↓
          </motion.span>
          <span>scroll to explore</span>
        </div>

        <motion.div className="bmx-htl-track" style={{ x }}>
          <div className="bmx-htl-spine" />
          {progression.map((phase, i) => (
            <HPhaseCard key={phase.period} phase={phase} index={i} scrollYProgress={scrollYProgress} />
          ))}
        </motion.div>

        <div className="bmx-htl-progress-bg">
          <motion.div
            className="bmx-htl-progress-fill"
            style={{ scaleX: scrollYProgress, transformOrigin: 'left' }}
          />
        </div>

      </div>
    </div>
  )
}

/* ─── Gear Ticker ─── */
function GearTicker() {
  const { scrollY } = useScroll()
  // Row 1 drifts left, row 2 drifts right as page scrolls
  const x1 = useTransform(scrollY, (v) => (-v * 0.35) % 800)
  const x2 = useTransform(scrollY, (v) => (v * 0.35) % 800)
  const smooth1 = useSpring(x1, { damping: 40, stiffness: 200, mass: 0.5 })
  const smooth2 = useSpring(x2, { damping: 40, stiffness: 200, mass: 0.5 })

  // Repeat enough to always fill the screen at any scroll
  const repeated = [...gear, ...gear, ...gear, ...gear]

  const renderRow = (items: typeof gear) =>
    items.map((g, i) => (
      <span key={i} className="bmx-ticker-item">
        <span className="bmx-ticker-icon">{g.icon}</span>
        <span className="bmx-ticker-label">{g.label}</span>
        <span className="bmx-ticker-sep">—</span>
        <span className="bmx-ticker-value">{g.value}</span>
        <span className="bmx-ticker-dot">·</span>
      </span>
    ))

  return (
    <div className="bmx-ticker-wrap">
      <div className="bmx-ticker-heading">
        <span className="text-secondary">—</span> The Setup
      </div>
      <div className="bmx-ticker-row-clip">
        <motion.div className="bmx-ticker-row" style={{ x: smooth1 }}>
          {renderRow(repeated)}
        </motion.div>
      </div>
      <div className="bmx-ticker-row-clip">
        <motion.div className="bmx-ticker-row bmx-ticker-row-muted" style={{ x: smooth2 }}>
          {renderRow(repeated)}
        </motion.div>
      </div>
    </div>
  )
}

/* ─── Video Snippet Slot ─── */
function VideoSlot({ clip, color }: { clip: VideoClip; color: string }) {
  return (
    <motion.div
      className="bmx-video-slot"
      style={{ borderColor: `${color}44` }}
      variants={fadeUp}
      whileHover={{ borderColor: color, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {clip.src ? (
        <video src={clip.src} controls playsInline className="bmx-video-player" />
      ) : (
        <div className="bmx-video-placeholder" style={{ color: `${color}66` }}>
          <i className="fas fa-film" style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }} />
          <span>clip incoming</span>
        </div>
      )}
      <p className="bmx-video-label" style={{ color }}>{clip.label}</p>
    </motion.div>
  )
}

/* ─── Roadmap Stack Card (sticky stacked, mirrors about page pattern) ─── */
function RoadmapStackCard({ quarter, index, total }: { quarter: Quarter; index: number; total: number }) {
  const stickyTop = 80 + index * 20
  const isActive = quarter.q === CURRENT_Q
  const isPast = quarter.q < CURRENT_Q
  const status = isPast ? 'completed' : isActive ? 'active' : 'upcoming'
  const statusLabel = isPast ? 'Completed' : isActive ? 'Currently Learning' : 'Upcoming'

  return (
    <motion.div
      className={`bmx-rs-card bmx-rs-${status}`}
      style={{
        top: stickyTop,
        zIndex: index + 1,
        '--rs-color': quarter.color,
        borderTopColor: quarter.color,
      } as React.CSSProperties}
      whileHover={{
        boxShadow: `0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px ${quarter.color}, 0 0 50px ${quarter.color}22`,
        transition: { duration: 0.2 },
      }}
    >
      {/* Ghost Q number background texture */}
      <div className="bmx-rs-ghost" style={{ color: quarter.color }}>Q{quarter.q}</div>
      {/* Overlay */}
      <div className="bmx-rs-overlay" style={{ background: `linear-gradient(115deg, rgba(10,10,10,0.97) 0%, rgba(10,10,10,0.85) 55%, ${quarter.color}12 100%)` }} />

      <div className="bmx-rs-content">
        {/* Left column — Q number + period */}
        <div className="bmx-rs-left">
          <span className="bmx-rs-index">{String(index + 1).padStart(2, '0')}</span>
          <span className="bmx-rs-qnum" style={{ color: quarter.color }}>Q{quarter.q}</span>
          <span className="bmx-rs-period">{quarter.range}</span>
        </div>

        {/* Middle column — trick info */}
        <div className="bmx-rs-middle">
          <div className="bmx-rs-top-row">
            <p className="bmx-rs-counter">{index + 1} / {total}</p>
            <div
              className={`bmx-quarter-badge bmx-badge-${status}`}
              style={isActive ? { background: quarter.color, color: '#0a0a0a' } : {}}
            >
              {isActive && <span className="bmx-badge-pulse" style={{ background: quarter.color }} />}
              {statusLabel}
            </div>
          </div>
          <h3 className="bmx-rs-trick" style={{ color: quarter.color }}>{quarter.mainTrick}</h3>
          <p className="bmx-rs-note">{quarter.mainNote}</p>

          <p className="bmx-rs-also-label">Also working on</p>
          <div className="bmx-tricks-wrap">
            {quarter.otherTricks.map(t => (
              <span key={t} className="bmx-trick-tag" style={{ borderColor: `${quarter.color}88`, color: `${quarter.color}cc` }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Right column — video clips */}
        <div className="bmx-rs-videos">
          {quarter.videos.map((v, i) => (
            <VideoSlot key={i} clip={v} color={quarter.color} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Gallery X — draggable grid with 3D tilt per cell ─── */
const CELL_W = 320
const CELL_H = 240
const CELL_GAP = 12
const GRID_COLS = 8

function GalXCell({ photo, onSelect, tileIndex }: { photo: typeof photos[0]; onSelect: (i: number) => void; tileIndex: number }) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useTransform(my, [-0.5, 0.5], [12, -12])
  const rotateY = useTransform(mx, [-0.5, 0.5], [-12, 12])
  // Curve: each column gets a base rotateY so the grid arcs like a cylinder
  const col = tileIndex % GRID_COLS
  const curveY = (col - (GRID_COLS - 1) / 2) * 4 // ±14deg across 8 cols

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  function onMouseLeave() { mx.set(0); my.set(0) }

  return (
    <motion.div
      className="bmx-galx-cell"
      layoutId={`bmx-photo-${tileIndex % photos.length}`}
      style={{ rotateX, rotateY: useTransform(rotateY, v => v + curveY), transformPerspective: 700 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={() => onSelect(tileIndex % photos.length)}
      whileHover={{ scale: 1.07, zIndex: 10 }}
      transition={{ scale: { duration: 0.18 } }}
    >
      <motion.img
        layoutId={`bmx-photo-img-${tileIndex % photos.length}`}
        src={photo.src}
        alt={photo.caption}
        draggable={false}
      />
      <div className="bmx-photo-overlay"><span>{photo.caption}</span></div>
    </motion.div>
  )
}

function GalleryX({ onSelect }: { onSelect: (i: number) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [constraints, setConstraints] = useState({ left: 0, right: 0, top: 0, bottom: 0 })
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  useEffect(() => {
    if (!containerRef.current) return
    const cw = containerRef.current.offsetWidth
    const ch = containerRef.current.offsetHeight
    const tiles = [...photos, ...photos, ...photos, ...photos]
    const rows = Math.ceil(tiles.length / GRID_COLS)
    const gridW = GRID_COLS * (CELL_W + CELL_GAP) - CELL_GAP
    const gridH = rows * (CELL_H + CELL_GAP) - CELL_GAP
    const left = -(gridW - cw)
    const top = -(gridH - ch)
    setConstraints({ left, right: 0, top, bottom: 0 })
    // Start centered
    x.set(left / 2)
    y.set(top / 2)
  }, [x, y])

  const tiles = [...photos, ...photos, ...photos, ...photos]

  return (
    <div ref={containerRef} className="bmx-galx-clip">
      <motion.div
        className="bmx-galx-grid"
        drag
        dragConstraints={constraints}
        dragTransition={{ power: 0.25, timeConstant: 380 }}
        dragElastic={0.04}
        whileDrag={{ cursor: 'grabbing' }}
        style={{ cursor: 'grab', x, y }}
      >
        {tiles.map((p, i) => (
          <GalXCell key={i} photo={p} tileIndex={i} onSelect={onSelect} />
        ))}
      </motion.div>
      <div className="bmx-galx-hint">drag to explore</div>
    </div>
  )
}

/* ─── Photo Lightbox ─── */
function PhotoLightbox({ photo, index, total, onClose, onPrev, onNext }: {
  photo: typeof photos[0]
  index: number
  total: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext])

  return (
    <motion.div
      className="bmx-lightbox-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className="bmx-lightbox-frame"
        layoutId={`bmx-photo-${index}`}
        onClick={e => e.stopPropagation()}
      >
        <motion.img
          layoutId={`bmx-photo-img-${index}`}
          src={photo.src}
          alt={photo.caption}
          className="bmx-lightbox-img"
        />
        <motion.p
          className="bmx-lightbox-caption"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
        >
          {photo.caption}
        </motion.p>
      </motion.div>

      <motion.button
        className="bmx-lightbox-close"
        onClick={onClose}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.15 }}
      >
        ✕
      </motion.button>

      {index > 0 && (
        <motion.button
          className="bmx-lightbox-nav bmx-lightbox-prev"
          onClick={e => { e.stopPropagation(); onPrev() }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.1, x: -3 }}
        >
          ‹
        </motion.button>
      )}
      {index < total - 1 && (
        <motion.button
          className="bmx-lightbox-nav bmx-lightbox-next"
          onClick={e => { e.stopPropagation(); onNext() }}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.1, x: 3 }}
        >
          ›
        </motion.button>
      )}

      <motion.div
        className="bmx-lightbox-counter"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        {index + 1} / {total}
      </motion.div>
    </motion.div>
  )
}

/* ─── Page ─── */
export default function BMX() {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroImgY = useTransform(heroScroll, [0, 1], ['0%', '25%'])
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0])

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

      {/* ── Intro banner (parallax) ── */}
      <motion.div
        ref={heroRef}
        className="bmx-intro"
        variants={fadeUp} initial="hidden"
        whileInView="show" viewport={{ once: true }}
        style={{ opacity: heroOpacity }}
      >
        <div className="bmx-intro-img" style={{ overflow: 'hidden' }}>
          <motion.img src="/img/bmx/bmx2.jpg" alt="BMX bike" style={{ y: heroImgY }} />
        </div>
        <div className="bmx-intro-text">
          <h3>Why <span className="text-secondary">BMX?</span></h3>
          <p>
            When the laptop closes, the bike comes out. Started in March 2025 with zero riding
            background — just curiosity and stubbornness. BMX demands full presence, punishes
            half-heartedness, and rewards patience the exact same way coding does.
          </p>
          <p>
            Street rider — no parks nearby, so every trick gets learned on flat ground, curbs, and whatever
            the streets of Nakuru throw at you. Still a beginner and proud of it.
          </p>
          <div className="bmx-intro-tags">
            <span style={{ borderColor: '#f472b6', color: '#f472b6' }}>Street Style</span>
            <span style={{ borderColor: '#b1db00', color: '#b1db00' }}>Self-Taught</span>
            <span style={{ borderColor: '#00ddd7', color: '#00ddd7' }}>Nakuru, Kenya</span>
            <span style={{ borderColor: '#ff8c42', color: '#ff8c42' }}>Since Mar 2025</span>
          </div>
        </div>
      </motion.div>

      {/* ── The Setup (gear ticker) ── */}
      <GearTicker />

      {/* ── Skills Progression ── */}
      <div className="bmx-section">
        <motion.div className="bmx-section-label" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <span className="text-secondary">—</span> Skills Progression
        </motion.div>
        <motion.p
          className="bmx-goals-sub"
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
        >
          One year in — from never touching a BMX to bunny hops and backwards riding
        </motion.p>
        <SkillsTimeline />
      </div>

      {/* ── 2026 Quarterly Goals ── */}
      <div className="bmx-section">
        <motion.div className="bmx-section-label" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <span className="text-secondary">—</span> 2026 Trick Roadmap
        </motion.div>
        <motion.p
          className="bmx-goals-sub"
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
        >
          Quarter by quarter — one main trick, supporting tricks, and clips as I go
        </motion.p>
        <div className="bmx-roadmap-stack">
          {quarters2026.map((q, i) => (
            <RoadmapStackCard key={q.q} quarter={q} index={i} total={quarters2026.length} />
          ))}
        </div>
      </div>

      {/* ── Photo Gallery ── */}
      <div className="bmx-section">
        <motion.div className="bmx-section-label" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <span className="text-secondary">—</span> Gallery
        </motion.div>
        <GalleryX onSelect={setSelectedPhoto} />
      </div>

      <AnimatePresence>
        {selectedPhoto !== null && (
          <PhotoLightbox
            photo={photos[selectedPhoto]}
            index={selectedPhoto}
            total={photos.length}
            onClose={() => setSelectedPhoto(null)}
            onPrev={() => setSelectedPhoto(prev => (prev! - 1 + photos.length) % photos.length)}
            onNext={() => setSelectedPhoto(prev => (prev! + 1) % photos.length)}
          />
        )}
      </AnimatePresence>

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
