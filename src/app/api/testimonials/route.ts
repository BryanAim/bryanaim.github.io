import { NextResponse } from 'next/server'
import { getTestimonials, getTestimonialsForSlugs } from '@/lib/db'

export const dynamic = 'force-dynamic'

const CACHE = { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=60' } }

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const project = searchParams.get('project') ?? undefined
  const projects = searchParams.get('projects')
  try {
    const testimonials = projects
      ? await getTestimonialsForSlugs(projects.split(',').map(s => s.trim()).filter(Boolean))
      : await getTestimonials(project)
    return NextResponse.json(testimonials, CACHE)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 })
  }
}
