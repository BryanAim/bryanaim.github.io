// Shared types for the shop — imported by shop pages and API routes

export interface TshirtColor {
  name: string
  hex: string
  label: string
}

export type ProductType = 'sticker' | 'tshirt' | 'custom_sticker' | 'custom_tshirt'

export interface CartItem {
  cartId: string
  productId: string
  name: string
  /** KES unit price */
  price: number
  /** Product image path or thumbnail data URL (≤ ~3 KB) */
  image: string
  quantity: number
  type: ProductType
  // catalog tshirt / custom tshirt
  color?: TshirtColor
  size?: string
  // custom sticker
  widthCm?: number
  heightCm?: number
  // custom items shared
  designId?: string  // UUID returned by /api/upload
  notes?: string
}

// ─── Sticker size presets (catalog stickers) ─────────────────────────────────

export interface StickerPreset { label: string; widthCm: number; heightCm: number }

export const STICKER_PRESETS: StickerPreset[] = [
  { label: 'XS',  widthCm: 3,  heightCm: 3  },
  { label: 'S',   widthCm: 4,  heightCm: 4  },
  { label: 'M',   widthCm: 5,  heightCm: 5  },
  { label: 'L',   widthCm: 8,  heightCm: 8  },
  { label: 'XL',  widthCm: 12, heightCm: 12 },
  { label: 'XXL', widthCm: 15, heightCm: 15 },
]

/** Price for a catalog sticker at a given size — purely area-based, same as custom stickers. */
export function catalogStickerPrice(_basePrice: number, preset: StickerPreset): number {
  return calcStickerPrice(preset.widthCm, preset.heightCm)
}

// ─── T-shirt size pricing ─────────────────────────────────────────────────────

export const TSHIRT_SIZE_PRICES: Record<string, number> = {
  XS: 900, S: 950, M: 1000, L: 1050, XL: 1100, XXL: 1200,
}

export const TSHIRT_COLORS: TshirtColor[] = [
  { name: 'black',  hex: '#1a1a1a', label: 'Black' },
  { name: 'white',  hex: '#e8e8e8', label: 'White' },
  { name: 'navy',   hex: '#1e3a5f', label: 'Navy' },
  { name: 'red',    hex: '#c0392b', label: 'Red' },
  { name: 'forest', hex: '#2d6a4f', label: 'Forest Green' },
]

export const TSHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

/** KES price for a custom sticker by dimensions (rounded to nearest KES 10, min KES 30) */
export function calcStickerPrice(widthCm: number, heightCm: number): number {
  return Math.max(30, Math.round(widthCm * heightCm * 2 / 10) * 10)
}

export const CART_KEY = 'bryan_shop_cart'

export function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(CART_KEY) ?? '[]') }
  catch { return [] }
}

export function saveCart(cart: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}
