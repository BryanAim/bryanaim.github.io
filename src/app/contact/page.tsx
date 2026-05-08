import type { Metadata } from 'next'
import ContactClient from './ContactClient'

const BASE = 'https://isalebryan.dev'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Brian Isale for web development, design work, or collaboration. Based in Nakuru, Kenya — available worldwide.',
  alternates: { canonical: `${BASE}/contact` },
  openGraph: {
    url: `${BASE}/contact`,
    title: 'Contact | Brian Isale',
    description: 'Get in touch for web development, design, or collaboration.',
    images: [{ url: `${BASE}/img/portrait.jpg`, width: 1200, height: 630 }],
  },
}

export default function ContactPage() {
  return <ContactClient />
}
