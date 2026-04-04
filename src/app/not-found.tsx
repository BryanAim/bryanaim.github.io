'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const TERMINAL_LINES = [
  { text: '$ navigate to /secret-page', type: 'cmd' },
  { text: 'Resolving route...', type: 'info' },
  { text: 'Checking cache... MISS', type: 'warn' },
  { text: 'Fetching from origin...', type: 'info' },
  { text: 'ERROR 404: Route not found', type: 'error' },
  { text: '$ retry --force', type: 'cmd' },
  { text: 'Still 404. The page is gone, man.', type: 'error' },
  { text: '$ ls /pages', type: 'cmd' },
  { text: '  / · /about · /work · /contact', type: 'output' },
  { text: '$ echo "maybe go home?"', type: 'cmd' },
  { text: 'maybe go home?', type: 'output' },
  { text: '$ _', type: 'cmd' },
]

const TYPE_COLORS: Record<string, string> = {
  cmd:    '#00ddd7',
  info:   '#888',
  warn:   '#ff8c42',
  error:  '#ff3d6b',
  output: '#ccc',
}

export default function NotFound() {
  const [visibleLines, setVisibleLines] = useState(1)

  useEffect(() => {
    if (visibleLines >= TERMINAL_LINES.length) {
      const reset = setTimeout(() => setVisibleLines(1), 2800)
      return () => clearTimeout(reset)
    }
    const delay = TERMINAL_LINES[visibleLines - 1].type === 'cmd' ? 520 : 220
    const t = setTimeout(() => setVisibleLines(v => v + 1), delay)
    return () => clearTimeout(t)
  }, [visibleLines])

  return (
    <main className="nf-wrap">
      {/* Grid background */}
      <div className="nf-grid" aria-hidden />

      <div className="nf-inner">
        {/* Glitched 404 */}
        <div className="nf-glitch-wrap" aria-label="404">
          <span className="nf-glitch" data-text="404">404</span>
        </div>

        <p className="nf-title">Page not found</p>
        <p className="nf-desc">This URL doesn&apos;t resolve to anything — but your next move does.</p>

        {/* Terminal */}
        <motion.div
          className="nf-terminal"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="nf-terminal-bar">
            <span className="nf-dot nf-dot--red" />
            <span className="nf-dot nf-dot--yellow" />
            <span className="nf-dot nf-dot--green" />
            <span className="nf-terminal-title">bash — not-found</span>
          </div>
          <div className="nf-terminal-body">
            {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
              <div key={i} className="nf-terminal-line" style={{ color: TYPE_COLORS[line.type] }}>
                {line.text}
                {i === visibleLines - 1 && <span className="nf-cursor" />}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="nf-actions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Link href="/" className="nf-btn-primary">
            <i className="fas fa-home" /> Go home
          </Link>
          <Link href="/work" className="nf-btn-ghost">
            <i className="fas fa-briefcase" /> View work
          </Link>
        </motion.div>
      </div>
    </main>
  )
}
