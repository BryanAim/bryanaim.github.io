import type { Metadata } from 'next'
import BmxClient from './BmxClient'

const BASE = 'https://isalebryan.dev'

export const metadata: Metadata = {
  title: 'BMX Life',
  description:
    'Brian Isale\'s BMX journey — riding, gear, skill progression, and the Nakuru riding scene. Passion project outside of code and design.',
  alternates: { canonical: `${BASE}/bmx` },
  openGraph: {
    url: `${BASE}/bmx`,
    title: 'BMX Life | Brian Isale',
    description: 'BMX riding, gear, skill progression, and the Nakuru riding scene.',
    images: [{ url: `${BASE}/img/portrait.jpg`, width: 1200, height: 630 }],
  },
}

export default function BmxPage() {
  return <BmxClient />
}
