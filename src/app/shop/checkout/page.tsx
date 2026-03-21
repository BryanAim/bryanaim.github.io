'use client'

import { useState, useEffect, useRef } from 'react'

type Stage = 'form' | 'waiting' | 'paid' | 'error'

interface Order {
  receipt: string
  amount: number
  phone: string
  mpesa_date: string
  customer_name: string
  customer_email: string
  saved_at: string
}

export default function Checkout() {
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [amount, setAmount] = useState(800)
  const [stage, setStage] = useState<Stage>('form')
  const [errorMsg, setErrorMsg] = useState('')
  const [checkoutRequestId, setCheckoutRequestId] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Poll for payment confirmation
  useEffect(() => {
    if (stage !== 'waiting' || !checkoutRequestId) return

    let attempts = 0
    pollRef.current = setInterval(async () => {
      attempts++
      try {
        const res = await fetch(`/api/mpesa/status/${encodeURIComponent(checkoutRequestId)}`)
        const data = await res.json()
        if (data.status === 'paid') {
          clearInterval(pollRef.current!)
          setOrder(data)
          setStage('paid')
        }
      } catch { /* ignore network blips */ }

      if (attempts >= 24) { // 2 min timeout
        clearInterval(pollRef.current!)
        setErrorMsg('Payment not confirmed after 2 minutes. If you paid, contact us with your M-Pesa message.')
        setStage('error')
      }
    }, 5000) // poll every 5s

    return () => clearInterval(pollRef.current!)
  }, [stage, checkoutRequestId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStage('waiting')
    setErrorMsg('')

    try {
      const res = await fetch('/api/mpesa/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: form.phone,
          amount,
          customer_name: form.name,
          customer_email: form.email,
        }),
      })
      const data = await res.json()

      if (data.ResponseCode === '0') {
        setCheckoutRequestId(data.CheckoutRequestID)
      } else {
        setErrorMsg(data.errorMessage ?? data.ResponseDescription ?? 'Payment initiation failed.')
        setStage('error')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
      setStage('error')
    }
  }

  const formatDate = (mpesaDate: string) => {
    if (!mpesaDate || mpesaDate.length < 14) return mpesaDate
    const y = mpesaDate.slice(0, 4)
    const mo = mpesaDate.slice(4, 6)
    const d = mpesaDate.slice(6, 8)
    const h = mpesaDate.slice(8, 10)
    const mi = mpesaDate.slice(10, 12)
    return `${d}/${mo}/${y} at ${h}:${mi}`
  }

  if (stage === 'paid' && order) {
    return (
      <main id="checkout">
        <h1 className="lg-heading">Pay<span className="text-secondary">ment</span></h1>
        <div className="receipt">
          <div className="receipt-header">
            <h2>✅ Payment Successful!</h2>
            <p>Thank you, <strong>{order.customer_name || 'Customer'}</strong>. Your order is confirmed.</p>
          </div>
          <div className="receipt-body">
            <h3 className="text-secondary">E-Receipt</h3>
            <table className="receipt-table">
              <tbody>
                <tr><td>Receipt No.</td><td><strong>{order.receipt}</strong></td></tr>
                <tr><td>Amount Paid</td><td><strong>KES {order.amount}</strong></td></tr>
                <tr><td>Phone</td><td>{order.phone}</td></tr>
                <tr><td>Date</td><td>{formatDate(order.mpesa_date)}</td></tr>
                {order.customer_email && <tr><td>Email</td><td>{order.customer_email}</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="receipt-footer">
            <p>Keep this receipt for your records.</p>
            <button className="btn-light" onClick={() => window.print()}>🖨 Print Receipt</button>
            <a href="/shop" className="btn-dark">Continue Shopping</a>
          </div>
        </div>
      </main>
    )
  }

  if (stage === 'waiting') {
    return (
      <main id="checkout">
        <h1 className="lg-heading">Pay<span className="text-secondary">ing...</span></h1>
        <div className="checkout-form">
          <div className="waiting">
            <div className="spinner"></div>
            <h3>Check your phone</h3>
            <p>An M-Pesa prompt has been sent to <strong>{form.phone}</strong>.</p>
            <p>Enter your <span className="text-secondary">M-Pesa PIN</span> to complete payment of <strong>KES {amount}</strong>.</p>
            <p className="waiting-note">Waiting for confirmation...</p>
          </div>
        </div>
      </main>
    )
  }

  if (stage === 'error') {
    return (
      <main id="checkout">
        <h1 className="lg-heading">Check<span className="text-secondary">out</span></h1>
        <div className="checkout-form">
          <p className="status-error">{errorMsg}</p>
          <button className="btn-dark" onClick={() => setStage('form')}>Try Again</button>
        </div>
      </main>
    )
  }

  return (
    <main id="checkout">
      <h1 className="lg-heading">Check<span className="text-secondary">out</span></h1>
      <h2 className="sm-heading">Complete your purchase with M-Pesa</h2>

      <div className="checkout-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>M-Pesa Phone</label>
            <input
              type="tel"
              placeholder="07XXXXXXXX"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>
          <p className="amount-display">Total: <span className="text-secondary">KES {amount}</span></p>
          <button type="submit" className="btn-dark">Pay with M-Pesa</button>
        </form>
      </div>
    </main>
  )
}
