'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { designProjects } from '../../work/designProjects'
import { PRODUCTS } from '@/lib/products'
import type { Testimonial } from '@/lib/db'

type Tab = 'testimonials' | 'links'
type StatusFilter = 'all' | 'published' | 'hidden'

const SHOP_LINKS = [
  { slug: 'shop-stickers', title: 'Sticker Packs',       icon: '🏷️', color: '#b1db00', url: '/testimonial/shop-stickers' },
  { slug: 'shop-tshirts', title: 'T-Shirts',              icon: '👕', color: '#00ddd7', url: '/testimonial/shop-tshirts' },
  { slug: 'shop-custom',  title: 'Custom Order',          icon: '🎨', color: '#ff8c42', url: '/testimonial/shop-custom'  },
]

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function projectTitle(slug: string): string {
  if (slug.startsWith('product-')) {
    const id = slug.replace('product-', '')
    return PRODUCTS.find(p => p.id === id)?.name ?? slug
  }
  return (
    designProjects.find(p => p.slug === slug)?.title ??
    SHOP_LINKS.find(p => p.slug === slug)?.title ??
    slug
  )
}

// ─── Password gate ─────────────────────────────────────────────────────────
function PasswordGate({ onAuth }: { onAuth: (token: string) => void }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const res = await fetch('/api/testimonials/admin', {
      headers: { Authorization: `Bearer ${pw}` },
    })
    if (res.ok) { sessionStorage.setItem('admin_token', pw); onAuth(pw) }
    else setError('Incorrect password')
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <motion.div className="w-full max-w-sm" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-lime/10 border border-lime/20 flex items-center justify-center text-2xl text-lime mx-auto mb-4">
            <i className="fas fa-lock" />
          </div>
          <h1 className="text-xl font-extrabold">Testimonials Admin</h1>
          <p className="text-white/40 text-[0.82rem] mt-1">Enter your admin password to continue</p>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Admin password" autoFocus
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-lime/50 transition-colors" />
          {error && <p className="text-red-400 text-[0.83rem] text-center">{error}</p>}
          <button type="submit" disabled={loading || !pw}
            className="py-3 rounded-xl bg-lime text-black font-black uppercase tracking-wider text-[0.88rem] disabled:opacity-40 transition-all hover:bg-[#c8f000]">
            {loading ? <i className="fas fa-circle-notch fa-spin" /> : 'Enter'}
          </button>
        </form>
      </motion.div>
    </main>
  )
}

// ─── Image grid card for share links ─────────────────────────────────────────
function LinkCard({
  image, icon, title, badge, color, url, slug, copied, onCopy,
}: {
  image?: string; icon?: string; title: string; badge?: string
  color: string; url: string; slug: string; copied: string; onCopy: () => void
}) {
  const isCopied = copied === slug
  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-xl border border-white/8 bg-white/3 cursor-pointer transition-all duration-200 hover:border-white/20 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
      onClick={onCopy}
      title={title}
    >
      {/* Thumbnail */}
      <div className="relative aspect-square overflow-hidden bg-white/5">
        {image ? (
          <img src={image} alt={title} loading="lazy" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">{icon}</div>
        )}
        {/* Overlay on hover */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${isCopied ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          style={{ background: `${color}22` }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ background: isCopied ? color : 'rgba(0,0,0,0.6)' }}>
            <i className={`fas fa-${isCopied ? 'check' : 'link'}`} />
          </div>
        </div>
        {/* Color bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: color }} />
      </div>

      {/* Info */}
      <div className="px-2.5 py-2">
        <p className="text-white/80 text-[0.75rem] font-semibold leading-tight truncate">{title}</p>
        {badge && <p className="text-white/30 text-[0.62rem] uppercase tracking-wide mt-0.5">{badge}</p>}
        {isCopied && <p className="text-[0.62rem] font-bold mt-0.5" style={{ color }}>{isCopied ? 'Copied!' : ''}</p>}
      </div>
    </div>
  )
}

// ─── Main dashboard ─────────────────────────────────────────────────────────
function Dashboard({ token }: { token: string }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('testimonials')
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [search, setSearch] = useState('')
  const [toggling, setToggling] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [copied, setCopied] = useState('')
  const [linkSearch, setLinkSearch] = useState('')

  const authHeader = { Authorization: `Bearer ${token}` }
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://isalebryan.dev'

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/testimonials/admin', { headers: authHeader })
    if (res.ok) setTestimonials(await res.json())
    setLoading(false)
  }, [token])

  useEffect(() => { load() }, [load])

  async function toggleStatus(t: Testimonial) {
    setToggling(t.id)
    const next = t.status === 'published' ? 'hidden' : 'published'
    await fetch(`/api/testimonials/${t.id}`, {
      method: 'PATCH',
      headers: { ...authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    })
    setTestimonials(prev => prev.map(x => x.id === t.id ? { ...x, status: next } : x))
    setToggling(null)
  }

  async function doDelete(id: string) {
    setDeleting(id)
    await fetch(`/api/testimonials/${id}`, { method: 'DELETE', headers: authHeader })
    setTestimonials(prev => prev.filter(x => x.id !== id))
    setDeleting(null)
    setConfirmDelete(null)
  }

  function copyLink(slug: string, url: string) {
    navigator.clipboard.writeText(url)
    setCopied(slug)
    setTimeout(() => setCopied(''), 2000)
  }

  const displayed = testimonials.filter(t => {
    if (filter !== 'all' && t.status !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      return t.name.toLowerCase().includes(q) || t.text.toLowerCase().includes(q) ||
        t.project_slug.toLowerCase().includes(q)
    }
    return true
  })

  const publishedCount = testimonials.filter(t => t.status === 'published').length
  const hiddenCount    = testimonials.filter(t => t.status === 'hidden').length

  // Stats per project for the links tab
  const countsBySlug = testimonials.reduce<Record<string, number>>((acc, t) => {
    acc[t.project_slug] = (acc[t.project_slug] ?? 0) + 1
    return acc
  }, {})

  return (
    <main className="min-h-screen pb-16">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-white/8 max-sm:px-4 max-sm:flex-col max-sm:gap-3 max-sm:items-start">
        <div>
          <h1 className="text-lg font-extrabold text-white m-0">Testimonials Admin</h1>
          <p className="text-white/35 text-[0.76rem] m-0 mt-0.5">
            {publishedCount} published · {hiddenCount} hidden · {testimonials.length} total
          </p>
        </div>
        <div className="flex gap-2">
          {(['testimonials', 'links'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-[0.8rem] font-bold uppercase tracking-wider transition-colors duration-200 ${tab === t ? 'bg-lime text-black' : 'bg-white/6 text-white/50 hover:text-white'}`}>
              {t === 'links' ? 'Share Links' : 'Testimonials'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-8 py-6 max-sm:px-4">

        {/* ── Testimonials tab ───────────────────────────────────────────── */}
        {tab === 'testimonials' && (
          <>
            <div className="flex gap-3 mb-6 flex-wrap">
              <input type="search" placeholder="Search name, text or project…" value={search} onChange={e => setSearch(e.target.value)}
                className="flex-1 min-w-52 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-[0.88rem] outline-none focus:border-lime/40 placeholder:text-white/25" />
              {(['all', 'published', 'hidden'] as StatusFilter[]).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-2 rounded-lg text-[0.78rem] font-semibold capitalize transition-colors duration-200 ${filter === f ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/70'}`}>
                  {f}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-16 text-white/30"><i className="fas fa-circle-notch fa-spin text-2xl" /></div>
            ) : displayed.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-white/30 text-[0.9rem]">No testimonials{filter !== 'all' ? ` with status "${filter}"` : ''}.</p>
                <p className="text-white/20 text-[0.8rem] mt-2">Share a collection link to start gathering feedback.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <AnimatePresence initial={false}>
                  {displayed.map(t => (
                    <motion.div
                      key={t.id}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                      transition={{ duration: 0.25 }}
                      className={`flex gap-4 p-4 rounded-xl border transition-colors duration-200 max-sm:flex-col ${t.status === 'hidden' ? 'border-white/5 bg-white/2 opacity-55' : 'border-white/8 bg-white/4'}`}
                    >
                      {/* Avatar */}
                      <div className="shrink-0">
                        {t.photo_data
                          ? <img src={t.photo_data} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                          : <div className="w-10 h-10 rounded-full bg-lime/20 flex items-center justify-center text-lime font-bold text-[0.85rem]">
                              {t.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()}
                            </div>
                        }
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <p className="font-bold text-[0.9rem] text-white m-0">{t.name}</p>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              {(t.role || t.company) && (
                                <span className="text-white/40 text-[0.72rem]">{[t.role, t.company].filter(Boolean).join(' · ')}</span>
                              )}
                              <span className="text-lime/60 text-[0.72rem] font-medium">{projectTitle(t.project_slug)}</span>
                              <span className="text-white/25 text-[0.68rem]">·</span>
                              <span className="text-white/30 text-[0.68rem]">{timeAgo(t.created_at)}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 shrink-0">
                            {t.rating && (
                              <div className="flex gap-px">
                                {Array.from({ length: t.rating }).map((_, i) => (
                                  <i key={i} className="fas fa-star text-lime text-[0.65rem]" />
                                ))}
                              </div>
                            )}
                            <span className={`text-[0.65rem] font-semibold uppercase tracking-wider px-2 py-px rounded-full ${t.status === 'published' ? 'bg-lime/15 text-lime' : 'bg-white/7 text-white/40'}`}>
                              {t.status}
                            </span>

                            {/* Toggle visibility */}
                            <button
                              onClick={() => toggleStatus(t)} disabled={toggling === t.id}
                              title={t.status === 'published' ? 'Hide' : 'Publish'}
                              className={`w-8 h-8 rounded-lg border flex items-center justify-center text-[0.78rem] transition-all duration-200 disabled:opacity-40 ${t.status === 'published' ? 'border-white/15 text-white/40 hover:border-amber-400/40 hover:text-amber-400' : 'border-lime/30 text-lime hover:bg-lime/10'}`}
                            >
                              {toggling === t.id
                                ? <i className="fas fa-circle-notch fa-spin" />
                                : <i className={`fas fa-${t.status === 'published' ? 'eye-slash' : 'eye'}`} />
                              }
                            </button>

                            {/* Delete — two-step confirm */}
                            {confirmDelete === t.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => doDelete(t.id)} disabled={deleting === t.id}
                                  className="h-8 px-2.5 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-[0.72rem] font-bold transition-colors hover:bg-red-500/30 disabled:opacity-40"
                                >
                                  {deleting === t.id ? <i className="fas fa-circle-notch fa-spin" /> : 'Delete'}
                                </button>
                                <button
                                  onClick={() => setConfirmDelete(null)}
                                  className="w-8 h-8 rounded-lg border border-white/10 text-white/40 text-[0.78rem] flex items-center justify-center hover:text-white/70 transition-colors"
                                >
                                  <i className="fas fa-times" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDelete(t.id)}
                                title="Delete testimonial"
                                className="w-8 h-8 rounded-lg border border-white/10 text-white/25 flex items-center justify-center text-[0.78rem] transition-all duration-200 hover:border-red-500/40 hover:text-red-400"
                              >
                                <i className="fas fa-trash" />
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="text-white/55 text-[0.85rem] leading-relaxed mt-2.5 m-0">&ldquo;{t.text}&rdquo;</p>

                        {/* Product photos if any */}
                        {t.product_photos && t.product_photos.length > 0 && (
                          <div className="flex gap-2 mt-2">
                            {t.product_photos.map((src, i) => (
                              <img key={i} src={src} alt="" className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        )}

        {/* ── Share links tab ─────────────────────────────────────────────── */}
        {tab === 'links' && (() => {
          const q = linkSearch.toLowerCase()
          const filteredProjects = designProjects.filter(p =>
            !q || p.title.toLowerCase().includes(q) || p.slug.includes(q) || p.category?.toLowerCase().includes(q)
          )
          const filteredShop = SHOP_LINKS.filter(s => !q || s.title.toLowerCase().includes(q))
          const filteredProducts = PRODUCTS.filter(p => !q || p.name.toLowerCase().includes(q) || p.type.includes(q))
          const totalVisible = filteredProjects.length + filteredShop.length + filteredProducts.length

          return (
          <div className="flex flex-col gap-8">
            {/* Search */}
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-white/25 text-[0.85rem] pointer-events-none" />
              <input
                type="search" value={linkSearch} onChange={e => setLinkSearch(e.target.value)}
                placeholder="Search projects or products…"
                className="w-full max-w-sm bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-white text-[0.88rem] outline-none focus:border-lime/40 placeholder:text-white/25 transition-colors"
              />
              {linkSearch && (
                <span className="ml-3 text-white/30 text-[0.78rem]">{totalVisible} result{totalVisible !== 1 ? 's' : ''}</span>
              )}
            </div>

            <p className="text-white/30 text-[0.8rem] -mt-4">
              Click any card to copy its review link — only link holders can submit a review.
            </p>

            {/* Design projects grid */}
            {filteredProjects.length > 0 && (
            <section>
              <div className="flex items-baseline gap-3 mb-3">
                <p className="text-[0.7rem] uppercase tracking-[3px] text-white/35 m-0">Design Projects</p>
                <span className="text-white/20 text-[0.72rem]">{filteredProjects.length}{q ? ` of ${designProjects.length}` : ''}</span>
              </div>
              <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(130px,1fr))]">
                {filteredProjects.map(p => {
                  const url = `${origin}/testimonial/${p.slug}`
                  const count = countsBySlug[p.slug]
                  return (
                    <div key={p.slug} className="relative">
                      <LinkCard
                        image={p.primaryImage} title={p.title} color={p.color}
                        url={url} slug={p.slug} copied={copied} onCopy={() => copyLink(p.slug, url)}
                      />
                      {count > 0 && (
                        <span className="absolute top-1.5 left-1.5 bg-lime text-black text-[0.6rem] font-black px-1.5 py-px rounded-full leading-none pointer-events-none">
                          {count}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
            )}

            {/* Shop categories */}
            {filteredShop.length > 0 && (
            <section>
              <p className="text-[0.7rem] uppercase tracking-[3px] text-white/35 mb-3">Shop Categories</p>
              <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(130px,1fr))]">
                {filteredShop.map(s => {
                  const url = `${origin}${s.url}`
                  const count = countsBySlug[s.slug]
                  return (
                    <div key={s.slug} className="relative">
                      <LinkCard
                        icon={s.icon} title={s.title} color={s.color}
                        url={url} slug={s.slug} copied={copied} onCopy={() => copyLink(s.slug, url)}
                      />
                      {count > 0 && (
                        <span className="absolute top-1.5 left-1.5 bg-lime text-black text-[0.6rem] font-black px-1.5 py-px rounded-full leading-none pointer-events-none">
                          {count}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
            )}

            {/* Products grid */}
            {filteredProducts.length > 0 && (
            <section>
              <div className="flex items-baseline gap-3 mb-3">
                <p className="text-[0.7rem] uppercase tracking-[3px] text-white/35 m-0">Individual Products</p>
                <span className="text-white/20 text-[0.72rem]">{filteredProducts.length}{q ? ` of ${PRODUCTS.length}` : ''} · review form unlocked</span>
              </div>
              <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(130px,1fr))]">
                {filteredProducts.map(p => {
                  const url = `${origin}/product/${p.id}?review=1#reviews`
                  const count = countsBySlug[`product-${p.id}`]
                  const color = p.type === 'sticker' ? '#b1db00' : p.type === 'tshirt' ? '#00ddd7' : '#ff8c42'
                  const badge = p.type === 'sticker' ? 'Sticker' : p.type === 'tshirt' ? 'T-Shirt' : 'Helmet'
                  return (
                    <div key={p.id} className="relative">
                      <LinkCard
                        image={p.image} title={p.name} badge={badge} color={color}
                        url={url} slug={p.id} copied={copied} onCopy={() => copyLink(p.id, url)}
                      />
                      {count > 0 && (
                        <span className="absolute top-1.5 left-1.5 bg-lime text-black text-[0.6rem] font-black px-1.5 py-px rounded-full leading-none pointer-events-none">
                          {count}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
            )}

            {totalVisible === 0 && linkSearch && (
              <p className="text-white/30 text-[0.88rem] py-8 text-center">No results for &ldquo;{linkSearch}&rdquo;</p>
            )}
          </div>
          )
        })()}
      </div>
    </main>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function AdminTestimonials() {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const saved = sessionStorage.getItem('admin_token')
    if (saved) setToken(saved)
  }, [])

  if (!token) return <PasswordGate onAuth={t => setToken(t)} />
  return <Dashboard token={token} />
}
