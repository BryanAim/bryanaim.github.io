'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── Types ─── */
interface QuoteOption {
  label: string
  hint?: string
  add: number        // KES added to total
  tag?: string       // short label shown in summary
}

interface QuoteStep {
  id: string
  question: string
  hint?: string
  multi?: boolean    // allow multiple selections
  options: QuoteOption[]
}

interface QuoteConfig {
  serviceId: string
  base: number
  steps: QuoteStep[]
}

/* ─── Quote configs per service ─── */
const QUOTE_CONFIGS: QuoteConfig[] = [
  {
    serviceId: 'website',
    base: 15000,
    steps: [
      {
        id: 'type',
        question: 'What type of website do you need?',
        hint: 'This is the biggest factor in pricing.',
        options: [
          { label: 'Landing / Promo page',   hint: 'Single page, focused on one goal', add: 0,     tag: 'Landing page' },
          { label: 'Business / Company site', hint: '3–8 pages, about, services, contact', add: 8000,  tag: 'Business site' },
          { label: 'Portfolio site',          hint: 'Showcase work, projects, or CV', add: 5000,  tag: 'Portfolio' },
          { label: 'E-commerce store',        hint: 'Product listings + checkout', add: 25000, tag: 'E-commerce' },
          { label: 'Web application',         hint: 'Custom tool, dashboard, or SaaS', add: 40000, tag: 'Web app' },
        ],
      },
      {
        id: 'pages',
        question: 'How many pages / screens?',
        options: [
          { label: '1 – 3 pages',  add: 0,     tag: '1–3 pages' },
          { label: '4 – 7 pages',  add: 5000,  tag: '4–7 pages' },
          { label: '8 – 15 pages', add: 12000, tag: '8–15 pages' },
          { label: '15+ pages',    add: 20000, tag: '15+ pages' },
        ],
      },
      {
        id: 'features',
        question: 'Which features do you need?',
        hint: 'Select all that apply.',
        multi: true,
        options: [
          { label: 'Contact form',          add: 0,     tag: 'Contact form' },
          { label: 'Blog / News section',   add: 5000,  tag: 'Blog' },
          { label: 'Online booking system', add: 8000,  tag: 'Booking' },
          { label: 'Payment integration',   add: 12000, tag: 'Payments' },
          { label: 'Image / Video gallery', add: 2000,  tag: 'Gallery' },
          { label: 'Custom animations',     add: 5000,  tag: 'Animations' },
          { label: 'None of the above',     add: 0,     tag: 'Basic only' },
        ],
      },
      {
        id: 'design',
        question: 'What about the design?',
        options: [
          { label: 'I have a design ready (just build it)',   add: -3000, tag: 'Dev only' },
          { label: 'Design + development (full service)',     add: 0,     tag: 'Design + Dev' },
          { label: 'Redesign an existing site',              add: 4000,  tag: 'Redesign' },
        ],
      },
      {
        id: 'timeline',
        question: 'What is your timeline?',
        options: [
          { label: 'Flexible (3+ weeks)',      add: 0,    tag: 'Flexible' },
          { label: 'Standard (1–2 weeks)',     add: 0,    tag: 'Standard' },
          { label: 'Rush (under 1 week)',      add: 8000, tag: 'Rush delivery' },
        ],
      },
    ],
  },
  {
    serviceId: 'logo',
    base: 5000,
    steps: [
      {
        id: 'scope',
        question: 'What do you need designed?',
        options: [
          { label: 'Logo only',                         hint: 'Primary mark in standard formats', add: 0,     tag: 'Logo only' },
          { label: 'Logo + colours & typography',       hint: 'Visual identity foundations', add: 3000,  tag: 'Logo + identity' },
          { label: 'Full brand identity kit',           hint: 'Logo, colours, fonts, usage guide, mockups', add: 12000, tag: 'Full brand kit' },
        ],
      },
      {
        id: 'concepts',
        question: 'How many initial concepts?',
        hint: 'More concepts = more exploration time.',
        options: [
          { label: '1 concept',           add: 0,    tag: '1 concept' },
          { label: '2 concepts',          add: 2000, tag: '2 concepts' },
          { label: '3 concepts',          add: 4000, tag: '3 concepts' },
        ],
      },
      {
        id: 'revisions',
        question: 'How many revision rounds?',
        options: [
          { label: '2 revisions (standard)',  add: 0,    tag: '2 revisions' },
          { label: '4 revisions',             add: 2000, tag: '4 revisions' },
          { label: 'Unlimited revisions',     add: 5000, tag: 'Unlimited revisions' },
        ],
      },
      {
        id: 'formats',
        question: 'Which file formats do you need?',
        options: [
          { label: 'Standard (PNG, PDF, JPEG)',                      add: 0,    tag: 'Standard formats' },
          { label: 'Extended (AI, SVG, EPS + all standard formats)', add: 1500, tag: 'All formats' },
        ],
      },
    ],
  },
  {
    serviceId: 'motion',
    base: 3000,
    steps: [
      {
        id: 'type',
        question: 'What type of motion graphic?',
        options: [
          { label: 'Animated logo',                 hint: 'Logo reveal / intro animation', add: 0,    tag: 'Logo animation' },
          { label: 'Social media post graphics',    hint: 'Static + animated post designs', add: 0,    tag: 'Social posts' },
          { label: 'Stories / Reels templates',     hint: 'Editable animated templates', add: 1000, tag: 'Stories/Reels' },
          { label: 'Video intro / outro',           hint: 'Branded opening/closing for videos', add: 3000, tag: 'Video intro/outro' },
          { label: 'Presentation / Pitch deck',     hint: 'Animated slides and transitions', add: 5000, tag: 'Presentation' },
        ],
      },
      {
        id: 'quantity',
        question: 'How many pieces?',
        options: [
          { label: '1 piece',     add: 0,    tag: '1 piece' },
          { label: '2 – 4 pieces', add: 4000, tag: '2–4 pieces' },
          { label: '5+ pieces',   add: 9000, tag: '5+ pieces' },
        ],
      },
      {
        id: 'duration',
        question: 'Approx. length per piece?',
        options: [
          { label: 'Under 15 seconds', add: 0,    tag: '<15s' },
          { label: '15 – 60 seconds',  add: 2000, tag: '15–60s' },
          { label: '1 minute+',        add: 5000, tag: '1min+' },
        ],
      },
      {
        id: 'formats',
        question: 'Deliverable format?',
        multi: true,
        options: [
          { label: 'MP4 video file',    add: 0,   tag: 'MP4' },
          { label: 'GIF',               add: 500, tag: 'GIF' },
          { label: 'Editable source file (After Effects / Illustrator)', add: 2000, tag: 'Source files' },
        ],
      },
    ],
  },
  {
    serviceId: 'uiux',
    base: 8000,
    steps: [
      {
        id: 'platform',
        question: 'What platform is this for?',
        options: [
          { label: 'Website / Web app', add: 0,    tag: 'Web' },
          { label: 'Mobile app (iOS / Android)', add: 2000, tag: 'Mobile app' },
          { label: 'Both web + mobile', add: 5000, tag: 'Web + Mobile' },
        ],
      },
      {
        id: 'screens',
        question: 'How many screens / pages?',
        options: [
          { label: '1 – 5 screens',    add: 0,     tag: '1–5 screens' },
          { label: '6 – 15 screens',   add: 7000,  tag: '6–15 screens' },
          { label: '16 – 30 screens',  add: 18000, tag: '16–30 screens' },
          { label: '30+ screens',      add: 30000, tag: '30+ screens' },
        ],
      },
      {
        id: 'prototype',
        question: 'Do you need a clickable prototype?',
        hint: 'A prototype lets you test flows before development.',
        options: [
          { label: 'Static mockups only',             add: 0,    tag: 'Mockups only' },
          { label: 'Clickable / interactive prototype', add: 5000, tag: 'Interactive prototype' },
        ],
      },
      {
        id: 'research',
        question: 'Is UX research needed?',
        hint: 'User interviews, competitor analysis, user flows.',
        options: [
          { label: 'No — I know what I want',           add: 0,     tag: 'No research' },
          { label: 'Basic (competitor review + flows)',  add: 3000,  tag: 'Basic research' },
          { label: 'Full UX research & user testing',   add: 10000, tag: 'Full research' },
        ],
      },
    ],
  },
  {
    serviceId: 'email',
    base: 4000,
    steps: [
      {
        id: 'templates',
        question: 'How many email templates?',
        options: [
          { label: '1 template',       add: 0,    tag: '1 template' },
          { label: '2 – 3 templates',  add: 3000, tag: '2–3 templates' },
          { label: '4+ templates',     add: 7000, tag: '4+ templates' },
        ],
      },
      {
        id: 'automation',
        question: 'Do you need automation flows?',
        hint: 'E.g. welcome sequence, abandoned cart, follow-ups.',
        options: [
          { label: 'No automation — manual sends only', add: 0,    tag: 'Manual sends' },
          { label: 'Basic flow (1–2 automations)',      add: 3000, tag: 'Basic automation' },
          { label: 'Advanced flows (3+ automations)',   add: 7000, tag: 'Advanced automation' },
        ],
      },
      {
        id: 'platform',
        question: 'Which platform are you on?',
        options: [
          { label: 'Mailchimp',    add: 0,    tag: 'Mailchimp' },
          { label: 'Brevo (Sendinblue)', add: 0, tag: 'Brevo' },
          { label: 'Other / not sure', hint: 'I can recommend the best fit', add: 0, tag: 'TBD platform' },
        ],
      },
      {
        id: 'training',
        question: 'Do you need a walkthrough / training session?',
        options: [
          { label: 'No — just set it up', add: 0,    tag: 'Setup only' },
          { label: 'Yes — include a training session', add: 2000, tag: '+ Training session' },
        ],
      },
    ],
  },
  {
    serviceId: 'mentorship',
    base: 0,
    steps: [
      {
        id: 'package',
        question: 'Which session package?',
        hint: 'Longer packages come with a discount.',
        options: [
          { label: '1 session  — KES 800',    hint: '1 × 1-hour session', add: 800,  tag: '1 session' },
          { label: '4 sessions — KES 2,800',  hint: 'Save KES 400',       add: 2800, tag: '4 sessions' },
          { label: '8 sessions — KES 5,200',  hint: 'Save KES 1,200',     add: 5200, tag: '8 sessions' },
          { label: '12 sessions — KES 7,200', hint: 'Save KES 2,400',     add: 7200, tag: '12 sessions' },
        ],
      },
      {
        id: 'level',
        question: 'What is your current level?',
        options: [
          { label: 'Complete beginner (no coding experience)', add: 0, tag: 'Beginner' },
          { label: 'Some experience (HTML/CSS basics)',        add: 0, tag: 'Some experience' },
          { label: 'Intermediate (knows JS, wants to level up)', add: 0, tag: 'Intermediate' },
        ],
      },
      {
        id: 'focus',
        question: 'What do you want to focus on?',
        multi: true,
        options: [
          { label: 'HTML & CSS',                add: 0, tag: 'HTML/CSS' },
          { label: 'JavaScript',                add: 0, tag: 'JavaScript' },
          { label: 'React / Next.js',           add: 0, tag: 'React' },
          { label: 'Node.js / Backend',         add: 0, tag: 'Node.js' },
          { label: 'Full-stack (everything)',   add: 0, tag: 'Full-stack' },
        ],
      },
      {
        id: 'format',
        question: 'How would you like to meet?',
        options: [
          { label: 'Online (Google Meet / Zoom)', add: 0,   tag: 'Online' },
          { label: 'In-person — Nakuru',          add: 500, tag: 'In-person Nakuru' },
        ],
      },
    ],
  },
]

/* ─── Helpers ─── */
function fmt(n: number) {
  return `KES ${n.toLocaleString()}`
}

function buildWhatsAppMessage(
  serviceName: string,
  steps: QuoteStep[],
  selections: Record<string, string[]>,
  total: number,
) {
  const lines: string[] = [
    `Hi Brian! I used the quote tool on your website and here's what I need:`,
    ``,
    `*Service:* ${serviceName}`,
    ``,
    `*Requirements:*`,
  ]
  steps.forEach(step => {
    const sel = selections[step.id] ?? []
    if (sel.length > 0) {
      const labels = sel.map(v => step.options.find(o => o.label === v)?.tag ?? v).join(', ')
      lines.push(`• ${step.question.replace('?', '')}: ${labels}`)
    }
  })
  lines.push(``, `*Estimated quote:* ${fmt(total)}`, ``, `Can we discuss further?`)
  return lines.join('\n')
}

/* ─── PDF download ─── */
function downloadProposal(
  serviceName: string,
  steps: QuoteStep[],
  selections: Record<string, string[]>,
  summaryItems: { label: string; add: number }[],
  base: number,
  total: number,
  color: string,
) {
  const date = new Date().toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })
  const rows = summaryItems.filter(i => i.add !== 0).map(i => `
    <tr>
      <td>${i.label}</td>
      <td style="text-align:right;color:${i.add > 0 ? '#555' : '#16a34a'}">${i.add > 0 ? `+${fmt(i.add)}` : `−${fmt(Math.abs(i.add))}`}</td>
    </tr>`).join('')

  const requirementLines = steps.map(s => {
    const sel = selections[s.id] ?? []
    if (!sel.length) return ''
    const tags = sel.map(v => s.options.find(o => o.label === v)?.tag ?? v).join(', ')
    return `<tr><td style="color:#555">${s.question.replace('?', '')}</td><td>${tags}</td></tr>`
  }).filter(Boolean).join('')

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Quote — ${serviceName}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',Arial,sans-serif;color:#111;padding:48px;max-width:680px;margin:auto}
  h1{font-size:1.5rem;margin-bottom:4px}
  .sub{color:#777;font-size:0.85rem;margin-bottom:32px}
  .badge{display:inline-block;background:${color}18;color:${color};border:1px solid ${color}55;border-radius:4px;padding:2px 10px;font-size:0.8rem;font-weight:600;margin-bottom:24px}
  h2{font-size:1rem;font-weight:700;margin:24px 0 8px;color:#111}
  table{width:100%;border-collapse:collapse;font-size:0.9rem}
  td{padding:7px 4px;border-bottom:1px solid #eee}
  .total-row td{font-weight:700;font-size:1rem;border-top:2px solid ${color};border-bottom:none;padding-top:12px;color:${color}}
  .base-row td{color:#555}
  .disclaimer{margin-top:28px;font-size:0.78rem;color:#888;line-height:1.5;border-top:1px solid #eee;padding-top:16px}
  .footer{margin-top:40px;font-size:0.8rem;color:#aaa;text-align:center}
  @media print{body{padding:32px}}
</style>
</head>
<body>
  <h1>Project Quote</h1>
  <div class="sub">Prepared by Brian Isale · isalebryan.dev · ${date}</div>
  <div class="badge">${serviceName}</div>

  <h2>Requirements</h2>
  <table>${requirementLines}</table>

  <h2>Price Breakdown</h2>
  <table>
    <tr class="base-row"><td>Base (${serviceName})</td><td style="text-align:right">${fmt(base)}</td></tr>
    ${rows}
    <tr class="total-row"><td>Estimated Total</td><td style="text-align:right">${fmt(total)}</td></tr>
  </table>

  <p class="disclaimer">This is an estimate — the final price is confirmed after a short consultation where we align on exact scope, timeline, and deliverables. To proceed, reach out via WhatsApp (+254 728 822 142) or email isale.bryan@gmail.com.</p>
  <div class="footer">isalebryan.dev</div>
</body>
</html>`

  const w = window.open('', '_blank')
  if (!w) return
  w.document.write(html)
  w.document.close()
  w.focus()
  setTimeout(() => w.print(), 400)
}

/* ─── Component ─── */
interface QuoteModalProps {
  serviceId: string
  serviceName: string
  color: string
  onClose: () => void
}

export default function QuoteModal({ serviceId, serviceName, color, onClose }: QuoteModalProps) {
  const config = QUOTE_CONFIGS.find(c => c.serviceId === serviceId)
  const [step, setStep] = useState(0)
  const [selections, setSelections] = useState<Record<string, string[]>>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!config || !mounted) return null

  const steps = config.steps
  const isLast = step === steps.length
  const currentStep = steps[step]

  /* live total */
  const total = config.base + steps.reduce((sum, s) => {
    const sel = selections[s.id] ?? []
    return sum + s.options
      .filter(o => sel.includes(o.label))
      .reduce((a, o) => a + o.add, 0)
  }, 0)

  const currentSel = selections[currentStep?.id ?? ''] ?? []

  function toggle(label: string) {
    if (!currentStep) return
    const id = currentStep.id
    if (currentStep.multi) {
      setSelections(prev => {
        const existing = prev[id] ?? []
        return {
          ...prev,
          [id]: existing.includes(label)
            ? existing.filter(v => v !== label)
            : [...existing, label],
        }
      })
    } else {
      setSelections(prev => ({ ...prev, [id]: [label] }))
    }
  }

  function next() {
    if (step < steps.length) setStep(s => s + 1)
  }
  function back() {
    if (step > 0) setStep(s => s - 1)
  }

  const canContinue = currentStep?.multi
    ? (selections[currentStep.id]?.length ?? 0) > 0
    : (selections[currentStep?.id ?? '']?.length ?? 0) > 0

  /* WA URL */
  const waMsg = isLast
    ? buildWhatsAppMessage(serviceName, steps, selections, total)
    : ''
  const waUrl = `https://wa.me/254728822142?text=${encodeURIComponent(waMsg)}`
  const mailSubject = encodeURIComponent(`Quote request — ${serviceName}`)
  const mailBody = encodeURIComponent(waMsg.replace(/\*/g, ''))
  const mailUrl = `mailto:isale.bryan@gmail.com?subject=${mailSubject}&body=${mailBody}`

  /* Summary items for proposal */
  const summaryItems = steps.flatMap(s => {
    const sel = selections[s.id] ?? []
    return s.options.filter(o => sel.includes(o.label)).map(o => ({
      label: o.tag ?? o.label,
      add: o.add,
    }))
  })

  return createPortal(
    <motion.div
      className="qm-overlay"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="qm-panel"
        onClick={e => e.stopPropagation()}
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        {/* Header */}
        <div className="qm-header" style={{ borderBottomColor: color }}>
          <div>
            <p className="qm-header-service" style={{ color }}>{serviceName}</p>
            <p className="qm-header-title">
              {isLast ? 'Your Proposal' : `Step ${step + 1} of ${steps.length}`}
            </p>
          </div>
          <button className="qm-close" onClick={onClose}>✕</button>
        </div>

        {/* Progress bar */}
        <div className="qm-progress-track">
          <motion.div
            className="qm-progress-fill"
            style={{ background: color }}
            animate={{ width: `${((isLast ? steps.length : step) / steps.length) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        {/* Live price pill */}
        <div className="qm-price-pill">
          <span className="qm-price-label">Estimated total</span>
          <motion.span
            className="qm-price-value"
            key={total}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ color }}
          >
            {fmt(total)}
          </motion.span>
        </div>

        {/* Body */}
        <div className="qm-body">
          <AnimatePresence mode="wait">
            {!isLast ? (
              <motion.div
                key={step}
                className="qm-step"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <h3 className="qm-question">{currentStep.question}</h3>
                {currentStep.hint && <p className="qm-hint">{currentStep.hint}</p>}

                <div className="qm-options">
                  {currentStep.options.map(opt => {
                    const selected = currentSel.includes(opt.label)
                    return (
                      <button
                        key={opt.label}
                        className={`qm-option${selected ? ' selected' : ''}`}
                        style={selected ? { borderColor: color, background: `${color}14` } : {}}
                        onClick={() => toggle(opt.label)}
                      >
                        <div className="qm-option-main">
                          <span className="qm-option-check" style={selected ? { background: color, borderColor: color } : {}}>
                            {selected && <i className="fas fa-check" />}
                          </span>
                          <div className="qm-option-text">
                            <span className="qm-option-label">{opt.label}</span>
                            {opt.hint && <span className="qm-option-hint">{opt.hint}</span>}
                          </div>
                        </div>
                        {opt.add > 0 && (
                          <span className="qm-option-add" style={{ color }}>+{fmt(opt.add)}</span>
                        )}
                        {opt.add < 0 && (
                          <span className="qm-option-add qm-option-add--discount">−{fmt(Math.abs(opt.add))}</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="proposal"
                className="qm-proposal"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <p className="qm-proposal-intro">
                  Based on your requirements, here&apos;s a proposed quote:
                </p>

                <div className="qm-breakdown">
                  <div className="qm-breakdown-row qm-breakdown-base">
                    <span>Base ({serviceName})</span>
                    <span>{fmt(config.base)}</span>
                  </div>
                  {summaryItems.filter(i => i.add !== 0).map((item, i) => (
                    <div key={i} className="qm-breakdown-row">
                      <span>{item.label}</span>
                      <span style={{ color: item.add > 0 ? '#aaa' : '#34d399' }}>
                        {item.add > 0 ? `+${fmt(item.add)}` : `−${fmt(Math.abs(item.add))}`}
                      </span>
                    </div>
                  ))}
                  <div className="qm-breakdown-total" style={{ borderTopColor: color }}>
                    <span>Estimated Total</span>
                    <span style={{ color }}>{fmt(total)}</span>
                  </div>
                </div>

                <p className="qm-disclaimer">
                  <i className="fas fa-info-circle" /> This is an estimate — the final price is confirmed after a short consultation where we align on exact scope, timeline, and deliverables.
                </p>

                <div className="qm-proposal-ctas">
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" className="qm-cta-wa">
                    <i className="fab fa-whatsapp" /> Send via WhatsApp
                  </a>
                  <a href={mailUrl} className="qm-cta-mail">
                    <i className="fas fa-envelope" /> Send via Email
                  </a>
                  <button
                    className="qm-cta-pdf"
                    onClick={() => downloadProposal(serviceName, steps, selections, summaryItems, config.base, total, color)}
                  >
                    <i className="fas fa-download" /> Download PDF
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer nav */}
        {!isLast && (
          <div className="qm-footer">
            <button className="qm-btn-back" onClick={back} disabled={step === 0}>
              <i className="fas fa-arrow-left" /> Back
            </button>
            <button
              className="qm-btn-next"
              style={canContinue ? { background: color, borderColor: color, color: '#000' } : {}}
              onClick={next}
              disabled={!canContinue}
            >
              {step === steps.length - 1 ? 'See proposal' : 'Continue'} <i className="fas fa-arrow-right" />
            </button>
          </div>
        )}
        {isLast && (
          <div className="qm-footer">
            <button className="qm-btn-back" onClick={back}>
              <i className="fas fa-arrow-left" /> Edit requirements
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>,
    document.body,
  )
}
