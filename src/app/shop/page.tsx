'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
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
  const [mounted, setMounted] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedColor, setSelectedColor] = useState<TshirtColor>(TSHIRT_COLORS[0])
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedStickerPreset, setSelectedStickerPreset] = useState<StickerPreset>(STICKER_PRESETS[0])
  const [addedFeedback, setAddedFeedback] = useState(false)

  useEffect(() => { setMounted(true); setCart(loadCart()) }, [])

  const updateCart = useCallback((next: CartItem[]) => { setCart(next); saveCart(next) }, [])

  useEffect(() => {
    if (!selectedProduct) return
    setSelectedColor(TSHIRT_COLORS[0])
    setSelectedSize('')
    setSelectedStickerPreset(STICKER_PRESETS[0])
    setAddedFeedback(false)
  }, [selectedProduct])

  const modalPrice = !selectedProduct
    ? 0
    : selectedProduct.type === 'sticker'
      ? catalogStickerPrice(selectedProduct.price, selectedStickerPreset)
      : selectedProduct.type === 'tshirt' && selectedSize
        ? TSHIRT_SIZE_PRICES[selectedSize]
        : selectedProduct.price

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
    setTab(t); setStickerFilter('all'); setPage(1)
  }

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
          cartId, productId: selectedProduct.id, name: itemName, price: modalPrice,
          image: selectedProduct.image, quantity: 1, type: selectedProduct.type,
          ...(selectedProduct.type === 'tshirt' && { color: selectedColor, size: selectedSize }),
          ...(selectedProduct.type === 'sticker' && {
            widthCm: selectedStickerPreset.widthCm, heightCm: selectedStickerPreset.heightCm,
          }),
        }]
    updateCart(next)
    setAddedFeedback(true)
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
  const canAdd = selectedProduct
    ? selectedProduct.type === 'sticker' || (selectedProduct.type === 'tshirt' && !!selectedSize)
    : false
  const categoryLabel = (p: Product) =>
    p.type === 'tshirt' ? 'T-Shirt' : CATEGORY_LABELS[(p as StickerProduct).category]

  return (
    <main id="shop">
      <motion.h1
        className="text-[7rem] mb-[0.2rem] text-center"
        initial={{ opacity: 0, y: -50, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        Bryan&apos;s <span className="text-lime">Shop</span>
      </motion.h1>
      <motion.h2
        className="mb-12 px-4 py-[0.2rem] bg-[rgba(73,73,73,0.5)] text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        Stickers &amp; T-Shirts — for devs, designers, riders &amp; everyone
      </motion.h2>

      {/* Filter bar */}
      <div className="flex flex-col gap-3 mb-8">
        <div className="flex gap-2 flex-wrap">
          {(['all', 'sticker', 'tshirt', 'custom'] as FilterTab[]).map(t => (
            <button
              key={t}
              className={`px-[1.4rem] py-2 border-2 text-[0.95rem] cursor-pointer rounded-sm transition-[background,color] duration-200 ${t === 'custom' ? `border-teal ${tab === t ? 'bg-teal text-[#1a1a1a] font-bold' : 'bg-transparent text-teal hover:bg-[rgba(0,221,215,0.12)]'}` : `border-lime ${tab === t ? 'bg-lime text-[#1a1a1a] font-bold' : 'bg-transparent text-white hover:bg-[rgba(177,219,0,0.15)]'}`}`}
              onClick={() => changeTab(t)}
            >
              {t === 'all' ? 'All' : t === 'sticker' ? 'Stickers' : t === 'tshirt' ? 'T-Shirts' : '🎨 Custom'}
            </button>
          ))}
        </div>

        {tab !== 'tshirt' && tab !== 'custom' && (
          <div className="flex gap-2 flex-wrap">
            {(['all', 'developer', 'designer', 'bmx', 'cycling', 'pop-culture'] as StickerFilter[]).map(c => (
              <button
                key={c}
                className={`px-4 py-[0.3rem] border border-teal text-[0.85rem] cursor-pointer rounded-sm transition-[background,color] duration-200 ${stickerFilter === c ? 'bg-teal text-[#1a1a1a] font-bold' : 'bg-transparent text-teal hover:bg-[rgba(0,221,215,0.15)]'}`}
                onClick={() => { setStickerFilter(c); setPage(1) }}
              >
                {c === 'all' ? 'All Stickers' : CATEGORY_LABELS[c as StickerCategory]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product grid */}
      <div className="grid gap-6 mb-24 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
        {visible.length === 0 && (
          <p className="text-[#888] text-center py-12 text-base col-span-full">No products found.</p>
        )}
        {visible.map(product => (
          <div
            key={product.id}
            className="bg-[#515151] border-b-4 border-lime cursor-pointer relative overflow-hidden transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
            onClick={() => setSelectedProduct(product)}
          >
            <img src={product.image} alt={product.name} className="w-full aspect-square object-cover block border-b-2 border-[#333]" />
            <Badge className="absolute top-[0.6rem] right-[0.6rem]">
              {product.type === 'tshirt' ? 'T-Shirt' : 'Sticker'}
            </Badge>
            <div className="px-4 py-[0.85rem]">
              <p className="text-[0.7rem] uppercase tracking-[0.08em] text-teal mb-[0.3rem]">{categoryLabel(product)}</p>
              <h3 className="text-lime text-[0.95rem] font-bold mb-[0.4rem] leading-[1.3]">{product.name}</h3>
              <p className="text-white text-[0.9rem]">
                {product.type === 'tshirt'
                  ? `From KES ${Math.min(...product.sizes.map(s => TSHIRT_SIZE_PRICES[s])).toLocaleString()}`
                  : `From KES ${catalogStickerPrice(product.price, STICKER_PRESETS[0]).toLocaleString()}`}
              </p>
              {product.type === 'tshirt' && (
                <div className="flex gap-[0.3rem] mt-2 flex-wrap">
                  {product.colors.map(c => (
                    <span
                      key={c.name}
                      className="w-[14px] h-[14px] rounded-full border-2 border-[#666] shrink-0"
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
          className="bg-[#515151] border-b-4 border-teal cursor-pointer relative overflow-hidden block no-underline transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
        >
          <div className="w-full aspect-square flex items-center justify-center text-5xl border-b-2 border-[#333]"
            style={{ background: 'linear-gradient(135deg,#1a1a1a 0%,#2a3a2a 100%)' }}>
            🎨
          </div>
          <Badge className="absolute top-[0.6rem] right-[0.6rem] bg-teal text-[#1a1a1a]">Custom</Badge>
          <div className="px-4 py-[0.85rem]">
            <p className="text-[0.7rem] uppercase tracking-[0.08em] text-teal mb-[0.3rem]">Your Design</p>
            <h3 className="text-lime text-[0.95rem] font-bold mb-[0.4rem] leading-[1.3]">Custom Sticker or T-Shirt</h3>
            <p className="text-[#aaa] text-[0.82rem]">Upload your artwork → we print &amp; deliver</p>
            <p className="text-teal text-[0.8rem] mt-[0.4rem] font-bold">From KES 30 →</p>
          </div>
        </a>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center gap-[0.4rem] flex-wrap mb-8">
          <button
            className="px-3 py-[0.4rem] border border-[#555] bg-transparent text-[#ccc] text-[0.9rem] cursor-pointer rounded-sm min-w-[36px] transition-[border-color,background,color] duration-150 hover:enabled:border-lime hover:enabled:text-white disabled:opacity-35 disabled:cursor-not-allowed"
            onClick={() => goToPage(safePage - 1)} disabled={safePage === 1}
          >←</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              className={`px-3 py-[0.4rem] border border-[#555] bg-transparent text-[#ccc] text-[0.9rem] cursor-pointer rounded-sm min-w-[36px] transition-[border-color,background,color] duration-150 hover:border-lime hover:text-white ${n === safePage ? 'border-lime bg-lime text-[#1a1a1a] font-bold' : ''}`}
              onClick={() => goToPage(n)}
            >{n}</button>
          ))}
          <button
            className="px-3 py-[0.4rem] border border-[#555] bg-transparent text-[#ccc] text-[0.9rem] cursor-pointer rounded-sm min-w-[36px] transition-[border-color,background,color] duration-150 hover:enabled:border-lime hover:enabled:text-white disabled:opacity-35 disabled:cursor-not-allowed"
            onClick={() => goToPage(safePage + 1)} disabled={safePage === totalPages}
          >→</button>
          <span className="text-[#666] text-[0.8rem] ml-2">{filtered.length} items · page {safePage}/{totalPages}</span>
        </div>
      )}

      {/* Product modal — rendered in portal to escape PageTransition transform */}
      {selectedProduct && mounted && createPortal(
        <div className="fixed inset-0 bg-black/75 z-[200] flex items-center justify-center p-4" onClick={() => setSelectedProduct(null)}>
          <div className="bg-[#515151] max-w-[780px] w-full max-h-[90vh] overflow-y-auto border-b-[5px] border-lime grid grid-cols-2 max-[600px]:grid-cols-1 max-[600px]:max-h-[95vh] relative" onClick={e => e.stopPropagation()}>
            <button
              className="absolute top-3 right-3 bg-black/50 text-white border-none w-8 h-8 rounded-full text-[1.1rem] cursor-pointer flex items-center justify-center z-10 transition-[background,color] duration-150 hover:bg-lime hover:text-[#1a1a1a]"
              onClick={() => setSelectedProduct(null)}
            >✕</button>
            <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full aspect-square object-cover block" />
            <div className="p-6 flex flex-col gap-4">
              <p className="text-[0.75rem] uppercase tracking-[0.1em] text-teal">{categoryLabel(selectedProduct)}</p>
              <h2 className="text-lime text-[1.4rem] font-bold leading-[1.2]">{selectedProduct.name}</h2>
              <p className="text-[1.3rem] text-white font-bold">KES {modalPrice.toLocaleString()}</p>
              <p className="text-[#ccc] text-[0.9rem] leading-[1.5]">{selectedProduct.description}</p>

              {selectedProduct.type === 'sticker' && (
                <>
                  <div>
                    <p className="text-[0.8rem] text-[#aaa] uppercase tracking-[0.08em] mb-[0.4rem]">Size</p>
                    <div className="flex gap-2 flex-wrap">
                      {STICKER_PRESETS.map(preset => (
                        <button
                          key={preset.label}
                          className={`flex flex-col items-center gap-[0.15rem] px-[0.9rem] py-[0.55rem] border-2 border-[#555] bg-transparent cursor-pointer rounded-sm min-w-[80px] transition-[border-color,background] duration-150 hover:border-lime ${selectedStickerPreset.label === preset.label ? 'border-lime bg-[rgba(177,219,0,0.12)]' : ''}`}
                          onClick={() => setSelectedStickerPreset(preset)}
                        >
                          <span className="text-white text-[0.85rem] font-bold">{preset.label}</span>
                          <span className="text-[#888] text-[0.72rem]">{preset.widthCm}×{preset.heightCm} cm</span>
                          <span className="text-lime text-[0.8rem] font-bold">KES {catalogStickerPrice(selectedProduct.price, preset).toLocaleString()}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[0.8rem] text-[#aaa] uppercase tracking-[0.08em] mb-[0.4rem]">Works on</p>
                    <div className="flex flex-wrap gap-[0.4rem]">
                      {selectedProduct.canUseOn.map(u => (
                        <span key={u} className="text-[0.75rem] border border-[#666] text-[#aaa] px-[0.55rem] py-[0.2rem] rounded-sm">{u}</span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {selectedProduct.type === 'tshirt' && (
                <>
                  <div>
                    <p className="text-[0.8rem] text-[#aaa] uppercase tracking-[0.08em] mb-[0.4rem]">
                      Colour <span className="text-[0.8rem] text-[#ccc]">— {selectedColor.label}</span>
                    </p>
                    <div className="flex gap-[0.6rem] flex-wrap">
                      {selectedProduct.colors.map(c => (
                        <button
                          key={c.name}
                          className={`w-[30px] h-[30px] rounded-full cursor-pointer border-[3px] border-transparent shrink-0 transition-[border-color,transform] duration-150 hover:scale-[1.15] ${selectedColor.name === c.name ? '!border-lime scale-[1.15]' : ''}`}
                          style={{ background: c.hex, borderColor: c.name === 'white' ? '#888' : 'transparent' }}
                          title={c.label}
                          onClick={() => setSelectedColor(c)}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[0.8rem] text-[#aaa] uppercase tracking-[0.08em] mb-[0.4rem]">
                      Size {!selectedSize && <span style={{ color: '#ff6b6b' }}>— required</span>}
                    </p>
                    <div className="flex gap-[0.4rem] flex-wrap">
                      {selectedProduct.sizes.map(s => (
                        <button
                          key={s}
                          className={`px-3 py-[0.35rem] border border-[#666] bg-transparent text-[#ccc] text-[0.85rem] cursor-pointer rounded-sm transition-[border-color,background,color] duration-150 hover:border-lime hover:text-white ${selectedSize === s ? 'border-lime bg-lime text-[#1a1a1a] font-bold' : ''}`}
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
                ? (
                  <div className="flex gap-2 animate-fadeUp mt-auto">
                    <button
                      className="flex-1 bg-transparent border border-lime text-lime px-4 py-[0.85rem] font-bold text-[0.9rem] cursor-pointer hover:bg-[rgba(177,219,0,0.1)] transition-colors"
                      onClick={addToCart}
                    >
                      + Add Again
                    </button>
                    <button
                      className="flex-1 bg-lime text-[#1a1a1a] border-none px-4 py-[0.85rem] font-bold text-[0.9rem] cursor-pointer hover:bg-[#c8f500] transition-colors"
                      onClick={() => { setSelectedProduct(null); setCartOpen(true) }}
                    >
                      View Cart 🛒
                    </button>
                  </div>
                )
                : (
                  <button
                    className="bg-lime text-[#1a1a1a] border-none px-6 py-[0.85rem] font-bold text-base cursor-pointer w-full mt-auto hover:bg-[#c8f500] disabled:bg-[#555] disabled:text-[#888] disabled:cursor-not-allowed transition-colors"
                    onClick={addToCart}
                    disabled={!canAdd}
                  >
                    {selectedProduct.type === 'tshirt' && !selectedSize
                      ? 'Select a size'
                      : `Add to Cart — KES ${modalPrice.toLocaleString()}`}
                  </button>
                )
              }
            </div>
          </div>
        </div>
      , document.body)}

      {/* Cart FAB + Cart panel — rendered in portal to escape PageTransition transform */}
      {mounted && createPortal(<>
      <button
        className="fixed bottom-8 right-8 bg-lime text-[#1a1a1a] border-none w-[60px] h-[60px] rounded-full text-[1.4rem] cursor-pointer flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.4)] z-[100] transition-transform hover:scale-110"
        onClick={() => setCartOpen(true)}
        aria-label="Open cart"
      >
        🛒
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#c0392b] text-white text-[0.7rem] font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      {/* Cart panel */}
      <div className={`fixed top-0 right-0 bottom-0 w-[380px] max-w-[95vw] bg-[#3a3a3a] border-l-[3px] border-lime z-[300] flex flex-col transition-transform duration-300 ease-[ease] ${cartOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#555]">
          <h3 className="text-lime text-[1.2rem] font-bold">Cart ({cartCount})</h3>
          <button className="bg-none border-none text-[#aaa] text-[1.3rem] cursor-pointer p-1 leading-none hover:text-white" onClick={() => setCartOpen(false)}>✕</button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {cart.length === 0
            ? <p className="text-[#888] text-[0.95rem] text-center mt-8">Your cart is empty.</p>
            : cart.map(item => (
              <div key={item.cartId} className="flex gap-3 items-start bg-[#444] p-3 rounded-sm">
                <img src={item.image} alt={item.name} className="w-[60px] h-[60px] object-cover shrink-0 border border-[#555]" />
                <div className="flex-1 min-w-0">
                  <p className="text-lime text-[0.85rem] font-bold mb-1 truncate">{item.name}</p>
                  {item.type === 'tshirt' && item.color && item.size && (
                    <p className="text-[#aaa] text-[0.75rem] mb-[0.4rem]">{item.color.label} · {item.size}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <button className={`bg-[#555] border-none text-white w-6 h-6 rounded-sm cursor-pointer text-base leading-none flex items-center justify-center hover:bg-lime hover:text-[#1a1a1a]`} onClick={() => changeQty(item.cartId, -1)}>−</button>
                    <span className="text-white text-[0.9rem] min-w-[20px] text-center">{item.quantity}</span>
                    <button className={`bg-[#555] border-none text-white w-6 h-6 rounded-sm cursor-pointer text-base leading-none flex items-center justify-center hover:bg-lime hover:text-[#1a1a1a]`} onClick={() => changeQty(item.cartId, +1)}>+</button>
                    <button className={`bg-none border-none text-[#666] text-[0.85rem] cursor-pointer p-0 ml-1 hover:text-[#ff6b6b]`} onClick={() => removeItem(item.cartId)} title="Remove">✕</button>
                  </div>
                </div>
                <span className="text-white text-[0.85rem] font-bold whitespace-nowrap shrink-0">KES {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))
          }
        </div>
        <div className="px-6 py-5 border-t border-[#555] flex flex-col gap-3">
          <div className="flex justify-between text-[#ccc] text-[0.95rem]">
            <span>Subtotal</span>
            <strong className="text-lime text-[1.1rem]">KES {cartTotal.toLocaleString()}</strong>
          </div>
          {cart.length > 0 && (
            <>
              <a href="/shop/checkout" className="block text-center bg-lime text-[#1a1a1a] font-bold text-base py-[0.85rem] no-underline hover:bg-[#c8f500]">
                Proceed to Checkout
              </a>
              <button className="bg-none border border-[#555] text-[#888] text-[0.85rem] p-2 cursor-pointer w-full hover:border-[#ff6b6b] hover:text-[#ff6b6b]" onClick={() => updateCart([])}>
                Clear cart
              </button>
            </>
          )}
        </div>
      </div>
      </>, document.body)}
    </main>
  )
}
