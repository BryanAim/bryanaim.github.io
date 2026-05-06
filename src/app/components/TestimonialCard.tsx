'use client'
import { motion } from 'framer-motion'
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

function Stars({ rating }: { rating: number | null }) {
  if (!rating) return null
  return (
    <div className="flex gap-[3px] mb-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <i key={i} className={`fas fa-star text-[0.8rem] ${i < rating ? 'text-lime' : 'text-white/20'}`} />
      ))}
    </div>
  )
}

export function TestimonialCard({ t, delay = 0 }: { t: Testimonial; delay?: number }) {
  const hasProductPhotos = t.product_photos && t.product_photos.length > 0

  return (
    <motion.div
      className="flex flex-col gap-0 bg-white/[0.04] border border-white/[0.08] rounded-xl p-5 h-full"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <Stars rating={t.rating} />
      <p className="text-white/70 leading-[1.75] text-[0.9rem] italic flex-1 mb-4">
        &ldquo;{t.text}&rdquo;
      </p>

      {/* Product photos — shown for shop reviews */}
      {hasProductPhotos && (
        <div className={`grid gap-2 mb-4 ${t.product_photos!.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {t.product_photos!.map((src, i) => (
            <img
              key={i} src={src} alt={`Product photo ${i + 1}`}
              className="w-full aspect-square object-cover rounded-lg border border-white/10"
            />
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 pt-3 border-t border-white/[0.07]">
        {/* Show profile photo only if no product photos */}
        {!hasProductPhotos && (
          t.photo_data
            ? <img src={t.photo_data} alt={t.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
            : <InitialsAvatar name={t.name} size={40} />
        )}
        <div className="min-w-0">
          <p className="text-white font-bold text-[0.88rem] m-0 truncate">{t.name}</p>
          {(t.role || t.company) && (
            <p className="text-white/40 text-[0.73rem] m-0 truncate">
              {[t.role, t.company].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export function TestimonialsGrid({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null
  return (
    <div className="grid grid-cols-3 gap-5 max-[900px]:grid-cols-2 max-sm:grid-cols-1">
      {testimonials.map((t, i) => (
        <TestimonialCard key={t.id} t={t} delay={i * 0.07} />
      ))}
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
