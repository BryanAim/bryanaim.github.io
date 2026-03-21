import { NextResponse } from 'next/server'
import { getOrderByCheckoutId } from '@/lib/db'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ checkoutRequestId: string }> }
) {
  const { checkoutRequestId } = await params
  const order = await getOrderByCheckoutId(checkoutRequestId)
  return NextResponse.json(order ?? { status: 'pending' })
}
