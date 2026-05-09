import { MetadataRoute } from 'next'
import { designProjects } from './work/designProjects'

const BASE = 'https://isalebryan.dev'

const d = (s: string) => new Date(s)

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                    lastModified: d('2026-05-05'), changeFrequency: 'monthly', priority: 1.0 },
    { url: `${BASE}/about`,         lastModified: d('2026-05-01'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/contact`,       lastModified: d('2026-04-30'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/work`,          lastModified: d('2026-04-30'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/shop`,          lastModified: d('2026-05-05'), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/shop/custom`,   lastModified: d('2026-03-01'), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/bmx`,           lastModified: d('2026-03-01'), changeFrequency: 'monthly', priority: 0.5 },
  ]

  const designRoutes: MetadataRoute.Sitemap = designProjects.map(project => ({
    url: `${BASE}/work/design/${project.slug}`,
    lastModified: new Date(`${project.year}-01-01`),
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...designRoutes]
}
