import { NextResponse } from 'next/server'
import { getAllTestimonialsAdmin } from '@/lib/db'

export const dynamic = 'force-dynamic'

function checkAdmin(request: Request): boolean {
  const secret = process.env.ADMIN_SECRET
  if (!secret) return false
  return request.headers.get('authorization') === `Bearer ${secret}`
}

export async function GET(request: Request) {
  if (!checkAdmin(request))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const testimonials = await getAllTestimonialsAdmin()
    return NextResponse.json(testimonials)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}
