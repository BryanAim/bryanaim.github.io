import { NextResponse } from 'next/server'
import { createOrdersTable, getAllOrders } from '@/lib/db'

export async function GET() {
  await createOrdersTable()
  const orders = await getAllOrders()
  return NextResponse.json(orders)
}
