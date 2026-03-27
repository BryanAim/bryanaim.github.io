'use client'

import { useState, useEffect, useCallback } from 'react'
import styles from './shop.module.css'
import {
  TshirtColor, CartItem, TSHIRT_COLORS, TSHIRT_SIZES, TSHIRT_SIZE_PRICES,
  StickerPreset, STICKER_PRESETS, catalogStickerPrice,
  loadCart, saveCart,
} from '@/lib/shopTypes'

// ─── Re-export CartItem so checkout can import it from here ──────────────────
export type { CartItem, TshirtColor }

// ─── Internal types ──────────────────────────────────────────────────────────

type CatalogProductType = 'sticker' | 'tshirt'
type StickerCategory = 'developer' | 'designer' | 'bmx' | 'cycling' | 'pop-culture'
type FilterTab = 'all' | 'sticker' | 'tshirt' | 'custom'
type StickerFilter = 'all' | StickerCategory

const PAGE_SIZE = 12

interface BaseProduct { id: string; type: CatalogProductType; name: string; price: number; image: string; description: string }
interface StickerProduct extends BaseProduct { type: 'sticker'; category: StickerCategory; canUseOn: string[] }
interface TshirtProduct extends BaseProduct { type: 'tshirt'; colors: TshirtColor[]; sizes: string[] }
type Product = StickerProduct | TshirtProduct

const CATEGORY_LABELS: Record<StickerCategory, string> = {
  developer: 'Developer', designer: 'Designer', bmx: 'BMX',
  cycling: 'Cycling', 'pop-culture': 'Pop Culture',
}

// ─── Catalogue ───────────────────────────────────────────────────────────────

const PRODUCTS: Product[] = [
  // Stickers: Developer
  { id: 's-dev-1', type: 'sticker', category: 'developer', name: 'Hello World Sticker', price: 150,
    image: '/img/projects/project1.jpg',
    description: 'Classic dev starter. For your laptop, phone, or mug.',
    canUseOn: ['Laptop', 'Phone', 'Water bottle', 'Notebook'] },
  { id: 's-dev-2', type: 'sticker', category: 'developer', name: '#!/usr/bin/env Sticker', price: 150,
    image: '/img/projects/my-portfolio.jpg',
    description: 'For those who live in the terminal. Represent your shell.',
    canUseOn: ['Laptop', 'Desktop', 'Server rack'] },
  { id: 's-dev-3', type: 'sticker', category: 'developer', name: 'NaxTechMakers Sticker', price: 250,
    image: '/img/projects/naxtechmakers.jpg',
    description: 'Nakuru tech community pride. Rep the local dev scene.',
    canUseOn: ['Laptop', 'Phone', 'Bike', 'Car'] },
  { id: 's-dev-4', type: 'sticker', category: 'developer', name: 'Coffee & Code Pack (3 pcs)', price: 400,
    image: '/img/projects/project2.jpg',
    description: 'Three-piece sticker pack — coffee, keyboard, and code vibes.',
    canUseOn: ['Laptop', 'Flask / Mug', 'Phone'] },
  { id: 's-dev-5', type: 'sticker', category: 'developer', name: 'git push --force Sticker', price: 150,
    image: '/img/projects/project3.jpg',
    description: 'For the brave devs who yolo the main branch.',
    canUseOn: ['Laptop', 'Phone', 'Notebook'] },

  // Stickers: Designer
  { id: 's-des-1', type: 'sticker', category: 'designer', name: 'Enjoy Music Art Sticker', price: 200,
    image: '/img/projects/design/enjoy-music.jpg',
    description: 'Original artwork sticker. Music is life.',
    canUseOn: ['Laptop', 'Phone', 'Speaker', 'Guitar case'] },
  { id: 's-des-2', type: 'sticker', category: 'designer', name: 'Ying Yang No Sensei', price: 200,
    image: '/img/projects/design/ying-yang-no-sensei.jpg',
    description: 'Balance & wisdom. Original illustration sticker.',
    canUseOn: ['Laptop', 'Phone', 'Bike', 'Skateboard'] },
  { id: 's-des-3', type: 'sticker', category: 'designer', name: 'World of Perps Sticker', price: 200,
    image: '/img/projects/design/illustrations/world-of-perps.jpg',
    description: 'Bold original illustration. Eye-catching anywhere.',
    canUseOn: ['Laptop', 'Notebook', 'Phone'] },
  { id: 's-des-4', type: 'sticker', category: 'designer', name: 'Mike Explode Art Sticker', price: 200,
    image: '/img/projects/design/mike-explode.jpg',
    description: 'Explosive original artwork. A real statement piece.',
    canUseOn: ['Laptop', 'Phone', 'Helmet', 'Bike'] },
  { id: 's-des-5', type: 'sticker', category: 'designer', name: 'Sensei Wisdom Sticker', price: 150,
    image: '/img/projects/design/illustrations/sensei-no-pills.jpg',
    description: 'Choose your path. Clean original illustration.',
    canUseOn: ['Laptop', 'Phone', 'Notebook'] },
  { id: 's-des-6', type: 'sticker', category: 'designer', name: 'Christmas 2024 Sticker', price: 150,
    image: '/img/projects/design/illustrations/christmas-2024.jpg',
    description: 'Festive original illustration. Gift it or keep it.',
    canUseOn: ['Phone', 'Laptop', 'Gift box', 'Notebook'] },

  // Stickers: BMX
  { id: 's-bmx-1', type: 'sticker', category: 'bmx', name: 'BMX Life Sticker', price: 200,
    image: '/img/bmx/bmx1.jpg',
    description: 'For the riders. Slap it on your frame, helmet, or phone.',
    canUseOn: ['Bike frame', 'Helmet', 'Phone', 'Laptop'] },
  { id: 's-bmx-2', type: 'sticker', category: 'bmx', name: 'Street BMX Sticker', price: 200,
    image: '/img/bmx/bmx3.jpg',
    description: 'Streets are yours. Rep your style everywhere.',
    canUseOn: ['Bike frame', 'Helmet', 'Skateboard', 'Phone'] },
  { id: 's-bmx-3', type: 'sticker', category: 'bmx', name: 'Air Time BMX Sticker', price: 200,
    image: '/img/bmx/bmx5.jpg',
    description: 'Catch that air. For riders who fly.',
    canUseOn: ['Bike frame', 'Helmet', 'Ramp', 'Gear bag'] },
  { id: 's-bmx-4', type: 'sticker', category: 'bmx', name: 'BMX Nakuru Sticker', price: 250,
    image: '/img/bmx/bmx2.jpg',
    description: 'Nakuru BMX scene. Local pride on your bike or beyond.',
    canUseOn: ['Bike frame', 'Helmet', 'Phone', 'Car'] },
  { id: 's-bmx-5', type: 'sticker', category: 'bmx', name: 'Barspin Sticker', price: 200,
    image: '/img/bmx/bmx6.jpg',
    description: 'Spin the bars, spin the world.',
    canUseOn: ['Bike frame', 'Helmet', 'Phone', 'Laptop'] },

  // Stickers: Cycling
  { id: 's-cyc-1', type: 'sticker', category: 'cycling', name: 'Ride or Die Sticker', price: 200,
    image: '/img/bmx/bmx7.jpg',
    description: "The cyclist's motto. For all two-wheel lovers.",
    canUseOn: ['Bike frame', 'Helmet', 'Water bottle', 'Phone'] },
  { id: 's-cyc-2', type: 'sticker', category: 'cycling', name: 'Two Wheels Sticker', price: 200,
    image: '/img/bmx/bmx9.jpg',
    description: 'Life is better on two wheels.',
    canUseOn: ['Bike frame', 'Helmet', 'Water bottle', 'Laptop'] },
  { id: 's-cyc-3', type: 'sticker', category: 'cycling', name: 'Bike Gang Sticker', price: 150,
    image: '/img/bmx/bmx4.jpg',
    description: 'Ride together, vibe together.',
    canUseOn: ['Bike frame', 'Phone', 'Water bottle'] },
  { id: 's-cyc-4', type: 'sticker', category: 'cycling', name: 'Kenyan Roads Sticker', price: 200,
    image: '/img/bmx/bmx10.jpg',
    description: 'Tarmac, murram, or anything in between. Kenyan cyclist pride.',
    canUseOn: ['Bike frame', 'Helmet', 'Car', 'Phone'] },

  // Stickers: Pop Culture
  { id: 's-pop-1', type: 'sticker', category: 'pop-culture', name: 'SpongeBob Vibes Sticker', price: 200,
    image: '/img/projects/design/illustrations/sensei-red-pill.jpg',
    description: 'Are you ready kids? SpongeBob-inspired sticker. [Placeholder — real art coming soon]',
    canUseOn: ['Phone', 'Laptop', 'Water bottle', 'Notebook'] },
  { id: 's-pop-2', type: 'sticker', category: 'pop-culture', name: "Krabby Patty Secret Sticker", price: 150,
    image: '/img/projects/corona.jpg',
    description: 'The formula is yours. SpongeBob-themed sticker. [Placeholder]',
    canUseOn: ['Phone', 'Laptop', 'Fridge', 'Water bottle'] },
  { id: 's-pop-3', type: 'sticker', category: 'pop-culture', name: 'Rick & Morty Forever Sticker', price: 200,
    image: '/img/projects/design/compositions/mike-explode.jpg',
    description: 'Wubba lubba dub dub! Rick & Morty fan sticker. [Placeholder]',
    canUseOn: ['Laptop', 'Phone', 'Car', 'Notebook'] },
  { id: 's-pop-4', type: 'sticker', category: 'pop-culture', name: 'Get Schwifty Sticker', price: 200,
    image: '/img/background.jpg',
    description: 'You gotta get schwifty! Show your Rick & Morty love. [Placeholder]',
    canUseOn: ['Phone', 'Laptop', 'Guitar case', 'Helmet'] },

  // T-Shirts
  { id: 't-1', type: 'tshirt', name: 'Nakuru Rides Tee', price: 1200,
    image: '/img/bmx/bmx1-banner.jpg',
    description: 'Nakuru BMX & cycling culture on a quality cotton tee. Lightweight, breathable, built to ride in.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES },
  { id: 't-2', type: 'tshirt', name: 'Code & Create Tee', price: 1200,
    image: '/img/bmx/design1-banner.jpg',
    description: 'For developers and designers who build things. Minimal design, maximum statement.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES },
  { id: 't-3', type: 'tshirt', name: 'Street Art Graphic Tee', price: 1300,
    image: '/img/projects/design/design1.jpg',
    description: 'Original graphic design on a premium cotton tee. Wear your art.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES },
  { id: 't-4', type: 'tshirt', name: 'Bike Life Tee', price: 1200,
    image: '/img/bmx/bmx8.jpg',
    description: 'For cyclists and BMX riders who live on two wheels. Comfortable fit for trail or street.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES },
  { id: 't-5', type: 'tshirt', name: 'Wubba Lubba Tee', price: 1300,
    image: '/img/projects/design/illustrations/world-of-perps.jpg',
    description: 'Rick & Morty vibes on a quality tee. For fans of the multiverse.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES },
  { id: 't-6', type: 'tshirt', name: 'Classic Signature Tee', price: 1000,
    image: '/img/portrait.jpg',
    description: 'Clean, minimal signature tee. A wardrobe staple in 5 colours.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function ShopPage() {
  const [tab, setTab] = useState<FilterTab>('all')
  const [stickerFilter, setStickerFilter] = useState<StickerFilter>('all')
  const [page, setPage] = useState(1)
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedColor, setSelectedColor] = useState<TshirtColor>(TSHIRT_COLORS[0])
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedStickerPreset, setSelectedStickerPreset] = useState<StickerPreset>(STICKER_PRESETS[0])
  const [addedFeedback, setAddedFeedback] = useState(false)

  useEffect(() => { setCart(loadCart()) }, [])

  const updateCart = useCallback((next: CartItem[]) => { setCart(next); saveCart(next) }, [])

  useEffect(() => {
    if (!selectedProduct) return
    setSelectedColor(TSHIRT_COLORS[0])
    setSelectedSize('')
    setSelectedStickerPreset(STICKER_PRESETS[0])
    setAddedFeedback(false)
  }, [selectedProduct])

  // ── Dynamic price for the open modal ──
  const modalPrice = !selectedProduct
    ? 0
    : selectedProduct.type === 'sticker'
      ? catalogStickerPrice(selectedProduct.price, selectedStickerPreset)
      : selectedProduct.type === 'tshirt' && selectedSize
        ? TSHIRT_SIZE_PRICES[selectedSize]
        : selectedProduct.price

  // ── Filtering + pagination ──

  const filtered = tab === 'custom' ? [] : PRODUCTS.filter(p => {
    if (tab === 'sticker' && p.type !== 'sticker') return false
    if (tab === 'tshirt' && p.type !== 'tshirt') return false
    if (tab !== 'tshirt' && p.type === 'sticker' && stickerFilter !== 'all') {
      return (p as StickerProduct).category === stickerFilter
    }
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const goToPage = (p: number) => {
    setPage(Math.max(1, Math.min(p, totalPages)))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const changeTab = (t: FilterTab) => {
    if (t === 'custom') { window.location.href = '/shop/custom'; return }
    setTab(t)
    setStickerFilter('all')
    setPage(1)
  }

  // ── Cart helpers ──

  const addToCart = () => {
    if (!selectedProduct) return
    if (selectedProduct.type === 'tshirt' && !selectedSize) return

    const cartId = selectedProduct.type === 'tshirt'
      ? `${selectedProduct.id}-${selectedColor.name}-${selectedSize}`
      : `${selectedProduct.id}-${selectedStickerPreset.label}`

    const itemName = selectedProduct.type === 'sticker'
      ? `${selectedProduct.name} (${selectedStickerPreset.label})`
      : selectedProduct.name

    const existing = cart.find(i => i.cartId === cartId)
    const next = existing
      ? cart.map(i => i.cartId === cartId ? { ...i, quantity: i.quantity + 1 } : i)
      : [...cart, {
          cartId,
          productId: selectedProduct.id,
          name: itemName,
          price: modalPrice,
          image: selectedProduct.image,
          quantity: 1,
          type: selectedProduct.type,
          ...(selectedProduct.type === 'tshirt' && { color: selectedColor, size: selectedSize }),
          ...(selectedProduct.type === 'sticker' && {
            widthCm: selectedStickerPreset.widthCm,
            heightCm: selectedStickerPreset.heightCm,
          }),
        }]

    updateCart(next)
    setAddedFeedback(true)
    setTimeout(() => setAddedFeedback(false), 2000)
  }

  const changeQty = (cartId: string, delta: number) => {
    const next = cart
      .map(i => i.cartId === cartId ? { ...i, quantity: i.quantity + delta } : i)
      .filter(i => i.quantity > 0)
    updateCart(next)
  }

  const removeItem = (cartId: string) => updateCart(cart.filter(i => i.cartId !== cartId))

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)
  // stickers always have a preset selected; tshirts need an explicit size choice
  const canAdd = selectedProduct
    ? selectedProduct.type === 'sticker' || (selectedProduct.type === 'tshirt' && !!selectedSize)
    : false

  const categoryLabel = (p: Product) =>
    p.type === 'tshirt' ? 'T-Shirt' : CATEGORY_LABELS[(p as StickerProduct).category]

  // ─ Render ──

  return (
    <main id="shop">
      <h1 className="lg-heading">
        Bryan&apos;s <span className="text-secondary">Shop</span>
      </h1>
      <h2 className="sm-heading">
        Stickers &amp; T-Shirts — for devs, designers, riders &amp; everyone
      </h2>

      {/* Filter bar */}
      <div className={styles.filterBar}>
        <div className={styles.tabs}>
          {(['all', 'sticker', 'tshirt', 'custom'] as FilterTab[]).map(t => (
            <button
              key={t}
              className={`${styles.tab} ${tab === t ? styles.tabActive : ''} ${t === 'custom' ? styles.tabCustom : ''}`}
              onClick={() => changeTab(t)}
            >
              {t === 'all' ? 'All' : t === 'sticker' ? 'Stickers' : t === 'tshirt' ? 'T-Shirts' : '🎨 Custom'}
            </button>
          ))}
        </div>

        {tab !== 'tshirt' && tab !== 'custom' && (
          <div className={styles.subTabs}>
            {(['all', 'developer', 'designer', 'bmx', 'cycling', 'pop-culture'] as StickerFilter[]).map(c => (
              <button
                key={c}
                className={`${styles.subTab} ${stickerFilter === c ? styles.subTabActive : ''}`}
                onClick={() => { setStickerFilter(c); setPage(1) }}
              >
                {c === 'all' ? 'All Stickers' : CATEGORY_LABELS[c as StickerCategory]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product grid */}
      <div className={styles.grid}>
        {visible.length === 0 && <p className={styles.noResults}>No products found.</p>}
        {visible.map(product => (
          <div key={product.id} className={styles.card} onClick={() => setSelectedProduct(product)}>
            <img src={product.image} alt={product.name} className={styles.cardImg} />
            <span className={styles.cardBadge}>{product.type === 'tshirt' ? 'T-Shirt' : 'Sticker'}</span>
            <div className={styles.cardBody}>
              <p className={styles.cardCategory}>{categoryLabel(product)}</p>
              <h3 className={styles.cardName}>{product.name}</h3>
              <p className={styles.cardPrice}>
                {product.type === 'tshirt'
                  ? `From KES ${Math.min(...product.sizes.map(s => TSHIRT_SIZE_PRICES[s])).toLocaleString()}`
                  : `From KES ${catalogStickerPrice(product.price, STICKER_PRESETS[0]).toLocaleString()}`}
              </p>
              {product.type === 'tshirt' && (
                <div className={styles.cardColors}>
                  {product.colors.map(c => (
                    <span
                      key={c.name}
                      className={styles.cardColorDot}
                      style={{ background: c.hex, borderColor: c.name === 'white' ? '#999' : '#333' }}
                      title={c.label}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Custom order promo card */}
        <a
          href="/shop/custom"
          className={styles.card}
          style={{ textDecoration: 'none', display: 'block', borderColor: '#00ddd7' }}
        >
          <div className={styles.cardImg} style={{ background: 'linear-gradient(135deg,#1a1a1a 0%,#2a3a2a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
            🎨
          </div>
          <span className={styles.cardBadge} style={{ background: '#00ddd7', color: '#1a1a1a' }}>Custom</span>
          <div className={styles.cardBody}>
            <p className={styles.cardCategory} style={{ color: '#00ddd7' }}>Your Design</p>
            <h3 className={styles.cardName}>Custom Sticker or T-Shirt</h3>
            <p className={styles.cardPrice} style={{ color: '#aaa', fontSize: '0.82rem' }}>Upload your artwork → we print &amp; deliver</p>
            <p style={{ color: '#00ddd7', fontSize: '0.8rem', margin: '0.4rem 0 0', fontWeight: 700 }}>From KES 30 →</p>
          </div>
        </a>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button className={styles.pageBtn} onClick={() => goToPage(safePage - 1)} disabled={safePage === 1}>←</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              className={`${styles.pageBtn} ${n === safePage ? styles.pageBtnActive : ''}`}
              onClick={() => goToPage(n)}
            >
              {n}
            </button>
          ))}
          <button className={styles.pageBtn} onClick={() => goToPage(safePage + 1)} disabled={safePage === totalPages}>→</button>
          <span className={styles.pageInfo}>{filtered.length} items · page {safePage}/{totalPages}</span>
        </div>
      )}

      {/* Product modal */}
      {selectedProduct && (
        <div className={styles.overlay} onClick={() => setSelectedProduct(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setSelectedProduct(null)}>✕</button>
            <img src={selectedProduct.image} alt={selectedProduct.name} className={styles.modalImg} />
            <div className={styles.modalBody}>
              <p className={styles.modalCategory}>{categoryLabel(selectedProduct)}</p>
              <h2 className={styles.modalName}>{selectedProduct.name}</h2>
              <p className={styles.modalPrice}>KES {modalPrice.toLocaleString()}</p>
              <p className={styles.modalDesc}>{selectedProduct.description}</p>

              {selectedProduct.type === 'sticker' && (
                <>
                  <div>
                    <p className={styles.pickerLabel}>Size</p>
                    <div className={styles.stickerSizes}>
                      {STICKER_PRESETS.map(preset => (
                        <button
                          key={preset.label}
                          className={`${styles.stickerSizeBtn} ${selectedStickerPreset.label === preset.label ? styles.stickerSizeBtnActive : ''}`}
                          onClick={() => setSelectedStickerPreset(preset)}
                        >
                          <span className={styles.stickerSizeLabel}>{preset.label}</span>
                          <span className={styles.stickerSizeDim}>{preset.widthCm}×{preset.heightCm} cm</span>
                          <span className={styles.stickerSizePrice}>KES {catalogStickerPrice(selectedProduct.price, preset).toLocaleString()}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className={styles.pickerLabel}>Works on</p>
                    <div className={styles.modalUsage}>
                      {selectedProduct.canUseOn.map(u => (
                        <span key={u} className={styles.usageTag}>{u}</span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {selectedProduct.type === 'tshirt' && (
                <>
                  <div>
                    <p className={styles.pickerLabel}>
                      Colour <span className={styles.colorName}>— {selectedColor.label}</span>
                    </p>
                    <div className={styles.colorPicker}>
                      {selectedProduct.colors.map(c => (
                        <button
                          key={c.name}
                          className={`${styles.colorSwatch} ${selectedColor.name === c.name ? styles.colorSwatchActive : ''}`}
                          style={{ background: c.hex, borderColor: c.name === 'white' ? '#888' : 'transparent' }}
                          title={c.label}
                          onClick={() => setSelectedColor(c)}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className={styles.pickerLabel}>
                      Size {!selectedSize && <span style={{ color: '#ff6b6b' }}>— required</span>}
                    </p>
                    <div className={styles.sizePicker}>
                      {selectedProduct.sizes.map(s => (
                        <button
                          key={s}
                          className={`${styles.sizeBtn} ${selectedSize === s ? styles.sizeBtnActive : ''}`}
                          onClick={() => setSelectedSize(s)}
                        >
                          <span>{s}</span>
                          <span style={{ fontSize: '0.72rem', display: 'block', opacity: 0.8 }}>
                            KES {TSHIRT_SIZE_PRICES[s].toLocaleString()}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {addedFeedback
                ? <p className={styles.addedFeedback}>Added to cart!</p>
                : (
                  <button className={styles.addToCartBtn} onClick={addToCart} disabled={!canAdd}>
                    {selectedProduct.type === 'tshirt' && !selectedSize
                      ? 'Select a size'
                      : `Add to Cart — KES ${modalPrice.toLocaleString()}`}
                  </button>
                )
              }
            </div>
          </div>
        </div>
      )}

      {/* Cart FAB */}
      <button className={styles.cartBtn} onClick={() => setCartOpen(true)} aria-label="Open cart">
        🛒
        {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
      </button>

      {/* Cart panel */}
      <div className={`${styles.cartPanel} ${cartOpen ? styles.cartPanelOpen : ''}`}>
        <div className={styles.cartHeader}>
          <h3 className={styles.cartTitle}>Cart ({cartCount})</h3>
          <button className={styles.cartCloseBtn} onClick={() => setCartOpen(false)}>✕</button>
        </div>
        <div className={styles.cartItems}>
          {cart.length === 0
            ? <p className={styles.cartEmpty}>Your cart is empty.</p>
            : cart.map(item => (
              <div key={item.cartId} className={styles.cartItem}>
                <img src={item.image} alt={item.name} className={styles.cartItemImg} />
                <div className={styles.cartItemInfo}>
                  <p className={styles.cartItemName}>{item.name}</p>
                  {item.type === 'tshirt' && item.color && item.size && (
                    <p className={styles.cartItemMeta}>{item.color.label} · {item.size}</p>
                  )}
                  <div className={styles.cartItemControls}>
                    <button className={styles.qtyBtn} onClick={() => changeQty(item.cartId, -1)}>−</button>
                    <span className={styles.qtyNum}>{item.quantity}</span>
                    <button className={styles.qtyBtn} onClick={() => changeQty(item.cartId, +1)}>+</button>
                    <button className={styles.removeBtn} onClick={() => removeItem(item.cartId)} title="Remove">✕</button>
                  </div>
                </div>
                <span className={styles.cartItemPrice}>KES {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))
          }
        </div>
        <div className={styles.cartFooter}>
          <div className={styles.cartSubtotal}>
            <span>Subtotal</span>
            <strong>KES {cartTotal.toLocaleString()}</strong>
          </div>
          {cart.length > 0 && (
            <>
              <a href="/shop/checkout" className={styles.checkoutBtn}>Proceed to Checkout</a>
              <button className={styles.clearCartBtn} onClick={() => updateCart([])}>Clear cart</button>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
