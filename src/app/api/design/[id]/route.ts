import { NextResponse } from 'next/server'
import { getDesignById } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const design = await getDesignById(id)

  if (!design) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Extract raw bytes from the stored base64 data URL
  const match = (design.data as string).match(/^data:([^;]+);base64,(.+)$/)
  if (!match) {
    return NextResponse.json({ error: 'Corrupt design data' }, { status: 500 })
  }

  const [, mime, b64] = match
  const buffer = Buffer.from(b64, 'base64')

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': mime,
      'Content-Length': String(buffer.length),
      // Private — not indexed, not cached publicly
      'Cache-Control': 'private, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
