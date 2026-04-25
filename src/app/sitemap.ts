import { MetadataRoute } from 'next'
import { designProjects } from './work/designProjects'

const BASE = 'https://isalebryan.dev'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,              lastModified: new Date(), changeFrequency: 'monthly', priority: 1.0 },
    { url: `${BASE}/about`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/bmx`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/shop`,    lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.6 },
  ]

  const designRoutes: MetadataRoute.Sitemap = designProjects.map(project => ({
    url: `${BASE}/work/design/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...designRoutes]
}
