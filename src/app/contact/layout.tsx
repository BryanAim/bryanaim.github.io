import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Brian Isale — Email, Phone & WhatsApp',
  description:
    'Get in touch with Brian Isale — Full Stack Developer & Creative Designer based in Nakuru, Kenya. ' +
    'Email: isale.bryan@gmail.com · Phone: +254 728 822 142 · WhatsApp available. ' +
    'Open to freelance projects, contracts, and collaborations.',
  keywords: [
    'Brian Isale contact', 'contact Brian Isale', 'Brian Isale email',
    'Brian Isale phone number', 'hire Brian Isale', 'Brian Isale WhatsApp',
    'isale.bryan@gmail.com', 'freelance developer Kenya contact',
    'web developer for hire Nakuru', 'creative designer Kenya contact',
  ],
  alternates: { canonical: 'https://isalebryan.dev/contact' },
  openGraph: {
    title: 'Contact Brian Isale — Full Stack Developer & Creative Designer',
    description:
      'Email: isale.bryan@gmail.com · Phone: +254 728 822 142 · Based in Nakuru, Kenya. ' +
      'Open to freelance, contracts, and collaborations.',
    url: 'https://isalebryan.dev/contact',
    images: [{ url: '/img/portrait.jpg', width: 1200, height: 630, alt: 'Brian Isale' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Brian Isale',
    description: 'Email: isale.bryan@gmail.com · Phone: +254 728 822 142 · Nakuru, Kenya.',
    images: ['/img/portrait.jpg'],
  },
}

// ContactPage + Person tells crawlers/AI engines this is the canonical contact page
const contactPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Brian Isale',
  url: 'https://isalebryan.dev/contact',
  description:
    'Contact page for Brian Isale — Full Stack Developer and Creative Designer based in Nakuru, Kenya. Reach him via email, phone, or WhatsApp.',
  author: {
    '@type': 'Person',
    name: 'Brian Isale',
    alternateName: ['BryanAim', 'Bryan Isale'],
    email: 'isale.bryan@gmail.com',
    telephone: '+254728822142',
    url: 'https://isalebryan.dev',
    image: 'https://isalebryan.dev/img/portrait.jpg',
    jobTitle: 'Full Stack Developer & Creative Designer',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Nakuru',
      addressRegion: 'Nakuru County',
      addressCountry: 'KE',
    },
    sameAs: [
      'https://linkedin.com/in/brian-isale/',
      'https://github.com/BryanAim',
      'https://behance.net/isalebryan',
      'https://twitter.com/IsaleBryan',
      'https://wa.me/254728822142',
    ],
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',    item: 'https://isalebryan.dev' },
      { '@type': 'ListItem', position: 2, name: 'Contact', item: 'https://isalebryan.dev/contact' },
    ],
  },
}

// FAQ targeting contact-intent queries — surfaces as rich results in Google + AI engines
const contactFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: "What is Brian Isale's email address?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Brian Isale's email address is isale.bryan@gmail.com. You can also reach him through the contact page at isalebryan.dev/contact.",
      },
    },
    {
      '@type': 'Question',
      name: "What is Brian Isale's phone number?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Brian Isale's phone number is +254 728 822 142. He is also reachable on WhatsApp at the same number.",
      },
    },
    {
      '@type': 'Question',
      name: 'How can I contact Brian Isale?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can contact Brian Isale via email at isale.bryan@gmail.com, by phone or WhatsApp at +254 728 822 142, or through LinkedIn at linkedin.com/in/brian-isale/. His contact page is at isalebryan.dev/contact.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Brian Isale available for freelance or contract work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Brian Isale is open to freelance projects, contract work, and collaborations. He works on full-stack web development, brand identity design, motion graphics, and UI/UX. Email isale.bryan@gmail.com or visit isalebryan.dev/contact to get started.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is Brian Isale located?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Brian Isale is based in Nakuru, Kenya, and works with clients locally and internationally.',
      },
    },
  ],
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  /* eslint-disable react/no-danger */
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactFaqJsonLd) }} />
      {children}
    </>
  )
}
