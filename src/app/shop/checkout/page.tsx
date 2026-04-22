'use client'

import { useState, useEffect, useRef } from 'react'
import {
  loadCart, saveCart, CART_KEY, CartItem,
  TSHIRT_COLORS, TSHIRT_SIZES, TSHIRT_SIZE_PRICES,
  STICKER_PRESETS, catalogStickerPrice,
} from '@/lib/shopTypes'

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
      <main id="checkout" className="print:bg-white print:text-black">
        <h1 className="text-[7rem] mb-[0.2rem] text-center font-semibold max-sm:leading-none max-sm:mb-4">Pay<span className="text-lime">ment</span></h1>
        <div className="bg-[#515151] border-b-[5px] border-[#b1db00] max-w-[560px] p-8 print:bg-white print:text-black print:border-[#ccc]">
          <div className="border-b border-[#666] mb-6 pb-4">
            <h2 className="text-[1.8rem] mb-2">Payment Successful!</h2>
            <p>Thank you, <strong>{order.customer_name || 'Customer'}</strong>. Your order is confirmed.</p>
          </div>
          <div>
            <h3 className="text-lime mb-4">E-Receipt</h3>
            <table className="w-full border-collapse mb-6">
              <tbody>
                <tr>
                  <td className="py-2 px-[0.8rem] border-b border-[#666] text-[#aaa] w-[40%] print:text-black print:border-[#ccc]">Receipt No.</td>
                  <td className="py-2 px-[0.8rem] border-b border-[#666] print:text-black print:border-[#ccc]"><strong>{order.receipt}</strong></td>
                </tr>
                <tr>
                  <td className="py-2 px-[0.8rem] border-b border-[#666] text-[#aaa] w-[40%] print:text-black print:border-[#ccc]">Amount Paid</td>
                  <td className="py-2 px-[0.8rem] border-b border-[#666] print:text-black print:border-[#ccc]"><strong>KES {order.amount.toLocaleString()}</strong></td>
                </tr>
                <tr>
                  <td className="py-2 px-[0.8rem] border-b border-[#666] text-[#aaa] w-[40%] print:text-black print:border-[#ccc]">Phone</td>
                  <td className="py-2 px-[0.8rem] border-b border-[#666] print:text-black print:border-[#ccc]">{order.phone}</td>
                </tr>
                <tr>
                  <td className="py-2 px-[0.8rem] border-b border-[#666] text-[#aaa] w-[40%] print:text-black print:border-[#ccc]">Date</td>
                  <td className="py-2 px-[0.8rem] border-b border-[#666] print:text-black print:border-[#ccc]">{formatDate(order.mpesa_date)}</td>
                </tr>
                {order.customer_email && (
                  <tr>
                    <td className="py-2 px-[0.8rem] border-b border-[#666] text-[#aaa] w-[40%] print:text-black print:border-[#ccc]">Email</td>
                    <td className="py-2 px-[0.8rem] border-b border-[#666] print:text-black print:border-[#ccc]">{order.customer_email}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="border-t border-[#666] pt-4 flex gap-4 items-center flex-wrap">
            <p className="w-full text-[#aaa] italic mb-4">Keep this receipt. We will reach out to arrange delivery or meetup.</p>
            <button className="block px-4 py-2 mb-[0.3rem] cursor-pointer border-0 bg-[#c4c4c4] text-[#333] transition-colors hover:bg-lime hover:text-black print:hidden" onClick={() => window.print()}>Print Receipt</button>
            <a href="/shop" className="block px-4 py-2 mb-[0.3rem] cursor-pointer border-0 bg-black text-white transition-colors hover:bg-lime hover:text-black print:hidden">Continue Shopping</a>
          </div>
        </div>
      </main>
    )
  }

  // ── Waiting for M-Pesa ───────────────────────────────────────────────────────
  if (stage === 'waiting') {
    return (
      <main id="checkout">
        <h1 className="text-[7rem] mb-[0.2rem] text-center font-semibold max-sm:leading-none max-sm:mb-4">Pay<span className="text-lime">ing…</span></h1>
        <div className="bg-[#515151] p-8 border-b-[5px] border-[#b1db00] max-w-[480px]">
          <div className="text-center py-8">
            <div className="w-14 h-14 border-[6px] border-[#555] border-t-[#b1db00] rounded-full mx-auto mb-6 animate-spin" />
            <h3 className="text-[#b1db00] text-[1.8rem] mb-4">Check your phone</h3>
            <p className="mb-2 text-[1.1rem]">M-Pesa prompt sent to <strong>{form.phone}</strong>.</p>
            <p className="mb-2 text-[1.1rem]">Enter your <span className="text-lime">M-Pesa PIN</span> to pay <strong>KES {total.toLocaleString()}</strong>.</p>
            <p className="text-[#b1db00] mt-6 italic">Waiting for confirmation…</p>
          </div>
        </div>
      </main>
    )
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (stage === 'error') {
    return (
      <main id="checkout">
        <h1 className="text-[7rem] mb-[0.2rem] text-center font-semibold max-sm:leading-none max-sm:mb-4">Check<span className="text-lime">out</span></h1>
        <div className="bg-[#515151] p-8 border-b-[5px] border-[#b1db00] max-w-[480px]">
          <p className="text-[#ff6b6b] mb-4">{errorMsg}</p>
          <button className="block px-4 py-2 mb-[0.3rem] cursor-pointer border-0 bg-black text-white transition-colors hover:bg-lime hover:text-black" onClick={() => setStage('form')}>Try Again</button>
        </div>
      </main>
    )
  }

  // ── Main checkout ────────────────────────────────────────────────────────────
  return (
    <main id="checkout">
      <nav className="mb-4">
        <a href="/shop" className="text-[#888] text-[0.85rem] no-underline transition-colors duration-150 hover:text-lime">← Back to Shop</a>
      </nav>
      <h1 className="text-[7rem] mb-[0.2rem] text-center font-semibold max-sm:leading-none max-sm:mb-4">Check<span className="text-lime">out</span></h1>
      <h2 className="mb-12 py-[0.2rem] px-4 bg-[rgba(73,73,73,0.5)] text-center font-semibold">Review your order and pay with M-Pesa</h2>

      {cart.length === 0 ? (
        <div className="bg-[#515151] p-8 border-b-[5px] border-[#b1db00] max-w-[480px]">
          <p className="text-[#888]">
            Your cart is empty. <a href="/shop" className="text-[#b1db00]">Go back to shop</a>.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-[1fr_380px] max-[860px]:grid-cols-1 gap-8 items-start">

          {/* ── LEFT: cart + delivery ── */}
          <div className="min-w-0">

            {/* Cart items */}
            <section className="bg-[#515151] border-b-[3px] border-[#b1db00] px-6 py-5 mb-5">
              <h3 className="text-[#b1db00] text-[0.82rem] uppercase tracking-[0.09em] mb-4 flex items-center gap-[0.6rem]">
                Your Items
                <span className="text-[#888] text-[0.78rem] font-normal normal-case tracking-normal">
                  {cart.reduce((s,i) => s + i.quantity, 0)} item{cart.reduce((s,i) => s + i.quantity, 0) !== 1 ? 's' : ''}
                </span>
              </h3>
              <div className="flex flex-col gap-3 mb-4">
                {cart.map(item => {
                  const isExpanded = expandedItem === item.cartId
                  const isTshirt   = item.type === 'tshirt' || item.type === 'custom_tshirt'
                  const isSticker  = item.type === 'sticker'
                  return (
                    <div key={item.cartId} className="flex gap-[0.85rem] items-start p-3 bg-[#444] rounded-[2px] flex-wrap">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover shrink-0 border border-[#555] rounded-[1px]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[#b1db00] text-[0.88rem] font-bold mb-1 leading-[1.3]">{item.name}</p>
                        {isTshirt && item.color && item.size && (
                          <p className="text-[#aaa] text-[0.78rem] mb-1 flex items-center gap-[0.4rem]">
                            <span
                              className="inline-block w-[10px] h-[10px] rounded-full border border-[#666] shrink-0"
                              style={{ background: item.color.hex }}
                            />
                            {item.color.label} · {item.size}
                          </p>
                        )}
                        {(isSticker || item.type === 'custom_sticker') && item.widthCm && item.heightCm && (
                          <p className="text-[#aaa] text-[0.78rem] mb-1 flex items-center gap-[0.4rem]">
                            {item.widthCm} × {item.heightCm} cm{item.type === 'custom_sticker' ? ' (custom)' : ''}
                          </p>
                        )}
                        {item.notes && (
                          <p className="text-[#888] text-[0.75rem] italic mb-[0.3rem] leading-[1.4]">Note: {item.notes}</p>
                        )}

                        {/* Inline editor toggle */}
                        {(isTshirt || isSticker) && (
                          <button
                            className="bg-transparent border border-[#666] text-[#aaa] text-[0.75rem] py-[0.15rem] px-[0.6rem] cursor-pointer rounded-[2px] mt-[0.3rem] transition-[border-color,color] duration-150 hover:border-[#b1db00] hover:text-[#b1db00]"
                            onClick={() => setExpandedItem(isExpanded ? null : item.cartId)}
                          >
                            {isExpanded ? 'Done' : 'Edit'}
                          </button>
                        )}

                        <div className="flex items-center gap-[0.4rem] mt-[0.4rem]">
                          <button
                            className="bg-[#555] border-0 text-white w-[26px] h-[26px] rounded-[2px] cursor-pointer text-base flex items-center justify-center transition-colors duration-150 hover:bg-[#b1db00] hover:text-[#1a1a1a]"
                            onClick={() => changeQty(item.cartId, -1)}
                            aria-label="Decrease"
                          >−</button>
                          <span className="text-white text-[0.9rem] font-bold min-w-[22px] text-center">{item.quantity}</span>
                          <button
                            className="bg-[#555] border-0 text-white w-[26px] h-[26px] rounded-[2px] cursor-pointer text-base flex items-center justify-center transition-colors duration-150 hover:bg-[#b1db00] hover:text-[#1a1a1a]"
                            onClick={() => changeQty(item.cartId, +1)}
                            aria-label="Increase"
                          >+</button>
                          <button
                            className="bg-transparent border-0 text-[#666] text-[0.78rem] cursor-pointer px-[0.25rem] ml-[0.25rem] transition-colors duration-150 hover:text-[#ff6b6b] hover:underline"
                            onClick={() => removeItem(item.cartId)}
                          >Remove</button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end shrink-0 gap-[0.2rem]">
                        <span className="text-white text-[0.9rem] font-bold whitespace-nowrap">KES {(item.price * item.quantity).toLocaleString()}</span>
                        <span className="text-[#666] text-[0.72rem] whitespace-nowrap">KES {item.price.toLocaleString()} ea.</span>
                      </div>

                      {/* Inline editor — t-shirt */}
                      {isExpanded && isTshirt && (
                        <div className="basis-full mt-2 p-3 bg-[#3a3a3a] rounded-[2px]">
                          <p className="text-[#888] text-[0.72rem] uppercase tracking-[0.07em] mb-[0.35rem]">Color</p>
                          <div className="flex gap-[0.4rem] flex-wrap">
                            {TSHIRT_COLORS.map(c => (
                              <button
                                key={c.name}
                                title={c.label}
                                className={`w-[22px] h-[22px] rounded-full border-2 cursor-pointer transition-[transform,border-color] duration-150 shrink-0 hover:scale-[1.15] ${item.color?.name === c.name ? 'border-[#b1db00] scale-[1.15]' : 'border-transparent'}`}
                                style={{ background: c.hex, ...(c.name === 'white' ? { borderColor: item.color?.name === c.name ? '#b1db00' : '#999' } : {}) }}
                                onClick={() => updateItem(item.cartId, { color: c })}
                              />
                            ))}
                          </div>
                          <p className="text-[#888] text-[0.72rem] uppercase tracking-[0.07em] mb-[0.35rem] mt-2">Size</p>
                          <div className="grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-[0.35rem]">
                            {TSHIRT_SIZES.map(s => (
                              <button
                                key={s}
                                className={`py-[0.25rem] px-[0.55rem] border rounded-[2px] text-[0.78rem] cursor-pointer text-center transition-[border-color,background,color] duration-150 hover:border-[#b1db00] hover:text-white ${item.size === s ? 'border-[#b1db00] bg-[#b1db00] text-[#1a1a1a] font-bold' : 'border-[#555] bg-transparent text-[#ccc]'}`}
                                onClick={() => updateItem(item.cartId, { size: s, price: TSHIRT_SIZE_PRICES[s] })}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Inline editor — sticker */}
                      {isExpanded && isSticker && (
                        <div className="basis-full mt-2 p-3 bg-[#3a3a3a] rounded-[2px]">
                          <p className="text-[#888] text-[0.72rem] uppercase tracking-[0.07em] mb-[0.35rem]">Size</p>
                          <div className="grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-[0.35rem]">
                            {STICKER_PRESETS.map(preset => (
                              <button
                                key={preset.label}
                                className={`py-[0.25rem] px-[0.55rem] border rounded-[2px] text-[0.78rem] cursor-pointer text-center transition-[border-color,background,color] duration-150 hover:border-[#b1db00] hover:text-white ${item.widthCm === preset.widthCm ? 'border-[#b1db00] bg-[#b1db00] text-[#1a1a1a] font-bold' : 'border-[#555] bg-transparent text-[#ccc]'}`}
                                onClick={() => updateItem(item.cartId, {
                                  widthCm: preset.widthCm,
                                  heightCm: preset.heightCm,
                                  price: catalogStickerPrice(item.price, preset),
                                })}
                              >
                                <span>{preset.label}</span>
                                <span className="text-[0.7rem] block">{preset.widthCm}×{preset.heightCm}cm</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-between text-[#aaa] text-[0.9rem] pt-3 border-t border-[#555]">
                <span>Subtotal</span>
                <span>KES {subtotal.toLocaleString()}</span>
              </div>
            </section>

            {/* Delivery */}
            <section className="bg-[#515151] border-b-[3px] border-[#b1db00] px-6 py-5 mb-5">
              <h3 className="text-[#b1db00] text-[0.82rem] uppercase tracking-[0.09em] mb-4 flex items-center gap-[0.6rem]">
                Delivery / Pickup — Nakuru
              </h3>
              <div className="flex flex-col gap-2">
                {DELIVERY_OPTIONS.map(opt => (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-3 py-3 px-4 bg-[#444] border-2 cursor-pointer transition-[border-color] duration-150 rounded-[2px] ${delivery.id === opt.id ? 'border-[#b1db00]' : 'border-[#555] hover:border-[#777]'}`}
                  >
                    <input
                      type="radio" name="delivery" value={opt.id}
                      checked={delivery.id === opt.id}
                      onChange={() => setDelivery(opt)}
                      className="w-4 h-4 shrink-0 cursor-pointer accent-[#b1db00]"
                    />
                    <div className="flex-1 flex flex-col gap-[0.15rem]">
                      <span className="text-white text-[0.88rem] font-bold">{opt.label}</span>
                      <span className="text-[#aaa] text-[0.75rem]">{opt.description}</span>
                    </div>
                    <span className={`text-[0.88rem] font-bold whitespace-nowrap shrink-0 ${delivery.id === opt.id ? 'text-[#b1db00]' : 'text-[#ccc]'}`}>
                      {opt.price === 0 ? 'Free' : `+ KES ${opt.price}`}
                    </span>
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* ── RIGHT: form + totals + pay ── */}
          <div className="relative">
            <div className="sticky top-4 bg-[#515151] border-b-[3px] border-[#b1db00]">

              {/* Order total breakdown */}
              <div className="px-6 py-5 border-b border-[#444]">
                <div className="flex justify-between text-[#aaa] text-[0.9rem] py-[0.3rem]">
                  <span>Subtotal</span><span className="text-white">KES {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#aaa] text-[0.9rem] py-[0.3rem]">
                  <span>Delivery</span>
                  <span className="text-white">{delivery.price === 0 ? 'Free' : `KES ${delivery.price}`}</span>
                </div>
                <div className="flex justify-between items-baseline mt-3 pt-3 border-t border-[#555]">
                  <span className="text-[#ccc] text-[0.95rem]">Total</span>
                  <strong className="text-[#b1db00] text-[1.6rem] font-bold">KES {total.toLocaleString()}</strong>
                </div>
              </div>

              {/* Contact form */}
              <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-0">
                <h3 className="text-[#b1db00] text-[0.82rem] uppercase tracking-[0.09em] mb-4">Your Details</h3>

                <div className="mb-5">
                  <label className="block text-[#b1db00] mb-[0.3rem]">Name</label>
                  <input
                    type="text" placeholder="Your full name" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} required
                    className="w-full py-[0.6rem] px-[0.8rem] bg-[#444] border border-[#666] text-white text-base outline-none focus:border-[#b1db00]"
                  />
                </div>
                <div className="mb-5">
                  <label className="block text-[#b1db00] mb-[0.3rem]">Email</label>
                  <input
                    type="email" placeholder="your@email.com" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })} required
                    className="w-full py-[0.6rem] px-[0.8rem] bg-[#444] border border-[#666] text-white text-base outline-none focus:border-[#b1db00]"
                  />
                </div>
                <div className="mb-5">
                  <label className="block text-[#b1db00] mb-[0.3rem]">M-Pesa Phone</label>
                  <input
                    type="tel" placeholder="07XXXXXXXX" value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })} required
                    className="w-full py-[0.6rem] px-[0.8rem] bg-[#444] border border-[#666] text-white text-base outline-none focus:border-[#b1db00]"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#b1db00] text-[#1a1a1a] border-0 p-4 w-full text-base font-bold cursor-pointer transition-colors duration-200 rounded-[2px] mt-2 hover:bg-[#c8f500]"
                >
                  Pay KES {total.toLocaleString()} with M-Pesa
                </button>
                <p className="text-[#777] text-[0.78rem] text-center mt-[0.6rem] leading-[1.4]">
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
