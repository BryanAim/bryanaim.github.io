import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Custom Order — Stickers & T-Shirts',
  description:
    'Upload your own design and get a custom sticker or t-shirt printed and delivered in Nakuru, Kenya. Stickers from KES 30, custom t-shirts from KES 1,000. Order online from Janja\'s Shop.',
  keywords: [
    'custom sticker printing Kenya', 'custom t-shirt printing Nakuru',
    'upload design sticker Kenya', 'personalised stickers Nakuru',
    'custom printed tshirt Kenya', 'print on demand Kenya',
    'custom merch Nakuru', 'sticker printing Nakuru CBD',
    "Janja's Shop custom order", 'Brian Isale custom print',
  ],
  alternates: { canonical: 'https://isalebryan.dev/shop/custom' },
  openGraph: {
    url: 'https://isalebryan.dev/shop/custom',
    title: 'Custom Print Order — Stickers & T-Shirts | Janja\'s Shop',
    description:
      'Upload your artwork and get a custom sticker or t-shirt printed in Nakuru, Kenya. Delivered to your door. From KES 30.',
    images: [
      {
        url: '/img/portrait.jpg',
        width: 1200,
        height: 630,
        alt: "Janja's Shop — Custom Print Orders",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@IsaleBryan',
    creator: '@IsaleBryan',
    title: 'Custom Print Order — Janja\'s Shop Kenya',
    description: 'Upload your design. Get custom stickers or tees printed & delivered in Nakuru. From KES 30.',
    images: ['/img/portrait.jpg'],
  },
  robots: { index: true, follow: true },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://isalebryan.dev' },
    { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://isalebryan.dev/shop' },
    { '@type': 'ListItem', position: 3, name: 'Custom Order', item: 'https://isalebryan.dev/shop/custom' },
  ],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Can I print my own design on a sticker in Kenya?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes. Janja's Shop lets you upload your own artwork (JPG, PNG, WEBP, or GIF) and have it printed as a custom sticker. Sizes range from 3×3 cm to 15×15 cm and prices start from KES 30.",
      },
    },
    {
      '@type': 'Question',
      name: 'Can I print my own design on a t-shirt in Nakuru?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes. Upload your design at isalebryan.dev/shop/custom and select the t-shirt option. Custom t-shirts are available in sizes XS–XXL and 5 colour options, priced at KES 1,000. Delivery within Nakuru is available.",
      },
    },
    {
      '@type': 'Question',
      name: 'What file formats are accepted for custom print orders?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Accepted file formats are JPG, PNG, WEBP, and GIF up to 5 MB. For best print quality, use a high-resolution file (300 DPI recommended).',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does a custom sticker or t-shirt order take in Kenya?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Custom orders are typically ready within 1–3 business days after payment confirmation. Delivery within Nakuru is arranged via meetup or courier.',
      },
    },
  ],
}

export default function CustomOrderLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {children}
    </>
  )
}
