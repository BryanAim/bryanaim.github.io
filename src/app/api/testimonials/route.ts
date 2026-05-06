import { NextResponse } from 'next/server'
import { getTestimonials } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const project = searchParams.get('project') ?? undefined
  try {
    const testimonials = await getTestimonials(project)
    return NextResponse.json(testimonials, {
      headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=60' },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 })
  }
}
