'use client'
import { AnimatePresence, m, useMotionValue, useTransform, useInView, useScroll, useSpring } from 'framer-motion'
import { createContext, useContext, useId, useMemo, useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { type ChannelVideo, cleanTitle, detectTrick } from './youtube'

/* Only one YouTube player plays at a time: each card claims the slot when played */
const PlayerCtx = createContext<{ active: string | null; setActive: (k: string | null) => void }>({ active: null, setActive: () => {} })

/* ─── Animation variants ─── */
const springEase = [0.16, 1, 0.3, 1] as const
const fadeUp = {
  hidden: { opacity: 0, y: 64, filter: 'blur(4px)' },
  show:   { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.7, ease: springEase } },
}
const fadeLeft = {
  hidden: { opacity: 0, x: -60, filter: 'blur(4px)' },
  show:   { opacity: 1, x: 0,  filter: 'blur(0px)', transition: { duration: 0.7, ease: springEase } },
}
const fadeRight = {
  hidden: { opacity: 0, x: 60, filter: 'blur(4px)' },
  show:   { opacity: 1, x: 0,  filter: 'blur(0px)', transition: { duration: 0.7, ease: springEase } },
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
    tricks: ['First time on a BMX', 'Pure riding, no tricks', 'Learning to roll straight', 'Getting used to the feel'],
    note: 'Picked up my first BMX in March 2025 with zero riding background. Pure curiosity. The first few sessions were just riding around getting used to it.',
  },
  {
    period: 'Mar – Apr 2025',
    phase: 'Bike Control',
    color: '#00ddd7',
    tricks: ['Basic balance', 'Smooth braking', 'Cornering', 'Riding in a straight line at speed'],
    note: 'First two months were purely about getting comfortable enough that the bike felt like an extension of the body. No tricks, just miles.',
  },
  {
    period: 'May – Aug 2025',
    phase: 'Foundation Building',
    color: '#f472b6',
    tricks: ['Weight shifts', 'Balancing tricks', 'Building confidence', 'Standing on pegs'],
    note: 'Started exploring balance-focused movements. Shifting weight, standing on pegs while rolling, building the body awareness that makes harder tricks possible.',
  },
  {
    period: 'Sep 2025 – Now',
    phase: 'Getting Technical',
    color: '#ff8c42',
    tricks: ['Bunny hops ✓', 'Backwards riding ✓', 'Peg stands in motion ✓', 'Manuals', 'Fakies', 'Half cabs (day 1)'],
    note: 'The foundation started paying off. Bunny hops felt impossible for weeks, then one day it just clicked. Backwards riding and peg stands in motion followed. Now on a new bike, grinding manuals and fakies and taking first swings at half cabs. Still a beginner, and owning it.',
  },
]

type VideoClip = { src?: string; youtubeId?: string; label: string }

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
    mainNote: 'Balance point is everything. Front end up, find the sweet spot, hold it. Working this daily on flat ground before adding distance.',
    otherTricks: ['Chicken Barspins', 'Footjams'],
    videos: [
      { youtubeId: 'QbgRtB4eHG4', label: 'Manual practice, flat ground' },
      { youtubeId: 'RjamX-ao0A4', label: 'Pull-up bar tricks on BMX' },
      { youtubeId: 'PALoD0ijUsM', label: 'Bunny hop practice' },
    ],
  },
  {
    q: 2,
    range: 'Apr – Jun 2026',
    color: '#f472b6',
    mainTrick: 'Barspins',
    mainNote: 'The scary one. Building up off low hops first, hands learning to trust letting go. Flat-ground and curb setups only.',
    otherTricks: ['Crankflips', 'X-Up', 'Pick Up Barspins'],
    videos: [
      { youtubeId: 'DU2M_j67068', label: 'Barspin drills' },
      { youtubeId: 'huO3YAudhJM', label: 'Crankflip attempts' },
      { youtubeId: 'fvvah3dR48o', label: 'Bunny hops, building height' },
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
      { youtubeId: 'ndzq0-ooRzE', label: 'Trying fakies' },
      { youtubeId: 'AB_rQSClML8', label: 'Riding backwards, fakie foundation' },
      { youtubeId: 'wyxGPM5dDeY', label: 'Fakies in the rain' },
    ],
  },
  {
    q: 4,
    range: 'Oct – Dec 2026',
    color: '#fbbf24',
    mainTrick: '180',
    mainNote: 'The first real spin. Half a rotation, commit to it, spot the landing, roll out clean. Starting on flat ground, then curb drops.',
    otherTricks: ['Fakie 180', '180 to Manual', 'Nose Manual'],
    videos: [
      { label: '180 flat ground attempts' },
      { label: 'Fakie 180 entry drills' },
      { label: '180 to manual combos' },
    ],
  },
]

/* Where each trick stands (last self-assessment 15-09-2026, updated from the log) */
const trickStatus = [
  { label: 'Dialed in', color: '#b1db00', tricks: ['Bunny hops', 'Backwards riding', 'Chicken barspins'] },
  { label: 'Getting there', color: '#00ddd7', tricks: ['Manuals', 'Fakies', 'X-ups', 'Footjams'] },
  { label: 'Learning', color: '#ff8c42', tricks: ['180s', 'Half cabs', 'Footplants'] },
  { label: 'First attempts', color: '#f472b6', tricks: ['Tailwhips', 'Crankflips', 'Pickup barspins'] },
]

/* Snapshot of the channel (21-10-2026), used only if the live YouTube feed can't be reached */
const fallbackVideos: ChannelVideo[] = [
  { id: 'dvSzNrbBW2k', title: 'Manuals practice on my new bike', date: '21-10-2026', short: true },
  { id: 'a2DIaueou_Q', title: 'Manuals to bunnyhops getting better', date: '20-10-2026', short: false },
  { id: 'FzPWdDTsBWM', title: 'Unable to do good fakies at this first spot', date: '19-10-2026', short: true },
  { id: '66zpMRlnmco', title: 'Day 1 trying half cabs', date: '18-10-2026', short: true },
  { id: 'wyxGPM5dDeY', title: 'Fakies in the rain', date: '17-10-2026', short: true },
  { id: 'pssuexEj-_w', title: '06-10-2026 Practice Session - Manuals, Footjams, Tailwhips, Bunnyhops', date: '16-10-2026', short: false },
  { id: 's17o5aCw-2s', title: 'Sundays are for fun', date: '16-10-2026', short: true },
  { id: 'Qd4Dp9pQ6LU', title: 'The things I think of before every fakie', date: '15-10-2026', short: true },
  { id: 'rYJ4IqoSthQ', title: 'Practicing tailwhips, any tips for staying over the front wheel?', date: '15-10-2026', short: false },
  { id: 'HISQFe-Wi9s', title: '100 Fakies for 100 Subscribers... Until it rained (I landed 43)', date: '14-10-2026', short: true },
  { id: 'lF50SDIzwgw', title: 'Tailwhip practice', date: '11-10-2026', short: true },
  { id: 'KNxqW12cEQU', title: 'How I Fixed My "Dancing" BMX Back Wheel (Bent Rear Axle Swap)', date: '10-10-2026', short: false },
]

/* Quarter cards get the newest matching Shorts (matched by title), then fall back to the curated clips */
function withLiveClips(quarters: Quarter[], videos: ChannelVideo[]): Quarter[] {
  const byQuarter = new Map<number, VideoClip[]>()
  for (const v of videos) {
    if (!v.short) continue
    const q = detectTrick(v.title)?.quarter
    if (!q) continue
    byQuarter.set(q, [...(byQuarter.get(q) ?? []), { youtubeId: v.id, label: cleanTitle(v.title) }])
  }
  return quarters.map(q => {
    const live = (byQuarter.get(q.q) ?? []).slice(0, 3)
    const liveIds = new Set(live.map(c => c.youtubeId))
    const curated = q.videos.filter(c => !c.youtubeId || !liveIds.has(c.youtubeId))
    return { ...q, videos: [...live, ...curated].slice(0, 3) }
  })
}

const photos = [
  { src: '/img/bmx/bmx1.jpg', caption: 'The weapon of choice', span: 'wide' },
  { src: '/img/bmx/bmx2.jpg', caption: 'Manual session, Nakuru CBD' },
  { src: '/img/bmx/bmx3.jpg', caption: 'Street spot hunt' },
  { src: '/img/bmx/bmx4.jpg', caption: 'Early morning ride' },
  { src: '/img/bmx/bmx5.jpg', caption: 'Session with the crew' },
  { src: '/img/bmx/bmx6.jpg', caption: 'Finding spots' },
  { src: '/img/bmx/bmx7.jpg', caption: 'Street session' },
  { src: '/img/bmx/bmx8.jpg', caption: 'Trick practice' },
  { src: '/img/bmx/bmx9.jpg', caption: 'Rolling through Nakuru' },
  { src: '/img/bmx/bmx10.jpg', caption: 'Session highlights' },
  { src: '/img/bmx/bmx11.jpg', caption: 'Street riding' },
  { src: '/img/bmx/bmx12.jpg', caption: 'BMX life' },
  { src: '/img/bmx/bmx13.jpg', caption: 'Street spot' },
  { src: '/img/bmx/bmx14.jpg', caption: 'Session clip' },
  { src: '/img/bmx/bmx15.jpg', caption: 'Riding around' },
  { src: '/img/bmx/bmx16.jpg', caption: 'Trick attempt' },
  { src: '/img/bmx/bmx17.jpg', caption: 'Nakuru streets' },
  { src: '/img/bmx/bmx18.jpg', caption: 'Session vibes' },
  { src: '/img/bmx/bmx19.jpg', caption: 'Street life' },
  { src: '/img/bmx/bmx20.jpg', caption: 'Riding session' },
  { src: '/img/bmx/bmx21.jpg', caption: 'BMX moment' },
  { src: '/img/bmx/bmx22.jpg', caption: 'Out on the streets' },
  { src: '/img/bmx/bmx23.jpg', caption: 'Practice run' },
  { src: '/img/bmx/bmx24.jpg', caption: 'Street spot hunt' },
  { src: '/img/bmx/bmx25.jpg', caption: 'Session footage' },
  { src: '/img/bmx/bmx26.jpg', caption: 'Trick drill' },
  { src: '/img/bmx/bmx27.jpg', caption: 'Riding in Nakuru' },
  { src: '/img/bmx/bmx28.jpg', caption: 'Street session' },
  { src: '/img/bmx/bmx29.jpg', caption: 'BMX life' },
  { src: '/img/bmx/bmx30.jpg', caption: 'Session wrap' },
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
  { label: 'Frame', value: 'Radio Darko, 20.5" top tube, chrome', icon: '🚲' },
  { label: 'Fork', value: 'Wethepeople Justice, black, 4130 chromoly, 22mm offset', icon: '🍴' },
  { label: 'Bars & Stem', value: 'Wethepeople bars, Salt stem', icon: '⬛' },
  { label: 'Front Rim', value: 'Salt Valon, 36 hole, ~446g', icon: '⚙️' },
  { label: 'Rear Rim', value: 'Saltplus Summit, 36mm wide, 36 hole', icon: '⚙️' },
  { label: 'Front Tyre', value: 'Eastern Curb Monkey 20x2.40', icon: '⭕' },
  { label: 'Rear Tyre', value: 'Demolition Momentum 20x2.35, ~538g', icon: '⭕' },
  { label: 'Hubs', value: 'Salt sealed front, Salt cassette rear', icon: '🔘' },
  { label: 'Sprocket', value: '28T Premium', icon: '⛓️' },
  { label: 'Bearings', value: 'Sealed everything: BB, headset, hubs', icon: '🛡️' },
  { label: 'Pedals', value: 'Rant plastic', icon: '🦶' },
  { label: 'Pegs', value: '2x plastic', icon: '🔩' },
  { label: 'Brakes', value: 'None', icon: '✋' },
  { label: 'Riding style', value: 'Street only, no parks nearby', icon: '🏙️' },
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
  const opacity = useTransform(scrollYProgress, inputRange, inputRange.map(v => v === cardCenter ? 1 : 0.85))
  const scale = useTransform(scrollYProgress, inputRange, inputRange.map(v => v === cardCenter ? 1.05 : 0.95))

  return (
    <m.div className="w-[240px] md:w-[420px] flex-shrink-0 flex flex-col items-center" style={{ opacity, scale }}>
      <div className="w-full bg-white/[0.03] border border-white/[0.08] border-t-[3px] rounded-xl px-[1.2rem] py-[1.1rem] mb-[14px] transition-colors hover:bg-white/[0.07]" style={{ borderColor: `${phase.color}50` }}>
        <div className="mb-2">
          <span className="text-[0.82rem] font-extrabold tracking-[2px] uppercase" style={{ color: phase.color }}>{phase.phase}</span>
        </div>
        <p className="text-[0.79rem] leading-[1.7] text-white mb-3">{phase.note}</p>
        <div className="flex flex-wrap gap-[0.4rem]">
          {phase.tricks.map((t) => (
            <span
              key={t}
              className="border rounded-full px-[0.65rem] py-[0.2rem] text-[0.75rem] font-semibold tracking-[0.3px]"
              style={{ borderColor: phase.color, color: phase.color }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="w-0.5 h-[14px] flex-shrink-0 origin-top" style={{ background: phase.color }} />
      <div
        className="w-[13px] h-[13px] rounded-full flex-shrink-0 relative z-10"
        style={{ background: phase.color, boxShadow: `0 0 14px ${phase.color}70` }}
      />
      <span className="mt-2 text-[0.67rem] font-mono tracking-[0.5px] text-center whitespace-nowrap" style={{ color: `${phase.color}99` }}>{phase.period}</span>
    </m.div>
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
    <div ref={sectionRef} style={{ height: sectionHeight }} className="relative -mx-6 md:-mx-16 mb-16">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col p-0">

        <div className="pt-[5vh] md:pt-[8vh] px-6 md:px-[60px] shrink-0">
          <m.div className="text-xl font-bold tracking-[3px] uppercase text-white mb-4" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <span className="text-lime mr-2">—</span> Skills Progression
          </m.div>
          <m.p className="text-[0.88rem] text-white max-w-lg mb-0" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            One year in. From never touching a BMX to bunny hops and backwards riding
          </m.p>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-[0.7rem] tracking-[2.5px] uppercase text-lime px-6 md:px-[60px] mb-4 mt-2 shrink-0">
            <m.span
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            >
              ↓
            </m.span>
            <span>scroll to explore</span>
          </div>

          <m.div className="flex items-start gap-5 md:gap-[32px] px-5 md:px-[calc(50vw-210px)] pb-[52px] w-max relative will-change-transform" style={{ x }}>
            <div className="absolute inset-x-0 bottom-[38px] h-0.5 pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 3%, rgba(255,255,255,0.1) 97%, transparent 100%)' }} />
            {progression.map((phase, i) => (
              <HPhaseCard key={phase.period} phase={phase} index={i} scrollYProgress={scrollYProgress} />
            ))}
          </m.div>
        </div>

        <div className="mx-5 md:mx-[60px] mb-4 md:mb-6 h-0.5 bg-white/[0.07] rounded-sm overflow-hidden shrink-0">
          <m.div
            className="h-full rounded-sm"
            style={{ scaleX: scrollYProgress, transformOrigin: 'left', background: 'linear-gradient(90deg, #b1db00, #00ddd7, #f472b6, #ff8c42)' }}
          />
        </div>

      </div>
    </div>
  )
}

/* ─── The Setup (Animated Cards Ticker) ─── */
function GearSetup() {
  const { scrollY } = useScroll()
  // x1 scrolls left, x2 scrolls right linearly with page scroll
  const x1 = useTransform(scrollY, (v) => -v * 0.7)
  const x2 = useTransform(scrollY, (v) => v * 0.7 - 500)
  const smooth1 = useSpring(x1, { damping: 50, stiffness: 200, mass: 0.5 })
  const smooth2 = useSpring(x2, { damping: 50, stiffness: 200, mass: 0.5 })

  // Duplicate items enough times to outlast maximum page scroll
  const half = Math.ceil(gear.length / 2)
  const row1Items = Array(8).fill(gear.slice(0, half)).flat()
  const row2Items = Array(8).fill(gear.slice(half)).flat()

  const renderCards = (items: typeof gear) =>
    items.map((g, i) => (
      <div
        key={i}
        className="flex-shrink-0 w-[240px] md:w-[320px] flex flex-col bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 hover:bg-white/[0.06] hover:border-lime/40 transition-all group"
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[1.35rem] opacity-70 group-hover:opacity-100 transition-opacity">{g.icon}</span>
          <span className="text-[0.7rem] font-bold tracking-[2px] uppercase text-white/40 group-hover:text-lime transition-colors">{g.label}</span>
        </div>
        <p className="text-[0.95rem] lg:text-[1.05rem] font-medium text-white/90 leading-snug whitespace-normal">{g.value}</p>
      </div>
    ))

  return (
    <div className="mb-16 py-12 -mx-6 md:-mx-16 border-t border-b border-white/[0.06] overflow-hidden flex flex-col gap-[1.25rem]">
      <m.div className="text-xl font-bold tracking-[3px] uppercase text-white mb-2 px-6 md:px-16" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
        <span className="text-lime mr-2">—</span> The Setup
      </m.div>
      <div className="overflow-visible w-full relative">
        <m.div className="flex gap-4 md:gap-5 w-max px-6 md:px-16" style={{ x: smooth1 }}>
          {renderCards(row1Items)}
        </m.div>
      </div>
      <div className="overflow-visible w-full relative">
        <m.div className="flex gap-4 md:gap-5 w-max px-6 md:px-16" style={{ x: smooth2, marginLeft: '-150px' }}>
          {renderCards(row2Items)}
        </m.div>
      </div>
    </div>
  )
}

/* ─── Video Snippet Slot ─── */
function usePlayer() {
  const uid = useId()
  const { active, setActive } = useContext(PlayerCtx)
  return { playing: active === uid, play: () => setActive(uid) }
}

function VideoSlot({ clip, color }: { clip: VideoClip; color: string }) {
  const { playing, play } = usePlayer()
  return (
    <m.div
      className="w-full min-w-0 lg:w-[140px] shrink-0 border border-white/[0.08] rounded-lg overflow-hidden flex flex-col gap-[0.3rem] transition-all"
      style={{ borderColor: `${color}44` }}
      variants={fadeUp}
      whileHover={{ borderColor: color, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {clip.youtubeId ? (
        <div className="relative w-full aspect-[9/16] bg-black">
          {playing ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${clip.youtubeId}?autoplay=1&rel=0`}
              title={clip.label}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0 block"
            />
          ) : (
            <button type="button" className="group absolute inset-0 w-full h-full p-0 border-0 bg-transparent cursor-pointer" onClick={play} aria-label={`Play ${clip.label}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`https://i.ytimg.com/vi/${clip.youtubeId}/hqdefault.jpg`} alt="" loading="lazy" className="w-full h-full object-cover block" />
              <span className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-[0.8rem] text-[#0a0a0a] pl-[2px]" style={{ background: color }}>
                <i className="fas fa-play" />
              </span>
            </button>
          )}
        </div>
      ) : clip.src ? (
        <video src={clip.src} controls playsInline className="w-full aspect-[9/16] object-cover bg-black block" />
      ) : (
        <div className="aspect-[9/16] flex flex-col items-center justify-center text-[0.62rem] uppercase tracking-[0.4px] bg-white/[0.02] gap-[0.2rem]" style={{ color: `${color}66` }}>
          <i className="fas fa-film" style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }} />
          <span>clip incoming</span>
        </div>
      )}
      <p className="text-[0.62rem] px-[0.4rem] py-[0.25rem] leading-[1.4] m-0 font-semibold" style={{ color }}>{clip.label}</p>
    </m.div>
  )
}

/* ─── YouTube click-to-play card (thumbnail first, iframe only on click) ─── */
function YtCard({ video, color }: { video: ChannelVideo; color: string }) {
  const { playing, play } = usePlayer()
  const watchUrl = video.short ? `https://www.youtube.com/shorts/${video.id}` : `https://www.youtube.com/watch?v=${video.id}`

  return (
    <m.div
      className="flex flex-col rounded-xl overflow-hidden border bg-white/[0.03] min-w-0"
      style={{ borderColor: `${color}44` }}
      variants={fadeUp}
      whileHover={{ borderColor: color }}
    >
      <div className={`relative w-full bg-black ${video.short ? 'aspect-[9/16]' : 'aspect-video'}`}>
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0 block"
          />
        ) : (
          <button
            type="button"
            className="group absolute inset-0 w-full h-full p-0 border-0 bg-transparent cursor-pointer"
            onClick={play}
            aria-label={`Play ${video.title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt="" loading="lazy" className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-[1.04]" />
            <span className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center text-[1.2rem] text-[#0a0a0a] pl-1" style={{ background: color }}>
              <i className="fas fa-play" />
            </span>
          </button>
        )}
      </div>
      <div className="flex flex-col gap-2 p-3">
        <p className="m-0 text-[0.82rem] font-semibold leading-snug text-white/90">{video.title}</p>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-[0.68rem] tracking-[1.5px] text-white/35 font-mono">{video.date}</span>
          <a href={watchUrl} target="_blank" rel="noopener noreferrer" className="text-[0.72rem] font-bold no-underline hover:underline" style={{ color }}>
            <i className="fab fa-youtube mr-1" /> Open on YouTube
          </a>
        </div>
      </div>
    </m.div>
  )
}

/* ─── Latest Updates (trick status board + progress feed) ─── */
function LatestUpdates({ videos }: { videos: ChannelVideo[] }) {
  return (
    <div className="mb-16">
      <m.div className="text-xl font-bold tracking-[3px] uppercase text-white mb-3" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
        <span className="text-lime mr-2">—</span> Latest Updates
      </m.div>
      <m.p className="text-[0.88rem] text-white mb-8" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
        Where each trick stands right now, and what I have been working on this month
      </m.p>

      <m.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10" variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true }}>
        {trickStatus.map(s => (
          <m.div key={s.label} variants={fadeUp} className="rounded-xl border border-white/[0.08] border-t-[3px] bg-white/[0.03] p-4" style={{ borderTopColor: s.color }}>
            <p className="m-0 mb-3 text-[0.72rem] font-extrabold tracking-[2px] uppercase" style={{ color: s.color }}>{s.label}</p>
            <div className="flex flex-wrap gap-[0.4rem]">
              {s.tricks.map(t => (
                <span key={t} className="border rounded-full px-[0.65rem] py-[0.2rem] text-[0.75rem] font-semibold" style={{ borderColor: `${s.color}88`, color: `${s.color}dd` }}>{t}</span>
              ))}
            </div>
          </m.div>
        ))}
      </m.div>

      <UpdatesRail videos={videos.slice(0, 10)} />
    </div>
  )
}

/* ─── Horizontal feed: newest first, hover (or tap on touch) reveals title + actions ─── */
function RailCard({ video }: { video: ChannelVideo }) {
  const { playing, play } = usePlayer()
  const trick = detectTrick(video.title)
  const watchUrl = video.short ? `https://www.youtube.com/shorts/${video.id}` : `https://www.youtube.com/watch?v=${video.id}`

  return (
    <div className="group relative shrink-0 snap-start w-[170px] sm:w-[200px] h-[290px] rounded-xl overflow-hidden border border-white/[0.1] bg-black focus-within:border-lime hover:border-lime transition-colors">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0 block"
        />
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt="" loading="lazy" className={`absolute inset-0 w-full h-full object-cover block transition-transform duration-500 ${video.short ? 'group-hover:scale-[1.06]' : 'scale-[1.34] group-hover:scale-[1.42]'}`} />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 p-2 bg-gradient-to-b from-black/80 to-transparent">
            <span className="text-[0.66rem] tracking-[1.5px] text-white/80 font-mono">{video.date}</span>
            {trick && <span className="text-[0.62rem] font-bold uppercase tracking-[1px] px-2 py-[0.1rem] rounded-full bg-lime text-[#0a0a0a]">{trick.label}</span>}
          </div>
          <div className="absolute inset-0 flex flex-col justify-end gap-2 p-3 bg-gradient-to-t from-black/95 via-black/70 to-black/10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity">
            <p className="m-0 text-[0.82rem] font-bold leading-snug text-white">{video.title}</p>
            <div className="flex flex-col gap-[0.35rem]">
              <button type="button" onClick={play} className="inline-flex items-center justify-center gap-2 px-3 py-[0.35rem] rounded-md border-0 bg-lime text-[#0a0a0a] text-[0.72rem] font-bold cursor-pointer">
                <i className="fas fa-play" /> Play here
              </button>
              <a href={watchUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-3 py-[0.35rem] rounded-md border border-white/30 text-white text-[0.72rem] font-bold no-underline hover:bg-white/10">
                <i className="fab fa-youtube" /> Open on YouTube
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function UpdatesRail({ videos }: { videos: ChannelVideo[] }) {
  const railRef = useRef<HTMLDivElement>(null)
  const scrollBy = (dir: number) => railRef.current?.scrollBy({ left: dir * 420, behavior: 'smooth' })

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="m-0 text-[0.7rem] text-white/35 uppercase tracking-[2px]">Newest first</p>
        <div className="hidden md:flex gap-2">
          <button type="button" aria-label="Scroll left" onClick={() => scrollBy(-1)} className="w-8 h-8 rounded-full border border-white/20 bg-white/[0.05] text-white cursor-pointer hover:bg-white/15">‹</button>
          <button type="button" aria-label="Scroll right" onClick={() => scrollBy(1)} className="w-8 h-8 rounded-full border border-white/20 bg-white/[0.05] text-white cursor-pointer hover:bg-white/15">›</button>
        </div>
      </div>
      <div ref={railRef} className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.25)_transparent]">
        {videos.map(v => <RailCard key={v.id} video={v} />)}
      </div>
    </div>
  )
}

/* ─── Latest Videos (YouTube) ─── */
function LatestVideos({ videos }: { videos: ChannelVideo[] }) {
  const shorts = videos.filter(v => v.short).slice(0, 4)
  const longForm = videos.filter(v => !v.short).slice(0, 3)
  return (
    <div className="mb-16">
      <m.div className="text-xl font-bold tracking-[3px] uppercase text-white mb-3" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
        <span className="text-lime mr-2">—</span> Latest Videos
      </m.div>
      <m.p className="text-[0.88rem] text-white mb-6" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
        Tap to play right here, or open it on YouTube
      </m.p>

      <p className="text-[0.7rem] text-white/35 uppercase tracking-[2px] mb-3">Shorts</p>
      <m.div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8" variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true }}>
        {shorts.map(v => <YtCard key={v.id} video={v} color="#ff8c42" />)}
      </m.div>

      <p className="text-[0.7rem] text-white/35 uppercase tracking-[2px] mb-3">Sessions &amp; repairs</p>
      <m.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-8" variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true }}>
        {longForm.map(v => <YtCard key={v.id} video={v} color="#00ddd7" />)}
      </m.div>

      <a href="https://youtube.com/@bryanaim/videos" target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-[0.5rem] px-[1.4rem] py-[0.6rem] border border-[#ff0000] text-[#ff0000] rounded-[6px] font-bold text-[0.85rem] no-underline transition-colors hover:bg-[#ff0000]/15">
        <i className="fab fa-youtube" /> See all videos on YouTube
      </a>
    </div>
  )
}

/* ─── Roadmap Stack Card (sticky stacked, mirrors about page pattern) ─── */
function RoadmapStackCard({ quarter, index, total }: { quarter: Quarter; index: number; total: number }) {
  const stickyTop = 80 + index * 20
  const isActive = quarter.q === CURRENT_Q
  const isPast = quarter.q < CURRENT_Q
  const status = isPast ? 'completed' : isActive ? 'active' : 'upcoming'
  const statusLabel = isPast ? 'Completed' : isActive ? 'Currently Learning' : 'Upcoming'
  const [videosOpen, setVideosOpen] = useState(false)

  return (
    <m.div
      className={`sticky h-auto lg:h-[calc(100vh-120px)] min-h-[60vh] md:min-h-[70vh] rounded-[14px] overflow-hidden border-t-[3px] shadow-[0_8px_32px_rgba(0,0,0,0.4)] mb-6 will-change-transform bg-[#0c0c0c]${isPast ? ' brightness-[0.8]' : ''}`}
      style={{
        top: stickyTop,
        zIndex: index + 1,
        backgroundColor: '#0c0c0c',
        '--rs-color': quarter.color,
        borderTopColor: quarter.color,
      } as React.CSSProperties}
      whileHover={{
        boxShadow: `0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px ${quarter.color}, 0 0 50px ${quarter.color}22`,
        transition: { duration: 0.2 },
      }}
    >
      {/* Ghost Q number background texture */}
      <div className="absolute -right-[0.05em] -bottom-[0.15em] text-[22rem] font-black font-mono leading-none opacity-[0.04] pointer-events-none select-none tracking-[-4px]" style={{ color: quarter.color }}>Q{quarter.q}</div>
      {/* Overlay */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(115deg, rgba(10,10,10,0.97) 0%, rgba(10,10,10,0.85) 55%, ${quarter.color}12 100%)` }} />

      <div className="absolute inset-0 flex flex-col lg:flex-row items-start lg:items-center p-[1.4rem_1.2rem_1.2rem] md:p-[2rem_2rem_1.6rem] lg:p-[3rem_4rem] gap-[0.8rem] lg:gap-[3rem] overflow-y-auto lg:overflow-hidden">
        {/* Left column — Q number + period */}
        <div className="flex flex-row lg:flex-col items-center gap-[0.8rem] lg:gap-[1.2rem] shrink-0">
          <span className="text-[0.7rem] text-white/20 font-mono tracking-[2px] [writing-mode:horizontal-tb] lg:[writing-mode:vertical-rl]">{String(index + 1).padStart(2, '0')}</span>
          <span className="text-[2.2rem] md:text-[2.6rem] lg:text-[3.8rem] font-black font-mono leading-none [text-shadow:0_0_40px_var(--rs-color)]" style={{ color: quarter.color }}>Q{quarter.q}</span>
          <span className="text-[0.65rem] text-white/25 uppercase tracking-[1.5px] [writing-mode:horizontal-tb] lg:[writing-mode:vertical-rl]">{quarter.range}</span>
        </div>

        {/* Middle column — trick info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-4 mb-[0.4rem]">
            <p className="text-[0.72rem] text-white/30 tracking-[3px] uppercase m-0">{index + 1} / {total}</p>
            <div
              className="text-[0.7rem] font-bold tracking-[0.6px] uppercase px-[0.6rem] py-[0.25rem] rounded-full bg-white/[0.07] text-white/50 flex items-center gap-[0.4rem] relative"
              style={isActive ? { background: quarter.color, color: '#0a0a0a' } : {}}
            >
              {isActive && <span className="bmx-badge-pulse" style={{ background: quarter.color }} />}
              {statusLabel}
            </div>
          </div>
          <h3 className="text-[2rem] md:text-[2.4rem] lg:text-[3.2rem] font-black uppercase tracking-[3px] leading-none mb-[0.8rem]" style={{ color: quarter.color }}>{quarter.mainTrick}</h3>
          <p className="text-[0.82rem] md:text-[0.85rem] lg:text-[0.9rem] leading-[1.78] text-white/55 mb-[0.8rem] lg:mb-[1.2rem] max-w-[420px]">{quarter.mainNote}</p>

          <p className="text-[0.7rem] text-white/30 uppercase tracking-[2px] mb-2">Also working on</p>
          <div className="flex flex-wrap gap-[0.4rem]">
            {quarter.otherTricks.map(t => (
              <span key={t} className="border rounded-full px-[0.65rem] py-[0.2rem] text-[0.75rem] font-semibold tracking-[0.3px]" style={{ borderColor: `${quarter.color}88`, color: `${quarter.color}cc` }}>{t}</span>
            ))}
          </div>

          {/* Mobile-only video toggle */}
          <button
            className="flex lg:hidden items-center gap-2 bg-transparent border rounded-md px-3 py-[0.4rem] text-[0.75rem] tracking-[1.5px] uppercase cursor-pointer mt-2 font-mono"
            style={{ borderColor: `${quarter.color}88`, color: quarter.color }}
            onClick={() => setVideosOpen(v => !v)}
          >
            <i className={`fas fa-${videosOpen ? 'chevron-up' : 'film'}`} />
            {videosOpen ? 'Hide clips' : 'Show clips'}
          </button>
        </div>

        {/* Right column — video clips (always visible on desktop, toggle on mobile) */}
        <div className={`${videosOpen ? 'grid' : 'hidden'} grid-cols-3 lg:flex lg:flex-nowrap gap-[0.6rem] shrink-0 items-stretch w-full lg:w-auto`}>
          {quarter.videos.map((v, i) => (
            <VideoSlot key={i} clip={v} color={quarter.color} />
          ))}
        </div>
      </div>
    </m.div>
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
    <m.div
      className="relative rounded-[10px] overflow-hidden cursor-zoom-in group"
      layoutId={`bmx-photo-${tileIndex % photos.length}`}
      style={{ rotateX, rotateY: useTransform(rotateY, v => v + curveY), transformPerspective: 700 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={() => onSelect(tileIndex % photos.length)}
      whileHover={{ scale: 1.07, zIndex: 10 }}
      transition={{ scale: { duration: 0.18 } }}
    >
      <m.img
        layoutId={`bmx-photo-img-${tileIndex % photos.length}`}
        src={photo.src}
        alt={photo.caption}
        className="w-full h-full object-cover block pointer-events-none"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-black/10 flex items-end p-[0.9rem] opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[0.82rem] text-white font-semibold">{photo.caption}</span>
      </div>
    </m.div>
  )
}

function GalleryX({ onSelect }: { onSelect: (i: number) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [constraints, setConstraints] = useState({ left: 0, right: 0, top: 0, bottom: 0 })
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return
      const cw = containerRef.current.offsetWidth
      const ch = containerRef.current.offsetHeight
      if (!cw || !ch) return // guard: skip if not yet painted
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
    }
    measure()
    // Re-measure on resize (handles orientation changes or window resize)
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [x, y])

  const tiles = [...photos, ...photos, ...photos, ...photos]

  return (
    // height as inline style ensures it's present at paint time before useEffect measures
    <div ref={containerRef} className="relative overflow-hidden rounded-xl select-none" style={{ height: '75vh', perspective: '1200px' }}>
      <m.div
        className="grid grid-cols-[repeat(8,320px)] auto-rows-[240px] gap-3 w-max p-1"
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
      </m.div>
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[0.72rem] text-lime tracking-[2px] uppercase pointer-events-none">drag to explore</div>
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
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext])

  if (!mounted) return null

  return createPortal(
    <m.div
      className="fixed inset-0 z-[999] bg-black/[0.88] backdrop-blur-[10px] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <m.div
        className="relative max-w-[min(90vw,900px)] max-h-[90vh] rounded-2xl overflow-hidden bg-[#111]"
        style={{ boxShadow: '0 40px 120px rgba(0,0,0,0.7)' }}
        layoutId={`bmx-photo-${index}`}
        onClick={e => e.stopPropagation()}
      >
        <m.img
          layoutId={`bmx-photo-img-${index}`}
          src={photo.src}
          alt={photo.caption}
          className="block w-full max-h-[78vh] object-contain"
        />
        <m.p
          className="px-[1.2rem] py-[0.9rem] text-[0.85rem] text-white/60 bg-black/40 m-0"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
        >
          {photo.caption}
        </m.p>
      </m.div>

      <m.button
        className="fixed top-6 right-6 bg-white/10 border border-white/[0.15] text-white w-10 h-10 rounded-full cursor-pointer text-base flex items-center justify-center z-[1000] transition-colors hover:bg-white/20"
        onClick={onClose}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.15 }}
      >
        ✕
      </m.button>

      {index > 0 && (
        <m.button
          className="fixed top-1/2 -translate-y-1/2 left-4 hidden md:flex bg-white/[0.08] border border-white/[0.12] text-white w-12 h-16 rounded-xl cursor-pointer text-[2rem] items-center justify-center z-[1000] transition-colors leading-none hover:bg-white/[0.16]"
          onClick={e => { e.stopPropagation(); onPrev() }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.1, x: -3 }}
        >
          ‹
        </m.button>
      )}
      {index < total - 1 && (
        <m.button
          className="fixed top-1/2 -translate-y-1/2 right-4 hidden md:flex bg-white/[0.08] border border-white/[0.12] text-white w-12 h-16 rounded-xl cursor-pointer text-[2rem] items-center justify-center z-[1000] transition-colors leading-none hover:bg-white/[0.16]"
          onClick={e => { e.stopPropagation(); onNext() }}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.1, x: 3 }}
        >
          ›
        </m.button>
      )}

      <m.div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 text-[0.75rem] tracking-[2px] text-white/40 z-[1000]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        {index + 1} / {total}
      </m.div>
    </m.div>,
    document.body
  )
}

/* ─── Page ─── */
export default function BMX({ videos }: { videos: ChannelVideo[] }) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)
  const [activePlayer, setActivePlayer] = useState<string | null>(null)
  const feed = videos.length ? videos : fallbackVideos
  const quarters = useMemo(() => withLiveClips(quarters2026, feed), [feed])
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroImgY = useTransform(heroScroll, [0, 1], ['0%', '25%'])
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0])

  return (
    <PlayerCtx.Provider value={{ active: activePlayer, setActive: setActivePlayer }}>
    <main id="bmx" className="overflow-x-clip">
      {/* ── Hero heading ── */}
      <m.h1
        className="text-[clamp(3rem,10vw,7rem)] mb-[0.2rem] text-center font-semibold max-sm:leading-none max-sm:mb-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        BMX <span className="text-lime">Life</span>
      </m.h1>
      <m.h2
        className="mb-12 py-[0.2rem] px-4 bg-[rgba(73,73,73,0.5)] text-center font-semibold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
      >
        Streets are my playground. Always learning, always riding
      </m.h2>

      {/* ── Intro banner (parallax) ── */}
      <m.div
        ref={heroRef}
        className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-6 md:gap-12 items-center my-8 mb-14"
        variants={fadeUp} initial="hidden"
        whileInView="show" viewport={{ once: true }}
        style={{ opacity: heroOpacity }}
      >
        <div
          className="relative rounded-[14px] overflow-hidden aspect-[4/3] border-2 border-pink-400/30 group"
          style={{ boxShadow: '0 16px 48px rgba(0,0,0,0.45), 0 0 0 1px rgba(244,114,182,0.2)' }}
        >
          <m.img src="/img/bmx/bmx2.jpg" alt="BMX bike" className="w-full h-full object-cover transition-transform duration-[0.6s] ease-in-out group-hover:scale-[1.04]" style={{ y: heroImgY }} />
        </div>
        <div>
          <h3 className="text-[2rem] font-extrabold mb-4 text-[#e0e0e0]">Why <span className="text-lime">BMX?</span></h3>
          <p className="text-[0.95rem] leading-[1.8] text-white mb-[0.9rem]">
            When the laptop closes, the bike comes out. Started in March 2025 with zero riding
            background, just curiosity and stubbornness. BMX demands full presence, punishes
            half-heartedness, and rewards patience the exact same way coding does.
          </p>
          <p className="text-[0.95rem] leading-[1.8] text-white mb-[0.9rem]">
            Street rider. Every trick gets learned on flat ground, curbs, and whatever
            the streets throw at you. Still a beginner and proud of it.
          </p>
          <div className="flex flex-wrap gap-2 mt-5">
            <span className="px-3 py-[0.25rem] border rounded-full text-[0.78rem] font-semibold tracking-[0.5px]" style={{ borderColor: '#f472b6', color: '#f472b6' }}>Street Style</span>
            <span className="px-3 py-[0.25rem] border rounded-full text-[0.78rem] font-semibold tracking-[0.5px]" style={{ borderColor: '#b1db00', color: '#b1db00' }}>Self-Taught</span>
            <span className="px-3 py-[0.25rem] border rounded-full text-[0.78rem] font-semibold tracking-[0.5px]" style={{ borderColor: '#00ddd7', color: '#00ddd7' }}>Nakuru, Kenya</span>
            <span className="px-3 py-[0.25rem] border rounded-full text-[0.78rem] font-semibold tracking-[0.5px]" style={{ borderColor: '#ff8c42', color: '#ff8c42' }}>Since Mar 2025</span>
          </div>
        </div>
      </m.div>

      {/* ── The Setup (gear ticker) ── */}
      <GearSetup />

      {/* ── Skills Progression ── */}
      <SkillsTimeline />

      {/* ── Latest Updates + Videos ── */}
      <LatestUpdates videos={feed} />
      <LatestVideos videos={feed} />

      {/* ── 2026 Quarterly Goals ── */}
      <div className="mb-16">
        <m.div className="text-xl font-bold tracking-[3px] uppercase text-white mb-8" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <span className="text-lime mr-2">—</span> 2026 Trick Roadmap
        </m.div>
        <m.p
          className="text-[0.88rem] text-white mb-6"
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
        >
          Quarter by quarter. One main trick, supporting tricks, and clips as I go
        </m.p>
        <div className="flex flex-col pb-[40vh] overflow-visible">
          {quarters.map((q, i) => (
            <RoadmapStackCard key={q.q} quarter={q} index={i} total={quarters.length} />
          ))}
        </div>
      </div>

      {/* ── Photo Gallery ── */}
      <div className="mb-16">
        <m.div className="text-xl font-bold tracking-[3px] uppercase text-white mb-8" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <span className="text-lime mr-2">—</span> Gallery
        </m.div>
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

      {/* ── Follow ── */}
      <m.div
        className="text-center py-12 pb-8 border-t border-white/[0.06]"
        variants={fadeUp} initial="hidden"
        whileInView="show" viewport={{ once: true }}
      >
        <p className="text-[0.8rem] tracking-[3px] uppercase text-white/30 mb-5">Follow the sessions</p>
        <div className="flex justify-center gap-4 flex-wrap">

          <a href="https://youtube.com/@bryanaim/videos" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-[0.5rem] px-[1.4rem] py-[0.6rem] border rounded-[6px] font-bold text-[0.85rem] no-underline transition-colors hover:bg-[color-mix(in_srgb,var(--fb-color)_15%,transparent)]" style={{ '--fb-color': '#b1db00', borderColor: '#b1db00', color: '#b1db00' } as React.CSSProperties}>
            <i className="fas fa-play" /> Watch Latest
          </a>
          <a href="https://tiktok.com/@bmxbrian" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-[0.5rem] px-[1.4rem] py-[0.6rem] border rounded-[6px] font-bold text-[0.85rem] no-underline transition-colors hover:bg-[color-mix(in_srgb,var(--fb-color)_15%,transparent)]" style={{ '--fb-color': '#e0e0e0' } as React.CSSProperties}>
            <i className="fab fa-tiktok" /> TikTok
          </a>
          <a href="https://youtube.com/@bryanaim" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-[0.5rem] px-[1.4rem] py-[0.6rem] border rounded-[6px] font-bold text-[0.85rem] no-underline transition-colors hover:bg-[color-mix(in_srgb,var(--fb-color)_15%,transparent)]" style={{ '--fb-color': '#ff0000' } as React.CSSProperties}>
            <i className="fab fa-youtube" /> YouTube
          </a>
        </div>
      </m.div>
    </main>
    </PlayerCtx.Provider>
  )
}
