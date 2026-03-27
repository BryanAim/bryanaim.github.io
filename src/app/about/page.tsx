'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Link from 'next/link'
import { designProjects as allDesignProjects, Category } from '../work/designProjects'

/* ─── Animation variants ─── */
const ease = 'easeOut' as const
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
interface Project { title: string; img: string; url: string; github?: string }
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
const webProjects: Project[] = [
  { title: 'WeatherNow', img: '/img/projects/weather.jpg', url: 'https://weathernow-afb00.web.app/', github: 'https://github.com/BryanAim/weather-app' },
  { title: 'Covid Tracker', img: '/img/projects/corona.jpg', url: 'https://isalebryan.dev/everything-corona-virus/', github: 'https://github.com/BryanAim/everything-corona-virus' },
  { title: 'VueGram', img: '/img/projects/vuegram.jpg', url: 'https://aim-vuegram.herokuapp.com/', github: 'https://github.com/BryanAim/vuegram' },
  { title: 'NaxTechmakers', img: '/img/projects/naxtechmakers.jpg', url: 'http://naxtechmakers.com/', github: 'https://github.com/NakuruTechMakers/techiesofnakuru' },
  { title: 'Personal Portfolio', img: '/img/projects/my-portfolio.jpg', url: 'https://isalebryan.dev', github: 'https://github.com/BryanAim/bryanaim.github.io' },
  { title: 'Personal Library', img: '/img/projects/project1.jpg', url: 'https://github.com/BryanAim/FCC-personal-library', github: 'https://github.com/BryanAim/FCC-personal-library' },
  { title: 'GSAP Scroll Animation', img: '/img/projects/project2.jpg', url: 'https://github.com/BryanAim/gsap-scroll-animation', github: 'https://github.com/BryanAim/gsap-scroll-animation' },
]
const bmxPhotos: Photo[] = [
  { src: '/img/bmx/bmx1.jpg', caption: 'Night session — helmet on, ready to ride' },
  { src: '/img/bmx/bmx2.jpg', caption: 'Locked in' },
  { src: '/img/bmx/bmx3.jpg', caption: 'Suited up for the streets' },
  { src: '/img/bmx/bmx4.jpg', caption: 'Street style' },
  { src: '/img/bmx/bmx5.jpg', caption: 'City nights' },
  { src: '/img/bmx/bmx6.jpg', caption: 'Moonlit ride' },
  { src: '/img/bmx/bmx7.jpg', caption: 'Always thinking two tricks ahead' },
  { src: '/img/bmx/bmx8.jpg', caption: 'Streets are my playground' },
  { src: '/img/bmx/bmx9.jpg', caption: 'Daytime vibes' },
  { src: '/img/bmx/bmx10.jpg', caption: 'Balanced' },
  { src: '/img/bmx/bmx11.jpg', caption: 'Forward momentum' },
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

// Design projects come from the shared data file (allDesignProjects)
// and are rendered via DesignGalleryModal below

const cards = [
  {
    id: 'webdev', icon: '</>', title: 'Tech & Development',
    color: '#00ddd7', glow: 'rgba(0,221,215,0.3)',
    tagline: 'Building solutions across the full stack',
    description: 'Started with a Google × Andela scholarship in 2018. From slick frontends to solid backends, cloud infrastructure, AI tools, and everything in between.',
    skills: webDevSkills, projects: webProjects, photos: null,
    bgImage: '/img/projects/design/enjoy-music.jpg',
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
    description: "Peer educator with HIV SEERs Kenya — fighting stigma through education and research. Also part of Unilever's Heroes for Change, reaching 3,000+ youth across Nakuru.",
    skills: null, projects: null, photos: communityPhotos,
    bgImage: '/img/heroes-school-address.jpeg',
    tags: ['HIV SEERs Kenya', 'Heroes for Change', '3,000+ Youth', 'Andela Mentor'],
    socials: [
      { icon: 'fab fa-facebook', label: 'Facebook', url: 'https://facebook.com/BryanAim' },
      { icon: 'fab fa-linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/brian-isale/' },
    ],
    hasCert: false,
  },
  {
    id: 'bmx', icon: '◈', title: 'BMX Street',
    color: '#f472b6', glow: 'rgba(244,114,182,0.3)',
    tagline: 'Streets are my playground',
    description: 'When the laptop closes, the bike comes out. BMX street riding is my reset button — learning new tricks, reading the city, proving real growth happens outside the comfort zone.',
    skills: null, projects: null, photos: bmxPhotos,
    bgImage: '/img/bmx/bmx1-banner.jpg',
    tags: ['Street Riding', 'Trick Learning', 'Urban Explorer'],
    socials: [
      { icon: 'fab fa-instagram', label: 'Instagram', url: 'https://www.instagram.com/isalebryan/' },
      { icon: 'fab fa-tiktok', label: 'TikTok', url: 'https://tiktok.com/@bmxbrian' },
      { icon: 'fab fa-youtube', label: 'YouTube', url: 'https://youtube.com/@bryanaim' },
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
  return (
    <div className="ms-skill-item">
      <div className="ms-skill-label">
        <span>{name}</span>
        <span style={{ color }}>{level}%</span>
      </div>
      <div className="ms-skill-track">
        <div
          className="ms-skill-fill"
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
function ProjectThumb({ p, color }: { p: Project; color: string }) {
  return (
    <div className="ms-project-thumb" style={{ '--ph-color': color } as React.CSSProperties}>
      <img src={p.img} alt={p.title} />
      <div className="ms-project-hover">
        <span className="ms-project-title">{p.title}</span>
        <div className="ms-project-links">
          <a href={p.url} target="_blank" rel="noopener noreferrer" className="ms-project-gh">
            <i className="fas fa-eye" /> View
          </a>
          {p.github && (
            <a href={p.github} target="_blank" rel="noopener noreferrer" className="ms-project-gh">
              <i className="fab fa-github" /> GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Design Gallery (inside modal) ─── */
const dgCatLabels: Record<Category | 'all', string> = {
  all: 'All',
  logo: 'Logos',
  print: 'Print',
  composition: 'Compositions',
  illustration: 'Illustrations',
}
const dgCatIcons: Record<Category | 'all', string> = {
  all: 'fas fa-th',
  logo: 'fas fa-pen-nib',
  print: 'fas fa-file-alt',
  composition: 'fas fa-layer-group',
  illustration: 'fas fa-paint-brush',
}

const PAGE_SIZE = 9

function DesignGalleryModal({ color }: { color: string }) {
  const [activeCat, setActiveCat] = useState<Category | 'all'>('all')
  const [activeTag, setActiveTag] = useState('')
  const [page, setPage] = useState(0)

  const allTags = Array.from(new Set(allDesignProjects.flatMap(p => p.tags))).sort()

  const filtered = allDesignProjects.filter(p => {
    const catOk = activeCat === 'all' || p.category === activeCat
    const tagOk = !activeTag || p.tags.includes(activeTag)
    return catOk && tagOk
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const handleCat = (cat: Category | 'all') => { setActiveCat(cat); setActiveTag(''); setPage(0) }
  const handleTag = (tag: string) => { setActiveTag(activeTag === tag ? '' : tag); setPage(0) }

  return (
    <div className="dgm-wrap">
      {/* Category tabs */}
      <div className="dgm-tabs">
        {(Object.keys(dgCatLabels) as (Category | 'all')[]).map(cat => (
          <button
            key={cat}
            className={`dgm-tab ${activeCat === cat ? 'active' : ''}`}
            style={activeCat === cat ? { borderColor: color, color } : {}}
            onClick={() => handleCat(cat)}
          >
            <i className={dgCatIcons[cat]} />
            {dgCatLabels[cat]}
            <span className="dgm-tab-count">
              {cat === 'all' ? allDesignProjects.length : allDesignProjects.filter(p => p.category === cat).length}
            </span>
          </button>
        ))}
      </div>

      {/* Tag cloud */}
      <div className="dgm-tags">
        {allTags.map(tag => (
          <button
            key={tag}
            className={`dgm-tag ${activeTag === tag ? 'active' : ''}`}
            style={activeTag === tag ? { borderColor: color, color } : {}}
            onClick={() => handleTag(tag)}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="dgm-results-count">
        {filtered.length === 0 ? 'No projects' : `Showing ${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, filtered.length)} of ${filtered.length} project${filtered.length !== 1 ? 's' : ''}`}
        {(activeCat !== 'all' || activeTag) && (
          <button className="dgm-clear-filters" onClick={() => { handleCat('all') }}>
            ✕ clear filters
          </button>
        )}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="dgm-grid">
          {pageItems.map(project => (
            <Link
              key={project.slug}
              href={`/work/design/${project.slug}`}
              className="dgm-card"
              style={{ '--dgm-color': project.color } as React.CSSProperties}
            >
              <div className="dgm-img-wrap">
                <img src={project.primaryImage} alt={project.title} className="dgm-img" />
                {project.images && project.images.length > 1 && (
                  <span className="dgm-multi-badge">
                    <i className="fas fa-images" /> {project.images.length}
                  </span>
                )}
                <div className="dgm-overlay">
                  <span className="dgm-overlay-cat" style={{ background: project.color, color: '#000' }}>
                    <i className={dgCatIcons[project.category]} />
                    {dgCatLabels[project.category]}
                  </span>
                  <p className="dgm-overlay-title">{project.title}</p>
                  <p className="dgm-overlay-hint"><i className="fas fa-expand-alt" /> Explore</p>
                </div>
              </div>
              <div className="dgm-footer" style={{ borderColor: `${project.color}44` }}>
                <span className="dgm-footer-title">{project.title}</span>
                <span className="dgm-footer-year" style={{ color: project.color }}>{project.year}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="dgm-empty">
          <i className="fas fa-search" />
          <p>No projects match this filter</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="dgm-pagination">
          <button
            className="dgm-page-btn"
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
          >
            <i className="fas fa-chevron-left" /> Prev
          </button>
          <div className="dgm-page-dots">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={`dgm-dot ${i === page ? 'active' : ''}`}
                style={i === page ? { background: color } : {}}
                onClick={() => setPage(i)}
              />
            ))}
          </div>
          <button
            className="dgm-page-btn"
            disabled={page === totalPages - 1}
            onClick={() => setPage(p => p + 1)}
          >
            Next <i className="fas fa-chevron-right" />
          </button>
        </div>
      )}
    </div>
  )
}

/* ─── Card Modal ─── */
function CardModal({ card, onClose }: { card: typeof cards[0]; onClose: () => void }) {
  const [animSkills, setAnimSkills] = useState(false)
  const [showCert, setShowCert] = useState(false)

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

  return (
    <motion.div
      className="ms-overlay"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        className="ms-panel"
        onClick={e => e.stopPropagation()}
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="ms-panel-header" style={{ borderColor: card.color }}>
          <div className="ms-panel-title">
            <span className="ms-panel-icon" style={{ color: card.color }}>{card.icon}</span>
            <h2 style={{ color: card.color }}>{card.title}</h2>
          </div>
          <button className="ms-close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="ms-panel-body">
          <p className="ms-desc">{card.description}</p>
          {card.skills && (
            <div className="ms-section">
              <h4 className="ms-section-title" style={{ color: card.color }}>— Skills</h4>
              <div className={`ms-skills-grid ${card.skills.length > 6 ? 'ms-skills-grid--two-col' : ''}`}>
                {card.skills.map((s, i) => (
                  <SkillBar key={s.name} name={s.name} level={s.level} color={card.color} animate={animSkills} delay={i * 0.08} />
                ))}
              </div>
            </div>
          )}
          {!card.skills && (
            <div className="ms-section">
              <div className="ms-tags">
                {card.tags.map(t => (
                  <span key={t} className="ms-tag" style={{ borderColor: card.color, color: card.color }}>{t}</span>
                ))}
              </div>
            </div>
          )}
          {card.id === 'design' && (
            <div className="ms-section">
              <h4 className="ms-section-title" style={{ color: card.color }}>— Portfolio</h4>
              <DesignGalleryModal color={card.color} />
            </div>
          )}
          {card.photos && (
            <div className="ms-section">
              <h4 className="ms-section-title" style={{ color: card.color }}>— Photos</h4>
              <div className={`ms-community-grid ${card.id === 'bmx' ? 'ms-community-grid--portrait' : ''}`}>
                {card.photos.map((p: Photo) => (
                  <div key={p.src} className="ms-community-thumb">
                    <img src={p.src} alt={p.caption} />
                    <div className="ms-community-caption">{p.caption}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {card.id !== 'design' && card.projects && (
            <div className="ms-section">
              <h4 className="ms-section-title" style={{ color: card.color }}>— Projects</h4>
              <div className="ms-projects-grid">
                {card.projects.map(p => <ProjectThumb key={p.title} p={p} color={card.color} />)}
              </div>
            </div>
          )}
          {card.hasCert && (
            <div className="ms-section">
              <h4 className="ms-section-title" style={{ color: card.color }}>— Certificate</h4>
              <div className="ms-cert-row" onClick={() => setShowCert(s => !s)}>
                <div className="ms-cert-left">
                  <i className="fas fa-award ms-cert-icon" style={{ color: card.color }} />
                  <div>
                    <p className="ms-cert-name">Google Africa Scholarship</p>
                    <p className="ms-cert-sub">Mobile Web Specialist · Andela & Pluralsight · 2019</p>
                  </div>
                </div>
                <span className="ms-cert-toggle" style={{ color: card.color }}>{showCert ? 'Hide ↑' : 'View ↓'}</span>
              </div>
              <AnimatePresence>
                {showCert && (
                  <motion.img
                    src="/img/certificate-google-scholar.png"
                    alt="Google Africa Scholar Certificate"
                    className="ms-cert-img"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35 }}
                  />
                )}
              </AnimatePresence>
            </div>
          )}
          <div className="ms-section ms-socials">
            {card.socials.map(s => (
              <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                className="ms-social-btn" style={{ '--sb-color': card.color } as React.CSSProperties}>
                <i className={s.icon} /><span>{s.label}</span>
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Sticky Stack Card (pure CSS sticky) ─── */
function StackCard({
  card, index, total, onOpen,
}: {
  card: typeof cards[0]; index: number; total: number; onOpen: (c: typeof cards[0]) => void
}) {
  // Each card sticks 16px lower than the previous — creates the fanned deck look
  const stickyTop = 80 + index * 16

  return (
    <motion.div
      className="stack-card"
      style={{
        top: stickyTop,
        zIndex: index + 1,
        '--ac-color': card.color,
        '--ac-glow': card.glow,
      } as React.CSSProperties}
      onClick={() => onOpen(card)}
      whileHover={{
        boxShadow: `0 24px 60px rgba(0,0,0,0.55), 0 0 0 1px ${card.color}, 0 0 36px ${card.glow}`,
        transition: { duration: 0.2 },
      }}
    >
      <div className="stack-bg" style={{ backgroundImage: `url('${card.bgImage}')` }} />
      <div className="stack-overlay" />
      <div className="stack-content">
        <div className="stack-left">
          <span className="stack-index">0{index + 1}</span>
          <span className="stack-icon">{card.icon}</span>
        </div>
        <div className="stack-right">
          <p className="stack-category">{index + 1} / {total}</p>
          <h3 className="stack-title" style={{ color: card.color }}>{card.title}</h3>
          <p className="stack-tagline">{card.tagline}</p>
          <p className="stack-desc">{card.description}</p>
          <div className="stack-tags">
            {card.tags.map(t => <span key={t} className="stack-tag">{t}</span>)}
          </div>
          <div className="stack-cta" style={{ color: card.color }}>
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
    <motion.div className="stat-item" variants={fadeUp}>
      <div className="stat-number">
        <span ref={ref}>0</span>
        <span className="stat-suffix">{suffix}</span>
      </div>
      <p className="stat-label">{label}</p>
    </motion.div>
  )
}

/* ─── Page ─── */
export default function About() {
  const [openCard, setOpenCard] = useState<typeof cards[0] | null>(null)

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
        className="lg-heading"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        About <span className="text-secondary">Me</span>
      </motion.h1>
      <motion.h2
        className="sm-heading"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
      >
        Developer · Designer · Community Builder · BMX Rider
      </motion.h2>

      {/* ── Bio ── */}
      <div className="about-bio-section">
        <motion.div
          className="about-portrait-wrap"
          variants={fadeLeft} initial="hidden"
          whileInView="show" viewport={{ once: true, margin: '-80px' }}
        >
          <img src="/img/portrait.jpg" alt="Isale Brian" className="about-portrait" />
          <div className="portrait-spin-ring" />
        </motion.div>
        <motion.div
          className="about-bio-text"
          variants={fadeRight} initial="hidden"
          whileInView="show" viewport={{ once: true, margin: '-80px' }}
        >
          <h3 className="about-bio-title">The <span className="text-secondary">Story</span></h3>
          <p>
            Art and technology enthusiast on a mission. I build modern solutions to everyday
            problems — because I genuinely believe technology is Africa&apos;s greatest lever for
            change. When I&apos;m not shipping code or crafting visuals, you&apos;ll find me at
            community events, developer meetups, or pushing limits on my BMX.
          </p>
          <div className="about-badges">
            <span className="about-badge">🌍 Based in Kenya</span>
            <span className="about-badge">💡 Lifelong Learner</span>
            <span className="about-badge">🎓 Google Africa Scholar</span>
            <span className="about-badge">🏆 Certified Mentor</span>
          </div>
        </motion.div>
      </div>

      {/* ── Stats ── */}
      <motion.div
        className="about-stats"
        variants={stagger(0.12)} initial="hidden"
        whileInView="show" viewport={{ once: true, margin: '-60px' }}
      >
        {stats.map(s => <StatCounter key={s.label} {...s} />)}
      </motion.div>

      {/* ── Sticky stack cards ── */}
      <div className="about-cards-section">
        <motion.p
          className="cards-section-label text-secondary"
          variants={fadeUp} initial="hidden"
          whileInView="show" viewport={{ once: true }}
        >
          What I&apos;m about — scroll through ↓
        </motion.p>
      </div>

      <div className="stack-container">
        {cards.map((card, i) => (
          <StackCard key={card.id} card={card} index={i} total={cards.length} onOpen={setOpenCard} />
        ))}
      </div>

      {/* ── Modal ── */}
      <AnimatePresence>
        {openCard && <CardModal card={openCard} onClose={() => setOpenCard(null)} />}
      </AnimatePresence>

    </main>
  )
}
