import type { Metadata } from 'next'
import AboutClient from './AboutClient'

const BASE = 'https://isalebryan.dev'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn about Brian Isale — Full Stack Developer, Creative Designer, and Community Builder based in Nakuru, Kenya. Google Africa Scholar, Andela alum, 6+ years building for Africa.',
  alternates: { canonical: `${BASE}/about` },
  openGraph: {
    url: `${BASE}/about`,
    title: 'About Brian Isale',
    description: 'Full Stack Developer & Creative Designer based in Nakuru, Kenya. Google Africa Scholar.',
    images: [{ url: `${BASE}/img/portrait.jpg`, width: 1200, height: 630 }],
  },
}

export default function AboutPage() {
  return <AboutClient />
}
