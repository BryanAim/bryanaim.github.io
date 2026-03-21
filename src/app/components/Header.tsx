'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Me' },
  { href: '/about#contact', label: 'Contact' },
  { href: '/shop', label: 'Shop' },
  { href: 'https://blog.isalebryan.me/', label: 'My Blog' },
  { href: '/bmx', label: 'BMX Life' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const toggle = () => setOpen(prev => !prev)

  return (
    <header>
      <div className={`menu-btn${open ? ' close' : ''}`} onClick={toggle}>
        <div className="btn-line"></div>
        <div className="btn-line"></div>
        <div className="btn-line"></div>
      </div>

      <nav className={`menu${open ? ' show' : ''}`}>
        <div className={`menu-branding${open ? ' show' : ''}`}>
          <div className="portrait"></div>
        </div>
        <ul className={`menu-nav${open ? ' show' : ''}`}>
          {navLinks.map(({ href, label }) => (
            <li
              key={href}
              className={`nav-item${open ? ' show' : ''}${pathname === href ? ' current' : ''}`}
            >
              <a href={href} className="nav-link" onClick={() => setOpen(false)}>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
