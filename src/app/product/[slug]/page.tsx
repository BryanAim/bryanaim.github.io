'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { m, AnimatePresence } from 'framer-motion'
import {
  PRODUCTS, StickerProduct, TshirtProduct, HelmProduct, CatalogProduct, TshirtColorVariant,
} from '@/lib/products'
import {
  STICKER_PRESETS, TSHIRT_SIZE_PRICES, TSHIRT_COLORS, catalogStickerPrice,
  CartItem, loadCart, saveCart, TshirtColor,
} from '@/lib/shopTypes'
import type { Testimonial } from '@/lib/db'
import { TestimonialCard } from '@/app/components/TestimonialCard'
import { compressImage } from '@/lib/imageCompress'

const COLOR_HEX: Record<string, string> = {
  black: '#1a1a1a', white: '#e8e8e8', navy: '#1e3a5f', red: '#c0392b',
  forest: '#2d6a4f', green: '#27ae60', teal: '#00897b', blue: '#2563eb',
  yellow: '#f1c40f', orange: '#e67e22', pink: '#e91e8c', purple: '#7c3aed',
  grey: '#888888', gray: '#888888', brown: '#795548', gold: '#f59e0b',
}

const inputCls = 'w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-4 py-3 text-white text-[0.92rem] placeholder:text-white/25 outline-none transition-colors duration-200 focus:border-lime/50 focus:bg-white/[0.07]'

// ─── Inline star rating ───────────────────────────────────────────────────────
function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  const display = hovered || value
  return (
    <div className="flex gap-2" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n} type="button" role="radio" aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          className="text-[1.5rem] transition-transform duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime rounded"
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

// ─── Inline photo upload ──────────────────────────────────────────────────────
function PhotoUpload({ file, onFile, label }: { file: File | null; onFile: (f: File | null) => void; label: string }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [compressing, setCompressing] = useState(false)
  const preview = file ? URL.createObjectURL(file) : null

  const handleFile = useCallback(async (f: File) => {
    if (f.size > 10 * 1024 * 1024) { alert('Photo must be under 10 MB'); return }
    setCompressing(true)
    try { f = await compressImage(f) } catch { /* use original */ }
    setCompressing(false)
    onFile(f)
  }, [onFile])

  return (
    <div
      role="button" tabIndex={0} aria-label={`Upload: ${label}`}
      className={`flex items-center gap-3 border-2 border-dashed rounded-xl px-4 py-3 cursor-pointer transition-colors duration-200 ${dragOver ? 'border-lime/60 bg-lime/5' : 'border-white/15 hover:border-white/30'}`}
      onClick={() => inputRef.current?.click()}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click() } }}
      onDragOver={e => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
    >
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
      {preview
        ? <img src={preview} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-white/20 shrink-0" />
        : <div className="w-12 h-12 rounded-lg bg-white/[0.06] border border-white/15 flex items-center justify-center text-white/30 shrink-0"><i className="fas fa-image" /></div>
      }
      <div className="flex-1 min-w-0">
        <p className="text-[0.83rem] text-white/65 m-0 truncate">{compressing ? 'Compressing…' : file ? file.name : label}</p>
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

// ─── Review form ─────────────────────────────────────────────────────────────
function ReviewForm({ projectSlug, onSubmitted }: { projectSlug: string; onSubmitted: () => void }) {
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [rating, setRating] = useState(0)
  const [photo1, setPhoto1] = useState<File | null>(null)
  const [photo2, setPhoto2] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || text.length < 20) return
    setLoading(true); setError('')
    const fd = new FormData()
    fd.append('name', name.trim())
    fd.append('text', text.trim())
    fd.append('project_slug', projectSlug)
    if (rating > 0) fd.append('rating', String(rating))
    if (photo1) fd.append('product_photo_1', photo1)
    if (photo2) fd.append('product_photo_2', photo2)
    fd.append('website', '')
    try {
      const res = await fetch('/api/testimonials/submit', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Something went wrong'); setLoading(false); return }
      setDone(true)
      onSubmitted()
    } catch {
      setError('Network error — please try again')
      setLoading(false)
    }
  }

  if (done) {
    return (
      <m.div
        className="text-center py-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-4xl mb-3">🎉</div>
        <p className="text-white font-bold text-lg mb-1">Thanks for your review!</p>
        <p className="text-white/50 text-[0.85rem]">It&apos;s live on the site now.</p>
      </m.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-[0.78rem] font-semibold uppercase tracking-[1.5px] text-white/50 mb-2">
          Your rating
        </label>
        <StarInput value={rating} onChange={setRating} />
      </div>

      <div>
        <label className="block text-[0.78rem] font-semibold uppercase tracking-[1.5px] text-white/50 mb-2">
          Your name <span className="text-lime">*</span>
        </label>
        <input type="text" value={name} onChange={e => setName(e.target.value)}
          placeholder="Jane Mwangi" maxLength={120} required className={inputCls} />
      </div>

      <div>
        <label className="block text-[0.78rem] font-semibold uppercase tracking-[1.5px] text-white/50 mb-2">
          Your review <span className="text-lime">*</span>
        </label>
        <textarea value={text} onChange={e => setText(e.target.value)}
          placeholder="The quality is amazing, the print is crisp and it arrived quickly…"
          maxLength={1000} required rows={4} className={`${inputCls} resize-none`} />
        <p className={`text-[0.72rem] mt-1 ${text.length > 0 && text.length < 20 ? 'text-amber-400' : 'text-white/30'}`}>
          {text.length < 20
            ? `${20 - text.length} more character${20 - text.length === 1 ? '' : 's'} needed`
            : `${text.length}/1000`}
        </p>
      </div>

      <div>
        <label className="block text-[0.78rem] font-semibold uppercase tracking-[1.5px] text-white/50 mb-2">
          Product photos <span className="text-white/25 normal-case tracking-normal font-normal">(optional — show off your order!)</span>
        </label>
        <div className="flex flex-col gap-3">
          <PhotoUpload file={photo1} onFile={setPhoto1} label="Photo 1 — tap to upload" />
          <PhotoUpload file={photo2} onFile={setPhoto2} label="Photo 2 — tap to upload" />
        </div>
      </div>

      <input type="text" name="website" tabIndex={-1} aria-hidden="true" className="hidden" />

      <AnimatePresence>
        {error && (
          <m.p className="text-red-400 text-[0.85rem] bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3"
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <i className="fas fa-exclamation-circle mr-2" />{error}
          </m.p>
        )}
      </AnimatePresence>

      <button
        type="submit" disabled={loading || !name.trim() || text.length < 20}
        className="py-3 rounded-xl font-black text-[0.88rem] uppercase tracking-[2px] bg-lime text-black transition-opacity duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? <><i className="fas fa-circle-notch fa-spin mr-2" />Submitting…</> : <><i className="fas fa-paper-plane mr-2" />Submit Review</>}
      </button>
    </form>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const searchParams = useSearchParams()
  const canReview = searchParams.get('review') === '1'
  const product = PRODUCTS.find(p => p.id === slug) as CatalogProduct | undefined

  const [activeImage, setActiveImage] = useState(product?.image ?? '')
  const [selectedColor, setSelectedColor] = useState<TshirtColor>(TSHIRT_COLORS[0])
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedPreset, setSelectedPreset] = useState(STICKER_PRESETS[0])
  const [cart, setCart] = useState<CartItem[]>([])
  const [addedFeedback, setAddedFeedback] = useState(false)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [reviewKey, setReviewKey] = useState(0)

  useEffect(() => { setCart(loadCart()) }, [])

  const projectSlug = `product-${slug}`

  const fetchReviews = useCallback(() => {
    fetch(`/api/testimonials?project=${encodeURIComponent(projectSlug)}`)
      .then(r => r.json())
      .then(setTestimonials)
      .catch(() => {})
  }, [projectSlug])

  useEffect(() => { fetchReviews() }, [fetchReviews])

  const updateCart = useCallback((next: CartItem[]) => { setCart(next); saveCart(next) }, [])

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-5xl mb-4">🔍</p>
          <h1 className="text-2xl font-bold mb-3">Product not found</h1>
          <p className="text-white/50 mb-6">This product doesn&apos;t exist or has been removed.</p>
          <Link href="/shop" className="text-lime hover:underline">← Back to Shop</Link>
        </div>
      </main>
    )
  }

  const sticker = product.type === 'sticker' ? product as StickerProduct : null
  const tshirt = product.type === 'tshirt' ? product as TshirtProduct : null
  const helmet = product.type === 'helmet' ? product as HelmProduct : null

  // Build all gallery images
  const galleryImages: { src: string; label: string }[] = []
  if (tshirt?.colorVariants) {
    for (const v of tshirt.colorVariants) {
      galleryImages.push({ src: v.image, label: v.colorLabel })
      if (v.modelImage) galleryImages.push({ src: v.modelImage, label: `${v.colorLabel} — model` })
    }
  } else if (sticker?.variants) {
    for (const v of sticker.variants) {
      galleryImages.push({ src: v.image, label: v.colorLabel })
    }
  } else if (helmet?.views) {
    for (const v of helmet.views) {
      galleryImages.push({ src: v.src, label: v.label })
    }
  } else {
    galleryImages.push({ src: product.image, label: product.name })
  }

  const price = product.type === 'sticker'
    ? catalogStickerPrice(product.price, selectedPreset)
    : product.type === 'tshirt' && selectedSize
      ? TSHIRT_SIZE_PRICES[selectedSize]
      : product.price

  const canAdd = product.type === 'sticker' || product.type === 'helmet' || (product.type === 'tshirt' && !!selectedSize)

  const addToCart = () => {
    if (!canAdd) return
    const cartId = product.type === 'tshirt'
      ? `${product.id}-${selectedColor.name}-${selectedSize}`
      : product.type === 'helmet'
        ? product.id
        : `${product.id}-${selectedPreset.label}`
    const itemName = product.type === 'sticker' ? `${product.name} (${selectedPreset.label})` : product.name
    const existing = cart.find(i => i.cartId === cartId)
    const next = existing
      ? cart.map(i => i.cartId === cartId ? { ...i, quantity: i.quantity + 1 } : i)
      : [...cart, {
          cartId, productId: product.id, name: itemName, price, image: activeImage || product.image,
          quantity: 1, type: product.type,
          ...(product.type === 'tshirt' && { color: selectedColor, size: selectedSize }),
          ...(product.type === 'sticker' && { widthCm: selectedPreset.widthCm, heightCm: selectedPreset.heightCm }),
        }]
    updateCart(next)
    setAddedFeedback(true)
  }

  return (
    <main className="py-10 px-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[0.8rem] text-white/40 mb-8">
        <Link href="/shop" className="hover:text-lime transition-colors">Shop</Link>
        <span>/</span>
        <span className="text-white/70 truncate">{product.name}</span>
      </nav>

      {/* Product hero */}
      <m.div
        className="grid grid-cols-2 gap-10 mb-16 max-md:grid-cols-1"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Gallery */}
        <div className="flex flex-col gap-3">
          <div className="relative select-none overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
            <img
              src={activeImage || product.image}
              alt={product.name}
              className={`w-full object-cover pointer-events-none block ${product.type === 'tshirt' ? 'aspect-3/4' : 'aspect-square'}`}
              draggable={false}
              onContextMenu={e => e.preventDefault()}
            />
          </div>
          {galleryImages.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {galleryImages.map((g, i) => (
                <button
                  key={i}
                  title={g.label}
                  onClick={() => setActiveImage(g.src)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all duration-150 hover:scale-110 ${(activeImage || product.image) === g.src ? 'border-lime scale-110' : 'border-white/15'}`}
                >
                  <img src={g.src} alt={g.label} className="w-full h-full object-cover pointer-events-none" draggable={false} onContextMenu={e => e.preventDefault()} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-[0.72rem] uppercase tracking-[3px] text-teal mb-1">
              {product.type === 'sticker' ? 'Sticker' : product.type === 'tshirt' ? 'T-Shirt' : 'Helmet'}
            </p>
            <h1 className="text-[clamp(1.6rem,5vw,2.4rem)] font-extrabold text-lime leading-tight m-0">
              {product.name}
            </h1>
            {testimonials.length > 0 && (() => {
              const rated = testimonials.filter(t => t.rating != null)
              const avg = rated.length > 0 ? rated.reduce((s, t) => s + t.rating!, 0) / rated.length : null
              return (
                <a href="#reviews" className="inline-flex items-center gap-1.5 mt-2 no-underline group">
                  {avg != null && (
                    <span className="text-yellow-400/90 text-[0.9rem] font-bold group-hover:text-yellow-300 transition-colors">
                      ★ {avg.toFixed(1)}
                    </span>
                  )}
                  <span className="text-white/40 text-[0.82rem] group-hover:text-white/60 transition-colors underline underline-offset-2">
                    {testimonials.length} {testimonials.length === 1 ? 'review' : 'reviews'}
                  </span>
                </a>
              )
            })()}
          </div>

          <p className="text-[1.3rem] font-bold text-white">
            KES {price.toLocaleString()}
            {product.type === 'sticker' && (
              <span className="text-white/40 text-[0.85rem] font-normal ml-2">({selectedPreset.widthCm}×{selectedPreset.heightCm} cm)</span>
            )}
          </p>

          <p className="text-white/70 leading-[1.7] text-[0.95rem]">{product.description}</p>

          {/* Sticker options */}
          {sticker && (
            <>
              {sticker.variants && sticker.variants.length > 1 && (
                <div>
                  <p className="text-[0.8rem] text-white/50 uppercase tracking-[0.08em] mb-2">
                    Colour — <span className="text-white normal-case">
                      {sticker.variants.find(v => v.image === (activeImage || product.image))?.colorLabel ?? sticker.variants[0].colorLabel}
                    </span>
                  </p>
                </div>
              )}
              <div>
                <p className="text-[0.8rem] text-white/50 uppercase tracking-[0.08em] mb-2">Size</p>
                <div className="flex gap-2 flex-wrap">
                  {STICKER_PRESETS.map(preset => (
                    <button
                      key={preset.label}
                      className={`flex flex-col items-center gap-[0.1rem] px-[0.9rem] py-[0.5rem] border-2 bg-transparent cursor-pointer rounded-lg min-w-[72px] transition-all duration-150 hover:border-lime ${selectedPreset.label === preset.label ? 'border-lime bg-lime/10' : 'border-white/20'}`}
                      onClick={() => setSelectedPreset(preset)}
                    >
                      <span className="text-white text-[0.85rem] font-bold">{preset.label}</span>
                      <span className="text-white/40 text-[0.7rem]">{preset.widthCm}×{preset.heightCm}cm</span>
                      <span className="text-lime text-[0.78rem] font-bold">KES {catalogStickerPrice(product.price, preset).toLocaleString()}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[0.8rem] text-white/50 uppercase tracking-[0.08em] mb-2">Works on</p>
                <div className="flex flex-wrap gap-2">
                  {sticker.canUseOn.map(u => (
                    <span key={u} className="text-[0.78rem] border border-white/20 text-white/60 px-3 py-[0.2rem] rounded-full">{u}</span>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* T-shirt options */}
          {tshirt && (
            <>
              <div>
                <p className="text-[0.8rem] text-white/50 uppercase tracking-[0.08em] mb-2">
                  Colour — <span className="text-white normal-case">{selectedColor.label}</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {(tshirt.colorVariants ?? []).map(v => {
                    const hex = COLOR_HEX[v.color] ?? '#888'
                    const isActive = selectedColor.name === v.color
                    return (
                      <button
                        key={v.color}
                        className={`w-7 h-7 rounded-full border-[3px] cursor-pointer shrink-0 transition-all duration-150 hover:scale-110 ${isActive ? 'scale-110' : ''}`}
                        style={{ background: hex, borderColor: isActive ? '#b1db00' : (v.color === 'white' ? '#888' : 'transparent') }}
                        title={v.colorLabel}
                        onClick={() => {
                          setSelectedColor({ name: v.color, hex, label: v.colorLabel })
                          setActiveImage(v.image)
                        }}
                      />
                    )
                  })}
                </div>
              </div>
              <div>
                <p className="text-[0.8rem] text-white/50 uppercase tracking-[0.08em] mb-2">
                  Size {!selectedSize && <span className="text-red-400 normal-case">— required</span>}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {tshirt.sizes.map(s => (
                    <button
                      key={s}
                      className={`flex flex-col items-center px-4 py-2 border bg-transparent cursor-pointer rounded-lg transition-all duration-150 hover:border-lime hover:text-white ${selectedSize === s ? 'border-lime bg-lime/10 text-white font-bold' : 'border-white/20 text-white/60'}`}
                      onClick={() => setSelectedSize(s)}
                    >
                      <span className="text-[0.88rem]">{s}</span>
                      <span className="text-[0.72rem] text-white/40">KES {TSHIRT_SIZE_PRICES[s].toLocaleString()}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Helmet info */}
          {helmet && (
            <div className="flex flex-wrap gap-2">
              <span className="text-[0.78rem] border border-white/20 text-white/60 px-3 py-[0.2rem] rounded-full">EX-UK</span>
              <span className="text-[0.78rem] border border-white/20 text-white/60 px-3 py-[0.2rem] rounded-full capitalize">{helmet.color}</span>
              {helmet.brand && <span className="text-[0.78rem] border border-white/20 text-white/60 px-3 py-[0.2rem] rounded-full">{helmet.brand}</span>}
            </div>
          )}

          {/* Add to cart */}
          {addedFeedback ? (
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-2 bg-lime/10 border border-lime/30 rounded-xl px-4 py-3">
                <i className="fas fa-check-circle text-lime" />
                <span className="text-lime font-bold text-[0.9rem]">Added to cart!</span>
              </div>
              <div className="flex gap-3">
                <button
                  className="flex-1 bg-transparent border border-white/20 text-white/70 px-4 py-3 font-semibold text-[0.85rem] cursor-pointer rounded-xl hover:border-lime hover:text-white transition-colors"
                  onClick={addToCart}
                >
                  + Add Another
                </button>
                <Link
                  href="/shop/checkout"
                  className="flex-1 bg-lime text-black px-4 py-3 font-black text-[0.9rem] uppercase tracking-wide cursor-pointer rounded-xl hover:bg-[#c8f500] transition-colors text-center"
                >
                  Checkout →
                </Link>
              </div>
            </div>
          ) : (
            <button
              disabled={!canAdd}
              onClick={addToCart}
              className="py-4 rounded-xl font-black text-[0.9rem] uppercase tracking-[2px] bg-lime text-black cursor-pointer hover:bg-[#c8f500] transition-colors disabled:bg-white/10 disabled:text-white/30 disabled:cursor-not-allowed"
            >
              {product.type === 'tshirt' && !selectedSize
                ? 'Select a size to continue'
                : `Add to Cart — KES ${price.toLocaleString()}`}
            </button>
          )}

          <p className="text-[0.72rem] text-white/30">
            Delivered Kenya-wide via courier. Pickup available in Nakuru.{' '}
            <Link href="/shop/checkout" className="text-lime/60 hover:text-lime transition-colors">Checkout →</Link>
          </p>
        </div>
      </m.div>

      {/* Reviews */}
      <section className="border-t border-white/[0.07] pt-12">
        <div className="flex items-baseline justify-between mb-8 flex-wrap gap-3">
          <div>
            <p className="text-[0.72rem] uppercase tracking-[4px] text-white/30 mb-1">Verified buyers</p>
            <h2 className="text-[1.8rem] font-extrabold m-0">
              Customer <span className="text-lime">Reviews</span>
              {testimonials.length > 0 && (
                <span className="text-white/30 text-[1rem] font-normal ml-3">({testimonials.length})</span>
              )}
            </h2>
          </div>
        </div>

        {testimonials.length > 0 ? (
          <div className="grid grid-cols-3 gap-5 mb-12 max-[900px]:grid-cols-2 max-sm:grid-cols-1">
            {testimonials.map((t, i) => (
              <TestimonialCard key={t.id} t={t} delay={i * 0.06} />
            ))}
          </div>
        ) : (
          <p className="text-white/30 text-[0.9rem] mb-12">
            {canReview ? 'No reviews yet — be the first!' : 'No reviews yet.'}
          </p>
        )}

        {/* Review form — only accessible via invite link (?review=1) */}
        {canReview ? (
          <div className="max-w-140" id="reviews">
            <h3 className="text-[1.2rem] font-bold mb-6">Leave a review</h3>
            <ReviewForm
              key={reviewKey}
              projectSlug={projectSlug}
              onSubmitted={() => { fetchReviews(); setReviewKey(k => k + 1) }}
            />
          </div>
        ) : (
          <div id="reviews" className="max-w-120 flex items-center gap-4 p-5 rounded-xl border border-white/[0.07] bg-white/3">
            <i className="fas fa-lock text-white/20 text-xl shrink-0" />
            <div>
              <p className="text-white/60 text-[0.88rem] m-0 font-semibold">Invite-only reviews</p>
              <p className="text-white/30 text-[0.78rem] m-0 mt-0.75">
                Reviews are by invitation. If you purchased this product, ask Brian for a review link.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Related products */}
      {(() => {
        const related = PRODUCTS.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4)
        if (related.length === 0) return null
        return (
          <section className="border-t border-white/[0.07] pt-12 mt-4">
            <p className="text-[0.72rem] uppercase tracking-[4px] text-white/30 mb-1">More like this</p>
            <h2 className="text-[1.5rem] font-extrabold mb-8">
              Related <span className="text-lime">Products</span>
            </h2>
            <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]">
              {related.map(p => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="bg-[#515151] border-b-4 border-lime block no-underline overflow-hidden transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className={`w-full object-cover block border-b-2 border-[#333] pointer-events-none ${p.type === 'tshirt' ? 'aspect-3/4' : 'aspect-square'}`}
                    draggable={false}
                    onContextMenu={e => e.preventDefault()}
                  />
                  <div className="px-3 py-3">
                    <h3 className="text-lime text-[0.88rem] font-bold leading-[1.3] mb-1">{p.name}</h3>
                    <p className="text-white text-[0.82rem]">
                      {p.type === 'tshirt'
                        ? `From KES ${Math.min(...p.sizes.map(s => TSHIRT_SIZE_PRICES[s])).toLocaleString()}`
                        : p.type === 'helmet'
                          ? `KES ${p.price.toLocaleString()}`
                          : `From KES ${catalogStickerPrice(p.price, STICKER_PRESETS[0]).toLocaleString()}`}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )
      })()}
    </main>
  )
}
