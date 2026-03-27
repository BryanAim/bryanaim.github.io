import { NextResponse } from 'next/server'
import { saveDesign } from '@/lib/db'

export const dynamic = 'force-dynamic'

// Allowed MIME types and their magic-byte signatures
const ALLOWED_TYPES: Record<string, { magic: number[]; offset: number }[]> = {
  'image/jpeg': [{ magic: [0xFF, 0xD8, 0xFF], offset: 0 }],
  'image/png':  [{ magic: [0x89, 0x50, 0x4E, 0x47], offset: 0 }],
  'image/gif':  [{ magic: [0x47, 0x49, 0x46, 0x38], offset: 0 }],
  'image/webp': [{ magic: [0x57, 0x45, 0x42, 0x50], offset: 8 }], // RIFF....WEBP
}

const MAX_BYTES = 5 * 1024 * 1024 // 5 MB

// Simple in-memory rate limiter (max 10 uploads per IP per minute)
const rateLimiter = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimiter.get(ip)
  if (!record || record.resetAt < now) {
    rateLimiter.set(ip, { count: 1, resetAt: now + 60_000 })
    return true
  }
  if (record.count >= 10) return false
  record.count++
  return true
}

function detectMimeType(buffer: Uint8Array): string | null {
  for (const [mime, sigs] of Object.entries(ALLOWED_TYPES)) {
    for (const { magic, offset } of sigs) {
      if (magic.every((byte, i) => buffer[offset + i] === byte)) return mime
    }
  }
  return null
}

export async function POST(request: Request) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many uploads — try again in a minute' }, { status: 429 })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const file = formData.get('file')
  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  // Check raw byte size before reading
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File exceeds 5 MB limit' }, { status: 413 })
  }
  if (file.size === 0) {
    return NextResponse.json({ error: 'File is empty' }, { status: 400 })
  }

  // Read bytes and validate magic bytes (not just Content-Type)
  const arrayBuffer = await file.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)
  const detectedMime = detectMimeType(buffer)

  if (!detectedMime) {
    return NextResponse.json({ error: 'Unsupported file type. Use JPG, PNG, WEBP, or GIF.' }, { status: 415 })
  }

  // Sanitize filename
  const rawName = typeof file.name === 'string' ? file.name : 'upload'
  const safeName = rawName.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120)

  // Convert to base64 data URL for storage
  const base64 = Buffer.from(buffer).toString('base64')
  const dataUrl = `data:${detectedMime};base64,${base64}`

  try {
    const designId = await saveDesign({
      data: dataUrl,
      mime_type: detectedMime,
      file_size: file.size,
      original_name: safeName,
    })
    return NextResponse.json({ designId }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to save design — please try again' }, { status: 500 })
  }
}
