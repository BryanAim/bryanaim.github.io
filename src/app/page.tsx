import type { Metadata } from 'next'
import HomeClient from './HomeClient'

const BASE = 'https://isalebryan.dev'

export const metadata: Metadata = {
  title: { absolute: 'Brian Isale — Full Stack Developer & Creative Designer | Nakuru, Kenya' },
  description:
    'Brian Isale is a Full Stack Developer, Creative Designer, and Community Builder based in Nakuru, Kenya. Google Africa Scholar with 6+ years experience building modern web apps, brand identities, and open-source tools for Africa.',
  alternates: { canonical: BASE },
  openGraph: {
    url: BASE,
    title: 'Brian Isale — Full Stack Developer & Creative Designer | Nakuru, Kenya',
    description:
      'Full Stack Developer, Creative Designer, and Community Builder based in Nakuru, Kenya. Google Africa Scholar with 6+ years of experience building for Africa.',
    images: [{ url: `${BASE}/img/portrait.jpg`, width: 1200, height: 630 }],
  },
}

export default function Home() {
  return <HomeClient />
}
