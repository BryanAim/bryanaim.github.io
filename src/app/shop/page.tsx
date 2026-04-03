'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import {
  TshirtColor, CartItem, TSHIRT_COLORS, TSHIRT_SIZES, TSHIRT_SIZE_PRICES,
  StickerPreset, STICKER_PRESETS, catalogStickerPrice,
  loadCart, saveCart,
} from '@/lib/shopTypes'
import {
  PRODUCTS, CatalogProduct, StickerProduct, TshirtProduct, TshirtColorVariant, ProductCategory,
} from '@/lib/products'

// ─── Re-export CartItem so checkout can import it from here ──────────────────
export type { CartItem, TshirtColor }

// ─── Internal types ──────────────────────────────────────────────────────────

type FilterTab = 'all' | 'sticker' | 'tshirt' | 'custom'
type StickerFilter = 'all' | ProductCategory

const PAGE_SIZE = 12

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  developer: 'Developer',
  designer: 'Designer',
  bmx: 'BMX',
  cycling: 'Cycling',
  'pop-culture': 'Pop Culture',
  street: 'Street',
  humour: 'Humour',
  football: 'Football',
}

/** Products from /img/products/ are auto-tagged new; explicit isNew overrides. */
const isProductNew = (p: CatalogProduct) =>
  (p as StickerProduct).isNew !== false &&
  ((p as StickerProduct).isNew === true || p.image.startsWith('/img/products/'))

// ─── Component ────────────────────────────────────────────────────────────────

export default function ShopPage() {
  const [shuffledProducts, setShuffledProducts] = useState<CatalogProduct[]>(PRODUCTS)
  const [tab, setTab] = useState<FilterTab>('all')
  const [stickerFilter, setStickerFilter] = useState<StickerFilter>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [mounted, setMounted] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null)
  const [selectedColor, setSelectedColor] = useState<TshirtColor>(TSHIRT_COLORS[0])
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedStickerPreset, setSelectedStickerPreset] = useState<StickerPreset>(STICKER_PRESETS[0])
  const [addedFeedback, setAddedFeedback] = useState(false)
  const [modalImage, setModalImage] = useState<string>('')
  const [variantImages, setVariantImages] = useState<Record<string, string>>({})

  useEffect(() => {
    setMounted(true)
    setCart(loadCart())
    setShuffledProducts([...PRODUCTS].sort(() => Math.random() - 0.5))
    // Randomise which color variant is shown on the card for products with variants
    const imgs: Record<string, string> = {}
    for (const p of PRODUCTS) {
      if (p.type === 'tshirt') {
        const variants = (p as TshirtProduct).colorVariants
        if (variants && variants.length > 1) {
          imgs[p.id] = variants[Math.floor(Math.random() * variants.length)].image
        }
      } else if (p.type === 'sticker') {
        const variants = (p as StickerProduct).variants
        if (variants && variants.length > 1) {
          imgs[p.id] = variants[Math.floor(Math.random() * variants.length)].image
        }
      }
    }
    setVariantImages(imgs)
  }, [])

  const updateCart = useCallback((next: CartItem[]) => { setCart(next); saveCart(next) }, [])

  useEffect(() => {
    if (!selectedProduct) return
    setSelectedColor(TSHIRT_COLORS[0])
    setSelectedSize('')
    setSelectedStickerPreset(STICKER_PRESETS[0])
    setAddedFeedback(false)
    setModalImage(selectedProduct.image)
  }, [selectedProduct])

  const modalPrice = !selectedProduct
    ? 0
    : selectedProduct.type === 'sticker'
      ? catalogStickerPrice(selectedProduct.price, selectedStickerPreset)
      : selectedProduct.type === 'tshirt' && selectedSize
        ? TSHIRT_SIZE_PRICES[selectedSize]
        : selectedProduct.price

  const ALL_CATEGORY_ORDER: ProductCategory[] = ['developer', 'designer', 'bmx', 'cycling', 'pop-culture', 'street', 'humour', 'football']

  const availableCategories = useMemo(() => {
    const source = tab === 'sticker' ? PRODUCTS.filter(p => p.type === 'sticker')
      : tab === 'tshirt' ? PRODUCTS.filter(p => p.type === 'tshirt')
      : PRODUCTS
    const cats = new Set(source.map(p => (p as StickerProduct | TshirtProduct).category))
    return ALL_CATEGORY_ORDER.filter(c => cats.has(c))
  }, [tab])

  const searchLower = search.toLowerCase()

  const filtered = tab === 'custom' ? [] : shuffledProducts.filter(p => {
    if (tab === 'sticker' && p.type !== 'sticker') return false
    if (tab === 'tshirt' && p.type !== 'tshirt') return false
    if (stickerFilter !== 'all') {
      if (p.type === 'sticker') {
        if ((p as StickerProduct).category !== stickerFilter) return false
      } else if (p.type === 'tshirt') {
        if ((p as TshirtProduct).category !== stickerFilter) return false
      }
    }
    if (searchLower) {
      const s = p as StickerProduct
      const inName = p.name.toLowerCase().includes(searchLower)
      const inDesc = p.description.toLowerCase().includes(searchLower)
      const inTags = (s.tags ?? []).some((tag: string) => tag.toLowerCase().includes(searchLower))
      const category = p.type === 'sticker' ? s.category : (p as TshirtProduct).category
      const inCategory = CATEGORY_LABELS[category]?.toLowerCase().includes(searchLower) ?? false
      if (!inName && !inDesc && !inTags && !inCategory) return false
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
          image: modalImage || selectedProduct.image, quantity: 1, type: selectedProduct.type,
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
  const categoryLabel = (p: CatalogProduct) =>
    CATEGORY_LABELS[(p.type === 'tshirt' ? (p as TshirtProduct) : (p as StickerProduct)).category] ?? 'T-Shirt'

  const stickerVariants = selectedProduct?.type === 'sticker'
    ? (selectedProduct as StickerProduct).variants
    : undefined

  const tshirtVariants = selectedProduct?.type === 'tshirt'
    ? (selectedProduct as TshirtProduct).colorVariants
    : undefined

  const activeTshirtVariant: TshirtColorVariant | undefined = tshirtVariants
    ? tshirtVariants.find(v => v.image === modalImage || v.modelImage === modalImage) ?? tshirtVariants[0]
    : undefined

  return (
    <main id="shop">
      <motion.h1
        className="text-[7rem] mb-[0.2rem] text-center"
        initial={{ opacity: 0, y: -50, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        Janja&apos;s <span className="text-lime">Shop</span>
      </motion.h1>
      <motion.h2
        className="mb-12 px-4 py-[0.2rem] bg-[rgba(73,73,73,0.5)] text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        Stickers &amp; T-Shirts — for devs, designers, riders &amp; everyone
      </motion.h2>

      {/* Search bar */}
      <div className="relative mb-6 max-w-[480px]">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888] text-[0.95rem] pointer-events-none">🔍</span>
        <input
          type="text"
          placeholder="Search products…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="w-full bg-[#3a3a3a] border border-[#555] text-white placeholder-[#666] text-[0.9rem] pl-9 pr-4 py-[0.6rem] rounded-sm focus:outline-none focus:border-lime transition-[border-color] duration-150"
        />
        {search && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] hover:text-white text-[0.85rem] leading-none"
            onClick={() => { setSearch(''); setPage(1) }}
          >✕</button>
        )}
      </div>

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

        {tab !== 'custom' && (
          <div className="flex gap-2 flex-wrap">
            {(['all', ...availableCategories] as StickerFilter[]).map(c => (
              <button
                key={c}
                className={`px-4 py-[0.3rem] border border-teal text-[0.85rem] cursor-pointer rounded-sm transition-[background,color] duration-200 ${stickerFilter === c ? 'bg-teal text-[#1a1a1a] font-bold' : 'bg-transparent text-teal hover:bg-[rgba(0,221,215,0.15)]'}`}
                onClick={() => { setStickerFilter(c); setPage(1) }}
              >
                {c === 'all'
                  ? (tab === 'tshirt' ? 'All T-Shirts' : tab === 'sticker' ? 'All Stickers' : 'All')
                  : CATEGORY_LABELS[c as ProductCategory]}
              </button>
            ))}
          </div>
        )}

        {search && (
          <p className="text-[#888] text-[0.82rem]">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;
          </p>
        )}
        {(tab === 'tshirt' || tab === 'all') && (
          <p className="text-[#555] text-[0.75rem]">
            T-shirt mockup photos by{' '}
            <a href="https://mockupmark.com" target="_blank" rel="noopener noreferrer" className="text-[#666] underline hover:text-[#888]">
              Mockup Mark
            </a>
          </p>
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
            {/* Image wrapper prevents right-click save */}
            <div className="relative select-none">
              <img
                src={variantImages[product.id] ?? product.image}
                alt={product.name}
                className={`w-full object-cover block border-b-2 border-[#333] pointer-events-none ${product.type === 'tshirt' ? 'aspect-3/4' : 'aspect-square'}`}
                draggable={false}
                onContextMenu={e => e.preventDefault()}
              />
            </div>
            {/* Type badge — only shown on "All" tab; redundant when filtered by type */}
            {tab === 'all' && (
              <Badge className="absolute top-[0.6rem] right-[0.6rem]">
                {product.type === 'tshirt' ? 'T-Shirt' : 'Sticker'}
              </Badge>
            )}
            {isProductNew(product) && (
              <span className="absolute top-[0.6rem] left-[0.6rem] bg-[#00c896] text-[#1a1a1a] text-[0.65rem] font-bold px-[0.45rem] py-[0.15rem] rounded-sm uppercase tracking-wide">
                New
              </span>
            )}
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
              {product.type === 'sticker' && (product as StickerProduct).variants && (product as StickerProduct).variants!.length > 1 && (
                <p className="text-[#888] text-[0.72rem] mt-[0.3rem]">
                  {(product as StickerProduct).variants!.length} colour variants
                </p>
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

            {/* Left column: image + variant strip */}
            <div className="flex flex-col">
              <div className="relative select-none">
                <img
                  src={modalImage || selectedProduct.image}
                  alt={selectedProduct.name}
                  className={`w-full object-cover block pointer-events-none ${selectedProduct.type === 'tshirt' ? 'aspect-3/4' : 'aspect-square'}`}
                  draggable={false}
                  onContextMenu={e => e.preventDefault()}
                />
              </div>

              {/* Sticker colour variant strip */}
              {stickerVariants && stickerVariants.length > 1 && (
                <div className="flex gap-2 flex-wrap px-3 py-[0.6rem] bg-[#444] border-t border-[#3a3a3a]">
                  {stickerVariants.map(v => (
                    <button
                      key={v.color}
                      title={v.colorLabel}
                      onClick={() => setModalImage(v.image)}
                      className={`w-10 h-10 rounded overflow-hidden border-2 cursor-pointer shrink-0 transition-[border-color,transform] duration-150 hover:scale-110 ${(modalImage || selectedProduct.image) === v.image ? 'border-lime scale-110' : 'border-[#555]'}`}
                    >
                      <img src={v.image} alt={v.colorLabel} className="w-full h-full object-cover pointer-events-none" draggable={false} onContextMenu={e => e.preventDefault()} />
                    </button>
                  ))}
                </div>
              )}

              {/* T-shirt colour variant strip */}
              {tshirtVariants && tshirtVariants.length > 0 && (
                <div className="flex gap-2 flex-wrap px-3 py-[0.6rem] bg-[#444] border-t border-[#3a3a3a]">
                  {tshirtVariants.map(v => (
                    <div key={v.color} className="flex flex-col gap-1 items-center">
                      <button
                        title={v.colorLabel}
                        onClick={() => setModalImage(v.image)}
                        className={`w-10 aspect-3/4 rounded overflow-hidden border-2 cursor-pointer shrink-0 transition-[border-color,transform] duration-150 hover:scale-110 ${activeTshirtVariant?.color === v.color ? 'border-lime scale-110' : 'border-[#555]'}`}
                      >
                        <img src={v.image} alt={v.colorLabel} className="w-full h-full object-cover pointer-events-none" draggable={false} onContextMenu={e => e.preventDefault()} />
                      </button>
                      {v.modelImage && (
                        <button
                          title={`${v.colorLabel} — model`}
                          onClick={() => setModalImage(v.modelImage!)}
                          className={`w-10 aspect-3/4 rounded overflow-hidden border-2 cursor-pointer shrink-0 transition-[border-color,transform] duration-150 hover:scale-110 ${modalImage === v.modelImage ? 'border-teal scale-110' : 'border-[#555]'}`}
                        >
                          <img src={v.modelImage} alt={`${v.colorLabel} model`} className="w-full h-full object-cover pointer-events-none" draggable={false} onContextMenu={e => e.preventDefault()} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 flex flex-col gap-4">
              <p className="text-[0.75rem] uppercase tracking-[0.1em] text-teal">{categoryLabel(selectedProduct)}</p>
              <h2 className="text-lime text-[1.4rem] font-bold leading-[1.2]">{selectedProduct.name}</h2>
              <p className="text-[1.3rem] text-white font-bold">KES {modalPrice.toLocaleString()}</p>
              <p className="text-[#ccc] text-[0.9rem] leading-[1.5]">{selectedProduct.description}</p>

              {selectedProduct.type === 'sticker' && (
                <>
                  {stickerVariants && stickerVariants.length > 1 && (
                    <div>
                      <p className="text-[0.8rem] text-[#aaa] uppercase tracking-[0.08em] mb-[0.3rem]">
                        Colour — <span className="text-white normal-case">
                          {stickerVariants.find(v => v.image === (modalImage || selectedProduct.image))?.colorLabel ?? stickerVariants[0].colorLabel}
                        </span>
                      </p>
                    </div>
                  )}
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
                      {(tshirtVariants
                        ? selectedProduct.colors.filter(c => tshirtVariants.some(v => v.color === c.name))
                        : selectedProduct.colors
                      ).map(c => {
                        const variant = tshirtVariants?.find(v => v.color === c.name)
                        return (
                          <button
                            key={c.name}
                            className={`w-7.5 h-7.5 rounded-full cursor-pointer border-[3px] border-transparent shrink-0 transition-[border-color,transform] duration-150 hover:scale-[1.15] ${selectedColor.name === c.name ? 'border-lime! scale-[1.15]' : ''}`}
                            style={{ background: c.hex, borderColor: c.name === 'white' ? '#888' : 'transparent' }}
                            title={c.label}
                            onClick={() => {
                              setSelectedColor(c)
                              if (variant) setModalImage(variant.image)
                            }}
                          />
                        )
                      })}
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
                <img src={item.image} alt={item.name} className="w-[60px] h-[60px] object-cover shrink-0 border border-[#555] pointer-events-none" draggable={false} onContextMenu={e => e.preventDefault()} />
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
