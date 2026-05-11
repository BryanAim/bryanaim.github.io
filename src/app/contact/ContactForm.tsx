'use client'

import { useState, useRef, useEffect } from 'react'
import { m, AnimatePresence } from 'framer-motion'

const SUBJECTS = ['Job Opportunity', 'Freelance Project', 'Collaboration', 'General Inquiry'] as const
type Subject = typeof SUBJECTS[number]
type Status = 'idle' | 'submitting' | 'success' | 'error'

const field = "w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-3 text-white text-[0.9rem] placeholder:text-white/20 focus:outline-none focus:border-teal/50 transition-colors duration-200"

function SubjectSelect({ value, onChange }: { value: Subject; onChange: (v: Subject) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`${field} flex items-center justify-between cursor-pointer text-left`}
      >
        <span>{value}</span>
        <i className={`fas fa-chevron-down text-white/30 text-[0.7rem] transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <m.ul
            role="listbox"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 top-[calc(100%+4px)] left-0 right-0 bg-[#1c1c1c] border border-white/10 rounded-lg overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
          >
            {SUBJECTS.map(s => (
              <li
                key={s}
                role="option"
                aria-selected={s === value}
                onClick={() => { onChange(s); setOpen(false) }}
                className={`px-4 py-[0.7rem] text-[0.9rem] cursor-pointer transition-colors duration-150 ${
                  s === value
                    ? 'text-teal bg-teal/10'
                    : 'text-white/80 hover:bg-white/6 hover:text-white'
                }`}
              >
                {s}
              </li>
            ))}
          </m.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [subject, setSubject] = useState<Subject>('Job Opportunity')

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    const data = Object.fromEntries(new FormData(e.currentTarget))
    data.subject = subject
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        setErrorMsg((j as { error?: string }).error ?? 'Something went wrong. Try again.')
        setStatus('error')
      } else {
        setStatus('success')
      }
    } catch {
      setErrorMsg('Network error. Check your connection and try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <m.div
        className="flex flex-col items-center gap-3 py-12 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-14 h-14 rounded-full bg-lime/10 flex items-center justify-center text-lime text-2xl">
          <i className="fas fa-check" />
        </div>
        <p className="text-white font-bold text-[1.05rem]">Message sent!</p>
        <p className="text-white/50 text-[0.875rem] max-w-xs">
          I&apos;ll be in touch soon — usually within a day or two.
        </p>
      </m.div>
    )
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3" noValidate>
      {/* Honeypot — bots fill this, humans don't */}
      <input name="website" type="text" tabIndex={-1} aria-hidden="true" className="hidden" autoComplete="off" />

      <div className="grid grid-cols-2 max-[540px]:grid-cols-1 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.72rem] uppercase tracking-[1.5px] text-white/40 font-semibold">Name</label>
          <input
            name="name" type="text" required placeholder="Your name"
            minLength={2} maxLength={120}
            className={field}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.72rem] uppercase tracking-[1.5px] text-white/40 font-semibold">Email</label>
          <input
            name="email" type="email" required placeholder="you@example.com"
            className={field}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[0.72rem] uppercase tracking-[1.5px] text-white/40 font-semibold">Subject</label>
        <SubjectSelect value={subject} onChange={setSubject} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[0.72rem] uppercase tracking-[1.5px] text-white/40 font-semibold">Message</label>
        <textarea
          name="message" required rows={5}
          placeholder="Tell me about your project, opportunity, or idea…"
          minLength={20} maxLength={2000}
          className={`${field} resize-none`}
        />
      </div>

      {status === 'error' && (
        <p className="text-[0.8rem] text-red-400">{errorMsg}</p>
      )}

      <m.button
        type="submit"
        disabled={status === 'submitting'}
        className="self-start inline-flex items-center gap-2 px-7 py-[0.8rem] bg-teal text-black font-bold text-[0.88rem] rounded-[7px] transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={status !== 'submitting' ? { scale: 1.03 } : undefined}
      >
        {status === 'submitting'
          ? <><i className="fas fa-spinner fa-spin" /> Sending…</>
          : <><i className="fas fa-paper-plane" /> Send Message</>}
      </m.button>
    </form>
  )
}
