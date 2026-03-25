import { NextResponse } from 'next/server'
import { createOrdersTable, createPendingOrder } from '@/lib/db'

export async function POST(request: Request) {
  const body = await request.json()
  const { phone, amount, customer_name, customer_email } = body

  // Validate inputs
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

  // 1. Get access token
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64')

  const tokenRes = await fetch(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    { headers: { Authorization: `Basic ${auth}` } }
  )
  if (!tokenRes.ok) {
    const text = await tokenRes.text()
    console.error('Token fetch failed:', tokenRes.status, text)
    return NextResponse.json({ error: 'Failed to authenticate with M-Pesa' }, { status: 502 })
  }
  const tokenData = await tokenRes.json()
  const accessToken = tokenData.access_token
  if (!accessToken) {
    console.error('No access_token in response:', tokenData)
    return NextResponse.json({ error: 'M-Pesa token missing' }, { status: 502 })
  }

  // 2. Build password
  const shortcode = process.env.MPESA_SHORTCODE!
  const passkey = process.env.MPESA_PASSKEY!
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')

  // 3. Normalise phone: 07XXXXXXXX → 2547XXXXXXXX
  const normalised = phone.startsWith('0')
    ? `254${phone.slice(1)}`
    : phone.replace(/^\+/, '')

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
    TransactionDesc: 'Sticker purchase',
  }

  try {
    const res = await fetch(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    )
    if (!res.ok) {
      const text = await res.text()
      console.error('STK push failed:', res.status, text)
      return NextResponse.json({ error: 'STK push request failed' }, { status: 502 })
    }
    const data = await res.json()

    // 4. Save pending order so we can match the callback later
    if (data.ResponseCode === '0' && data.CheckoutRequestID) {
      await createOrdersTable()
      await createPendingOrder({
        checkout_request_id: data.CheckoutRequestID,
        amount: Math.ceil(amount),
        phone: normalised,
        customer_name: customer_name ?? '',
        customer_email: customer_email ?? '',
      })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to initiate payment' }, { status: 500 })
  }
}
