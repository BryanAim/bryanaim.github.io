'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TestimonialStripeCard } from './TestimonialCard'
import type { Testimonial } from '@/lib/db'

export function TestimonialsStrip() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  useEffect(() => {
    fetch('/api/testimonials')
      .then(r => r.json())
      .then((data: Testimonial[]) => setTestimonials(data.slice(0, 12)))
      .catch(() => {})
  }, [])

  if (testimonials.length === 0) return null

  // Duplicate for seamless marquee loop
  const doubled = [...testimonials, ...testimonials]

  return (
    <motion.section
      className="py-16 border-t border-white/[0.06] overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7 }}
    >
      <p className="text-[0.72rem] uppercase tracking-[4px] text-white text-center mb-8">
        What clients say
      </p>
      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#1a1a1a] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#1a1a1a] to-transparent" />
        <div className="testimonials-marquee flex">
          {doubled.map((t, i) => (
            <TestimonialStripeCard key={`${t.id}-${i}`} t={t} />
          ))}
        </div>
      </div>
    </motion.section>
  )
}
