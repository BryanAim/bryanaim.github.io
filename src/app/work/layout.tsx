import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Work',
  description: 'Portfolio of full-stack development projects and brand identity designs by Brian Isale.',
  alternates: { canonical: 'https://bryanaim.github.io/work' },
  openGraph: {
    url: 'https://bryanaim.github.io/work',
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://bryanaim.github.io' },
    { '@type': 'ListItem', position: 2, name: 'Work', item: 'https://bryanaim.github.io/work' },
  ],
}

export default function WorkLayout({ children }: { children: React.ReactNode }) {
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
