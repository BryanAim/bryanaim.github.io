'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion'
import { services } from '../work/services'
import QuoteModal from '../components/QuoteModal'

/* ─── Data ─── */
const contactInfo = [
  { icon: 'fas fa-envelope', label: 'Email',    value: 'isale.bryan@gmail.com',  href: 'mailto:isale.bryan@gmail.com',              color: '#00ddd7' },
  { icon: 'fas fa-phone',    label: 'Phone',    value: '+254 728 822 142',        href: 'tel:+254728822142',                         color: '#b1db00' },
  { icon: 'fas fa-map-marker-alt', label: 'Location', value: 'Nakuru, Kenya',   href: 'https://maps.google.com/?q=Nakuru,Kenya',   color: '#ff8c42' },
]

const socials = [
  { icon: 'fab fa-linkedin',  label: 'LinkedIn',    sub: 'brian-isale',   url: 'https://linkedin.com/in/brian-isale/',            color: '#b1db00' },
  { icon: 'fab fa-github',    label: 'GitHub',      sub: 'BryanAim',      url: 'https://github.com/BryanAim',                     color: '#b1db00' },
  { icon: 'fab fa-behance',   label: 'Behance',     sub: 'isalebryan',    url: 'https://behance.net/isalebryan',                  color: '#1769ff' },
  { icon: 'fab fa-instagram', label: 'Instagram',   sub: '@isalebryan',   url: 'https://www.instagram.com/isalebryan/',           color: '#e1306c' },
  { icon: 'fab fa-dev',       label: 'Dev.to',      sub: 'bryanaim',      url: 'https://dev.to/bryanaim',                         color: '#e0e0e0' },
  { icon: 'fab fa-twitter',   label: 'Twitter / X', sub: '@IsaleBryan',   url: 'https://twitter.com/IsaleBryan',                  color: '#1d9bf0' },
  { icon: 'fab fa-tiktok',    label: 'TikTok',      sub: '@bmxbrian',     url: 'https://tiktok.com/@bmxbrian',                    color: '#e0e0e0' },
  { icon: 'fab fa-youtube',   label: 'YouTube',     sub: '@bryanaim',     url: 'https://youtube.com/@bryanaim',                   color: '#ff0000' },
  { icon: 'fab fa-facebook',  label: 'Facebook',    sub: 'BryanAim',      url: 'https://facebook.com/BryanAim',                   color: '#1877f2' },
]

/* ─── Animation helpers ─── */

const SPRING = [0.16, 1, 0.3, 1] as const

// Curtain-lift: text emerges from below an invisible clip mask
const curtain = (delay = 0) => ({
  hidden:  { clipPath: 'inset(0 0 100% 0)', y: 24, opacity: 0 },
  show:    { clipPath: 'inset(0 0 0% 0)',   y: 0,  opacity: 1,
    transition: { duration: 0.65, delay, ease: SPRING } },
})

// Slide-up with spring + blur
const riseUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 56, filter: 'blur(6px)' },
  show:   { opacity: 1, y: 0,  filter: 'blur(0px)',
    transition: { duration: 0.7, delay, ease: SPRING } },
})

// Wipe-right: element reveals by a horizontal mask sweep
const wipeRight = {
  hidden: { scaleX: 0, originX: 0 },
  show:   { scaleX: 1, transition: { duration: 0.6, ease: SPRING } },
}

/* ─── Animated draw-line divider ─── */
function DrawLine({ color = '#00ddd7' }: { color?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <div ref={ref} className="ct-draw-line-wrap">
      <motion.div
        className="ct-draw-line"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
        initial={{ scaleX: 0, originX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  )
}

interface ActiveQuote { serviceId: string; serviceName: string; color: string }

/* ─── Page ─── */
export default function Contact() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const [activeQuote, setActiveQuote] = useState<ActiveQuote | null>(null)

  // Load LinkedIn badge script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://platform.linkedin.com/badges/js/profile.js'
    script.async = true; script.defer = true
    document.body.appendChild(script)
    return () => { document.body.removeChild(script) }
  }, [])

  return (
    <main id="contact-page">

      {/* ══════════════════════════════════
          HERO — parallax heading
      ══════════════════════════════════ */}
      <section className="ct-hero" ref={heroRef}>
        <motion.div className="ct-hero-inner" style={{ y: heroY, opacity: heroOpacity }}>
          {/* "Let's" curtain-lifts first */}
          <div className="ct-hero-overflow">
            <motion.h1
              className="ct-hero-h1 ct-hero-h1--default"
              variants={curtain(0)}
              initial="hidden"
              animate="show"
            >
              Let&apos;s
            </motion.h1>
          </div>
          {/* "Connect." curtain-lifts second */}
          <div className="ct-hero-overflow">
            <motion.h1
              className="ct-hero-h1 ct-hero-h1--accent"
              variants={curtain(0.15)}
              initial="hidden"
              animate="show"
            >
              Connect.
            </motion.h1>
          </div>

          {/* Role tags — animated stagger */}
          <motion.div
            className="ct-role-tags"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.35 } } }}
          >
            {['Developer', 'Designer', 'Community Builder', 'BMX Rider'].map((tag) => (
              <motion.span
                key={tag}
                className="ct-role-tag"
                variants={{
                  hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
                  show:   { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.55, ease: SPRING } },
                }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>

          <motion.p
            className="ct-hero-sub"
            variants={riseUp(0.75)}
            initial="hidden"
            animate="show"
          >
            Got a project in mind, a collaboration, or just want to say hey?
            <br />I&apos;m always open to a good conversation.
          </motion.p>
        </motion.div>

      </section>

      {/* ══════════════════════════════════
          LET'S WORK TOGETHER  (moved up)
      ══════════════════════════════════ */}
      <section className="ct-services-section">
        <div className="ct-section-head">
          <motion.h2
            className="ct-section-heading"
            variants={curtain(0)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            Let&apos;s <span className="text-secondary">Work Together</span>
          </motion.h2>
          <DrawLine color="#00ddd7" />
        </div>

        <motion.p
          className="ct-services-sub"
          variants={riseUp(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
        >
          Pick a service and get an instant quote — or browse the shop.
        </motion.p>

        {/* ── Service cards ── */}
        <motion.div
          className="ct-services-grid"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
        >
          {services.map((s) => (
            <motion.button
              key={s.serviceId}
              className="ct-service-card"
              style={{ '--ct-sv-color': s.color } as React.CSSProperties}
              variants={riseUp(0)}
              whileHover={{ y: -4, boxShadow: `0 20px 48px rgba(0,0,0,0.5), 0 0 0 1px ${s.color}55` }}
              onClick={() => setActiveQuote({ serviceId: s.serviceId, serviceName: s.title, color: s.color })}
            >
              <div className="ct-sv-top">
                <span className="ct-sv-icon" style={{ color: s.color, background: `${s.color}1a` }}>
                  <i className={s.icon} />
                </span>
                <span className="ct-sv-pricing" style={{ color: s.color }}>{s.pricing}</span>
              </div>
              <p className="ct-sv-title">{s.title}</p>
              <p className="ct-sv-turnaround"><i className="fas fa-clock" /> {s.turnaround}</p>
              <span className="ct-sv-cta" style={{ color: s.color }}>
                Get a quote <i className="fas fa-arrow-right" />
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* ── Shop divider ── */}
        <motion.div
          className="ct-shop-divider"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <span>or shop the collection</span>
        </motion.div>

        {/* ── Shop cards ── */}
        <motion.div
          className="ct-shop-cards"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        >
          {([
            {
              icon: 'fas fa-store',
              label: 'Browse the Shop',
              desc: 'Stickers, tees, prints, and more — ready to order.',
              color: '#b1db00',
              href: '/shop',
              cta: 'Visit shop',
            },
            {
              icon: 'fas fa-pen-nib',
              label: 'Custom Order',
              desc: 'Upload your own artwork or brief — I\'ll make it happen.',
              color: '#00ddd7',
              href: '/shop/custom',
              cta: 'Start custom order',
            },
          ] as const).map((item) => (
            <motion.a
              key={item.href}
              href={item.href}
              className="ct-shop-card"
              style={{ '--ct-sh-color': item.color } as React.CSSProperties}
              variants={riseUp(0)}
              whileHover={{ y: -4, boxShadow: `0 20px 48px rgba(0,0,0,0.5), 0 0 0 1px ${item.color}55` }}
            >
              <span className="ct-sh-icon" style={{ color: item.color, background: `${item.color}1a` }}>
                <i className={item.icon} />
              </span>
              <div className="ct-sh-body">
                <p className="ct-sh-label">{item.label}</p>
                <p className="ct-sh-desc">{item.desc}</p>
              </div>
              <span className="ct-sh-cta" style={{ color: item.color }}>
                {item.cta} <i className="fas fa-long-arrow-alt-right" />
              </span>
            </motion.a>
          ))}
        </motion.div>
      </section>

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

      {/* ══════════════════════════════════
          CONTACT CARDS
      ══════════════════════════════════ */}
      <section className="ct-cards-section">
        <DrawLine color="#b1db00" />

        <motion.div
          className="ct-info-row"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.14 } } }}
        >
          {contactInfo.map((c, i) => (
            <motion.a
              key={c.label}
              href={c.href}
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="ct-info-card"
              style={{ '--ct-color': c.color } as React.CSSProperties}
              variants={riseUp(0)}
              whileHover={{
                y: -6,
                boxShadow: `0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px ${c.color}, 0 0 28px ${c.color}44`,
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <div className="ct-info-icon"><i className={c.icon} /></div>
              <div>
                <p className="ct-info-label">{c.label}</p>
                <p className="ct-info-value">{c.value}</p>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </section>

      {/* ══════════════════════════════════
          SOCIAL LINKS
      ══════════════════════════════════ */}
      <section className="ct-socials-section">
        {/* Section heading with wipe-reveal underline */}
        <div className="ct-section-head">
          <motion.h2
            className="ct-section-heading"
            variants={curtain(0)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            Find me <span className="text-secondary">online</span>
          </motion.h2>
          <DrawLine color="#b1db00" />
        </div>

        <motion.div
          className="ct-socials-grid"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
        >
          {socials.map((s, i) => (
            <motion.a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ct-social-card"
              style={{ '--sc-color': s.color } as React.CSSProperties}
              variants={{
                hidden: { opacity: 0, x: i % 2 === 0 ? -30 : 30, filter: 'blur(4px)' },
                show:   { opacity: 1, x: 0, filter: 'blur(0px)',
                  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
              }}
              whileHover={{ x: 6, backgroundColor: 'rgba(255,255,255,0.07)' }}
            >
              <i className={`${s.icon} ct-social-icon`} style={{ color: s.color }} />
              <div className="ct-social-text">
                <span className="ct-social-name">{s.label}</span>
                <span className="ct-social-sub">{s.sub}</span>
              </div>
              <motion.i
                className="fas fa-arrow-right ct-social-arrow"
                initial={{ x: 0, opacity: 0.4 }}
                whileHover={{ x: 4, opacity: 1 }}
              />
            </motion.a>
          ))}
        </motion.div>
      </section>

      {/* ══════════════════════════════════
          EMBEDS
      ══════════════════════════════════ */}
      <section className="ct-embeds-section">
        <div className="ct-embeds-row">
          <motion.div
            className="ct-embed-col"
            initial={{ opacity: 0, x: -60, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="ct-section-heading">
              LinkedIn <span className="text-secondary">Profile</span>
            </h3>
            <div className="ct-embed-wrap">
              <div className="LI-profile-badge" data-version="v1" data-size="large"
                data-locale="en_US" data-type="horizontal" data-theme="dark" data-vanity="brian-isale">
                <a className="LI-simple-link" href="https://ke.linkedin.com/in/brian-isale?trk=profile-badge">Brian Isale</a>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="ct-embed-col"
            initial={{ opacity: 0, x: 60, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="ct-section-heading">
              Behance <span className="text-secondary">Portfolio</span>
            </h3>
            <a href="https://behance.net/isalebryan" target="_blank" rel="noopener noreferrer" className="ct-behance-card">
              <div className="ct-behance-header">
                <div className="ct-behance-logo"><i className="fab fa-behance" /></div>
                <div>
                  <p className="ct-behance-name">Isale Bryan</p>
                  <p className="ct-behance-handle">behance.net/isalebryan</p>
                </div>
              </div>
              <p className="ct-behance-desc">
                Creative designer crafting brand identities, motion graphics, and digital illustrations. View the full portfolio on Behance.
              </p>
              <div className="ct-behance-tags">
                <span>Brand Identity</span><span>Motion Graphics</span>
                <span>UI/UX</span><span>Illustration</span>
              </div>
              <div className="ct-behance-cta">View Portfolio <i className="fas fa-arrow-right" /></div>
            </a>
          </motion.div>
        </div>
      </section>

    </main>
  )
}
