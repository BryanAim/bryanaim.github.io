import { NextResponse } from 'next/server'
import { setTestimonialStatus, deleteTestimonial } from '@/lib/db'

export const dynamic = 'force-dynamic'

function checkAdmin(request: Request): boolean {
  const secret = process.env.ADMIN_SECRET
  if (!secret) return false
  return request.headers.get('authorization') === `Bearer ${secret}`
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAdmin(request))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { status } = await request.json() as { status: 'published' | 'hidden' }
  if (status !== 'published' && status !== 'hidden')
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })

  try {
    await setTestimonialStatus(id, status)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAdmin(request))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  try {
    await deleteTestimonial(id)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
