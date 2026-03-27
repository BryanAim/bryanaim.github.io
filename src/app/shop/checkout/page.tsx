'use client'

import { useState, useEffect, useRef } from 'react'
import {
  loadCart, saveCart, CART_KEY, CartItem,
  TSHIRT_COLORS, TSHIRT_SIZES, TSHIRT_SIZE_PRICES,
  STICKER_PRESETS, catalogStickerPrice,
} from '@/lib/shopTypes'
import styles from './checkout.module.css'

type Stage = 'form' | 'waiting' | 'paid' | 'error'

interface Order {
  receipt: string; amount: number; phone: string
  mpesa_date: string; customer_name: string; customer_email: string
}

interface DeliveryOption { id: string; label: string; description: string; price: number }

const DELIVERY_OPTIONS: DeliveryOption[] = [
  { id: 'meetup', label: 'Meetup in Town (CBD)',           description: 'Agreed spot in Nakuru CBD — coordinate via WhatsApp', price: 0   },
  { id: 'near',   label: 'Delivery — nearby (0–5 km)',     description: 'Milimani, Section 58, Pipeline, Kaptembwo…',          price: 100 },
  { id: 'mid',    label: 'Delivery — mid-range (5–15 km)', description: 'Lanet, Bahati, Nakuru East, London, Bondeni…',        price: 150 },
  { id: 'far',    label: 'Delivery — outskirts (15+ km)',  description: 'Salgaa, Njoro, Molo, Subukia and beyond',             price: 200 },
]

export default function Checkout() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [delivery, setDelivery] = useState<DeliveryOption>(DELIVERY_OPTIONS[0])
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [stage, setStage] = useState<Stage>('form')
  const [errorMsg, setErrorMsg] = useState('')
  const [checkoutRequestId, setCheckoutRequestId] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => { setCart(loadCart()) }, [])

  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  const updateCart = (next: CartItem[]) => { setCart(next); saveCart(next) }
  const changeQty   = (cartId: string, delta: number) =>
    updateCart(cart.map(i => i.cartId === cartId ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i))
  const removeItem  = (cartId: string) => updateCart(cart.filter(i => i.cartId !== cartId))

  const updateItem  = (cartId: string, patch: Partial<CartItem>) =>
    updateCart(cart.map(i => i.cartId === cartId ? { ...i, ...patch } : i))

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)
  const total    = subtotal + delivery.price

  // Poll for M-Pesa confirmation
  useEffect(() => {
    if (stage !== 'waiting' || !checkoutRequestId) return
    let attempts = 0
    pollRef.current = setInterval(async () => {
      attempts++
      try {
        const res  = await fetch(`/api/mpesa/status/${encodeURIComponent(checkoutRequestId)}`)
        const data = await res.json()
        if (data.status === 'paid') {
          clearInterval(pollRef.current!)
          setOrder(data)
          setStage('paid')
          localStorage.removeItem(CART_KEY)
        }
      } catch { /* ignore network blips */ }
      if (attempts >= 24) {
        clearInterval(pollRef.current!)
        setErrorMsg('Payment not confirmed after 2 minutes. If you paid, contact us with your M-Pesa receipt.')
        setStage('error')
      }
    }, 5000)
    return () => clearInterval(pollRef.current!)
  }, [stage, checkoutRequestId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStage('waiting')
    setErrorMsg('')
    try {
      const cartForServer = cart.map(({ image: _img, ...rest }) => rest)
      const designIds     = cart.flatMap(i => i.designId ? [i.designId] : [])
      const res = await fetch('/api/mpesa/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: form.phone, amount: total,
          customer_name: form.name, customer_email: form.email,
          cart_json: cartForServer, delivery_option: delivery.id,
          delivery_fee: delivery.price,
          design_ids: designIds.length > 0 ? designIds : undefined,
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

  const formatDate = (d: string) => {
    if (!d || d.length < 14) return d
    return `${d.slice(6,8)}/${d.slice(4,6)}/${d.slice(0,4)} at ${d.slice(8,10)}:${d.slice(10,12)}`
  }

  // ── Success receipt ──────────────────────────────────────────────────────────
  if (stage === 'paid' && order) {
    return (
      <main id="checkout">
        <h1 className="lg-heading">Pay<span className="text-secondary">ment</span></h1>
        <div className="receipt">
          <div className="receipt-header">
            <h2>Payment Successful!</h2>
            <p>Thank you, <strong>{order.customer_name || 'Customer'}</strong>. Your order is confirmed.</p>
          </div>
          <div className="receipt-body">
            <h3 className="text-secondary">E-Receipt</h3>
            <table className="receipt-table">
              <tbody>
                <tr><td>Receipt No.</td><td><strong>{order.receipt}</strong></td></tr>
                <tr><td>Amount Paid</td><td><strong>KES {order.amount.toLocaleString()}</strong></td></tr>
                <tr><td>Phone</td><td>{order.phone}</td></tr>
                <tr><td>Date</td><td>{formatDate(order.mpesa_date)}</td></tr>
                {order.customer_email && <tr><td>Email</td><td>{order.customer_email}</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="receipt-footer">
            <p>Keep this receipt. We will reach out to arrange delivery or meetup.</p>
            <button className="btn-light" onClick={() => window.print()}>Print Receipt</button>
            <a href="/shop" className="btn-dark">Continue Shopping</a>
          </div>
        </div>
      </main>
    )
  }

  // ── Waiting for M-Pesa ───────────────────────────────────────────────────────
  if (stage === 'waiting') {
    return (
      <main id="checkout">
        <h1 className="lg-heading">Pay<span className="text-secondary">ing…</span></h1>
        <div className="checkout-form">
          <div className="waiting">
            <div className="spinner" />
            <h3>Check your phone</h3>
            <p>M-Pesa prompt sent to <strong>{form.phone}</strong>.</p>
            <p>Enter your <span className="text-secondary">M-Pesa PIN</span> to pay <strong>KES {total.toLocaleString()}</strong>.</p>
            <p className="waiting-note">Waiting for confirmation…</p>
          </div>
        </div>
      </main>
    )
  }

  // ── Error ────────────────────────────────────────────────────────────────────
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

  // ── Main checkout ────────────────────────────────────────────────────────────
  return (
    <main id="checkout">
      <nav className="breadcrumb">
        <a href="/shop">← Back to Shop</a>
      </nav>
      <h1 className="lg-heading">Check<span className="text-secondary">out</span></h1>
      <h2 className="sm-heading">Review your order and pay with M-Pesa</h2>

      {cart.length === 0 ? (
        <div className="checkout-form">
          <p style={{ color: '#888' }}>
            Your cart is empty. <a href="/shop" style={{ color: '#b1db00' }}>Go back to shop</a>.
          </p>
        </div>
      ) : (
        <div className={styles.layout}>

          {/* ── LEFT: cart + delivery ── */}
          <div className={styles.left}>

            {/* Cart items */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>
                Your Items
                <span className={styles.sectionCount}>{cart.reduce((s,i) => s + i.quantity, 0)} item{cart.reduce((s,i) => s + i.quantity, 0) !== 1 ? 's' : ''}</span>
              </h3>
              <div className={styles.items}>
                {cart.map(item => {
                  const isExpanded = expandedItem === item.cartId
                  const isTshirt   = item.type === 'tshirt' || item.type === 'custom_tshirt'
                  const isSticker  = item.type === 'sticker'
                  return (
                    <div key={item.cartId} className={styles.item}>
                      <img src={item.image} alt={item.name} className={styles.itemImg} />
                      <div className={styles.itemInfo}>
                        <p className={styles.itemName}>{item.name}</p>
                        {isTshirt && item.color && item.size && (
                          <p className={styles.itemMeta}>
                            <span className={styles.colorDot} style={{ background: item.color.hex }} />
                            {item.color.label} · {item.size}
                          </p>
                        )}
                        {(isSticker || item.type === 'custom_sticker') && item.widthCm && item.heightCm && (
                          <p className={styles.itemMeta}>
                            {item.widthCm} × {item.heightCm} cm{item.type === 'custom_sticker' ? ' (custom)' : ''}
                          </p>
                        )}
                        {item.notes && <p className={styles.itemNotes}>Note: {item.notes}</p>}

                        {/* Inline editor */}
                        {(isTshirt || isSticker) && (
                          <button
                            className={styles.editToggleBtn}
                            onClick={() => setExpandedItem(isExpanded ? null : item.cartId)}
                          >
                            {isExpanded ? 'Done' : 'Edit'}
                          </button>
                        )}
                        {isExpanded && isTshirt && (
                          <div className={styles.inlineEdit}>
                            <p className={styles.inlineEditLabel}>Color</p>
                            <div className={styles.inlineColors}>
                              {TSHIRT_COLORS.map(c => (
                                <button
                                  key={c.name}
                                  title={c.label}
                                  className={`${styles.inlineColorSwatch} ${item.color?.name === c.name ? styles.inlineColorSwatchActive : ''}`}
                                  style={{ background: c.hex, borderColor: c.name === 'white' ? '#999' : 'transparent' }}
                                  onClick={() => updateItem(item.cartId, { color: c })}
                                />
                              ))}
                            </div>
                            <p className={styles.inlineEditLabel} style={{ marginTop: '0.5rem' }}>Size</p>
                            <div className={styles.inlineSizes}>
                              {TSHIRT_SIZES.map(s => (
                                <button
                                  key={s}
                                  className={`${styles.inlineSizeBtn} ${item.size === s ? styles.inlineSizeBtnActive : ''}`}
                                  onClick={() => updateItem(item.cartId, { size: s, price: TSHIRT_SIZE_PRICES[s] })}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        {isExpanded && isSticker && (
                          <div className={styles.inlineEdit}>
                            <p className={styles.inlineEditLabel}>Size</p>
                            <div className={styles.inlineSizes}>
                              {STICKER_PRESETS.map(preset => (
                                <button
                                  key={preset.label}
                                  className={`${styles.inlineSizeBtn} ${item.widthCm === preset.widthCm ? styles.inlineSizeBtnActive : ''}`}
                                  onClick={() => updateItem(item.cartId, {
                                    widthCm: preset.widthCm,
                                    heightCm: preset.heightCm,
                                    price: catalogStickerPrice(item.price, preset),
                                  })}
                                >
                                  <span>{preset.label}</span>
                                  <span style={{ fontSize: '0.7rem', display: 'block' }}>{preset.widthCm}×{preset.heightCm}cm</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className={styles.itemControls}>
                          <button className={styles.qtyBtn} onClick={() => changeQty(item.cartId, -1)} aria-label="Decrease">−</button>
                          <span className={styles.qtyNum}>{item.quantity}</span>
                          <button className={styles.qtyBtn} onClick={() => changeQty(item.cartId, +1)} aria-label="Increase">+</button>
                          <button className={styles.removeBtn} onClick={() => removeItem(item.cartId)}>Remove</button>
                        </div>
                      </div>
                      <div className={styles.itemPriceCol}>
                        <span className={styles.itemTotal}>KES {(item.price * item.quantity).toLocaleString()}</span>
                        <span className={styles.itemUnit}>KES {item.price.toLocaleString()} ea.</span>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className={styles.subtotalRow}>
                <span>Subtotal</span>
                <span>KES {subtotal.toLocaleString()}</span>
              </div>
            </section>

            {/* Delivery */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Delivery / Pickup — Nakuru</h3>
              <div className={styles.deliveryOptions}>
                {DELIVERY_OPTIONS.map(opt => (
                  <label key={opt.id} className={`${styles.deliveryOpt} ${delivery.id === opt.id ? styles.deliveryOptActive : ''}`}>
                    <input
                      type="radio" name="delivery" value={opt.id}
                      checked={delivery.id === opt.id}
                      onChange={() => setDelivery(opt)}
                      className={styles.radioInput}
                    />
                    <div className={styles.deliveryInfo}>
                      <span className={styles.deliveryLabel}>{opt.label}</span>
                      <span className={styles.deliveryDesc}>{opt.description}</span>
                    </div>
                    <span className={`${styles.deliveryPrice} ${delivery.id === opt.id ? styles.deliveryPriceActive : ''}`}>
                      {opt.price === 0 ? 'Free' : `+ KES ${opt.price}`}
                    </span>
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* ── RIGHT: form + totals + pay ── */}
          <div className={styles.right}>
            <div className={styles.stickyPanel}>

              {/* Order total breakdown */}
              <div className={styles.totals}>
                <div className={styles.totalRow}>
                  <span>Subtotal</span><span>KES {subtotal.toLocaleString()}</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Delivery</span>
                  <span>{delivery.price === 0 ? 'Free' : `KES ${delivery.price}`}</span>
                </div>
                <div className={styles.totalRowFinal}>
                  <span>Total</span>
                  <strong>KES {total.toLocaleString()}</strong>
                </div>
              </div>

              {/* Contact form */}
              <form onSubmit={handleSubmit} className={styles.form}>
                <h3 className={styles.formTitle}>Your Details</h3>
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" placeholder="Your full name" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" placeholder="your@email.com" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>M-Pesa Phone</label>
                  <input type="tel" placeholder="07XXXXXXXX" value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })} required />
                </div>
                <button type="submit" className={styles.payBtn}>
                  Pay KES {total.toLocaleString()} with M-Pesa
                </button>
                <p className={styles.payNote}>
                  You will receive an M-Pesa prompt on your phone. Enter your PIN to confirm.
                </p>
              </form>

            </div>
          </div>
        </div>
      )}
    </main>
  )
}
