'use client'
import { useParams, useRouter } from 'next/navigation'
import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { designProjects } from '../../work/designProjects'
import { compressImage } from '@/lib/imageCompress'

// ─── Virtual slugs for non-design-project contexts ───────────────────────────
const VIRTUAL: Record<string, { title: string; subtitle: string; image: string; color: string; viewUrl?: string }> = {
  'shop-stickers': {
    title: 'Sticker Packs',
    subtitle: 'Share your experience with your sticker order',
    image: '', color: '#00ddd7', viewUrl: '/shop',
  },
  'shop-tshirts': {
    title: 'Custom T-Shirts',
    subtitle: 'Share your experience with your t-shirt order',
    image: '', color: '#ff8c42', viewUrl: '/shop',
  },
  'shop-custom': {
    title: 'Custom Design Order',
    subtitle: 'Share your experience with your custom order',
    image: '', color: '#b1db00', viewUrl: '/shop/custom',
  },
}

const SHOP_SLUGS = new Set(Object.keys(VIRTUAL))
const isShopSlug = (slug: string) => SHOP_SLUGS.has(slug)

function resolveProject(slug: string): { title: string; subtitle: string; image: string; color: string; viewUrl?: string } | null {
  const dp = designProjects.find(p => p.slug === slug)
  if (dp) return { title: dp.title, subtitle: dp.description, image: dp.primaryImage, color: dp.color, viewUrl: `/work/design/${slug}` }
  const vp = VIRTUAL[slug]
  if (vp) return vp
  return null
}

// ─── Star rating input ────────────────────────────────────────────────────────
function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  const display = hovered || value
  return (
    <div className="flex gap-2" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n} type="button" role="radio" aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          className="text-[1.7rem] transition-transform duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime rounded"
          style={{ color: n <= display ? '#b1db00' : 'rgba(255,255,255,0.2)', transform: n <= display ? 'scale(1.15)' : 'scale(1)' }}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
        >
          <i className="fas fa-star" />
        </button>
      ))}
    </div>
  )
}

// ─── Single photo drop/click input ───────────────────────────────────────────
function PhotoInput({
  file, onFile, label, accept = 'image/jpeg,image/png,image/webp', compress = false,
}: {
  file: File | null; onFile: (f: File | null) => void
  label: string; accept?: string; compress?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [compressing, setCompressing] = useState(false)
  const preview = file ? URL.createObjectURL(file) : null

  const handleFile = useCallback(async (f: File) => {
    if (f.size > 10 * 1024 * 1024) { alert('Photo must be under 10 MB'); return }
    if (compress) {
      setCompressing(true)
      try { f = await compressImage(f) } catch { /* use original */ }
      setCompressing(false)
    }
    onFile(f)
  }, [onFile, compress])

  return (
    <div
      role="button" tabIndex={0} aria-label={`Upload: ${label}`}
      className={`relative flex items-center gap-4 border-2 border-dashed rounded-xl px-4 py-3 cursor-pointer transition-colors duration-200 ${dragOver ? 'border-lime/60 bg-lime/5' : 'border-white/15 hover:border-white/30'}`}
      onClick={() => inputRef.current?.click()}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click() } }}
      onDragOver={e => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
    >
      <input ref={inputRef} type="file" accept={accept} className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
      {preview ? (
        <img src={preview} alt="Preview" className="w-14 h-14 rounded-lg object-cover border border-white/20 shrink-0" />
      ) : (
        <div className="w-14 h-14 rounded-lg bg-white/[0.06] border border-white/15 flex items-center justify-center text-white/30 text-xl shrink-0">
          <i className="fas fa-image" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[0.85rem] text-white/65 m-0 truncate">{compressing ? 'Compressing…' : file ? file.name : label}</p>
        <p className="text-[0.71rem] text-white/30 m-0 mt-[2px]">JPG / PNG / WebP · optional</p>
      </div>
      {file && !compressing && (
        <button type="button" aria-label="Remove" className="text-white/25 hover:text-red-400 transition-colors text-sm shrink-0"
          onClick={e => { e.stopPropagation(); onFile(null) }}>
          <i className="fas fa-times" />
        </button>
      )}
    </div>
  )
}

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({ label, required, children, hint }: { label: string; required?: boolean; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-[0.78rem] font-semibold uppercase tracking-[1.5px] text-white/50 mb-2">
        {label}{required && <span className="text-lime ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-[0.72rem] text-white/30 mt-1">{hint}</p>}
    </div>
  )
}

const inputCls = 'w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-4 py-3 text-white text-[0.92rem] placeholder:text-white/25 outline-none transition-colors duration-200 focus:border-lime/50 focus:bg-white/[0.07]'

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function TestimonialForm() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const project = resolveProject(slug)
  const isShop = isShopSlug(slug)

  const [name, setName]             = useState('')
  const [role, setRole]             = useState('')
  const [company, setCompany]       = useState('')
  const [text, setText]             = useState('')
  const [rating, setRating]         = useState(0)
  // Profile photo (for project/design testimonials)
  const [photo, setPhoto]           = useState<File | null>(null)
  // Product photos (for shop reviews — up to 2, compressed)
  const [prodPhoto1, setProdPhoto1] = useState<File | null>(null)
  const [prodPhoto2, setProdPhoto2] = useState<File | null>(null)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')

  if (!project) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-[3rem] mb-4">🔍</p>
          <h1 className="text-2xl font-bold mb-3">Project not found</h1>
          <p className="text-white/50 mb-6">This link doesn&apos;t match a known project.</p>
          <Link href="/" className="text-lime hover:underline text-[0.9rem]">← Back to portfolio</Link>
        </div>
      </main>
    )
  }

  const hasImage = project.image && !project.image.endsWith('/')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !text.trim()) return
    setLoading(true); setError('')

    const fd = new FormData()
    fd.append('name', name.trim())
    fd.append('text', text.trim())
    fd.append('project_slug', slug)
    if (!isShop && role.trim())    fd.append('role', role.trim())
    if (!isShop && company.trim()) fd.append('company', company.trim())
    if (rating > 0) fd.append('rating', String(rating))
    if (!isShop && photo)  fd.append('photo', photo)
    if (isShop && prodPhoto1) fd.append('product_photo_1', prodPhoto1)
    if (isShop && prodPhoto2) fd.append('product_photo_2', prodPhoto2)
    fd.append('website', '') // honeypot

    try {
      const res = await fetch('/api/testimonials/submit', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Something went wrong'); setLoading(false); return }
      router.push(`/testimonial/${slug}/success?name=${encodeURIComponent(name.trim())}`)
    } catch {
      setError('Network error — please try again')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen py-12 px-4 flex items-start justify-center">
      <motion.div
        className="w-full max-w-[560px]"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Project header */}
        <div className="rounded-xl overflow-hidden mb-8 border-t-[3px]" style={{ borderColor: project.color }}>
          {hasImage && (
            <div className="relative h-40 overflow-hidden">
              <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(18,18,18,0.95) 100%)' }} />
            </div>
          )}
          <div className={`px-6 py-5 bg-[#1c1c1c] ${hasImage ? '-mt-10 relative' : ''}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-[0.68rem] uppercase tracking-[3px] mb-1" style={{ color: project.color }}>
                  {isShop ? 'You\'re reviewing' : 'You\'re leaving feedback for'}
                </p>
                <h1 className="text-[1.4rem] font-extrabold text-white m-0 leading-tight">{project.title}</h1>
                {project.subtitle && (
                  <p className="text-[0.82rem] text-white/45 mt-1 m-0 line-clamp-2">{project.subtitle}</p>
                )}
              </div>
              {project.viewUrl && (
                <a
                  href={project.viewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 flex items-center gap-1 text-[0.72rem] font-semibold mt-1 px-3 py-1 rounded-lg border transition-colors duration-200 no-underline"
                  style={{ borderColor: `${project.color}40`, color: project.color }}
                >
                  <i className="fas fa-external-link-alt text-[0.65rem]" />
                  View
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Field label="Your rating">
            <StarInput value={rating} onChange={setRating} />
          </Field>

          <Field label="Your name" required>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Jane Mwangi" maxLength={120} required className={inputCls} />
          </Field>

          {/* Show role/company only for non-shop testimonials */}
          {!isShop && (
            <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
              <Field label="Role / Title">
                <input type="text" value={role} onChange={e => setRole(e.target.value)}
                  placeholder="Marketing Manager" maxLength={100} className={inputCls} />
              </Field>
              <Field label="Company">
                <input type="text" value={company} onChange={e => setCompany(e.target.value)}
                  placeholder="Acme Ltd" maxLength={100} className={inputCls} />
              </Field>
            </div>
          )}

          <Field
            label={isShop ? 'Your review' : 'Your testimonial'}
            required
            hint={`${text.length}/1000 characters (min 20)`}
          >
            <textarea
              value={text} onChange={e => setText(e.target.value)}
              placeholder={isShop
                ? 'The quality is amazing, the print is crisp and the sticker held up really well…'
                : 'Brian\'s work was exceptional. The logo captured exactly what our brand stands for…'
              }
              maxLength={1000} required rows={5} className={`${inputCls} resize-none`}
            />
          </Field>

          {/* Profile photo for design/project testimonials */}
          {!isShop && (
            <Field label="Profile photo">
              <PhotoInput
                file={photo} onFile={setPhoto}
                label="Upload a profile photo (optional)"
              />
            </Field>
          )}

          {/* Product photos for shop reviews */}
          {isShop && (
            <Field
              label="Product photos (optional)"
              hint="Show off your order — sticker on your laptop, shirt you're wearing, etc."
            >
              <div className="flex flex-col gap-3">
                <PhotoInput
                  file={prodPhoto1} onFile={setProdPhoto1}
                  label="Photo 1 — tap to upload" compress
                />
                <PhotoInput
                  file={prodPhoto2} onFile={setProdPhoto2}
                  label="Photo 2 — tap to upload" compress
                />
              </div>
            </Field>
          )}

          {/* Honeypot */}
          <input type="text" name="website" tabIndex={-1} aria-hidden="true" className="hidden" />

          <AnimatePresence>
            {error && (
              <motion.p
                className="text-red-400 text-[0.85rem] bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3"
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              >
                <i className="fas fa-exclamation-circle mr-2" />{error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit" disabled={loading || !name.trim() || text.length < 20}
            className="mt-2 w-full py-4 rounded-xl font-black text-[0.9rem] uppercase tracking-[2px] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: loading ? '#666' : project.color, color: '#000' }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <i className="fas fa-circle-notch fa-spin" /> Submitting…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <i className="fas fa-paper-plane" />
                {isShop ? 'Submit Review' : 'Submit Testimonial'}
              </span>
            )}
          </button>

          <p className="text-[0.72rem] text-white/25 text-center leading-relaxed">
            Your {isShop ? 'review' : 'testimonial'} will be published on the portfolio immediately.
            One submission per project per 24 hours.
          </p>
        </form>
      </motion.div>
    </main>
  )
}
