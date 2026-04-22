'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion'
import { services } from '../work/services'
import QuoteModal from '../components/QuoteModal'

/* ─── Data ─── */
const contactInfo = [
  { icon: 'fas fa-envelope',       label: 'Email',    value: 'isale.bryan@gmail.com', href: 'mailto:isale.bryan@gmail.com',            color: '#00ddd7' },
  { icon: 'fas fa-phone',          label: 'Phone',    value: '+254 728 822 142',       href: 'tel:+254728822142',                       color: '#b1db00' },
  { icon: 'fas fa-map-marker-alt', label: 'Location', value: 'Nakuru, Kenya',          href: 'https://maps.google.com/?q=Nakuru,Kenya', color: '#ff8c42' },
]

const socials = [
  { icon: 'fab fa-linkedin',  label: 'LinkedIn',    sub: 'brian-isale',  url: 'https://linkedin.com/in/brian-isale/',          color: '#b1db00' },
  { icon: 'fab fa-github',    label: 'GitHub',      sub: 'BryanAim',     url: 'https://github.com/BryanAim',                   color: '#b1db00' },
  { icon: 'fab fa-behance',   label: 'Behance',     sub: 'isalebryan',   url: 'https://behance.net/isalebryan',                color: '#1769ff' },
  { icon: 'fab fa-instagram', label: 'Instagram',   sub: '@isalebryan',  url: 'https://www.instagram.com/isalebryan/',         color: '#e1306c' },
  { icon: 'fab fa-dev',       label: 'Dev.to',      sub: 'bryanaim',     url: 'https://dev.to/bryanaim',                       color: '#e0e0e0' },
  { icon: 'fab fa-twitter',   label: 'Twitter / X', sub: '@IsaleBryan',  url: 'https://twitter.com/IsaleBryan',                color: '#1d9bf0' },
  { icon: 'fab fa-tiktok',    label: 'TikTok',      sub: '@bmxbrian',    url: 'https://tiktok.com/@bmxbrian',                  color: '#e0e0e0' },
  { icon: 'fab fa-youtube',   label: 'YouTube',     sub: '@bryanaim',    url: 'https://youtube.com/@bryanaim',                 color: '#ff0000' },
  { icon: 'fab fa-facebook',  label: 'Facebook',    sub: 'BryanAim',     url: 'https://facebook.com/BryanAim',                 color: '#1877f2' },
]

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

export default function Contact() {
  const socialRailRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: railProgress } = useScroll({
    target: socialRailRef,
    offset: ['start start', 'end end'],
  })
  const railX = useTransform(railProgress, [0, 1], ['0%', '-58%'])

  const [activeQuote, setActiveQuote] = useState<ActiveQuote | null>(null)

  return (
    <main id="contact-page">

      {/* ══════════════════════════════════
          HERO — centered, matches other pages
      ══════════════════════════════════ */}
      <section className="ct-hero flex-col items-center text-center">

        <div className="overflow-hidden leading-none mb-8">
          <motion.h1
            className="text-[clamp(3.2rem,9vw,7rem)] font-semibold leading-none tracking-tight whitespace-nowrap"
            variants={curtain(0)}
            initial="hidden"
            animate="show"
          >
            <span className="text-teal">Let&apos;s </span><span className="text-lime">Connect.</span>
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          className="text-[1.05rem] leading-[1.7] text-[#aaa] max-w-120 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: SPRING }}
        >
          Got a project in mind, a collaboration, or just want to say hey?<br />
          I&apos;m always open to a good conversation.
        </motion.p>

        {/* Contact cards — row on desktop, stack on mobile */}
        <motion.div
          className="flex flex-row flex-wrap justify-center gap-3 w-full mb-10"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } } }}
        >
          {contactInfo.map((c) => (
            <motion.a
              key={c.label}
              href={c.href}
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="flex flex-1 min-w-50 items-center gap-4 bg-white/4 border border-white/8 border-t-[3px] rounded-lg px-5 py-4 no-underline transition-all duration-300 text-left"
              style={{ borderTopColor: c.color }}
              variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: SPRING } } }}
              whileHover={{ y: -4, boxShadow: `0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px ${c.color}, 0 0 28px ${c.color}44` }}
            >
              <div
                className="w-10 h-10 rounded-full bg-white/6 flex items-center justify-center text-[1rem] shrink-0"
                style={{ color: c.color }}
              >
                <i className={c.icon} />
              </div>
              <div className="min-w-0">
                <p className="text-[0.72rem] uppercase tracking-[1.5px] text-lime mb-[0.2rem]">{c.label}</p>
                <p className="text-[0.95rem] text-[#e0e0e0] font-semibold">{c.value}</p>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="flex gap-[0.85rem] flex-wrap justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1, ease: SPRING }}
        >
          <motion.a
            href="/work"
            className="inline-flex items-center gap-2 px-7 py-[0.8rem] bg-teal text-black font-bold text-[0.88rem] rounded-[7px] no-underline transition-opacity duration-200"
            whileHover={{ scale: 1.04 }}
          >
            View My Work <i className="fas fa-arrow-right" />
          </motion.a>
          <motion.a
            href="mailto:isale.bryan@gmail.com"
            className="inline-flex items-center gap-2 px-7 py-[0.8rem] border border-white/18 text-white/75 font-semibold text-[0.88rem] rounded-[7px] no-underline transition-[border-color,color] duration-200 hover:border-white/40 hover:text-white"
            whileHover={{ scale: 1.04 }}
          >
            Send an Email
          </motion.a>
          <motion.a
            href="https://wa.me/254728822142"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-[0.8rem] bg-[rgba(37,211,102,0.12)] border border-[rgba(37,211,102,0.35)] text-[#25d366] font-semibold text-[0.88rem] rounded-[7px] no-underline transition-[background] duration-200 hover:bg-[rgba(37,211,102,0.22)]"
            whileHover={{ scale: 1.04 }}
          >
            <i className="fab fa-whatsapp" /> WhatsApp
          </motion.a>
        </motion.div>

      </section>

      {/* ══════════════════════════════════
          LET'S WORK TOGETHER
      ══════════════════════════════════ */}
      <section className="px-5 pb-12 min-[600px]:px-8 min-[600px]:pb-16 min-[900px]:px-16">
        <div className="mb-8">
          <motion.h2
            className="text-2xl font-bold mb-[1.2rem] uppercase tracking-[1px]"
            variants={curtain(0)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            Let&apos;s <span className="text-lime">Work Together</span>
          </motion.h2>
          <DrawLine color="#00ddd7" />
        </div>

        <motion.p
          className="text-white/40 text-[0.875rem] mb-6 -mt-3"
          variants={riseUp(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
        >
          Pick a service and get an instant quote — or browse the shop.
        </motion.p>

        <motion.div
          className="grid grid-cols-2 min-[640px]:grid-cols-3 max-[639px]:grid-cols-1 gap-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
        >
          {services.map((s) => (
            <motion.button
              key={s.serviceId}
              className="ct-service-card group flex flex-col gap-[0.55rem] p-4 bg-white/[0.03] border border-white/[0.08] rounded-xl cursor-pointer text-left w-full transition-[border-color] duration-[250ms]"
              style={{ '--ct-sv-color': s.color } as React.CSSProperties}
              variants={riseUp(0)}
              whileHover={{ y: -4, boxShadow: `0 20px 48px rgba(0,0,0,0.5), 0 0 0 1px ${s.color}55` }}
              onClick={() => setActiveQuote({ serviceId: s.serviceId, serviceName: s.title, color: s.color })}
            >
              <div className="flex items-center justify-between gap-[0.4rem]">
                <span
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-[0.95rem] shrink-0"
                  style={{ color: s.color, background: `${s.color}1a` }}
                >
                  <i className={s.icon} />
                </span>
                <span className="text-[0.68rem] font-bold text-right leading-[1.2]" style={{ color: s.color }}>{s.pricing}</span>
              </div>
              <p className="text-[0.8rem] font-bold text-white/[0.88] leading-[1.35] m-0 flex-1">{s.title}</p>
              <p className="text-[0.67rem] text-white/[0.28] m-0">
                <i className="fas fa-clock mr-[0.2rem]" /> {s.turnaround}
              </p>
              <span className="text-[0.72rem] font-semibold flex items-center gap-[0.35rem] mt-[0.15rem]" style={{ color: s.color }}>
                Get a quote <i className="fas fa-arrow-right text-[0.6rem] transition-transform duration-200 group-hover:translate-x-[3px]" />
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Shop divider */}
        <motion.div
          className="flex items-center gap-4 my-7 mb-5 text-white/20 text-[0.72rem] uppercase tracking-[0.8px] before:content-[''] before:flex-1 before:h-px before:bg-white/[0.08] after:content-[''] after:flex-1 after:h-px after:bg-white/[0.08]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <span>or shop the collection</span>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 max-[480px]:grid-cols-1 gap-3"
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
              className="ct-shop-card group flex flex-col gap-[0.7rem] p-5 bg-white/[0.03] border border-white/[0.08] rounded-[14px] no-underline text-inherit transition-[border-color] duration-[250ms]"
              style={{ '--ct-sh-color': item.color } as React.CSSProperties}
              variants={riseUp(0)}
              whileHover={{ y: -4, boxShadow: `0 20px 48px rgba(0,0,0,0.5), 0 0 0 1px ${item.color}55` }}
            >
              <span
                className="w-11 h-11 rounded-[10px] flex items-center justify-center text-[1.15rem] shrink-0"
                style={{ color: item.color, background: `${item.color}1a` }}
              >
                <i className={item.icon} />
              </span>
              <div className="flex-1">
                <p className="text-[0.88rem] font-bold text-white/90 m-0 mb-1">{item.label}</p>
                <p className="text-[0.73rem] text-white/[0.38] m-0 leading-[1.5]">{item.desc}</p>
              </div>
              <span className="text-[0.75rem] font-bold inline-flex items-center gap-[0.4rem] mt-[0.2rem]" style={{ color: item.color }}>
                {item.cta} <i className="fas fa-long-arrow-alt-right transition-transform duration-200 group-hover:translate-x-[4px]" />
              </span>
            </motion.a>
          ))}
        </motion.div>
      </section>

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
          <div className="mb-8">
            <motion.h2
              className="text-2xl font-bold mb-[1.2rem] uppercase tracking-[1px]"
              variants={curtain(0)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
            >
              Find me <span className="text-lime">online</span>
            </motion.h2>
            <DrawLine color="#b1db00" />
          </div>

          <div className="overflow-hidden mt-2 max-[767px]:hidden">
            <motion.div className="flex gap-4 w-max py-2" style={{ x: railX }}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ct-social-card w-[220px] shrink-0 flex items-center gap-[0.85rem] bg-white/4 border border-white/[0.07] rounded-lg px-4 py-[0.9rem] no-underline transition-all duration-250"
                  style={{ '--sc-color': s.color } as React.CSSProperties}
                >
                  <i className={`${s.icon} ct-social-icon`} />
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-[0.88rem] font-bold text-[#e0e0e0]">{s.label}</span>
                    <span className="text-[0.75rem] text-lime whitespace-nowrap overflow-hidden text-ellipsis">{s.sub}</span>
                  </div>
                  <i className="fas fa-arrow-right ct-social-arrow" />
                </a>
              ))}
            </motion.div>
          </div>

          {/* Mobile: simple grid */}
          <div className="hidden max-[767px]:grid grid-cols-2 gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.07] rounded-lg px-4 py-3 no-underline"
              >
                <i className={s.icon} style={{ color: s.color, fontSize: '1.1rem' }} />
                <div className="min-w-0">
                  <p className="text-[0.82rem] font-bold text-[#e0e0e0] m-0">{s.label}</p>
                  <p className="text-[0.72rem] text-lime m-0 truncate">{s.sub}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>

    </main>
  )
}
