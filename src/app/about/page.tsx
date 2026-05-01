'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import DesignGallery from '../components/DesignGallery'
import { devProjects, type DevProject } from '../work/devProjects'

/* ─── Animation variants ─── */
const SPRING = [0.16, 1, 0.3, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 64, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: SPRING } },
}
const fadeLeft = {
  hidden: { opacity: 0, x: -60, filter: 'blur(4px)' },
  show: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: SPRING } },
}
const fadeRight = {
  hidden: { opacity: 0, x: 60, filter: 'blur(4px)' },
  show: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: SPRING } },
}
const stagger = (delay = 0.1) => ({
  hidden: {},
  show: { transition: { staggerChildren: delay } },
})

/* ─── Types ─── */
interface Skill { name: string; level: number }
interface Photo { src: string; caption: string }

/* ─── Data ─── */
const webDevSkills: Skill[] = [
  { name: 'HTML5 / CSS3', level: 85 },
  { name: 'JavaScript (ES6+)', level: 80 },
  { name: 'TypeScript', level: 60 },
  { name: 'Next.js / React', level: 65 },
  { name: 'Vue.js / Nuxt', level: 55 },
  { name: 'Tailwind CSS', level: 70 },
  { name: 'Node.js', level: 75 },
  { name: 'Python / Django', level: 55 },
  { name: 'WordPress', level: 80 },
  { name: 'GCP', level: 55 },
  { name: 'Git / GitHub', level: 80 },
  { name: 'Mailchimp', level: 70 },
  { name: 'AI Tools', level: 80 },
]
const designSkills: Skill[] = [
  { name: 'Adobe Photoshop', level: 80 },
  { name: 'Adobe Illustrator', level: 90 },
  { name: 'UI/UX Design', level: 80 },
  { name: 'Motion Graphics', level: 65 },
]
const communityPhotos: Photo[] = [
  { src: '/img/projects/community/speaking-at-event.jpeg', caption: 'Speaking at a peer education event' },
  { src: '/img/projects/community/indoor-audience.jpeg', caption: 'Engaged audience at an indoor session' },
  { src: '/img/projects/community/heroes-discussion.jpeg', caption: 'Heroes for Change — group discussion' },
  { src: '/img/projects/community/outdoor-group.jpeg', caption: 'Community outdoor gathering' },
  { src: '/img/projects/community/classroom-session.jpeg', caption: 'Google Developer Group — Classroom education session' },
  { src: '/img/projects/community/heroes-outreach.jpeg', caption: 'Heroes for Change — youth outreach' },
  { src: '/img/projects/community/school-outreach-1.jpeg', caption: 'School outreach programme' },
  { src: '/img/projects/community/school-outreach-2.jpeg', caption: 'Engaging students at school' },
  { src: '/img/projects/community/heroes-school-address.jpeg', caption: 'Addressing students — Heroes for Change' },
  { src: '/img/projects/community/heroes-school-presentation.jpeg', caption: 'School presentation with the team' },
  { src: '/img/projects/community/heroes-school-assembly.jpeg', caption: 'School assembly address' },
  { src: '/img/projects/community/school-outreach-3.jpeg', caption: 'Community school outreach' },
]

const cards = [
  {
    id: 'webdev', icon: '</>', title: 'Tech & Development',
    color: '#00ddd7', glow: 'rgba(0,221,215,0.3)',
    tagline: 'Building solutions across the full stack',
    description: 'Started with a Google × Andela scholarship in 2018. From slick frontends to solid backends, cloud infrastructure, AI tools, and everything in between.',
    skills: webDevSkills, projects: devProjects, photos: null,
    bgImage: '/img/projects/design/compositions/enjoy-music.jpg',
    tags: ['Full-Stack', 'Open Source', 'Google Scholar'],
    socials: [
      { icon: 'fab fa-github', label: 'GitHub', url: 'https://github.com/BryanAim' },
      { icon: 'fab fa-linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/brian-isale/' },
      { icon: 'fab fa-dev', label: 'Dev.to', url: 'https://dev.to/bryanaim' },
    ],
    hasCert: true,
  },
  {
    id: 'design', icon: '✦', title: 'Creative Design',
    color: '#b1db00', glow: 'rgba(177,219,0,0.3)',
    tagline: 'Where art meets technology',
    description: 'From childhood sketches to professional digital art, design is in my DNA. Visual identities, motion graphics, and illustrations that actually mean something.',
    skills: designSkills, projects: null, photos: null,
    bgImage: '/img/bmx/design1-banner.jpg',
    tags: ['Brand Identity', 'Motion Graphics', 'UI/UX'],
    socials: [
      { icon: 'fab fa-behance', label: 'Behance', url: 'https://behance.net/isalebryan' },
      { icon: 'fab fa-instagram', label: 'Instagram', url: 'https://www.instagram.com/isalebryan/' },
      { icon: 'fab fa-linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/brian-isale/' },
    ],
    hasCert: false,
  },
  {
    id: 'volunteer', icon: '♥', title: 'Community Work',
    color: '#ff8c42', glow: 'rgba(255,140,66,0.3)',
    tagline: 'Making a difference beyond the screen',
    description: "Peer educator with HIV SEERs Kenya, fighting stigma through education and research. Also part of Unilever's Heroes for Change, reaching 3,000+ youth across Nakuru.",
    skills: null, projects: null, photos: communityPhotos,
    bgImage: '/img/heroes-school-address.jpeg',
    tags: ['HIV SEERs Kenya', 'Heroes for Change', '3,000+ Youth', 'Andela Mentor'],
    socials: [
      { icon: 'fab fa-facebook', label: 'Facebook', url: 'https://facebook.com/BryanAim' },
      { icon: 'fab fa-linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/brian-isale/' },
    ],
    hasCert: false,
  },
]

const stats = [
  { value: 6, suffix: '+', label: 'Years Experience' },
  { value: 20, suffix: '+', label: 'Projects Shipped' },
  { value: 20, suffix: '+', label: 'Students Mentored' },
  { value: 3000, suffix: '+', label: 'Youth Reached' },
]


/* ─── Skill Bar ─── */
function SkillBar({ name, level, color, animate, delay }: { name: string; level: number; color: string; animate: boolean; delay: number }) {
  const tier = level >= 85 ? 'Expert' : level >= 70 ? 'Advanced' : level >= 55 ? 'Proficient' : 'Familiar'
  const [typed, setTyped] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!animate) { setTyped(''); setDone(false); return }
    let i = 0
    const start = setTimeout(() => {
      const tick = setInterval(() => {
        i++
        setTyped(tier.slice(0, i))
        if (i >= tier.length) { clearInterval(tick); setDone(true) }
      }, 48)
      return () => clearInterval(tick)
    }, delay * 1000 + 180)
    return () => clearTimeout(start)
  }, [animate, tier, delay])

  return (
    <div>
      <div className="flex justify-between text-[0.82rem] text-[#bbb] mb-[0.25rem]">
        <span>{name}</span>
        <span style={{ color }} className="font-mono tracking-wider">
          {typed}{!done && animate && <span className="opacity-70 animate-pulse">_</span>}
        </span>
      </div>
      <div className="h-[6px] bg-white/[0.08] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-[900ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]"
          style={{
            width: animate ? `${level}%` : '0%',
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            transitionDelay: animate ? `${delay}s` : '0s',
          }}
        />
      </div>
    </div>
  )
}

/* ─── Project Thumb ─── */
function ProjectThumb({ p, color }: { p: DevProject; color: string }) {
  return (
    <div className="group relative block rounded-md overflow-hidden aspect-video cursor-default">
      <img src={p.img} alt={p.title} className="w-full h-full object-cover block transition-transform duration-[400ms] group-hover:scale-[1.06]" />
      <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-[0.4rem] opacity-0 transition-opacity duration-[250ms] group-hover:opacity-100">
        <span className="text-white text-[0.85rem] font-bold text-center mb-[0.3rem]">{p.title}</span>
        <div className="flex gap-[0.4rem]">
          {p.url && (
            <a href={p.url} target="_blank" rel="noopener noreferrer"
              className="about-project-gh inline-flex items-center gap-[0.3rem] text-[0.78rem] border px-[0.6rem] py-[0.2rem] rounded-full transition-colors duration-200"
              style={{ color, borderColor: color } as React.CSSProperties}>
              <i className="fas fa-eye" /> View
            </a>
          )}
          {p.github && (
            <a href={p.github} target="_blank" rel="noopener noreferrer"
              className="about-project-gh inline-flex items-center gap-[0.3rem] text-[0.78rem] border px-[0.6rem] py-[0.2rem] rounded-full transition-colors duration-200"
              style={{ color, borderColor: color } as React.CSSProperties}>
              <i className="fab fa-github" /> GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Card Modal ─── */
function CardModal({ card, onClose }: { card: typeof cards[0]; onClose: () => void }) {
  const [animSkills, setAnimSkills] = useState(false)
  const [showCert, setShowCert] = useState(false)
  const [shuffleSeed] = useState(() => Math.random())

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => setAnimSkills(true), 400)
    return () => { document.body.style.overflow = ''; clearTimeout(t) }
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return createPortal(
    <motion.div
      className="fixed inset-0 bg-black/[0.82] z-[900] flex items-center justify-center p-6 backdrop-blur-[6px] max-[768px]:p-0 max-[768px]:items-end"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        className="about-modal-panel bg-[#252525] rounded-xl border border-white/[0.08] w-full max-w-[760px] max-h-[88vh] overflow-y-auto shadow-[0_30px_80px_rgba(0,0,0,0.7)] max-[768px]:max-w-full max-[768px]:rounded-t-[20px] max-[768px]:rounded-b-none max-[768px]:max-h-[92vh]"
        onClick={e => e.stopPropagation()}
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div
          className="flex items-center justify-between px-[1.6rem] py-[1.2rem] border-b-2 sticky top-0 bg-[#252525] z-[1] max-[768px]:px-[1.2rem] max-[768px]:py-4"
          style={{ borderColor: card.color }}
        >
          <div className="flex items-center gap-[0.8rem]">
            <span className="text-[1.8rem] font-['Courier_New',monospace] font-extrabold leading-none" style={{ color: card.color }}>{card.icon}</span>
            <h2 className="text-[1.3rem] font-extrabold uppercase tracking-[2px]" style={{ color: card.color }}>{card.title}</h2>
          </div>
          <button
            className="bg-white/[0.08] border border-white/[0.12] text-white w-[34px] h-[34px] rounded-full cursor-pointer text-[0.9rem] flex items-center justify-center transition-all duration-200 hover:bg-white/[0.18] shrink-0"
            onClick={onClose}
          >✕</button>
        </div>
        <div className="px-[1.6rem] py-[1.4rem] max-[768px]:px-[1.2rem] max-[768px]:py-4">
          <p className="text-[0.95rem] leading-[1.8] text-[#ccc] mb-[1.2rem]">{card.description}</p>
          {card.skills && (
            <div className="mb-[1.4rem]">
              <h4 className="text-[0.78rem] font-bold uppercase tracking-[3px] mb-[0.8rem]" style={{ color: card.color }}>— Skills</h4>
              <div className={`grid gap-2 ${card.skills.length > 6 ? 'grid-cols-2 gap-x-6 max-[768px]:grid-cols-1' : 'grid-cols-1'}`}>
                {card.skills.map((s, i) => (
                  <SkillBar key={s.name} name={s.name} level={s.level} color={card.color} animate={animSkills} delay={i * 0.08} />
                ))}
              </div>
            </div>
          )}
          {!card.skills && (
            <div className="mb-[1.4rem]">
              <div className="flex flex-wrap gap-2">
                {card.tags.map(t => (
                  <span key={t} className="px-4 py-[0.4rem] border rounded-full text-[0.82rem] font-semibold" style={{ borderColor: card.color, color: card.color }}>{t}</span>
                ))}
              </div>
            </div>
          )}
          {card.id === 'design' && (
            <div className="mb-[1.4rem]">
              <h4 className="text-[0.78rem] font-bold uppercase tracking-[3px] mb-[0.8rem]" style={{ color: card.color }}>— Portfolio</h4>
              <DesignGallery shuffleSeed={shuffleSeed} />
            </div>
          )}
          {card.photos && (
            <div className="mb-[1.4rem]">
              <h4 className="text-[0.78rem] font-bold uppercase tracking-[3px] mb-[0.8rem]" style={{ color: card.color }}>— Photos</h4>
              <div className="grid grid-cols-3 gap-[0.6rem] max-[768px]:grid-cols-2">
                {card.photos.map((p: Photo) => (
                  <div key={p.src} className="group relative rounded-md overflow-hidden aspect-[4/3] cursor-default">
                    <img src={p.src} alt={p.caption} className="w-full h-full object-cover block transition-transform duration-[400ms] group-hover:scale-[1.06]" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 to-transparent text-white text-[0.72rem] px-[0.5rem] pb-[0.4rem] pt-4 opacity-0 transition-opacity duration-[250ms] group-hover:opacity-100 leading-[1.3]">
                      {p.caption}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {card.id !== 'design' && card.projects && (
            <div className="mb-[1.4rem]">
              <h4 className="text-[0.78rem] font-bold uppercase tracking-[3px] mb-[0.8rem]" style={{ color: card.color }}>— Projects</h4>
              <div className="grid grid-cols-2 gap-[0.7rem] max-[768px]:grid-cols-1">
                {card.projects.map(p => <ProjectThumb key={p.title} p={p} color={card.color} />)}
              </div>
            </div>
          )}
          {card.hasCert && (
            <div className="mb-[1.4rem]">
              <h4 className="text-[0.78rem] font-bold uppercase tracking-[3px] mb-[0.8rem]" style={{ color: card.color }}>— Certificate</h4>
              <div
                className="flex items-center justify-between gap-4 bg-white/[0.04] border border-white/[0.08] rounded-lg px-[1.2rem] py-[0.9rem] cursor-pointer transition-colors duration-200 hover:bg-white/[0.08] mb-[0.8rem]"
                onClick={() => setShowCert(s => !s)}
              >
                <div className="flex items-center gap-[0.9rem]">
                  <i className="fas fa-award text-[1.6rem]" style={{ color: card.color }} />
                  <div>
                    <p className="text-[0.95rem] font-bold text-white mb-[0.1rem]">Google Africa Scholarship</p>
                    <p className="text-[0.78rem] text-[#888]">Mobile Web Specialist · Andela & Pluralsight · 2019</p>
                  </div>
                </div>
                <span className="text-[0.8rem] font-semibold whitespace-nowrap" style={{ color: card.color }}>{showCert ? 'Hide ↑' : 'View ↓'}</span>
              </div>
              <AnimatePresence>
                {showCert && (
                  <motion.img
                    src="/img/certificate-google-scholar.png"
                    alt="Google Africa Scholar Certificate"
                    className="w-full rounded-md border border-white/10"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35 }}
                  />
                )}
              </AnimatePresence>
            </div>
          )}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-white/[0.07]">
            {card.socials.map(s => (
              <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                className="about-social-btn inline-flex items-center gap-[0.45rem] px-4 py-[0.45rem] border border-white/15 rounded-[24px] text-[0.82rem] text-[#ccc] no-underline bg-white/[0.05] transition-all duration-[220ms]"
                style={{ '--sb-color': card.color } as React.CSSProperties}>
                <i className={`${s.icon} text-[0.9rem]`} /><span>{s.label}</span>
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  , document.body)
}

/* ─── Sticky Stack Card (pure CSS sticky) ─── */
function StackCard({
  card, index, total, onOpen,
}: {
  card: typeof cards[0]; index: number; total: number; onOpen: (c: typeof cards[0]) => void
}) {
  const stickyTop = 80 + index * 16

  return (
    <motion.div
      className="group sticky h-[calc(100vh-120px)] rounded-[14px] overflow-hidden cursor-pointer border-t-[3px] shadow-[0_8px_32px_rgba(0,0,0,0.4)] mb-6 will-change-transform max-[768px]:h-[calc(85vh-80px)]"
      style={{
        top: stickyTop,
        zIndex: index + 1,
        '--ac-color': card.color,
        '--ac-glow': card.glow,
        borderColor: card.color,
      } as React.CSSProperties}
      onClick={() => onOpen(card)}
      whileHover={{
        boxShadow: `0 24px 60px rgba(0,0,0,0.55), 0 0 0 1px ${card.color}, 0 0 36px ${card.glow}`,
        transition: { duration: 0.2 },
      }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[600ms] ease-[ease]"
        style={{ backgroundImage: `url('${card.bgImage}')` }}
      />
      <div className="absolute inset-0 [background:linear-gradient(110deg,rgba(0,0,0,0.93)_0%,rgba(0,0,0,0.72)_50%,rgba(0,0,0,0.3)_100%)]" />
      <div className="absolute inset-0 flex items-center px-16 py-12 gap-12 max-[768px]:flex-col max-[768px]:px-6 max-[768px]:py-8 max-[768px]:gap-[1.2rem] max-[768px]:items-start">
        <div className="flex flex-col items-center gap-[1.2rem] shrink-0 max-[768px]:flex-row max-[768px]:gap-[0.8rem] max-[768px]:items-center">
          <span className="text-[0.7rem] text-white/25 font-['Courier_New',monospace] tracking-[2px] [writing-mode:vertical-rl] max-[768px]:[writing-mode:horizontal-tb]">0{index + 1}</span>
          <span
            className="text-[3.2rem] font-['Courier_New',monospace] font-extrabold leading-none"
            style={{ color: card.color, textShadow: `0 0 28px ${card.glow}` }}
          >{card.icon}</span>
        </div>
        <div className="flex-1 max-w-[580px] max-[768px]:max-w-full">
          <p className="text-[0.72rem] text-white/35 tracking-[3px] uppercase mb-2">{index + 1} / {total}</p>
          <h3 className="text-5xl font-extrabold uppercase tracking-[2px] leading-[1.05] mb-[0.6rem] max-[768px]:text-[2rem]" style={{ color: card.color }}>{card.title}</h3>
          <p className="text-base italic text-white/70 mb-4">{card.tagline}</p>
          <p className="text-[0.92rem] leading-[1.78] text-white/60 mb-[1.2rem] max-w-[460px] max-[768px]:hidden">{card.description}</p>
          <div className="flex flex-wrap gap-[0.4rem] mb-6">
            {card.tags.map(t => (
              <span key={t} className="bg-white/[0.07] border border-white/[0.18] text-white px-[0.7rem] py-[0.22rem] rounded-full text-[0.76rem] backdrop-blur-[4px]">{t}</span>
            ))}
          </div>
          <div
            className="inline-flex items-center gap-2 text-[0.85rem] font-bold tracking-[1.5px] uppercase border-b border-current pb-[2px] transition-[gap] duration-200 group-hover:gap-[0.9rem]"
            style={{ color: card.color }}
          >
            Explore <i className="fas fa-arrow-right" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Stat Counter ─── */
function StatCounter({ value, suffix, label }: typeof stats[0]) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const triggered = useRef(false)

  useEffect(() => {
    if (!inView || triggered.current || !ref.current) return
    triggered.current = true
    const el = ref.current
    const start = performance.now()
    const duration = 2000
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      el.textContent = Math.round(eased * value).toLocaleString()
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, value])

  return (
    <motion.div className="text-center" variants={fadeUp}>
      <div className="text-[2.4rem] font-extrabold text-lime leading-none font-['Courier_New',monospace] max-[768px]:text-[1.8rem]">
        <span ref={ref}>0</span>
        <span className="text-[1.8rem] text-teal max-[768px]:text-[1.4rem]">{suffix}</span>
      </div>
      <p className="text-[0.78rem] text-[#999] uppercase tracking-[1.5px] mt-[0.3rem]">{label}</p>
    </motion.div>
  )
}

/* ─── Page ─── */
export default function About() {
  const [openCard, setOpenCard] = useState<typeof cards[0] | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://platform.linkedin.com/badges/js/profile.js'
    script.async = true; script.defer = true
    document.body.appendChild(script)
    return () => { document.body.removeChild(script) }
  }, [])

  return (
    <main id="about">
      {/* ── Heading ── */}
      <motion.h1
        className="text-[7rem] mb-[0.2rem] text-center font-semibold max-sm:leading-none max-sm:mb-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        About <span className="text-lime">Me</span>
      </motion.h1>
      <motion.h2
        className="mb-12 py-[0.2rem] px-4 bg-[rgba(73,73,73,0.5)] text-center font-semibold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
      >
        Developer · Designer · Community Builder
      </motion.h2>

      {/* ── Bio ── */}
      <div className="flex gap-10 items-center mb-8 max-[768px]:flex-col max-[768px]:items-center max-[768px]:text-center">
        <motion.div
          className="relative shrink-0"
          variants={fadeLeft} initial="hidden"
          whileInView="show" viewport={{ once: true, margin: '-80px' }}
        >
          <img src="/img/portrait.jpg" alt="Isale Brian" className="w-[190px] h-[190px] rounded-full border-4 border-lime block relative z-[1] object-cover max-[768px]:w-[140px] max-[768px]:h-[140px]" />
          <div className="absolute -top-[10px] -left-[10px] w-[calc(100%+20px)] h-[calc(100%+20px)] rounded-full border-2 border-dashed border-teal/35 [animation:portrait-ring-spin_18s_linear_infinite] pointer-events-none max-[768px]:w-[158px] max-[768px]:h-[158px] max-[768px]:-top-[9px] max-[768px]:-left-[9px]" />
        </motion.div>
        <motion.div
          variants={fadeRight} initial="hidden"
          whileInView="show" viewport={{ once: true, margin: '-80px' }}
        >
          <h3 className="text-[1.6rem] font-bold mb-[0.8rem] uppercase tracking-[2px]">The <span className="text-lime">Story</span></h3>
          <p className="text-[1.05rem] leading-[1.85] text-[#d8d8d8] mb-[1.2rem]">
            Art and technology enthusiast on a mission. I build modern solutions to everyday
            problems. I genuinely believe technology is Africa&apos;s greatest lever for
            change. When I&apos;m not shipping code or crafting visuals, you&apos;ll find me at
            community events, developer meetups, or pushing limits on my BMX bike.
          </p>
          <div className="flex flex-wrap gap-2 mb-[1.2rem] max-[768px]:justify-center">
            <span className="bg-lime/[0.12] border border-lime/40 text-lime px-[0.85rem] py-[0.3rem] rounded-full text-[0.82rem] font-semibold tracking-[0.3px]">🌍 Based in Kenya</span>
            <span className="bg-lime/[0.12] border border-lime/40 text-lime px-[0.85rem] py-[0.3rem] rounded-full text-[0.82rem] font-semibold tracking-[0.3px]">💡 Lifelong Learner</span>
            <span className="bg-lime/[0.12] border border-lime/40 text-lime px-[0.85rem] py-[0.3rem] rounded-full text-[0.82rem] font-semibold tracking-[0.3px]">🎓 Google Africa Scholar</span>
            <span className="bg-lime/[0.12] border border-lime/40 text-lime px-[0.85rem] py-[0.3rem] rounded-full text-[0.82rem] font-semibold tracking-[0.3px]">🏆 Certified Mentor</span>
          </div>
          <div className="flex gap-3 flex-wrap max-[600px]:flex-col">
            <a href="/isale_brian_cv.pdf" download className="home-cta-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.25rem' }}>
              <i className="fas fa-download" /> Download CV
            </a>
            <Link href="/work?tab=services" className="home-cta-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.25rem' }}>
              Hire me
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ── Stats ── */}
      <motion.div
        className="flex justify-around gap-4 bg-black/25 border border-lime/[0.15] rounded-lg px-8 py-6 mb-10 max-[768px]:flex-wrap max-[768px]:gap-6 max-[768px]:px-4 max-[768px]:py-4"
        variants={stagger(0.12)} initial="hidden"
        whileInView="show" viewport={{ once: true, margin: '-60px' }}
      >
        {stats.map(s => <StatCounter key={s.label} {...s} />)}
      </motion.div>

      {/* ── Sticky stack cards ── */}
      <div className="mt-2 mb-0">
        <motion.p
          className="text-[0.82rem] uppercase tracking-[4px] mb-6 text-lime max-[768px]:text-center"
          variants={fadeUp} initial="hidden"
          whileInView="show" viewport={{ once: true }}
        >
          What I&apos;m about. Scroll through ↓
        </motion.p>
      </div>

      <div className="flex flex-col pb-[40vh] overflow-visible max-[768px]:pb-[20vh]">
        {cards.map((card, i) => (
          <StackCard key={card.id} card={card} index={i} total={cards.length} onOpen={setOpenCard} />
        ))}
      </div>

      {/* ── Modal — portal to escape PageTransition transform ── */}
      {mounted && (
        <AnimatePresence>
          {openCard && <CardModal card={openCard} onClose={() => setOpenCard(null)} />}
        </AnimatePresence>
      )}

      {/* ── Quote ── */}
      <motion.div
        className="mx-auto mt-16 mb-8 max-w-[720px] text-center"
        variants={fadeUp} initial="hidden"
        whileInView="show" viewport={{ once: true, margin: '-60px' }}
      >
        <blockquote className="quote italic text-[1.15rem] leading-[1.8] text-lime border-l-[3px] border-lime px-6 py-4 m-0">
          &ldquo;The details are not the details. They make the design.&rdquo;
          <cite className="block mt-3 not-italic text-[0.9rem] text-[#aaa] tracking-[0.05em]">— Charles Eames</cite>
        </blockquote>
      </motion.div>

    </main>
  )
}
