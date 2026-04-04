import type { Metadata } from 'next'

// ── Metadata ──────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Work & Services',
  description:
    'Brian Isale offers freelance web design, logo & brand identity, UI/UX design, motion graphics, email marketing, and coding mentorship — based in Nakuru, Kenya. View portfolio and get an instant quote.',
  keywords: [
    'freelance web developer Nakuru', 'web designer Kenya', 'logo designer Nakuru',
    'brand identity Kenya', 'UI UX designer Kenya', 'motion graphics Kenya',
    'email marketing setup Kenya', 'coding mentor Nakuru', 'Next.js developer Kenya',
    'React developer Kenya', 'WordPress developer Nakuru', 'graphic designer Kenya',
    'website design Kenya prices', 'affordable web design Nakuru',
    'Brian Isale services', 'BryanAim portfolio',
  ],
  alternates: { canonical: 'https://isalebryan.dev/work' },
  openGraph: {
    url: 'https://isalebryan.dev/work',
    title: 'Work & Services — Brian Isale | Web Design, Branding & More',
    description:
      'Freelance web design, branding, UI/UX, motion graphics, and coding mentorship from Brian Isale — Nakuru, Kenya. Portfolio + instant quote tool.',
    images: [
      {
        url: '/img/portrait.jpg',
        width: 1200,
        height: 630,
        alt: 'Brian Isale — Freelance Web Developer & Designer, Nakuru Kenya',
      },
    ],
  },
}

// ── Structured Data ───────────────────────────────────────────────────────────

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://isalebryan.dev' },
    { '@type': 'ListItem', position: 2, name: 'Work & Services', item: 'https://isalebryan.dev/work' },
  ],
}

// LocalBusiness — GEO signal for "freelancer near me" queries and AI answers
const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://isalebryan.dev/#business',
  name: 'Brian Isale — Freelance Web & Design Services',
  description:
    'Freelance web development, graphic design, brand identity, UI/UX design, motion graphics, and coding mentorship. Serving clients in Nakuru, Nairobi, and across East Africa.',
  url: 'https://isalebryan.dev',
  telephone: '+254728822142',
  email: 'isale.bryan@gmail.com',
  founder: { '@type': 'Person', name: 'Brian Isale' },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Nakuru',
    addressRegion: 'Nakuru County',
    addressCountry: 'KE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -0.3031,
    longitude: 36.0800,
  },
  areaServed: [
    { '@type': 'City', name: 'Nakuru' },
    { '@type': 'City', name: 'Nairobi' },
    { '@type': 'Country', name: 'Kenya' },
    { '@type': 'Place', name: 'East Africa' },
  ],
  priceRange: 'KES 3,000 – KES 80,000+',
  currenciesAccepted: 'KES',
  paymentAccepted: 'M-Pesa, Bank Transfer',
  openingHours: 'Mo-Fr 08:00-18:00',
  sameAs: [
    'https://linkedin.com/in/brian-isale/',
    'https://github.com/BryanAim',
    'https://behance.net/isalebryan',
  ],
}

// ItemList of services — helps AI and rich results surface individual offerings
const servicesListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Brian Isale Freelance Services',
  description: 'Freelance digital services offered by Brian Isale, based in Nakuru, Kenya.',
  url: 'https://isalebryan.dev/work',
  numberOfItems: 6,
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'Service',
        name: 'Website Design & Development',
        description:
          'Custom websites built with Next.js, React, WordPress, or plain HTML/CSS. Includes responsive design, SEO-ready markup, CMS integration, and hosting setup. From landing pages to full web applications.',
        provider: { '@type': 'Person', name: 'Brian Isale', url: 'https://isalebryan.dev' },
        areaServed: 'Kenya',
        offers: {
          '@type': 'Offer',
          priceCurrency: 'KES',
          price: '15000',
          priceSpecification: {
            '@type': 'PriceSpecification',
            minPrice: 15000,
            maxPrice: 100000,
            priceCurrency: 'KES',
            description: 'Price varies by project scope. Landing pages from KES 15,000; web apps from KES 55,000.',
          },
          eligibleRegion: 'KE',
        },
        serviceType: 'Web Development',
        termsOfService: 'https://isalebryan.dev/work',
      },
    },
    {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@type': 'Service',
        name: 'Logo & Brand Identity Design',
        description:
          'Professional logo design, colour palettes, typography selection, and brand guidelines. Delivered in all formats including AI, SVG, PNG, and PDF.',
        provider: { '@type': 'Person', name: 'Brian Isale', url: 'https://isalebryan.dev' },
        areaServed: 'Kenya',
        offers: {
          '@type': 'Offer',
          priceCurrency: 'KES',
          price: '5000',
          priceSpecification: {
            '@type': 'PriceSpecification',
            minPrice: 5000,
            maxPrice: 20000,
            priceCurrency: 'KES',
          },
          eligibleRegion: 'KE',
        },
        serviceType: 'Graphic Design',
      },
    },
    {
      '@type': 'ListItem',
      position: 3,
      item: {
        '@type': 'Service',
        name: 'Motion Graphics & Social Media Design',
        description:
          'Animated logos, social media post templates, stories and reels graphics, video intros and outros. Delivered as MP4, GIF, and editable source files.',
        provider: { '@type': 'Person', name: 'Brian Isale', url: 'https://isalebryan.dev' },
        areaServed: 'Kenya',
        offers: {
          '@type': 'Offer',
          priceCurrency: 'KES',
          price: '3000',
          priceSpecification: {
            '@type': 'PriceSpecification',
            minPrice: 3000,
            maxPrice: 25000,
            priceCurrency: 'KES',
          },
          eligibleRegion: 'KE',
        },
        serviceType: 'Motion Graphics',
      },
    },
    {
      '@type': 'ListItem',
      position: 4,
      item: {
        '@type': 'Service',
        name: 'UI/UX Design',
        description:
          'Wireframes and high-fidelity mockups for websites and mobile apps. Interactive Figma prototypes ready for developer handoff.',
        provider: { '@type': 'Person', name: 'Brian Isale', url: 'https://isalebryan.dev' },
        areaServed: 'Kenya',
        offers: {
          '@type': 'Offer',
          priceCurrency: 'KES',
          price: '8000',
          priceSpecification: {
            '@type': 'PriceSpecification',
            minPrice: 8000,
            maxPrice: 50000,
            priceCurrency: 'KES',
          },
          eligibleRegion: 'KE',
        },
        serviceType: 'UX Design',
      },
    },
    {
      '@type': 'ListItem',
      position: 5,
      item: {
        '@type': 'Service',
        name: 'Email Marketing Setup',
        description:
          'Mailchimp and Brevo campaign setup, custom email templates, and automation flows for small businesses and community organisations in Kenya.',
        provider: { '@type': 'Person', name: 'Brian Isale', url: 'https://isalebryan.dev' },
        areaServed: 'Kenya',
        offers: {
          '@type': 'Offer',
          priceCurrency: 'KES',
          price: '4000',
          priceSpecification: {
            '@type': 'PriceSpecification',
            minPrice: 4000,
            maxPrice: 15000,
            priceCurrency: 'KES',
          },
          eligibleRegion: 'KE',
        },
        serviceType: 'Email Marketing',
      },
    },
    {
      '@type': 'ListItem',
      position: 6,
      item: {
        '@type': 'Service',
        name: 'Coding Mentorship',
        description:
          '1-on-1 web development mentorship sessions in Nakuru or online. Topics: HTML, CSS, JavaScript, React, and Next.js. Flexible schedule, structured learning plan.',
        provider: { '@type': 'Person', name: 'Brian Isale', url: 'https://isalebryan.dev' },
        areaServed: 'Kenya',
        offers: {
          '@type': 'Offer',
          priceCurrency: 'KES',
          price: '800',
          priceSpecification: {
            '@type': 'PriceSpecification',
            minPrice: 800,
            maxPrice: 7200,
            priceCurrency: 'KES',
            unitText: 'per session',
          },
          eligibleRegion: 'KE',
        },
        serviceType: 'Education',
      },
    },
  ],
}

// FAQPage — AEO: directly answers questions AI assistants and featured snippets target
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does a website cost in Kenya?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Brian Isale builds websites in Kenya starting from KES 15,000 for a landing page, KES 23,000 for a business site, and KES 40,000+ for an e-commerce store or web application. Final pricing depends on scope, features, and timeline.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does a logo cost in Kenya?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Logo design by Brian Isale starts from KES 5,000 for a basic logo. A full brand identity kit including logo, colours, typography, and brand guidelines costs from KES 17,000. Turnaround is 3–7 days.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a web designer in Nakuru, Kenya?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Brian Isale is a freelance web designer and developer based in Nakuru, Kenya. He offers website design and development, logo and brand identity, UI/UX design, motion graphics, email marketing, and coding mentorship. He can work with clients in-person in Nakuru or remotely across Kenya and East Africa.',
      },
    },
    {
      '@type': 'Question',
      name: 'What web development services does Brian Isale offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Brian Isale offers: website design and development (Next.js, React, WordPress), logo and brand identity design, UI/UX design and Figma prototypes, motion graphics and social media design, email marketing setup (Mailchimp/Brevo), and 1-on-1 coding mentorship. All services include an instant online quote tool.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to build a website in Kenya?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Brian Isale typically delivers a landing page in 1 week, a business website in 1–2 weeks, and a full web application in 2–4 weeks. Rush delivery under 1 week is available for an additional fee.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I get a coding mentor in Nakuru Kenya?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Brian Isale offers coding mentorship sessions in Nakuru (in-person) and online via Google Meet or Zoom. Sessions cover HTML, CSS, JavaScript, React, and Next.js. Packages start from KES 800 per session.',
      },
    },
  ],
}

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {children}
    </>
  )
}
