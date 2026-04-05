import type { Metadata } from 'next'
import { PRODUCTS, StickerProduct, TshirtProduct } from '@/lib/products'

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

const BASE_URL = 'https://isalebryan.dev'
const AUTHOR = { '@type': 'Person', name: 'Brian Isale', url: BASE_URL }
const BRAND  = { '@type': 'Brand', name: 'BryanAim / Janja' }
const SHIPPING = {
  '@type': 'OfferShippingDetails',
  shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'KE' },
  deliveryTime: {
    '@type': 'ShippingDeliveryTime',
    handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 3, unitCode: 'DAY' },
  },
}

/** ItemList — every product in the catalogue for rich results & AI answer engines */
const itemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: "Janja's Shop — Stickers & T-Shirts",
  description:
    'Custom BMX stickers, developer stickers, pop-culture graphic tees and street art t-shirts by Brian Isale. Designed in Nakuru, Kenya.',
  url: `${BASE_URL}/shop`,
  numberOfItems: PRODUCTS.length,
  itemListElement: PRODUCTS.map((p, i) => {
    const absImage = `${BASE_URL}${p.image}`
    const isTshirt = p.type === 'tshirt'
    const tp = p as TshirtProduct
    const offer = isTshirt
      ? {
          '@type': 'AggregateOffer',
          priceCurrency: 'KES',
          lowPrice: String(tp.price - 300),
          highPrice: String(tp.price),
          offerCount: String(tp.sizes?.length ?? 6),
          availability: 'https://schema.org/InStock',
          seller: AUTHOR,
          shippingDetails: SHIPPING,
        }
      : {
          '@type': 'Offer',
          priceCurrency: 'KES',
          price: String(p.price),
          priceValidUntil: '2026-12-31',
          availability: 'https://schema.org/InStock',
          seller: AUTHOR,
          shippingDetails: SHIPPING,
        }

    // Collect all images for this product (main + variants)
    const allImages: string[] = [absImage]
    if (isTshirt && tp.colorVariants) {
      for (const v of tp.colorVariants) {
        const url = `${BASE_URL}${v.image}`
        if (!allImages.includes(url)) allImages.push(url)
        if (v.modelImage) {
          const mUrl = `${BASE_URL}${v.modelImage}`
          if (!allImages.includes(mUrl)) allImages.push(mUrl)
        }
      }
    } else {
      const sp = p as StickerProduct
      if (sp.variants) {
        for (const v of sp.variants) {
          const url = `${BASE_URL}${v.image}`
          if (!allImages.includes(url)) allImages.push(url)
        }
      }
    }

    return {
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        '@id': `${BASE_URL}/shop#product-${p.id}`,
        name: p.name,
        description: p.description,
        url: `${BASE_URL}/shop`,
        image: allImages,
        brand: BRAND,
        category: isTshirt ? `Clothing > T-Shirts > ${p.category}` : `Stickers > ${p.category}`,
        offers: offer,
      },
    }
  }),
}

/** ImageObject — every product image attributed to Brian Isale for Google Images */
const imageListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: "Janja's Shop — Product Images",
  url: `${BASE_URL}/shop`,
  itemListElement: PRODUCTS.flatMap((p, pi) => {
    const images: string[] = [p.image]
    if (p.type === 'tshirt') {
      const tp = p as TshirtProduct
      tp.colorVariants?.forEach(v => {
        if (!images.includes(v.image)) images.push(v.image)
        if (v.modelImage && !images.includes(v.modelImage)) images.push(v.modelImage)
      })
    } else {
      const sp = p as StickerProduct
      sp.variants?.forEach(v => { if (!images.includes(v.image)) images.push(v.image) })
    }
    return images.map((img, ii) => ({
      '@type': 'ListItem',
      position: pi * 10 + ii + 1,
      item: {
        '@type': 'ImageObject',
        contentUrl: `${BASE_URL}${img}`,
        name: `${p.name}${images.length > 1 ? ` — variant ${ii + 1}` : ''}`,
        description: p.description,
        author: AUTHOR,
        creator: AUTHOR,
        copyrightHolder: AUTHOR,
        license: `${BASE_URL}/shop`,
        acquireLicensePage: `${BASE_URL}/shop`,
      },
    }))
  }),
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(imageListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  )
}
