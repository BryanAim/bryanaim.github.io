import type { Metadata } from 'next'
import JsonLd from '../components/JsonLd'

export const metadata: Metadata = {
  title: 'BMX Life — Brian Isale Riding the Streets of Nakuru',
  description:
    "Brian Isale's BMX journey — learning flatland and street riding on Nakuru's streets since 2025. " +
    'A developer who rides. Every slam is a lesson. Follow the journey of BMX Brian from Nakuru, Kenya.',
  keywords: [
    'BMX Nakuru Kenya', 'BMX Kenya', 'flatland BMX Kenya', 'street BMX Nakuru',
    'BMX beginner Kenya', 'BMXbrian', 'bmxbrian', 'BMX rider Nakuru',
    'Brian Isale BMX', 'BryanAim BMX', 'learning BMX Kenya 2025',
    'developer who rides BMX', 'Nakuru BMX community',
  ],
  alternates: { canonical: 'https://isalebryan.dev/bmx' },
  openGraph: {
    title: "BMX Life — Brian Isale's Riding Journey in Nakuru, Kenya",
    description:
      "Learning flatland and street BMX on Nakuru's streets since 2025. A developer by day, a rider by choice. Every slam is a lesson.",
    url: 'https://isalebryan.dev/bmx',
    images: [{ url: '/img/bmx/bmx23-bg.jpg', width: 1200, height: 630, alt: 'Brian Isale — BMX riding in Nakuru, Kenya' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@IsaleBryan',
    creator: '@IsaleBryan',
    title: 'BMX Life — Brian Isale Nakuru, Kenya',
    description: 'Learning BMX flatland and street riding in Nakuru since 2025. Developer by day, rider by choice.',
    images: ['/img/bmx/bmx23-bg.jpg'],
  },
}

const bmxActivityJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SportsOrganization',
  name: 'BMX Brian — Nakuru BMX',
  url: 'https://isalebryan.dev/bmx',
  description:
    "Brian Isale's BMX riding journey. Learning flatland and street BMX on Nakuru's streets since 2025.",
  athlete: {
    '@type': 'Person',
    name: 'Brian Isale',
    alternateName: ['BMXbrian', 'bmxbrian', 'BryanAim'],
    url: 'https://isalebryan.dev',
    image: 'https://isalebryan.dev/img/portrait.jpg',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Nakuru',
      addressCountry: 'KE',
    },
    sameAs: [
      'https://tiktok.com/@bmxbrian',
      'https://youtube.com/@bryanaim',
      'https://twitter.com/IsaleBryan',
      'https://www.instagram.com/bryanisale/',
    ],
  },
  sport: 'BMX',
  location: {
    '@type': 'Place',
    name: 'Nakuru, Kenya',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Nakuru',
      addressCountry: 'KE',
    },
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home',     item: 'https://isalebryan.dev' },
    { '@type': 'ListItem', position: 2, name: 'BMX Life', item: 'https://isalebryan.dev/bmx' },
  ],
}

export default function BmxLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={bmxActivityJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {children}
    </>
  )
}
