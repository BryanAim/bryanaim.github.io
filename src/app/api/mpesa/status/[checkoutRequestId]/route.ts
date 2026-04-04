import { NextResponse } from 'next/server'
import { getOrderByCheckoutId } from '@/lib/db'

// Safaricom CheckoutRequestID format: ws_CO_DDMMYYYYHHMMSS_XXXXXXXXXXXXXXXXX
const CHECKOUT_ID_RE = /^[a-zA-Z0-9_-]{10,80}$/

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ checkoutRequestId: string }> }
) {
  const { checkoutRequestId } = await params

  if (!checkoutRequestId || !CHECKOUT_ID_RE.test(checkoutRequestId)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const order = await getOrderByCheckoutId(checkoutRequestId)

  // Only return the status — never leak phone, email, or cart data to the polling client
  if (!order) return NextResponse.json({ status: 'pending' })
  return NextResponse.json({ status: order.status, receipt: order.receipt ?? null })
}
