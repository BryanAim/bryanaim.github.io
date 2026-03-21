import { NextResponse } from 'next/server'
import { createOrdersTable, confirmOrder } from '@/lib/db'

export async function POST(request: Request) {
  const body = await request.json()
  const callback = body?.Body?.stkCallback

  if (!callback) {
    return NextResponse.json({ received: true })
  }

  const { ResultCode, ResultDesc, CheckoutRequestID, CallbackMetadata } = callback

  if (ResultCode === 0) {
    try {
      const items: { Name: string; Value: string | number }[] = CallbackMetadata?.Item ?? []
      const get = (name: string) => items.find(i => i.Name === name)?.Value

      const order = {
        checkout_request_id: CheckoutRequestID,
        receipt: String(get('MpesaReceiptNumber')),
        amount: Number(get('Amount')),
        phone: String(get('PhoneNumber')),
        mpesa_date: String(get('TransactionDate')),
      }

      await createOrdersTable()
      await confirmOrder(order)
      console.log('✅ Payment confirmed and saved:', order.receipt)
    } catch (err) {
      console.error('❌ Failed to save confirmed payment to DB:', err)
    }
  } else {
    console.warn('❌ Payment failed:', ResultDesc)
  }

  return NextResponse.json({ received: true })
}
