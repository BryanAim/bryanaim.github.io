import type { Metadata } from 'next'
import CustomClient from './CustomClient'

const BASE = 'https://isalebryan.dev'

export const metadata: Metadata = {
  title: 'Custom Order',
  description:
    'Upload your own artwork and order custom stickers or t-shirts. Printed and delivered across Kenya. Starting from KES 30.',
  alternates: { canonical: `${BASE}/shop/custom` },
  openGraph: {
    url: `${BASE}/shop/custom`,
    title: 'Custom Order | Brian Isale Shop',
    description: 'Upload your artwork — we print and deliver custom stickers or t-shirts across Kenya.',
    images: [{ url: `${BASE}/img/portrait.jpg`, width: 1200, height: 630 }],
  },
}

export default function CustomPage() {
  return <CustomClient />
}
