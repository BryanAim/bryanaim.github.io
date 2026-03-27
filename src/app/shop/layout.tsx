import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Merchandise and digital products by Brian Isale.',
  alternates: { canonical: 'https://bryanaim.github.io/shop' },
  openGraph: {
    url: 'https://bryanaim.github.io/shop',
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://bryanaim.github.io' },
    { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://bryanaim.github.io/shop' },
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
