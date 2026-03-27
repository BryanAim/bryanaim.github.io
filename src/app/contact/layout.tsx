import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Brian Isale — available for projects, collaborations, and conversations.',
  alternates: { canonical: 'https://bryanaim.github.io/contact' },
  openGraph: {
    url: 'https://bryanaim.github.io/contact',
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://bryanaim.github.io' },
    { '@type': 'ListItem', position: 2, name: 'Contact', item: 'https://bryanaim.github.io/contact' },
  ],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What does Brian Isale do?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Brian Isale is a full-stack developer and creative designer based in Nakuru, Kenya. He builds web applications and brand identities, and is a Google Africa Scholar.',
      },
    },
    {
      '@type': 'Question',
      name: 'How can I hire Brian Isale?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can reach Brian Isale via email at isale.bryan@gmail.com or through his LinkedIn at linkedin.com/in/brian-isale/.',
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
        text: 'Brian Isale works with React, Next.js, TypeScript, and Node.js for development, and uses design tools for brand identity and motion graphics.',
      },
    },
  ],
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  )
}
