'use client'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import type { Testimonial } from '@/lib/db'

function InitialsAvatar({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name.split(' ').map(w => w[0] ?? '').slice(0, 2).join('').toUpperCase()
  const hue = Array.from(name).reduce((h, c) => (Math.imul(31, h) + c.charCodeAt(0)) | 0, 0)
  const bg = `hsl(${Math.abs(hue) % 360}, 55%, 38%)`
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: bg, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 700, fontSize: size * 0.38, fontFamily: 'inherit',
    }}>
      {initials}
    </div>
  )
}

function Stars({ rating, size = '0.75rem' }: { rating: number | null; size?: string }) {
  if (!rating) return null
  return (
    <div className="flex gap-[3px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <i key={i} className={`fas fa-star ${i < rating ? 'text-lime' : 'text-white/20'}`} style={{ fontSize: size }} />
      ))}
    </div>
  )
}

/* ─── Full Review Modal ─── */
function ReviewModal({ t, onClose }: { t: Testimonial; onClose: () => void }) {
  return createPortal(
    <motion.div
      className="fixed inset-0 bg-black/80 z-[950] flex items-center justify-center p-6 backdrop-blur-[6px] max-[768px]:p-0 max-[768px]:items-end"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="bg-[#1e1e1e] border border-white/[0.1] rounded-2xl w-full max-w-[520px] max-h-[88vh] overflow-y-auto shadow-[0_30px_80px_rgba(0,0,0,0.7)] max-[768px]:max-w-full max-[768px]:rounded-t-[20px] max-[768px]:rounded-b-none max-[768px]:max-h-[92vh]"
        onClick={e => e.stopPropagation()}
        initial={{ y: 48, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 32, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07] sticky top-0 bg-[#1e1e1e] z-[1]">
          <Stars rating={t.rating} size="0.85rem" />
          <button
            className="bg-white/[0.07] border border-white/[0.12] text-white w-[30px] h-[30px] rounded-full text-[0.8rem] flex items-center justify-center hover:bg-white/[0.15] transition-colors"
            onClick={onClose}
          >✕</button>
        </div>

        <div className="p-5">
          {/* Product photos grid */}
          {t.product_photos && t.product_photos.length > 0 && (
            <div className={`grid gap-2 mb-5 ${t.product_photos.length === 1 ? 'grid-cols-1' : t.product_photos.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {t.product_photos.map((src, i) => (
                <img
                  key={i} src={src} alt={`Product photo ${i + 1}`}
                  className="w-full aspect-square object-cover rounded-lg border border-white/10"
                />
              ))}
            </div>
          )}

          {/* Review text */}
          <p className="text-white/80 leading-[1.8] text-[0.95rem] italic mb-5">
            &ldquo;{t.text}&rdquo;
          </p>

          {/* Author */}
          <div className="flex items-center gap-3 pt-4 border-t border-white/[0.07]">
            {t.photo_data
              ? <img src={t.photo_data} alt={t.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
              : <InitialsAvatar name={t.name} size={40} />
            }
            <div className="min-w-0">
              <p className="text-white font-bold text-[0.9rem] m-0 truncate">{t.name}</p>
              {(t.role || t.company) && (
                <p className="text-white/40 text-[0.75rem] m-0 truncate">
                  {[t.role, t.company].filter(Boolean).join(' · ')}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  )
}

/* ─── Product Review Card (photo-forward) ─── */
function ProductReviewCard({ t, delay = 0 }: { t: Testimonial; delay?: number }) {
  const [open, setOpen] = useState(false)
  const firstPhoto = t.product_photos![0]

  return (
    <>
      <motion.div
        className="group relative rounded-xl overflow-hidden cursor-pointer aspect-square border border-white/[0.08] hover:border-lime/40 transition-colors duration-200"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => setOpen(true)}
      >
        {/* Product photo */}
        <img
          src={firstPhoto} alt="Product"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Extra photos badge */}
        {t.product_photos!.length > 1 && (
          <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-sm border border-white/20 text-white/80 text-[0.68rem] font-bold px-2 py-0.5 rounded-full">
            +{t.product_photos!.length - 1}
          </div>
        )}

        {/* Stars badge */}
        {t.rating && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-sm border border-lime/30 rounded-full px-2 py-1">
            <Stars rating={t.rating} size="0.65rem" />
          </div>
        )}

        {/* Bottom text */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-white/80 text-[0.78rem] leading-[1.45] italic line-clamp-2 mb-2">
            &ldquo;{t.text}&rdquo;
          </p>
          <div className="flex items-center gap-2">
            {t.photo_data
              ? <img src={t.photo_data} alt={t.name} className="w-6 h-6 rounded-full object-cover shrink-0 border border-white/20" />
              : <InitialsAvatar name={t.name} size={24} />
            }
            <span className="text-white font-semibold text-[0.75rem] truncate">{t.name}</span>
          </div>
        </div>

        {/* Expand hint */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-black/50 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 text-white/80 text-[0.72rem] font-semibold flex items-center gap-1.5">
            <i className="fas fa-expand-alt text-[0.65rem]" /> View review
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {open && <ReviewModal t={t} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  )
}

/* ─── Text Testimonial Card (compact) ─── */
export function TestimonialCard({ t, delay = 0 }: { t: Testimonial; delay?: number }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <motion.div
        className="group flex flex-col gap-0 bg-white/[0.04] border border-white/[0.07] rounded-xl p-4 h-full cursor-pointer hover:border-white/[0.18] hover:bg-white/[0.06] transition-all duration-200"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => setOpen(true)}
      >
        <Stars rating={t.rating} />
        {t.rating && <div className="mb-2" />}
        <p className="text-white/65 leading-[1.7] text-[0.86rem] italic flex-1 mb-3 line-clamp-3">
          &ldquo;{t.text}&rdquo;
        </p>

        <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-2 min-w-0">
            {t.photo_data
              ? <img src={t.photo_data} alt={t.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
              : <InitialsAvatar name={t.name} size={32} />
            }
            <div className="min-w-0">
              <p className="text-white font-bold text-[0.82rem] m-0 truncate">{t.name}</p>
              {(t.role || t.company) && (
                <p className="text-white/35 text-[0.7rem] m-0 truncate">
                  {[t.role, t.company].filter(Boolean).join(' · ')}
                </p>
              )}
            </div>
          </div>
          <i className="fas fa-expand-alt text-white/20 text-[0.7rem] shrink-0 group-hover:text-white/50 transition-colors" />
        </div>
      </motion.div>

      <AnimatePresence>
        {open && <ReviewModal t={t} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  )
}

/* ─── Grid ─── */
export function TestimonialsGrid({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null

  const productReviews = testimonials.filter(t => t.product_photos && t.product_photos.length > 0)
  const textReviews = testimonials.filter(t => !t.product_photos || t.product_photos.length === 0)

  return (
    <div className="space-y-6">
      {/* Product review cards (photo-forward) */}
      {productReviews.length > 0 && (
        <div>
          <p className="text-[0.7rem] uppercase tracking-[3px] text-white/30 mb-3">Reviewed products</p>
          <div className="grid grid-cols-4 gap-3 max-[900px]:grid-cols-3 max-sm:grid-cols-2">
            {productReviews.map((t, i) => (
              <ProductReviewCard key={t.id} t={t} delay={i * 0.06} />
            ))}
          </div>
        </div>
      )}

      {/* Text testimonials */}
      {textReviews.length > 0 && (
        <div>
          {productReviews.length > 0 && (
            <p className="text-[0.7rem] uppercase tracking-[3px] text-white/30 mb-3">Service reviews</p>
          )}
          <div className="grid grid-cols-3 gap-4 max-[900px]:grid-cols-2 max-sm:grid-cols-1">
            {textReviews.map((t, i) => (
              <TestimonialCard key={t.id} t={t} delay={i * 0.06} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Compact horizontal card for the home page marquee strip
export function TestimonialStripeCard({ t }: { t: Testimonial }) {
  return (
    <div className="shrink-0 w-[300px] bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 mx-3">
      {t.rating && (
        <div className="flex gap-[3px] mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <i key={i} className={`fas fa-star text-[0.72rem] ${i < t.rating! ? 'text-lime' : 'text-white/20'}`} />
          ))}
        </div>
      )}
      <p className="text-white/65 text-[0.83rem] leading-[1.6] italic mb-3 line-clamp-3">
        &ldquo;{t.text}&rdquo;
      </p>
      <div className="flex items-center gap-2">
        {t.photo_data ? (
          <img src={t.photo_data} alt={t.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
        ) : (
          <InitialsAvatar name={t.name} size={32} />
        )}
        <div className="min-w-0">
          <p className="text-white font-bold text-[0.8rem] m-0 truncate">{t.name}</p>
          {(t.role || t.company) && (
            <p className="text-white/40 text-[0.68rem] m-0 truncate">{[t.role, t.company].filter(Boolean).join(' · ')}</p>
          )}
        </div>
      </div>
    </div>
  )
}
