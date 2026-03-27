import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from './components/Header'
import PageTransition from './components/PageTransition'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/next'

const inter = Inter({ subsets: ['latin'] })

// ── SEO Metadata ─────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL('https://bryanaim.github.io'),
  title: {
    default: 'Brian Isale — Full Stack Developer & Creative Designer | Nakuru, Kenya',
    template: '%s | Brian Isale',
  },
  description:
    'Brian Isale is a Full Stack Developer, Creative Designer, and Community Builder based in Nakuru, Kenya. Google Africa Scholar with 6+ years experience building modern web apps, brand identities, and open-source tools for Africa.',
  keywords: [
    'Brian Isale', 'BryanAim', 'full stack developer Kenya', 'web developer Nakuru',
    'creative designer Kenya', 'Next.js developer Africa', 'React developer Kenya',
    'Google Africa Scholar', 'software engineer Kenya', 'UI UX designer Nakuru',
    'brand identity designer Kenya', 'motion graphics Kenya', 'frontend developer Africa',
    'community builder Kenya', 'Andela scholar',
  ],
  authors: [{ name: 'Brian Isale', url: 'https://bryanaim.github.io' }],
  creator: 'Brian Isale',
  publisher: 'Brian Isale',
  category: 'Technology',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bryanaim.github.io',
    siteName: 'Brian Isale Portfolio',
    title: 'Brian Isale — Full Stack Developer & Creative Designer | Nakuru, Kenya',
    description:
      'Full Stack Developer, Creative Designer, and Community Builder based in Nakuru, Kenya. Google Africa Scholar with 6+ years of experience building for Africa.',
    images: [
      {
        url: '/img/portrait.jpg',
        width: 1200,
        height: 630,
        alt: 'Brian Isale — Full Stack Developer & Creative Designer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@IsaleBryan',
    creator: '@IsaleBryan',
    title: 'Brian Isale — Full Stack Developer & Creative Designer',
    description:
      'Full Stack Developer, Creative Designer & Community Builder. Google Africa Scholar. Based in Nakuru, Kenya.',
    images: ['/img/portrait.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: { canonical: 'https://bryanaim.github.io' },
}

// ── Structured Data (JSON-LD) ─────────────────────────────────────────────────
// Person schema — answers "Who is Brian Isale?" for search engines, AI assistants,
// and generative engines (AEO + GEO)
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Brian Isale',
  alternateName: ['BryanAim', 'Bryan Isale', 'Isale Brian'],
  url: 'https://bryanaim.github.io',
  image: 'https://bryanaim.github.io/img/portrait.jpg',
  jobTitle: ['Full Stack Developer', 'Creative Designer', 'Community Builder'],
  description:
    'Brian Isale is a Full Stack Developer and Creative Designer based in Nakuru, Kenya. A Google Africa Scholar (Andela, 2019), he builds modern web applications with Next.js, React, and Node.js, and crafts brand identities, motion graphics, and UI/UX designs. He mentors developers, runs community outreach programmes with HIV SEERs Kenya and Unilever Heroes for Change, and has reached 3,000+ youth across Nakuru.',
  email: 'isale.bryan@gmail.com',
  telephone: '+254728822142',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Nakuru',
    addressRegion: 'Nakuru County',
    addressCountry: 'KE',
  },
  alumniOf: {
    '@type': 'Organization',
    name: 'Andela',
    description: 'Google Africa Developer Scholarship — Mobile Web Specialist, 2019',
  },
  award: 'Google Africa Scholarship — Mobile Web Specialist (Andela & Pluralsight, 2019)',
  memberOf: [
    { '@type': 'Organization', name: 'HIV SEERs Kenya' },
    { '@type': 'Organization', name: "Unilever Heroes for Change" },
    { '@type': 'Organization', name: 'Google Developer Groups' },
  ],
  sameAs: [
    'https://linkedin.com/in/brian-isale/',
    'https://github.com/BryanAim',
    'https://behance.net/isalebryan',
    'https://twitter.com/IsaleBryan',
    'https://dev.to/bryanaim',
    'https://youtube.com/@bryanaim',
    'https://www.instagram.com/bryanisale/',
    'https://facebook.com/BryanAim',
  ],
  knowsAbout: [
    'HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Next.js',
    'Vue.js', 'Nuxt.js', 'Node.js', 'Python', 'Django', 'WordPress',
    'Tailwind CSS', 'Google Cloud Platform', 'Adobe Illustrator', 'Adobe Photoshop',
    'UI/UX Design', 'Motion Graphics', 'Brand Identity Design',
    'Community Building', 'Peer Education', 'Software Mentorship',
  ],
}

// WebSite schema — helps crawlers understand site structure
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Brian Isale Portfolio',
  url: 'https://bryanaim.github.io',
  description:
    'Portfolio of Brian Isale — Full Stack Developer and Creative Designer based in Nakuru, Kenya.',
  author: {
    '@type': 'Person',
    name: 'Brian Isale',
    url: 'https://bryanaim.github.io',
  },
  inLanguage: 'en-US',
}

// FAQ schema — surfaces direct Q&A in search results and AI answer engines (AEO)
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Who is Brian Isale?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Brian Isale (also known as BryanAim) is a Full Stack Developer, Creative Designer, and Community Builder based in Nakuru, Kenya. He is a Google Africa Scholar (Andela, 2019) with over 6 years of professional experience building web applications, designing brand identities, and mentoring developers across Africa.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does Brian Isale do professionally?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Brian Isale builds full-stack web applications using Next.js, React, TypeScript, Node.js, and Python/Django. He also creates brand identities, logos, motion graphics, and UI/UX designs using Adobe Illustrator and Photoshop. Beyond technology, he runs community outreach programs, mentors developers, and serves as a peer educator with HIV SEERs Kenya.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is Brian Isale based?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Brian Isale is based in Nakuru, Kenya.',
      },
    },
    {
      '@type': 'Question',
      name: 'What technologies does Brian Isale work with?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Brian Isale works with Next.js, React, TypeScript, Vue.js, Node.js, Python, Django, WordPress, Tailwind CSS, and Google Cloud Platform on the development side. For design, he uses Adobe Illustrator, Adobe Photoshop, and various UI/UX design tools.',
      },
    },
    {
      '@type': 'Question',
      name: 'How can I contact Brian Isale?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can contact Brian Isale via email at isale.bryan@gmail.com, by phone at +254 728 822 142, or through his social profiles on LinkedIn (linkedin.com/in/brian-isale), GitHub (github.com/BryanAim), or Twitter/X (@IsaleBryan).',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Brian Isale available for freelance or contract work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Brian Isale is open to freelance projects, contract work, and collaborations. He can be reached at isale.bryan@gmail.com or through the contact page on his portfolio at bryanaim.github.io/contact.',
      },
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-157368874-1"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'UA-157368874-1');
            `,
          }}
        />
        {/* Structured data — Person (AEO + GEO) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {/* Structured data — WebSite (SEO) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {/* Structured data — FAQ (AEO) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <link rel="icon" href="/favicon.png" />
        <link rel="stylesheet" href="/fonts/css/all.min.css" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Header />
        <div id="content-wrap">
          <PageTransition>{children}</PageTransition>
          <Footer />
        </div>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}


function Footer() {
  return (
    <footer id="main-footer">
      &copy; {new Date().getFullYear()} - Brian Isale
    </footer>
  )
}
