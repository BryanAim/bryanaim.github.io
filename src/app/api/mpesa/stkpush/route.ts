import { NextResponse } from 'next/server'
import { ensureSchema, createPendingOrder } from '@/lib/db'

export async function POST(request: Request) {
  const body = await request.json()
  const {
    phone, amount, customer_name, customer_email,
    cart_json, delivery_option, delivery_fee, design_ids, notes,
  } = body

  // ── Input validation ─────────────────────────────────────────────────────
  if (!phone || typeof phone !== 'string' || !/^\+?0?\d{9,12}$/.test(phone.trim())) {
    return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
  }
  if (!amount || typeof amount !== 'number' || amount < 1 || amount > 150000 || !isFinite(amount)) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
  }
  if (customer_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer_email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }
  if (customer_name && (typeof customer_name !== 'string' || customer_name.length > 100)) {
    return NextResponse.json({ error: 'Invalid name' }, { status: 400 })
  }
  if (design_ids && !Array.isArray(design_ids)) {
    return NextResponse.json({ error: 'Invalid design_ids' }, { status: 400 })
  }

  // ── 1. Get M-Pesa access token ────────────────────────────────────────────
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64')

  const tokenRes = await fetch(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    { headers: { Authorization: `Basic ${auth}` } }
  )
  if (!tokenRes.ok) {
    return NextResponse.json({ error: 'Failed to authenticate with M-Pesa' }, { status: 502 })
  }
  const tokenData = await tokenRes.json()
  const accessToken = tokenData.access_token
  if (!accessToken) {
    return NextResponse.json({ error: 'M-Pesa token missing' }, { status: 502 })
  }

  // ── 2. Build STK push payload ─────────────────────────────────────────────
  const shortcode = process.env.MPESA_SHORTCODE!
  const passkey = process.env.MPESA_PASSKEY!
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')

  const normalised = phone.trim().startsWith('0')
    ? `254${phone.trim().slice(1)}`
    : phone.trim().replace(/^\+/, '')

  // Build a short order description (max 13 chars for M-Pesa)
  const hasCustom = Array.isArray(cart_json) && cart_json.some(
    (i: { type?: string }) => i.type?.startsWith('custom_')
  )
  const transDesc = hasCustom ? 'Custom order' : 'Shop order'

  const payload = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: Math.ceil(amount),
    PartyA: normalised,
    PartyB: shortcode,
    PhoneNumber: normalised,
    CallBackURL: process.env.MPESA_CALLBACK_URL,
    AccountReference: 'BryanShop',
    TransactionDesc: transDesc,
  }

  try {
    const res = await fetch(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    )
    if (!res.ok) {
      return NextResponse.json({ error: 'STK push request failed' }, { status: 502 })
    }
    const data = await res.json()

    // ── 3. Save pending order ─────────────────────────────────────────────────
    if (data.ResponseCode === '0' && data.CheckoutRequestID) {
      await ensureSchema()
      await createPendingOrder({
        checkout_request_id: data.CheckoutRequestID,
        amount: Math.ceil(amount),
        phone: normalised,
        customer_name: customer_name ?? '',
        customer_email: customer_email ?? '',
        cart_json: cart_json ?? null,
        delivery_option: delivery_option ?? undefined,
        delivery_fee: typeof delivery_fee === 'number' ? delivery_fee : 0,
        design_ids: Array.isArray(design_ids) ? design_ids : [],
        notes: typeof notes === 'string' ? notes.slice(0, 1000) : undefined,
      })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to initiate payment' }, { status: 500 })
  }
}
