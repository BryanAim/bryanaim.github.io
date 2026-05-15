import { NextResponse } from 'next/server'
import { getProductRatings } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const ratings = await getProductRatings()
    return NextResponse.json(ratings, {
      headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=60' },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch ratings' }, { status: 500 })
  }
}
