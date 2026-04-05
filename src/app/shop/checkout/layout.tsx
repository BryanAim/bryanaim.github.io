import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checkout',
  description:
    "Complete your order from Janja's Shop. Pay securely with M-Pesa. Stickers and t-shirts designed by Brian Isale, delivered across Nakuru and Kenya.",
  alternates: { canonical: 'https://isalebryan.dev/shop/checkout' },
  openGraph: {
    url: 'https://isalebryan.dev/shop/checkout',
    title: 'Checkout — Janja\'s Shop',
    description: "Complete your sticker or t-shirt order and pay via M-Pesa.",
  },
  robots: {
    index: false,
    follow: false,
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://isalebryan.dev' },
    { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://isalebryan.dev/shop' },
    { '@type': 'ListItem', position: 3, name: 'Checkout', item: 'https://isalebryan.dev/shop/checkout' },
  ],
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  )
}
