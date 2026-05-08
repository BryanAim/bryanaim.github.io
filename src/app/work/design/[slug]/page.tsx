import type { Metadata } from 'next'
import { designProjects } from '../../designProjects'
import DesignProjectClient from './DesignProjectClient'

const BASE = 'https://isalebryan.dev'

export function generateStaticParams() {
  return designProjects.map(p => ({ slug: p.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const project = designProjects.find(p => p.slug === slug)
  if (!project) return { title: 'Project Not Found' }
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `${BASE}/work/design/${slug}` },
    openGraph: {
      url: `${BASE}/work/design/${slug}`,
      title: `${project.title} | Brian Isale`,
      description: project.description,
      images: [{ url: `${BASE}${project.primaryImage}` }],
    },
  }
}

export default function DesignProjectPage() {
  return <DesignProjectClient />
}
