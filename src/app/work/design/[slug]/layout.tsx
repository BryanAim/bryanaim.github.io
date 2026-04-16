import type { Metadata } from 'next'
import { designProjects } from '../../designProjects'

type Props = {
  params: Promise<{ slug: string }>
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = designProjects.find(p => p.slug === slug)

  if (!project) {
    return {
      title: 'Design Project Not Found',
      description: 'The requested design project could not be found.',
    }
  }

  const categoryLabel: Record<string, string> = {
    logo: 'Logo Design',
    print: 'Brochure & Print',
    composition: 'Photo Composition',
    illustration: 'Digital Illustration',
    motion: 'Motion Graphics',
    'ui-ux': 'UI / UX Design',
    photography: 'Photography',
  }

  const title = `${project.title} — ${categoryLabel[project.category] ?? 'Design'} by Brian Isale`
  const description = `${project.description} Tools used: ${project.tools.join(', ')}. ${project.client ? `Client: ${project.client}.` : ''} Year: ${project.year}.`

  return {
    title,
    description,
    keywords: [
      project.title,
      ...project.tags,
      categoryLabel[project.category],
      'Brian Isale',
      'design portfolio Kenya',
      `${project.category} design Kenya`,
    ],
    openGraph: {
      title,
      description,
      url: `https://isalebryan.dev/work/design/${project.slug}`,
      images: [
        {
          url: project.primaryImage,
          width: 1200,
          height: 630,
          alt: `${project.title} — design by Brian Isale`,
        },
      ],
    },
    alternates: {
      canonical: `https://isalebryan.dev/work/design/${project.slug}`,
    },
  }
}

export default function DesignProjectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
