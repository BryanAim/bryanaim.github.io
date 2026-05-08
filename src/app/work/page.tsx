import type { Metadata } from 'next'
import WorkClient from './WorkClient'

const BASE = 'https://isalebryan.dev'

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Explore Brian Isale\'s portfolio — web development projects, logo & brand design, print, illustrations, and freelance services. Available for hire.',
  alternates: { canonical: `${BASE}/work` },
  openGraph: {
    url: `${BASE}/work`,
    title: 'Work | Brian Isale',
    description: 'Web development projects, logo & brand design, print, illustrations, and freelance services.',
    images: [{ url: `${BASE}/img/portrait.jpg`, width: 1200, height: 630 }],
  },
}

export default function WorkPage() {
  return <WorkClient />
}
