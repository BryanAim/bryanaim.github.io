import { NextResponse } from 'next/server'
import { saveTestimonial, countRecentByIp } from '@/lib/db'

export const dynamic = 'force-dynamic'

const ALLOWED_TYPES: Record<string, { magic: number[]; offset: number }[]> = {
  'image/jpeg': [{ magic: [0xFF, 0xD8, 0xFF], offset: 0 }],
  'image/png':  [{ magic: [0x89, 0x50, 0x4E, 0x47], offset: 0 }],
  'image/webp': [{ magic: [0x57, 0x45, 0x42, 0x50], offset: 8 }],
}

function detectMime(buf: Uint8Array): string | null {
  for (const [mime, sigs] of Object.entries(ALLOWED_TYPES)) {
    for (const { magic, offset } of sigs) {
      if (magic.every((b, i) => buf[offset + i] === b)) return mime
    }
  }
  return null
}

async function processImageFile(file: File): Promise<string | null> {
  if (!file || typeof file === 'string' || file.size === 0) return null
  if (file.size > 3 * 1024 * 1024)
    throw new Error('Each photo must be under 3 MB')
  const buf = new Uint8Array(await file.arrayBuffer())
  const mime = detectMime(buf)
  if (!mime) throw new Error('Unsupported photo format. Use JPG, PNG, or WebP.')
  return `data:${mime};base64,${Buffer.from(buf).toString('base64')}`
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'

  let body: FormData
  try {
    body = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  // Honeypot — bots fill this, humans leave it empty
  if (body.get('website')) {
    return NextResponse.json({ ok: true }) // silent drop
  }

  const name        = (body.get('name') as string | null)?.trim() ?? ''
  const role        = (body.get('role') as string | null)?.trim() || undefined
  const company     = (body.get('company') as string | null)?.trim() || undefined
  const text        = (body.get('text') as string | null)?.trim() ?? ''
  const ratingRaw   = body.get('rating')
  const projectSlug = (body.get('project_slug') as string | null)?.trim() ?? ''

  if (name.length < 2 || name.length > 120)
    return NextResponse.json({ error: 'Name must be 2–120 characters' }, { status: 400 })
  if (text.length < 20 || text.length > 1000)
    return NextResponse.json({ error: 'Review must be 20–1000 characters' }, { status: 400 })
  if (!projectSlug || !/^[a-z0-9-]+$/.test(projectSlug))
    return NextResponse.json({ error: 'Invalid project' }, { status: 400 })

  const rating = ratingRaw ? Number(ratingRaw) : undefined
  if (rating !== undefined && (rating < 1 || rating > 5 || !Number.isInteger(rating)))
    return NextResponse.json({ error: 'Rating must be 1–5' }, { status: 400 })

  // Rate limit: max 2 submissions per IP per project per 24 hours
  const recent = await countRecentByIp(ip, projectSlug)
  if (recent >= 2)
    return NextResponse.json({ error: 'You have already submitted feedback for this project recently.' }, { status: 429 })

  // Optional profile photo (for project/design testimonials)
  let photoData: string | undefined
  try {
    const photoFile = body.get('photo')
    if (photoFile && typeof photoFile !== 'string')
      photoData = (await processImageFile(photoFile as File)) ?? undefined
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 413 })
  }

  // Optional product photos — up to 2 (for shop reviews, already compressed client-side)
  const productPhotos: string[] = []
  try {
    for (const key of ['product_photo_1', 'product_photo_2'] as const) {
      const f = body.get(key)
      if (f && typeof f !== 'string') {
        const data = await processImageFile(f as File)
        if (data) productPhotos.push(data)
      }
    }
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 413 })
  }

  try {
    const id = await saveTestimonial({
      name, role, company, text, rating,
      project_slug: projectSlug,
      photo_data: photoData,
      product_photos: productPhotos.length > 0 ? productPhotos : undefined,
      ip,
    })
    return NextResponse.json({ id }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to save — please try again' }, { status: 500 })
  }
}
