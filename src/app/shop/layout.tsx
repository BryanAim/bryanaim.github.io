import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Merchandise and digital products by Brian Isale.',
  alternates: { canonical: 'https://isalebryan.dev/shop' },
  openGraph: {
    url: 'https://isalebryan.dev/shop',
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://isalebryan.dev' },
    { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://isalebryan.dev/shop' },
  ],
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  )
}
