import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BMX Life',
  description: "Brian Isale's BMX journey — learning flatland and street riding on Nakuru's streets since 2025.",
  alternates: { canonical: 'https://isalebryan.dev/bmx' },
  openGraph: {
    url: 'https://isalebryan.dev/bmx',
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://isalebryan.dev' },
    { '@type': 'ListItem', position: 2, name: 'BMX Life', item: 'https://isalebryan.dev/bmx' },
  ],
}

export default function BmxLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  )
}
