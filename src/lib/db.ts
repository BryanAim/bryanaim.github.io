import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function createOrdersTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id                   SERIAL PRIMARY KEY,
      receipt              TEXT UNIQUE,
      amount               NUMERIC,
      phone                TEXT,
      mpesa_date           TEXT,
      checkout_request_id  TEXT UNIQUE,
      customer_name        TEXT,
      customer_email       TEXT,
      saved_at             TIMESTAMPTZ DEFAULT NOW(),
      status               TEXT DEFAULT 'pending'
    )
  `
}

export async function createPendingOrder(order: {
  checkout_request_id: string
  amount: number
  phone: string
  customer_name: string
  customer_email: string
}) {
  await sql`
    INSERT INTO orders (checkout_request_id, amount, phone, customer_name, customer_email, status)
    VALUES (${order.checkout_request_id}, ${order.amount}, ${order.phone}, ${order.customer_name}, ${order.customer_email}, 'pending')
    ON CONFLICT (checkout_request_id) DO NOTHING
  `
}

export async function confirmOrder(order: {
  checkout_request_id: string
  receipt: string
  amount: number
  phone: string
  mpesa_date: string
}) {
  // UPSERT — works whether or not a pending row already exists
  await sql`
    INSERT INTO orders (checkout_request_id, receipt, amount, phone, mpesa_date, status)
    VALUES (${order.checkout_request_id}, ${order.receipt}, ${order.amount}, ${order.phone}, ${order.mpesa_date}, 'paid')
    ON CONFLICT (checkout_request_id) DO UPDATE
      SET receipt    = EXCLUDED.receipt,
          amount     = EXCLUDED.amount,
          phone      = EXCLUDED.phone,
          mpesa_date = EXCLUDED.mpesa_date,
          status     = 'paid'
  `
}

export async function getOrderByCheckoutId(checkoutRequestId: string) {
  const rows = await sql`
    SELECT * FROM orders WHERE checkout_request_id = ${checkoutRequestId}
  `
  return rows[0] ?? null
}

export async function getAllOrders() {
  return sql`SELECT * FROM orders ORDER BY saved_at DESC`
}
