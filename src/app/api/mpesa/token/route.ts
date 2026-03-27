import { NextResponse } from 'next/server'

// This endpoint is intentionally disabled — token generation is handled
// server-side within the stkpush route to avoid exposing M-Pesa credentials.
export async function GET() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
