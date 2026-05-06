'use client'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { designProjects } from '../../../work/designProjects'
import { Suspense } from 'react'

const VIRTUAL_TITLES: Record<string, string> = {
  'shop-stickers': 'Sticker Packs',
  'shop-tshirts': 'Custom T-Shirts',
  'shop-custom': 'Custom Design Order',
}

function SuccessContent() {
  const { slug } = useParams<{ slug: string }>()
  const params = useSearchParams()
  const name = params.get('name') ?? 'there'

  const dp = designProjects.find(p => p.slug === slug)
  const projectTitle = dp?.title ?? VIRTUAL_TITLES[slug] ?? 'this project'
  const projectColor = dp?.color ?? '#b1db00'
  const backHref = dp ? `/work/design/${slug}` : slug.startsWith('shop') ? '/shop' : '/'

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        className="text-center max-w-[480px]"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Checkmark */}
        <motion.div
          className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mx-auto mb-8 border-2"
          style={{ borderColor: projectColor, color: projectColor, background: `${projectColor}15` }}
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <i className="fas fa-check" />
        </motion.div>

        <motion.h1
          className="text-[1.8rem] font-extrabold mb-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Thank you, <span style={{ color: projectColor }}>{name}!</span>
        </motion.h1>

        <motion.p
          className="text-white/55 leading-[1.75] text-[0.95rem] mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Your testimonial for <strong className="text-white/80">{projectTitle}</strong> has been
          published on the portfolio. It means a lot — genuinely.
        </motion.p>

        <motion.div
          className="flex gap-3 justify-center flex-wrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[0.88rem] uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: projectColor, color: '#000' }}
          >
            <i className="fas fa-arrow-left" />
            {dp ? 'View Project' : slug.startsWith('shop') ? 'Back to Shop' : 'Portfolio'}
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[0.88rem] uppercase tracking-wider border border-white/15 text-white/60 bg-white/[0.04] transition-all duration-200 hover:border-white/30 hover:text-white"
          >
            Home
          </Link>
        </motion.div>
      </motion.div>
    </main>
  )
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
