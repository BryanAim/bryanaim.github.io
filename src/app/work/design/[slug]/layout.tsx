import type { Metadata } from 'next'
import { designProjects } from '../../designProjects'
import JsonLd from '../../../components/JsonLd'

type Props = {
  params: Promise<{ slug: string }>
  children: React.ReactNode
}

const categoryLabel: Record<string, string> = {
  logo:         'Logo Design',
  print:        'Brochure & Print Design',
  composition:  'Photo Composition',
  illustration: 'Digital Illustration',
  motion:       'Motion Graphics',
  'ui-ux':      'UI / UX Design',
  photography:  'Photography',
}

const PERSONAL_CLIENTS = new Set(['Confidential', 'Personal', 'Personal / Commission'])

// Pre-renders all 80+ design pages as static HTML at build time.
// Without this, Next.js renders them on-demand (JS-heavy for crawlers).
export function generateStaticParams() {
  return designProjects.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = designProjects.find(p => p.slug === slug)

  if (!project) {
    return { title: 'Design Project Not Found', description: 'The requested design project could not be found.' }
  }

  const catLabel = categoryLabel[project.category] ?? 'Design'
  const isNamedClient = project.client && !PERSONAL_CLIENTS.has(project.client)
  const clientKeywords = isNamedClient
    ? [project.client!, `${project.client} logo`, `${project.client} ${catLabel.toLowerCase()}`, `${project.client} branding`]
    : []

  // "Starehe Entertainment — Logo Design, Nakuru Kenya | Brian Isale"
  const title = `${project.title} — ${catLabel}, Nakuru Kenya | Brian Isale`
  const description =
    `${project.description} ` +
    `Designed by Brian Isale in Nakuru, Kenya. ` +
    `Tools: ${project.tools.join(', ')}.` +
    (project.client ? ` Client: ${project.client}.` : '') +
    ` Year: ${project.year}.`

  const absImage = project.primaryImage.startsWith('http')
    ? project.primaryImage
    : `https://isalebryan.dev${project.primaryImage}`

  return {
    title,
    description,
    keywords: [
      project.title,
      ...clientKeywords,
      ...project.tags,
      catLabel,
      `${project.category} design Nakuru`,
      `${project.category} designer Kenya`,
      `${project.category} design Kenya`,
      'graphic designer Nakuru Kenya',
      'logo designer Nakuru',
      'creative designer Kenya',
      'Brian Isale',
      'BryanAim design',
      'design portfolio Kenya',
    ],
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: `https://isalebryan.dev/work/design/${project.slug}`,
      images: [{ url: absImage, width: 1200, height: 630, alt: `${project.title} — ${catLabel} by Brian Isale, Nakuru Kenya` }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@IsaleBryan',
      creator: '@IsaleBryan',
      title,
      description,
      images: [absImage],
    },
    alternates: { canonical: `https://isalebryan.dev/work/design/${project.slug}` },
  }
}

export default async function DesignProjectLayout({ params, children }: Props) {
  const { slug } = await params
  const project = designProjects.find(p => p.slug === slug)

  if (!project) return <>{children}</>

  const catLabel = categoryLabel[project.category] ?? 'Design'
  const isNamedClient = project.client && !PERSONAL_CLIENTS.has(project.client)
  const absImage = project.primaryImage.startsWith('http')
    ? project.primaryImage
    : `https://isalebryan.dev${project.primaryImage}`
  const pageUrl = `https://isalebryan.dev/work/design/${project.slug}`

  const CREATOR = {
    '@type': 'Person',
    name: 'Brian Isale',
    alternateName: 'BryanAim',
    url: 'https://isalebryan.dev',
    jobTitle: 'Creative Designer & Full Stack Developer',
  }

  // CreativeWork — tells search engines this is a named design work with a client and creator
  const creativeWorkJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': pageUrl,
    name: project.title,
    description: project.description,
    url: pageUrl,
    image: absImage,
    dateCreated: `${project.year}-01-01`,
    creator: CREATOR,
    author: CREATOR,
    copyrightHolder: CREATOR,
    ...(isNamedClient ? { client: { '@type': 'Organization', name: project.client } } : {}),
    locationCreated: { '@type': 'Place', name: 'Nakuru, Kenya' },
    keywords: [project.title, ...project.tags, catLabel, 'Nakuru Kenya'].join(', '),
    genre: catLabel,
    inLanguage: 'en',
    usageInfo: 'https://isalebryan.dev/contact',
  }

  // ImageObject — drives Google Images ranking for "[client] logo", "[product] sticker" queries
  const imageObjectJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    name: `${project.title} — ${catLabel} by Brian Isale`,
    description: project.description,
    contentUrl: absImage,
    url: pageUrl,
    creator: CREATOR,
    author: CREATOR,
    copyrightHolder: CREATOR,
    license: 'https://isalebryan.dev/work',
    acquireLicensePage: 'https://isalebryan.dev/contact',
    keywords: [project.title, ...project.tags, catLabel, 'Nakuru Kenya', 'Brian Isale'].join(', '),
    datePublished: `${project.year}-01-01`,
    locationCreated: { '@type': 'Place', name: 'Nakuru, Kenya' },
    ...(project.images && project.images.length > 1
      ? { thumbnail: { '@type': 'ImageObject', contentUrl: absImage } }
      : {}),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',   item: 'https://isalebryan.dev' },
      { '@type': 'ListItem', position: 2, name: 'Work',   item: 'https://isalebryan.dev/work' },
      { '@type': 'ListItem', position: 3, name: catLabel, item: `https://isalebryan.dev/work?tab=${project.category}` },
      { '@type': 'ListItem', position: 4, name: project.title, item: pageUrl },
    ],
  }

  return (
    <>
      <JsonLd data={creativeWorkJsonLd} />
      <JsonLd data={imageObjectJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {children}
    </>
  )
}
