'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useInView, type Variants } from 'framer-motion'
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

const curtain = (delay = 0) => ({
  hidden: { clipPath: 'inset(0 0 100% 0)', y: 24, opacity: 0 },
  show:   { clipPath: 'inset(0 0 0% 0)',   y: 0,  opacity: 1,
    transition: { duration: 0.65, delay, ease: SPRING } },
})

const riseUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 56, filter: 'blur(6px)' },
  show:   { opacity: 1, y: 0,  filter: 'blur(0px)',
    transition: { duration: 0.7, delay, ease: SPRING } },
})

const slideVariant: Variants = {
  hidden: { opacity: 0, y: 32, filter: 'blur(8px)' },
  show:   { opacity: 1, y: 0,  filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit:   { opacity: 0, y: -20, filter: 'blur(4px)',
    transition: { duration: 0.28, ease: [0.4, 0, 1, 1] } },
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
  /* ── Hero sticky slides ── */
  const heroWrapRef = useRef<HTMLDivElement>(null)
  const heroInnerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroWrapRef,
    offset: ['start start', 'end end'],
  })
  const [heroSlide, setHeroSlide] = useState(0)

  useEffect(() => {
    return heroScroll.on('change', v => {
      if (v < 0.33)       setHeroSlide(0)
      else if (v < 0.66)  setHeroSlide(1)
      else                setHeroSlide(2)
    })
  }, [heroScroll])

  /* ── Social rail ── */
  const socialRailRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: railProgress } = useScroll({
    target: socialRailRef,
    offset: ['start start', 'end end'],
  })
  const railX = useTransform(railProgress, [0, 1], ['0%', '-58%'])

  /* ── Quote modal ── */
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
          HERO — sticky with 3 slides
      ══════════════════════════════════ */}
      <div ref={heroWrapRef} className="ct-hero-scroll-wrap">
        <section className="ct-hero ct-hero--sticky" ref={heroInnerRef}>
          <motion.div className="ct-hero-inner">

            {/* Permanent heading — always visible */}
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

            {/* Swappable slide content */}
            <AnimatePresence mode="wait">

              {heroSlide === 0 && (
                <motion.div key="slide-0" className="ct-hero-slide" variants={slideVariant} initial="hidden" animate="show" exit="exit">
                  <motion.div
                    className="ct-role-tags"
                    initial="hidden"
                    animate="show"
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
                  >
                    {['Developer', 'Designer', 'Community Builder', 'BMX Rider'].map(tag => (
                      <motion.span
                        key={tag}
                        className="ct-role-tag"
                        variants={{
                          hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
                          show:   { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.5, ease: SPRING } },
                        }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </motion.div>
                  <p className="ct-hero-sub">
                    Got a project in mind, a collaboration, or just want to say hey?
                    <br />I&apos;m always open to a good conversation.
                  </p>
                  <p className="ct-hero-scroll-hint"><i className="fas fa-mouse" /> Scroll to explore</p>
                </motion.div>
              )}

              {heroSlide === 1 && (
                <motion.div key="slide-1" className="ct-hero-slide" variants={slideVariant} initial="hidden" animate="show" exit="exit">
                  <p className="ct-slide-label">Reach me directly</p>
                  <div className="ct-hero-contact-cards">
                    {contactInfo.map((c, i) => (
                      <motion.a
                        key={c.label}
                        href={c.href}
                        target={c.href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="ct-info-card"
                        style={{ '--ct-color': c.color } as React.CSSProperties}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.5, ease: SPRING }}
                        whileHover={{ y: -4, boxShadow: `0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px ${c.color}, 0 0 28px ${c.color}44` }}
                      >
                        <div className="ct-info-icon"><i className={c.icon} /></div>
                        <div>
                          <p className="ct-info-label">{c.label}</p>
                          <p className="ct-info-value">{c.value}</p>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              )}

              {heroSlide === 2 && (
                <motion.div key="slide-2" className="ct-hero-slide" variants={slideVariant} initial="hidden" animate="show" exit="exit">
                  <p className="ct-slide-label">Ready to start?</p>
                  <div className="ct-hero-ctas">
                    <motion.a
                      href="/work"
                      className="ct-hero-cta ct-hero-cta--primary"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1, ease: SPRING }}
                      whileHover={{ scale: 1.04 }}
                    >
                      View My Work <i className="fas fa-arrow-right" />
                    </motion.a>
                    <motion.a
                      href="mailto:isale.bryan@gmail.com"
                      className="ct-hero-cta ct-hero-cta--ghost"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.18, ease: SPRING }}
                      whileHover={{ scale: 1.04 }}
                    >
                      Send an Email
                    </motion.a>
                    <motion.a
                      href="https://wa.me/254728822142"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ct-hero-cta ct-hero-cta--wa"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.26, ease: SPRING }}
                      whileHover={{ scale: 1.04 }}
                    >
                      <i className="fab fa-whatsapp" /> WhatsApp
                    </motion.a>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            {/* Slide indicator dots */}
            <div className="ct-hero-dots">
              {[0, 1, 2].map(i => (
                <span key={i} className={`ct-hero-dot${heroSlide === i ? ' active' : ''}`} />
              ))}
            </div>

          </motion.div>
        </section>
      </div>

      {/* ══════════════════════════════════
          LET'S WORK TOGETHER
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
            { icon: 'fas fa-store',   label: 'Browse the Shop', desc: 'Stickers, tees, prints, and more — ready to order.', color: '#b1db00', href: '/shop',        cta: 'Visit shop' },
            { icon: 'fas fa-pen-nib', label: 'Custom Order',    desc: "Upload your own artwork or brief — I'll make it happen.", color: '#00ddd7', href: '/shop/custom', cta: 'Start custom order' },
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
          SOCIAL LINKS — horizontal rail
      ══════════════════════════════════ */}
      <div ref={socialRailRef} className="ct-socials-rail-wrap">
        <section className="ct-socials-section ct-socials-sticky">
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

          {/* Desktop: horizontal scroll rail */}
          <div className="ct-socials-overflow">
            <motion.div className="ct-socials-row" style={{ x: railX }}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ct-social-card"
                  style={{ '--sc-color': s.color } as React.CSSProperties}
                >
                  <i className={`${s.icon} ct-social-icon`} style={{ color: s.color }} />
                  <div className="ct-social-text">
                    <span className="ct-social-name">{s.label}</span>
                    <span className="ct-social-sub">{s.sub}</span>
                  </div>
                  <i className="fas fa-arrow-right ct-social-arrow" />
                </a>
              ))}
            </motion.div>
          </div>

        </section>
      </div>

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
