import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const VALID_SUBJECTS = ['Job Opportunity', 'Freelance Project', 'Collaboration', 'General Inquiry']

let schemaMigrated = false

async function ensureSchema() {
  if (schemaMigrated) return
  schemaMigrated = true
  const sql = neon(process.env.DATABASE_URL!)
  await sql`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      name       TEXT        NOT NULL,
      email      TEXT        NOT NULL,
      subject    TEXT        NOT NULL,
      message    TEXT        NOT NULL,
      ip_hash    TEXT,
      status     TEXT        NOT NULL DEFAULT 'unread',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
}

function hashIp(ip: string): string {
  let h = 0
  for (let i = 0; i < ip.length; i++) { h = Math.imul(31, h) + ip.charCodeAt(i) | 0 }
  return Math.abs(h).toString(36)
}

export async function POST(request: Request) {
  let body: Record<string, string>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const { name, email, subject, message, website } = body

  // Honeypot — bots fill the hidden website field
  if (website) return NextResponse.json({ ok: true })

  if (!name || name.trim().length < 2 || name.trim().length > 120)
    return NextResponse.json({ error: 'Name must be 2–120 characters.' }, { status: 422 })
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 422 })
  if (!subject || !VALID_SUBJECTS.includes(subject))
    return NextResponse.json({ error: 'Please select a valid subject.' }, { status: 422 })
  if (!message || message.trim().length < 20 || message.trim().length > 2000)
    return NextResponse.json({ error: 'Message must be 20–2000 characters.' }, { status: 422 })

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const ipHash = hashIp(ip)

  await ensureSchema()
  const sql = neon(process.env.DATABASE_URL!)

  const recent = await sql`
    SELECT COUNT(*) AS count FROM contact_submissions
    WHERE ip_hash = ${ipHash} AND created_at > NOW() - INTERVAL '24 hours'
  `
  if (Number(recent[0].count) >= 3)
    return NextResponse.json({ error: 'Too many messages. Please try again tomorrow.' }, { status: 429 })

  await sql`
    INSERT INTO contact_submissions (name, email, subject, message, ip_hash)
    VALUES (${name.trim()}, ${email.trim()}, ${subject}, ${message.trim()}, ${ipHash})
  `

  return NextResponse.json({ ok: true })
}
