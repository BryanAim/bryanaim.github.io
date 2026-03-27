import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

// ─── Schema migration (idempotent, runs once per cold start) ─────────────────

let schemaMigrated = false

export async function ensureSchema() {
  if (schemaMigrated) return
  schemaMigrated = true

  // Designs — stores uploaded artwork for custom orders
  await sql`
    CREATE TABLE IF NOT EXISTS designs (
      id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      data          TEXT        NOT NULL,
      mime_type     TEXT        NOT NULL,
      file_size     INTEGER     NOT NULL,
      original_name TEXT,
      created_at    TIMESTAMPTZ DEFAULT NOW()
    )
  `

  // Orders table (full schema — new installs get everything)
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id                   SERIAL      PRIMARY KEY,
      receipt              TEXT        UNIQUE,
      amount               NUMERIC,
      phone                TEXT,
      mpesa_date           TEXT,
      checkout_request_id  TEXT        UNIQUE,
      customer_name        TEXT,
      customer_email       TEXT,
      saved_at             TIMESTAMPTZ DEFAULT NOW(),
      status               TEXT        DEFAULT 'pending',
      cart_json            JSONB,
      delivery_option      TEXT,
      delivery_fee         NUMERIC     DEFAULT 0,
      design_ids           TEXT[],
      notes                TEXT
    )
  `

  // Migrate existing orders tables that may be missing newer columns
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS cart_json       JSONB`
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_option TEXT`
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_fee    NUMERIC DEFAULT 0`
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS design_ids      TEXT[]`
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes           TEXT`
}

// ─── Designs ─────────────────────────────────────────────────────────────────

export async function saveDesign(design: {
  data: string        // base64 data URL
  mime_type: string
  file_size: number
  original_name: string
}): Promise<string> {
  await ensureSchema()
  const rows = await sql`
    INSERT INTO designs (data, mime_type, file_size, original_name)
    VALUES (${design.data}, ${design.mime_type}, ${design.file_size}, ${design.original_name})
    RETURNING id
  `
  return rows[0].id as string
}

export async function getDesignById(id: string) {
  // UUID format check to prevent injection
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return null
  }
  const rows = await sql`SELECT * FROM designs WHERE id = ${id}`
  return rows[0] ?? null
}

// ─── Orders ──────────────────────────────────────────────────────────────────

/** @deprecated Use ensureSchema() instead */
export async function createOrdersTable() {
  await ensureSchema()
}

export async function createPendingOrder(order: {
  checkout_request_id: string
  amount: number
  phone: string
  customer_name: string
  customer_email: string
  cart_json?: object
  delivery_option?: string
  delivery_fee?: number
  design_ids?: string[]
  notes?: string
}) {
  await sql`
    INSERT INTO orders (
      checkout_request_id, amount, phone, customer_name, customer_email,
      status, cart_json, delivery_option, delivery_fee, design_ids, notes
    )
    VALUES (
      ${order.checkout_request_id},
      ${order.amount},
      ${order.phone},
      ${order.customer_name},
      ${order.customer_email},
      'pending',
      ${order.cart_json ? JSON.stringify(order.cart_json) : null},
      ${order.delivery_option ?? null},
      ${order.delivery_fee ?? 0},
      ${order.design_ids ?? null},
      ${order.notes ?? null}
    )
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
