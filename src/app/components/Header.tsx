'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { href: '/',              label: 'Home',     icon: 'fas fa-home' },
  { href: '/about',         label: 'About Me', icon: 'fas fa-user' },
  { href: '/work',          label: 'Work',     icon: 'fas fa-briefcase' },
  { href: '/contact',       label: 'Contact',  icon: 'fas fa-envelope' },
  { href: '/shop',          label: 'Shop',     icon: 'fas fa-shopping-bag' },
  { href: 'https://blog.isalebryan.dev/', label: 'My Blog',  icon: 'fas fa-pen-nib' },
  { href: '/bmx',           label: 'BMX Life', icon: 'fas fa-bicycle' },
]

const COLLAPSED = 64
const EXPANDED  = 220

export default function Header() {
  const [hovered, setHovered] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--sidebar-w',
      hovered ? `${EXPANDED}px` : `${COLLAPSED}px`
    )
  }, [hovered])

  return (
    <header>
      {/* ══════════════════════════════════
          DESKTOP — collapsible side nav
          ══════════════════════════════════ */}
      <motion.nav
        className="side-nav"
        aria-label="Main navigation"
        initial={false}
        animate={{ width: hovered ? EXPANDED : COLLAPSED }}
        transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* ── Logo ── */}
        <a href="/" className="side-nav-logo">
          <span className="side-nav-logo-b">B</span>
          <AnimatePresence>
            {hovered && (
              <motion.span
                className="side-nav-logo-rest"
                key="logo-rest"
                initial={{ opacity: 0, x: -6, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 'auto' }}
                exit={{ opacity: 0, x: -6, width: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                rian.
              </motion.span>
            )}
          </AnimatePresence>
        </a>

        {/* ── Divider ── */}
        <div className="side-nav-divider" />

        {/* ── Nav items ── */}
        <ul className="side-nav-list" role="list">
          {navLinks.map(({ href, label, icon }, i) => {
            const isActive = pathname === href
            return (
              <li key={href} className="side-nav-item">
                <a
                  href={href}
                  className={`side-nav-link${isActive ? ' active' : ''}`}
                  title={label}
                >
                  {/* Shared-element active background */}
                  {isActive && (
                    <motion.span
                      className="side-nav-active-bg"
                      layoutId="activeNavBg"
                      transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
                    />
                  )}

                  {/* Icon */}
                  <span className="side-nav-icon-wrap">
                    <i className={icon} aria-hidden="true" />
                    {/* Active dot — shown when collapsed */}
                    {isActive && !hovered && (
                      <motion.span
                        className="side-nav-active-dot"
                        layoutId="activeDot"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      />
                    )}
                  </span>

                  {/* Label — animates in on expand */}
                  <AnimatePresence>
                    {hovered && (
                      <motion.span
                        key={`label-${href}`}
                        className="side-nav-label"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{
                          duration: 0.2,
                          delay: 0.06 + i * 0.035,
                          ease: 'easeOut',
                        }}
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </a>
              </li>
            )
          })}
        </ul>

        {/* ── Bottom accent line ── */}
        <motion.div
          className="side-nav-bottom-line"
          animate={{ scaleX: hovered ? 1 : 0.3, opacity: hovered ? 1 : 0.4 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </motion.nav>

      {/* ══════════════════════════════════
          MOBILE — hamburger + overlay nav
          ══════════════════════════════════ */}
      <button
        className={`menu-btn${mobileOpen ? ' close' : ''}`}
        onClick={() => setMobileOpen(p => !p)}
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
        aria-controls="mobile-menu"
      >
        <div className="btn-line" />
        <div className="btn-line" />
        <div className="btn-line" />
      </button>

      <nav
        id="mobile-menu"
        className={`menu${mobileOpen ? ' show' : ''}`}
        aria-hidden={!mobileOpen}
      >
        <div className={`menu-branding${mobileOpen ? ' show' : ''}`}>
          <div className="portrait" />
        </div>
        <ul className={`menu-nav${mobileOpen ? ' show' : ''}`}>
          {navLinks.map(({ href, label }) => (
            <li
              key={href}
              className={`nav-item${mobileOpen ? ' show' : ''}${pathname === href ? ' current' : ''}`}
            >
              <a href={href} className="nav-link" onClick={() => setMobileOpen(false)}>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
