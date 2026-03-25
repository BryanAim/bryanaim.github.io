import { NextResponse } from 'next/server'
import { createOrdersTable, getAllOrders } from '@/lib/db'

export async function GET(request: Request) {
  const secret = process.env.ORDERS_API_SECRET
  const authHeader = request.headers.get('x-api-key')

  if (!secret || authHeader !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await createOrdersTable()
  const orders = await getAllOrders()
  return NextResponse.json(orders)
}
