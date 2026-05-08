import type { Metadata } from 'next'
import ShopClient from './ShopClient'

const BASE = 'https://isalebryan.dev'

export const metadata: Metadata = {
  title: 'Shop',
  description:
    'Janja\'s Shop — stickers, t-shirts, and helmets for developers, designers, and BMX riders. Custom orders welcome. Ships across Kenya.',
  alternates: { canonical: `${BASE}/shop` },
  openGraph: {
    url: `${BASE}/shop`,
    title: "Janja's Shop | Brian Isale",
    description: 'Stickers, t-shirts, and helmets for developers, designers, and BMX riders.',
    images: [{ url: `${BASE}/img/portrait.jpg`, width: 1200, height: 630 }],
  },
}

// Re-export types so existing imports from '@/app/shop/page' still resolve
export type { CartItem, TshirtColor } from './ShopClient'

export default function ShopPage() {
  return <ShopClient />
}
