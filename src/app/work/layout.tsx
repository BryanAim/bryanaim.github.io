import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Work',
  description: 'Portfolio of full-stack development projects and brand identity designs by Brian Isale.',
  alternates: { canonical: 'https://isalebryan.dev/work' },
  openGraph: {
    url: 'https://isalebryan.dev/work',
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://isalebryan.dev' },
    { '@type': 'ListItem', position: 2, name: 'Work', item: 'https://isalebryan.dev/work' },
  ],
}

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  )
}
