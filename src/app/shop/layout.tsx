import type { Metadata } from 'next'

// ── SEO / AEO / GEO metadata ──────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Shop — Stickers & T-Shirts | Brian Isale',
  description:
    'Buy custom BMX stickers, developer stickers, pop-culture tees, and graphic t-shirts designed by Brian Isale. Shipped across Kenya. Prices from KES 150.',
  keywords: [
    // product-level
    'BMX stickers Kenya', 'custom stickers Nakuru', 'developer stickers Kenya',
    'graphic t-shirts Kenya', 'custom t-shirts Nairobi', 'pop culture tees Kenya',
    'buy stickers Kenya', 'BMX t-shirt Kenya', 'cycling stickers Kenya',
    'street art stickers Kenya', 'designer stickers Nairobi', 'humour stickers Kenya',
    'football stickers Kenya', 'Messi sticker', 'Ronaldo sticker',
    // brand
    'Brian Isale shop', 'BryanAim merch', 'Janja shop',
    // intent
    'buy custom stickers online Kenya', 'order t-shirts Kenya delivery',
    'affordable graphic tees Nakuru', 'BMX merchandise Africa',
    'custom printed stickers Kenya', 'vinyl stickers Kenya',
  ],
  alternates: { canonical: 'https://isalebryan.dev/shop' },
  openGraph: {
    type: 'website',
    url: 'https://isalebryan.dev/shop',
    title: 'Shop — BMX Stickers & Graphic T-Shirts | Brian Isale',
    description:
      'Custom BMX stickers, developer stickers, pop-culture graphic tees and more — designed in Nakuru, Kenya. Shipped nationwide. From KES 150.',
    images: [
      {
        url: '/img/og-shop.jpg',
        width: 1200,
        height: 630,
        alt: 'Janja Shop — Stickers & T-Shirts by Brian Isale',
      },
    ],
    siteName: 'Brian Isale Portfolio',
    locale: 'en_KE',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@IsaleBryan',
    creator: '@IsaleBryan',
    title: 'Shop — BMX Stickers & Graphic Tees | Brian Isale',
    description:
      'Custom stickers & graphic t-shirts designed in Nakuru, Kenya. BMX, developer, pop culture, street & more. From KES 150.',
    images: ['/img/og-shop.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
}

// ── Structured data ───────────────────────────────────────────────────────────

/** Store schema — tells search & AI engines this is a real shop with a seller */
const storeJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: "Janja's Shop",
  description:
    'Online shop by Brian Isale selling custom BMX stickers, developer stickers, pop-culture graphic tees, and street art t-shirts. Designed in Nakuru, Kenya and shipped nationwide.',
  url: 'https://isalebryan.dev/shop',
  image: 'https://isalebryan.dev/img/og-shop.jpg',
  logo: 'https://isalebryan.dev/img/portrait.jpg',
  founder: {
    '@type': 'Person',
    name: 'Brian Isale',
    url: 'https://isalebryan.dev',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Nakuru',
    addressRegion: 'Nakuru County',
    addressCountry: 'KE',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+254728822142',
    email: 'isale.bryan@gmail.com',
    contactType: 'customer service',
    availableLanguage: ['English', 'Swahili'],
  },
  areaServed: {
    '@type': 'Country',
    name: 'Kenya',
  },
  currenciesAccepted: 'KES',
  paymentAccepted: 'M-Pesa, Bank Transfer',
  priceRange: 'KES 150 – KES 1,200',
  sameAs: [
    'https://www.instagram.com/isalebryan/',
    'https://twitter.com/IsaleBryan',
    'https://youtube.com/@bryanaim',
  ],
}

/** ItemList schema — representative products for rich results & AI answer engines */
const itemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: "Janja's Shop — Stickers & T-Shirts",
  description:
    'Custom BMX stickers, developer stickers, pop-culture graphic tees and street art t-shirts by Brian Isale. Designed in Nakuru, Kenya.',
  url: 'https://isalebryan.dev/shop',
  numberOfItems: 3,
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'Product',
        name: 'BMX Stickers — Custom Designs',
        description:
          'High-quality vinyl BMX stickers for bike frames, helmets, and water bottles. Designed in Nakuru, Kenya. Multiple colour variants available.',
        url: 'https://isalebryan.dev/shop',
        image: 'https://isalebryan.dev/img/products/stickers/bmx-life.jpg',
        brand: { '@type': 'Brand', name: 'BryanAim / Janja' },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'KES',
          price: '150',
          priceValidUntil: '2026-12-31',
          availability: 'https://schema.org/InStock',
          seller: { '@type': 'Person', name: 'Brian Isale' },
          shippingDetails: {
            '@type': 'OfferShippingDetails',
            shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'KE' },
            deliveryTime: { '@type': 'ShippingDeliveryTime', handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 3, unitCode: 'DAY' } },
          },
        },
        category: 'Stickers > BMX',
      },
    },
    {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@type': 'Product',
        name: 'Graphic T-Shirts — BMX & Pop Culture',
        description:
          'Premium cotton graphic t-shirts with BMX, street art, pop-culture, and developer designs. Available in multiple colours and sizes XS–XXL. Shipped across Kenya.',
        url: 'https://isalebryan.dev/shop',
        image: 'https://isalebryan.dev/img/products/t-shirts/ride-crash-swear-repeat-rasts-purple-and-blue-green-tshirt.jpg',
        brand: { '@type': 'Brand', name: 'BryanAim / Janja' },
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'KES',
          lowPrice: '900',
          highPrice: '1200',
          offerCount: '6',
          availability: 'https://schema.org/InStock',
          seller: { '@type': 'Person', name: 'Brian Isale' },
        },
        category: 'Clothing > T-Shirts',
      },
    },
    {
      '@type': 'ListItem',
      position: 3,
      item: {
        '@type': 'Product',
        name: 'Developer & Designer Stickers',
        description:
          'Stickers for developers and designers — code, git, coffee, and creative themes. Perfect for laptops, notebooks, and water bottles.',
        url: 'https://isalebryan.dev/shop',
        image: 'https://isalebryan.dev/img/products/stickers/git-commit-and-pray.jpg',
        brand: { '@type': 'Brand', name: 'BryanAim / Janja' },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'KES',
          price: '150',
          priceValidUntil: '2026-12-31',
          availability: 'https://schema.org/InStock',
          seller: { '@type': 'Person', name: 'Brian Isale' },
        },
        category: 'Stickers > Developer',
      },
    },
  ],
}

/** FAQ schema — targets high-intent search queries and AI answer engines (AEO/GEO) */
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Where can I buy custom BMX stickers in Kenya?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "You can buy custom BMX stickers on Brian Isale's online shop at isalebryan.dev/shop. Prices start from KES 150 and the stickers are shipped across Kenya.",
      },
    },
    {
      '@type': 'Question',
      name: 'Does the shop ship to all parts of Kenya?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Janja\'s Shop ships stickers and t-shirts nationwide across Kenya. Orders are processed within 1–3 business days.',
      },
    },
    {
      '@type': 'Question',
      name: 'What types of products are available in Janja\'s Shop?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Janja's Shop sells custom vinyl stickers (BMX, developer, cycling, pop culture, street art, humour, football) and graphic t-shirts in categories including BMX, street, pop culture, and developer themes. Stickers start at KES 150 and t-shirts from KES 900.",
      },
    },
    {
      '@type': 'Question',
      name: 'How do I pay for stickers and t-shirts in the shop?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Payment is accepted via M-Pesa and bank transfer. Contact Brian Isale at isale.bryan@gmail.com or +254 728 822 142 to place an order.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I order a custom sticker or t-shirt design?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The shop offers a custom order option where you can upload your own artwork and have it printed as a sticker or t-shirt. Visit isalebryan.dev/shop/custom for details.',
      },
    },
    {
      '@type': 'Question',
      name: 'What sizes are available for graphic t-shirts?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'T-shirts are available in sizes XS, S, M, L, XL, and XXL. Prices range from KES 900 (XS) to KES 1,200 (XXL).',
      },
    },
    {
      '@type': 'Question',
      name: 'Who designs the stickers and t-shirts?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'All designs are created by Brian Isale (BryanAim), a Full Stack Developer and Creative Designer based in Nakuru, Kenya.',
      },
    },
  ],
}

/** BreadcrumbList schema */
const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://isalebryan.dev' },
    { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://isalebryan.dev/shop' },
  ],
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  )
}
