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

  // Testimonials — client feedback for design projects, dev work, and shop orders
  await sql`
    CREATE TABLE IF NOT EXISTS testimonials (
      id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      name           TEXT        NOT NULL,
      role           TEXT,
      company        TEXT,
      text           TEXT        NOT NULL,
      rating         INTEGER     CHECK (rating BETWEEN 1 AND 5),
      project_slug   TEXT        NOT NULL,
      photo_data     TEXT,
      product_photos JSONB,
      status         TEXT        NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'hidden')),
      ip_hash        TEXT,
      created_at     TIMESTAMPTZ DEFAULT NOW()
    )
  `
  // Migrate existing testimonials tables that may be missing newer columns
  await sql`ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS product_photos JSONB`
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

// ─── Testimonials ─────────────────────────────────────────────────────────────

export interface Testimonial {
  id: string
  name: string
  role: string | null
  company: string | null
  text: string
  rating: number | null
  project_slug: string
  photo_data: string | null
  product_photos: string[] | null
  status: 'published' | 'hidden'
  created_at: string
}

function hashIp(ip: string): string {
  let h = 0
  for (let i = 0; i < ip.length; i++) { h = Math.imul(31, h) + ip.charCodeAt(i) | 0 }
  return Math.abs(h).toString(36)
}

export async function saveTestimonial(t: {
  name: string; role?: string; company?: string; text: string
  rating?: number; project_slug: string; photo_data?: string
  product_photos?: string[]; ip: string
}): Promise<string> {
  await ensureSchema()
  const rows = await sql`
    INSERT INTO testimonials (name, role, company, text, rating, project_slug, photo_data, product_photos, ip_hash)
    VALUES (
      ${t.name}, ${t.role ?? null}, ${t.company ?? null}, ${t.text},
      ${t.rating ?? null}, ${t.project_slug}, ${t.photo_data ?? null},
      ${t.product_photos ? JSON.stringify(t.product_photos) : null}, ${hashIp(t.ip)}
    ) RETURNING id
  `
  return rows[0].id as string
}

export async function getTestimonials(projectSlug?: string): Promise<Testimonial[]> {
  await ensureSchema()
  if (projectSlug) {
    return sql`
      SELECT id, name, role, company, text, rating, project_slug, photo_data, product_photos, status, created_at
      FROM testimonials WHERE status = 'published' AND project_slug = ${projectSlug}
      ORDER BY created_at DESC
    ` as unknown as Testimonial[]
  }
  return sql`
    SELECT id, name, role, company, text, rating, project_slug, photo_data, product_photos, status, created_at
    FROM testimonials WHERE status = 'published' ORDER BY created_at DESC
  ` as unknown as Testimonial[]
}

export async function getAllTestimonialsAdmin(): Promise<Testimonial[]> {
  await ensureSchema()
  return sql`
    SELECT id, name, role, company, text, rating, project_slug, photo_data, product_photos, status, created_at
    FROM testimonials ORDER BY created_at DESC
  ` as unknown as Testimonial[]
}

export async function setTestimonialStatus(id: string, status: 'published' | 'hidden'): Promise<void> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return
  await sql`UPDATE testimonials SET status = ${status} WHERE id = ${id}`
}

export async function deleteTestimonial(id: string): Promise<void> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return
  await sql`DELETE FROM testimonials WHERE id = ${id}`
}

export async function countRecentByIp(ip: string, projectSlug: string): Promise<number> {
  await ensureSchema()
  const rows = await sql`
    SELECT COUNT(*) AS count FROM testimonials
    WHERE ip_hash = ${hashIp(ip)} AND project_slug = ${projectSlug}
    AND created_at > NOW() - INTERVAL '24 hours'
  `
  return Number(rows[0].count)
}
