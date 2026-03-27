import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: "Brian Isale's story — from Google Africa Scholar to full-stack developer and designer in Nakuru, Kenya.",
  alternates: { canonical: 'https://isalebryan.dev/about' },
  openGraph: {
    url: 'https://isalebryan.dev/about',
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://isalebryan.dev' },
    { '@type': 'ListItem', position: 2, name: 'About', item: 'https://isalebryan.dev/about' },
  ],
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
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
