// ─── Product catalogue — edit this file to add/update products ───────────────
// Run `/update-shop` in Claude Code to auto-detect new images and add them here.

import { TshirtColor, TSHIRT_COLORS, TSHIRT_SIZES } from '@/lib/shopTypes'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StickerVariant {
  color: string       // e.g. 'green'
  colorLabel: string  // e.g. 'Green'
  image: string       // e.g. '/img/products/stickers/alien-2-green.jpg'
}

export type ProductCategory =
  | 'developer'
  | 'designer'
  | 'bmx'
  | 'cycling'
  | 'pop-culture'
  | 'street'
  | 'humour'
  | 'football'

export interface StickerProduct {
  id: string
  type: 'sticker'
  name: string
  price: number
  image: string
  description: string
  category: ProductCategory
  canUseOn: string[]
  tags?: string[]
  variants?: StickerVariant[]
  defaultColor?: string
  isNew?: boolean
  addedAt?: string  // ISO date YYYY-MM-DD, used to auto-expire the NEW badge after 60 days
}

export interface TshirtColorVariant {
  color: string        // e.g. 'black'
  colorLabel: string   // e.g. 'Black'
  image: string        // flat/mockup photo
  modelImage?: string  // lifestyle/model photo (optional)
}

export interface TshirtProduct {
  id: string
  type: 'tshirt'
  name: string
  price: number
  image: string
  description: string
  colors: TshirtColor[]
  sizes: string[]
  category: ProductCategory
  colorVariants?: TshirtColorVariant[]
  defaultColor?: string
  mockupCredit?: string
  isNew?: boolean
  addedAt?: string  // ISO date YYYY-MM-DD, used to auto-expire the NEW badge after 60 days
}

export type CatalogProduct = StickerProduct | TshirtProduct

// ─── Catalogue ────────────────────────────────────────────────────────────────

export const PRODUCTS: CatalogProduct[] = [
  // ── Stickers: Developer ──────────────────────────────────────────────────


  // ── Stickers: Designer ───────────────────────────────────────────────────

  {
    id: 's-des-2', type: 'sticker', category: 'designer',
    name: 'Ying Yang No Sensei', price: 200,
    image: '/img/projects/design/illustrations/ying-yang-no-sensei.jpg',
    description: 'Balance & wisdom. Original illustration sticker.',
    canUseOn: ['Laptop', 'Phone', 'Bike', 'Skateboard'],
  },
  {
    id: 's-des-5', type: 'sticker', category: 'designer',
    name: 'Sensei Wisdom Sticker', price: 150,
    image: '/img/projects/design/illustrations/sensei-no-pills.jpg',
    description: 'Choose your path. Clean original illustration.',
    canUseOn: ['Laptop', 'Phone', 'Notebook'],
  },

  // ── Stickers: BMX ────────────────────────────────────────────────────────
 

  // // ── Stickers: Cycling ────────────────────────────────────────────────────
 

  // ── Stickers: Pop Culture ────────────────────────────────────────────────
  {
    id: 's-pop-1', type: 'sticker', category: 'pop-culture',
    name: 'Red pill Sensei', price: 200,
    image: '/img/projects/design/illustrations/sensei-red-pill.jpg',
    description: 'Red Pill Sensei balancing a basketball. Original illustration sticker.',
    canUseOn: ['Phone', 'Laptop', 'Water bottle', 'Notebook'],
  },

  // ── T-Shirts ─────────────────────────────────────────────────────────────
 

  // ── Stickers: Street ─────────────────────────────────────────────────────
  {
    id: 's-str-1', type: 'sticker', category: 'street',
    name: 'Alien 2', price: 150,
    image: '/img/products/stickers/alien-2-green.jpg',
    description: 'Out-of-this-world alien art sticker. Available in multiple colours.',
    canUseOn: ['Laptop', 'Phone', 'Helmet', 'Skateboard'],
    variants: [
      { color: 'green', colorLabel: 'Green', image: '/img/products/stickers/alien-2-green.jpg' },
      { color: 'pink', colorLabel: 'Pink', image: '/img/products/stickers/alien-pink.jpg' },
    ],
    defaultColor: 'green',
  },
  {
    id: 's-str-2', type: 'sticker', category: 'street',
    name: 'Angry Gorilla Face', price: 150,
    image: '/img/products/stickers/angry-gorilla-face.jpg',
    description: 'Bold gorilla face sticker. Fierce energy for your gear.',
    canUseOn: ['Laptop', 'Phone', 'Helmet', 'Gear bag'],
  },
  {
    id: 's-str-3', type: 'sticker', category: 'bmx',
    name: 'Bike Emoji', price: 150,
    image: '/img/products/stickers/bike-emoji-yellow.jpg',
    description: 'Classic bike emoji, sticker edition. Yellow and bold.',
    canUseOn: ['Bike frame', 'Phone', 'Helmet', 'Water bottle'],
  },
  {
    id: 's-str-4', type: 'sticker', category: 'bmx',
    name: 'Bike Life', price: 150,
    image: '/img/products/stickers/bike-life-black.jpg',
    description: 'Bike Life — a creed, not just a phrase. Available in black or white.',
    canUseOn: ['Bike frame', 'Helmet', 'Phone', 'Laptop'],
    variants: [
      { color: 'black', colorLabel: 'Black', image: '/img/products/stickers/bike-life-black.jpg' },
      { color: 'white', colorLabel: 'White', image: '/img/products/stickers/bike-life-white.jpg' },
    ],
    defaultColor: 'black',
  },
  {
    id: 's-str-5', type: 'sticker', category: 'bmx',
    name: 'Bike Nike Logo', price: 150,
    image: '/img/products/stickers/bike-nike-logo.jpg',
    description: 'Custom Nike-inspired bike sticker. Just ride it.',
    canUseOn: ['Bike frame', 'Helmet', 'Phone', 'Shoes'],
  },
  {
    id: 's-str-6', type: 'sticker', category: 'bmx',
    name: 'BMX Handlebars', price: 150,
    image: '/img/products/stickers/bmx-handlebars-with-bmx-text-green.jpg',
    description: 'BMX handlebars illustration with BMX text. Available in green or red.',
    canUseOn: ['Bike frame', 'Helmet', 'Phone', 'Gear bag'],
    variants: [
      { color: 'green', colorLabel: 'Green', image: '/img/products/stickers/bmx-handlebars-with-bmx-text-green.jpg' },
      { color: 'red', colorLabel: 'Red', image: '/img/products/stickers/bmx-handlebars-with-bmx-text-red.jpg' },
    ],
    defaultColor: 'green',
  },
  {
    id: 's-str-7', type: 'sticker', category: 'cycling',
    name: 'Chain Link Footprint', price: 150,
    image: '/img/products/stickers/chain-link-footprint-yellow.jpg',
    description: 'Chain link meets footprint — unique cycling art sticker.',
    canUseOn: ['Bike frame', 'Phone', 'Laptop', 'Water bottle'],
  },
  {
    id: 's-str-8', type: 'sticker', category: 'bmx',
    name: 'Cult Orange', price: 150,
    image: '/img/products/stickers/cult-orange.jpg',
    description: 'Cult BMX brand sticker in bold orange. For true riders.',
    canUseOn: ['Bike frame', 'Helmet', 'Phone', 'Skate deck'],
  },
  {
    id: 's-str-9', type: 'sticker', category: 'street',
    name: 'Glowing Nike Logo', price: 150,
    image: '/img/products/stickers/glowing-nike-logo-blue.jpg',
    description: 'Nike swoosh with a glowing blue effect. Streetwear energy.',
    canUseOn: ['Laptop', 'Phone', 'Shoes', 'Helmet'],
  },
  {
    id: 's-str-10', type: 'sticker', category: 'humour',
    name: 'Love Weed', price: 150,
    image: '/img/products/stickers/love-weed-green.jpg',
    description: 'Cheeky Love Weed sticker. Available in green or red.',
    canUseOn: ['Laptop', 'Phone', 'Notebook', 'Water bottle'],
    variants: [
      { color: 'green', colorLabel: 'Green', image: '/img/products/stickers/love-weed-green.jpg' },
      { color: 'red', colorLabel: 'Red', image: '/img/products/stickers/love-weed-red.jpg' },
    ],
    defaultColor: 'green',
  },
  {
    id: 's-str-11', type: 'sticker', category: 'street',
    name: 'Monster Energy', price: 150,
    image: '/img/products/stickers/monster-energy.jpg',
    description: 'Monster Energy fan sticker. Fuel your ride or your grind.',
    canUseOn: ['Bike frame', 'Laptop', 'Helmet', 'Water bottle'],
    variants: [
      { color: 'default', colorLabel: 'Classic', image: '/img/products/stickers/monster-energy.jpg' },
      { color: 'green', colorLabel: 'Green', image: '/img/products/stickers/monster-green.jpg' },
      { color: 'black', colorLabel: 'Black Outline', image: '/img/products/stickers/monster-m-logo-black-outline.jpg' },
      { color: 'logo', colorLabel: 'M Logo', image: '/img/products/stickers/monster-m-logo.jpg' },
      { color: 'combo', colorLabel: 'With M Logo', image: '/img/products/stickers/monster-energy-with-m-logo.jpg' },
    ],
    defaultColor: 'default',
  },
  {
    id: 's-str-12', type: 'sticker', category: 'street',
    name: 'Red Bull Logo', price: 150,
    image: '/img/products/stickers/red-bull-logo.jpg',
    description: 'Red Bull sticker — gives your gear wings.',
    canUseOn: ['Bike frame', 'Helmet', 'Laptop', 'Water bottle'],
  },
  {
    id: 's-pop-5', type: 'sticker', category: 'pop-culture',
    name: 'Rick and Morty Portal', price: 150,
    image: '/img/products/stickers/rick-and-morty-portal.jpg',
    description: 'Step through the portal. Rick & Morty sticker for true fans.',
    canUseOn: ['Laptop', 'Phone', 'Notebook', 'Car'],
    variants: [
      { color: 'default', colorLabel: 'Portal', image: '/img/products/stickers/rick-and-morty-portal.jpg' },
      { color: 'red', colorLabel: 'Red', image: '/img/products/stickers/rick-and-morty-red.jpg' },
    ],
    defaultColor: 'default',
  },
  {
    id: 's-str-13', type: 'sticker', category: 'street',
    name: 'Rockstar Energy', price: 150,
    image: '/img/products/stickers/rockstar-energy-drink.jpg',
    description: 'Rockstar Energy sticker. Live loud, ride harder.',
    canUseOn: ['Bike frame', 'Helmet', 'Laptop', 'Water bottle'],
    variants: [
      { color: 'default', colorLabel: 'Classic', image: '/img/products/stickers/rockstar-energy-drink.jpg' },
      { color: 'yellow', colorLabel: 'Yellow', image: '/img/products/stickers/rockstar-yellow.jpg' },
    ],
    defaultColor: 'default',
  },
  {
    id: 's-str-14', type: 'sticker', category: 'street',
    name: 'Ski Mask', price: 150,
    image: '/img/products/stickers/ski-mask-green.jpg',
    description: 'Ski mask sticker with serious street cred. Available in green or red.',
    canUseOn: ['Laptop', 'Phone', 'Helmet', 'Skate deck'],
    variants: [
      { color: 'green', colorLabel: 'Green', image: '/img/products/stickers/ski-mask-green.jpg' },
      { color: 'red', colorLabel: 'Red', image: '/img/products/stickers/ski-mask-red.jpg' },
    ],
    defaultColor: 'green',
  },
  {
    id: 's-str-15', type: 'sticker', category: 'street',
    name: 'Speed Bullet', price: 150,
    image: '/img/products/stickers/speed-bullet-red.jpg',
    description: 'Speed bullet sticker — fast is a lifestyle.',
    canUseOn: ['Bike frame', 'Helmet', 'Phone', 'Car'],
  },
  {
    id: 's-pop-6', type: 'sticker', category: 'pop-culture',
    name: 'Stewie Arms Crossed', price: 150,
    image: '/img/products/stickers/stewie-arms-crossed.jpg',
    description: 'Stewie Griffin looking unimpressed as always. Family Guy fan sticker.',
    canUseOn: ['Laptop', 'Phone', 'Notebook', 'Water bottle'],
  },
  {
    id: 's-str-16', type: 'sticker', category: 'humour',
    name: 'Unless They Kill God', price: 150,
    image: '/img/products/stickers/unless-they-kill-god-red.jpg',
    description: 'Bold and edgy statement sticker. Not for the faint of heart.',
    canUseOn: ['Laptop', 'Notebook', 'Phone', 'Helmet'],
  },
  {
    id: 's-str-17', type: 'sticker', category: 'street',
    name: 'Villain Sensei Red Pill', price: 150,
    image: '/img/products/stickers/villain-sensei-red-pill.jpg',
    description: 'Take the red pill. Original villain sensei artwork sticker.',
    canUseOn: ['Laptop', 'Phone', 'Notebook', 'Helmet'],
  },

  // ── Stickers: Street (continued) ─────────────────────────────────────────
  {
    id: 's-str-18', type: 'sticker', category: 'street',
    name: 'Skull Hot Head', price: 150,
    image: '/img/products/stickers/skull-hot-head-with-helmet.jpg',
    description: 'Skull with a helmet — street art that wears its gear.',
    canUseOn: ['Laptop', 'Phone', 'Helmet', 'Skateboard'],
    variants: [
      { color: 'default', colorLabel: 'Classic', image: '/img/products/stickers/skull-hot-head-with-helmet.jpg' },
      { color: 'blue', colorLabel: 'Blue', image: '/img/products/stickers/skull-hot-head-with-helmet-blue.jpg' },
    ],
    defaultColor: 'default',
  },

  // ── Stickers: BMX (new) ───────────────────────────────────────────────────
  {
    id: 's-bmx-1', type: 'sticker', category: 'bmx',
    name: 'A Day Without BMX', price: 150,
    image: '/img/products/stickers/a-day-without-bmx-just-kidding-i-have-no-idea.jpg',
    description: "A day without BMX? Just kidding — no idea what that even means.",
    canUseOn: ['Bike frame', 'Helmet', 'Phone', 'Water bottle'],
  },
  {
    id: 's-bmx-2', type: 'sticker', category: 'bmx',
    name: 'All Bikes Matter BMX', price: 150,
    image: '/img/products/stickers/all-bikes-matter-bmx.jpg',
    description: 'All bikes matter — BMX most of all. Rep the two-wheel life.',
    canUseOn: ['Bike frame', 'Helmet', 'Phone', 'Water bottle'],
  },
  {
    id: 's-bmx-3', type: 'sticker', category: 'bmx',
    name: 'BMX BMX BMX Rasta', price: 150,
    image: '/img/products/stickers/bmx-bmx-bmx-rasta.jpg',
    description: 'Triple the BMX, triple the energy — in rasta colours.',
    canUseOn: ['Bike frame', 'Helmet', 'Phone', 'Water bottle'],
  },
  {
    id: 's-bmx-4', type: 'sticker', category: 'bmx',
    name: 'BMX Emoji', price: 150,
    image: '/img/products/stickers/bmx-emoji.jpg',
    description: 'Say it with a sticker — BMX life in emoji form.',
    canUseOn: ['Bike frame', 'Helmet', 'Phone', 'Water bottle'],
  },
  {
    id: 's-bmx-5', type: 'sticker', category: 'bmx',
    name: 'BMX Life', price: 150,
    image: '/img/products/stickers/bmx-life.jpg',
    description: "It's not just a hobby, it's a lifestyle. BMX for life.",
    canUseOn: ['Bike frame', 'Helmet', 'Phone', 'Water bottle'],
  },
  {
    id: 's-bmx-6', type: 'sticker', category: 'bmx',
    name: 'BMX Sunflower', price: 150,
    image: '/img/products/stickers/bmx-sunflower.jpg',
    description: 'BMX meets sunflower energy. Bright, bold, and uniquely you.',
    canUseOn: ['Bike frame', 'Helmet', 'Phone', 'Water bottle'],
  },
  {
    id: 's-bmx-7', type: 'sticker', category: 'bmx',
    name: 'BMX Typography Rasta', price: 150,
    image: '/img/products/stickers/bmx-typography-rasta.jpg',
    description: 'Bold BMX typography with rasta colour energy.',
    canUseOn: ['Bike frame', 'Helmet', 'Phone', 'Water bottle'],
  },
  {
    id: 's-bmx-8', type: 'sticker', category: 'bmx',
    name: 'He Is Rizin', price: 150,
    image: '/img/products/stickers/he-is-rizin-black-jesus-rasta-with-bmx.jpg',
    description: "Black Jesus on a BMX — he is rizin. Bold and unapologetic.",
    canUseOn: ['Bike frame', 'Helmet', 'Phone', 'Water bottle'],
  },
  {
    id: 's-bmx-9', type: 'sticker', category: 'bmx',
    name: 'I Love BMX', price: 150,
    image: '/img/products/stickers/i-love-bmx.jpg',
    description: 'Simple. True. I love BMX.',
    canUseOn: ['Bike frame', 'Helmet', 'Phone', 'Water bottle'],
  },
  {
    id: 's-bmx-10', type: 'sticker', category: 'bmx',
    name: 'Love BMX', price: 150,
    image: '/img/products/stickers/love-bmx.jpg',
    description: 'Put your love for BMX on everything you own.',
    canUseOn: ['Bike frame', 'Helmet', 'Phone', 'Water bottle'],
  },
  {
    id: 's-bmx-11', type: 'sticker', category: 'bmx',
    name: 'My Only Ex I Still Ride', price: 150,
    image: '/img/products/stickers/my-only-ex-i-still-ride-bmx.jpg',
    description: "My only ex I still ride — BMX never breaks your heart.",
    canUseOn: ['Bike frame', 'Helmet', 'Phone', 'Water bottle'],
  },
  {
    id: 's-bmx-12', type: 'sticker', category: 'bmx',
    name: 'Shades of BMX Rasta', price: 150,
    image: '/img/products/stickers/shades-of-bmx-rasta.jpg',
    description: 'BMX vibes in rasta shades — colourful, energetic, unstoppable.',
    canUseOn: ['Bike frame', 'Helmet', 'Phone', 'Water bottle'],
  },
  {
    id: 's-bmx-13', type: 'sticker', category: 'bmx',
    name: "I Don't Crash", price: 150,
    image: '/img/products/stickers/i-dont-crash-i-do-random-gravity-checks-rasta.jpg',
    description: "I don't crash — I do random gravity checks. BMX humour, rasta style.",
    canUseOn: ['Bike frame', 'Helmet', 'Phone', 'Water bottle'],
  },
  {
    id: 's-bmx-14', type: 'sticker', category: 'bmx',
    name: 'Life Behind Bars', price: 150,
    image: '/img/products/stickers/life-behind-bars.jpg',
    description: 'Life behind bars — the only bars worth living behind.',
    canUseOn: ['Bike frame', 'Helmet', 'Phone', 'Water bottle'],
  },

  // ── Stickers: Cycling (new) ───────────────────────────────────────────────
  {
    id: 's-cyc-1', type: 'sticker', category: 'cycling',
    name: 'Born to Ride Forced to Work', price: 150,
    image: '/img/products/stickers/born-to-ride-forced-to-work.jpg',
    description: 'Born to ride, forced to work — the struggle every cyclist knows.',
    canUseOn: ['Bike frame', 'Helmet', 'Phone', 'Water bottle'],
  },
  {
    id: 's-cyc-2', type: 'sticker', category: 'cycling',
    name: 'Ride Crash Swear Repeat', price: 150,
    image: '/img/products/stickers/ride-crash-swear-repeat.jpg',
    description: 'The unofficial motto of every rider. Available in classic and rasta.',
    canUseOn: ['Bike frame', 'Helmet', 'Phone', 'Water bottle'],
    variants: [
      { color: 'default', colorLabel: 'Classic', image: '/img/products/stickers/ride-crash-swear-repeat.jpg' },
      { color: 'rasta', colorLabel: 'Rasta', image: '/img/products/stickers/ride-crash-swear-repeat-rasts-purple-and-blue-.jpg' },
    ],
    defaultColor: 'default',
  },

  // ── Stickers: Designer (new) ──────────────────────────────────────────────
  {
    id: 's-des-6', type: 'sticker', category: 'designer',
    name: 'Camera With Lens', price: 150,
    image: '/img/products/stickers/camera-with-lens.jpg',
    description: 'Capture every moment. A clean camera illustration for the creatives.',
    canUseOn: ['Laptop', 'Phone', 'Notebook'],
  },
  {
    id: 's-des-7', type: 'sticker', category: 'designer',
    name: 'COD', price: 150,
    image: '/img/products/stickers/cod.jpg',
    description: 'Call of Duty fan art sticker. For the gamer in you.',
    canUseOn: ['Laptop', 'Phone', 'Notebook'],
  },
  {
    id: 's-des-8', type: 'sticker', category: 'designer',
    name: 'COD 2', price: 150,
    image: '/img/products/stickers/cod-2.jpg',
    description: 'Call of Duty fan art, second edition. Fresh design for the battlefield.',
    canUseOn: ['Laptop', 'Phone', 'Notebook'],
  },
  {
    id: 's-des-9', type: 'sticker', category: 'designer',
    name: 'Early Bird', price: 150,
    image: '/img/products/stickers/early-bird.jpg',
    description: 'The early bird catches the wave. Rise and grind sticker.',
    canUseOn: ['Laptop', 'Phone', 'Notebook'],
  },
  {
    id: 's-des-10', type: 'sticker', category: 'designer',
    name: 'Falling Is a Form of Art', price: 150,
    image: '/img/products/stickers/falling-is-a-form-of-art.jpg',
    description: "Falling is a form of art — and you're a masterpiece.",
    canUseOn: ['Laptop', 'Phone', 'Notebook'],
  },
  {
    id: 's-des-11', type: 'sticker', category: 'designer',
    name: 'Risk Rich', price: 150,
    image: '/img/products/stickers/Risk-rich.jpg',
    description: 'Risk it to get rich. Bold ambition in sticker form.',
    canUseOn: ['Laptop', 'Phone', 'Notebook'],
  },
  {
    id: 's-des-12', type: 'sticker', category: 'designer',
    name: 'Vans', price: 150,
    image: '/img/products/stickers/vans.jpg',
    description: 'Vans-inspired sticker for the skate and street culture lovers.',
    canUseOn: ['Laptop', 'Phone', 'Notebook'],
  },

  // ── Stickers: Pop Culture (new) ───────────────────────────────────────────
  {
    id: 's-pop-2', type: 'sticker', category: 'pop-culture',
    name: 'Bart Shocked', price: 150,
    image: '/img/products/stickers/bart-shocked.jpg',
    description: "Bart Simpson in full shock mode. The Simpsons fan sticker.",
    canUseOn: ['Laptop', 'Phone', 'Notebook', 'Water bottle'],
  },
  {
    id: 's-pop-3', type: 'sticker', category: 'pop-culture',
    name: 'Bart Skeleton', price: 150,
    image: '/img/products/stickers/bart-skeleton.jpg',
    description: "Bart as a skeleton — edgy Simpsons art for the bold.",
    canUseOn: ['Laptop', 'Phone', 'Notebook', 'Water bottle'],
  },
  {
    id: 's-pop-4', type: 'sticker', category: 'pop-culture',
    name: 'Heath Ledger Joker', price: 150,
    image: '/img/products/stickers/heath-leger-joker-not-detailed.jpg',
    description: "Why so serious? Heath Ledger's iconic Joker in sticker form.",
    canUseOn: ['Laptop', 'Phone', 'Notebook', 'Water bottle'],
  },
  {
    id: 's-ftb-1', type: 'sticker', category: 'football',
    name: 'Mbappe', price: 150,
    image: '/img/products/stickers/Mbappe.jpg',
    description: 'Kylian Mbappe sticker. For the football fans.',
    canUseOn: ['Laptop', 'Phone', 'Notebook', 'Water bottle'],
  },
  {
    id: 's-ftb-2', type: 'sticker', category: 'football',
    name: 'Messi Argentina', price: 150,
    image: '/img/products/stickers/messi-argentina.jpg',
    description: 'Leo Messi repping Argentina. For the GOAT fans.',
    canUseOn: ['Laptop', 'Phone', 'Notebook', 'Water bottle'],
  },
  {
    id: 's-ftb-3', type: 'sticker', category: 'football',
    name: 'Messi Cartoon', price: 150,
    image: '/img/products/stickers/messi-cartoon.jpg',
    description: 'Cartoon Messi sticker. Football art meets pop culture.',
    canUseOn: ['Laptop', 'Phone', 'Notebook', 'Water bottle'],
  },
  {
    id: 's-pop-10', type: 'sticker', category: 'pop-culture',
    name: 'Rick and Morty Open Your Eyes', price: 150,
    image: '/img/products/stickers/rick-and-morty-open-your-eyes-morty.jpg',
    description: "Open your eyes, Morty! Rick & Morty fan sticker.",
    canUseOn: ['Laptop', 'Phone', 'Notebook', 'Water bottle'],
  },
  {
    id: 's-pop-11', type: 'sticker', category: 'pop-culture',
    name: 'Rick and Morty Thug Life', price: 150,
    image: '/img/products/stickers/rick-and-morty-thug-life.jpg',
    description: "Thug life chose Rick and Morty. Street-meets-sci-fi sticker.",
    canUseOn: ['Laptop', 'Phone', 'Notebook', 'Water bottle'],
  },
  {
    id: 's-pop-12', type: 'sticker', category: 'pop-culture',
    name: 'Rick Head', price: 150,
    image: '/img/products/stickers/rick-head.jpg',
    description: "Rick Sanchez sticker — wubba lubba dub dub.",
    canUseOn: ['Laptop', 'Phone', 'Notebook', 'Water bottle'],
  },
  {
    id: 's-ftb-4', type: 'sticker', category: 'football',
    name: 'Ronaldo Celebrate', price: 150,
    image: '/img/products/stickers/ronaldo-celebrate.jpg',
    description: "CR7 in full celebration mode. SIUUU in sticker form.",
    canUseOn: ['Laptop', 'Phone', 'Notebook', 'Water bottle'],
  },
  {
    id: 's-pop-14', type: 'sticker', category: 'pop-culture',
    name: 'SpongeBob Raise Hand', price: 150,
    image: '/img/products/stickers/spongebob-raise-hand.jpg',
    description: "SpongeBob raising his hand — because you always have the right answer.",
    canUseOn: ['Laptop', 'Phone', 'Notebook', 'Water bottle'],
  },

  // ── T-Shirts (new) ────────────────────────────────────────────────────────
  {
    id: 't-7', type: 'tshirt',
    name: 'A Day Without BMX Tee', price: 1200,
    image: '/img/products/t-shirts/a-day-without-bmx-just-kidding-i-have-no-idea-white-tshirt.jpg',
    description: "A day without BMX? Just kidding — no idea what that even means. Premium cotton tee.",
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES, category: 'bmx',
    mockupCredit: 'https://mockupmark.com',
    colorVariants: [
      { color: 'white', colorLabel: 'White', image: '/img/products/t-shirts/a-day-without-bmx-just-kidding-i-have-no-idea-white-tshirt.jpg' },
    ],
    defaultColor: 'white',
  },
  {
    id: 't-8', type: 'tshirt',
    name: 'Alien Curvy Tee', price: 1200,
    image: '/img/products/t-shirts/alien-curvy-black-tshirt.jpg',
    description: 'Out-of-this-world curvy alien design on a clean black tee.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES, category: 'street',
    mockupCredit: 'https://mockupmark.com',
    colorVariants: [
      { color: 'black', colorLabel: 'Black', image: '/img/products/t-shirts/alien-curvy-black-tshirt.jpg' },
    ],
    defaultColor: 'black',
  },
  {
    id: 't-9', type: 'tshirt',
    name: 'All Bikes Matter BMX Tee', price: 1200,
    image: '/img/products/t-shirts/all-bikes-matter-bmx-white-tshirt.jpg',
    description: 'All bikes matter — BMX especially. Wear the creed.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES, category: 'bmx',
    mockupCredit: 'https://mockupmark.com',
    colorVariants: [
      { color: 'white', colorLabel: 'White', image: '/img/products/t-shirts/all-bikes-matter-bmx-white-tshirt.jpg' },
      { color: 'black', colorLabel: 'Black', image: '/img/products/t-shirts/all-bikes-matter-bmx-black-tshirt.jpg' },
    ],
    defaultColor: 'white',
  },
  {
    id: 't-10', type: 'tshirt',
    name: 'Angry Gorilla Face Tee', price: 1200,
    image: '/img/products/t-shirts/angry-gorilla-face-white-tshirt.jpg',
    description: 'Bold gorilla face graphic tee. Fierce energy, premium feel.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES, category: 'street',
    mockupCredit: 'https://mockupmark.com',
    colorVariants: [
      { color: 'white', colorLabel: 'White', image: '/img/products/t-shirts/angry-gorilla-face-white-tshirt.jpg', modelImage: '/img/products/t-shirts/angry-gorilla-face-white-tshirt-male-model-rasta.jpg' },
      { color: 'black', colorLabel: 'Black', image: '/img/products/t-shirts/angry-gorilla-face-black-tshirt.jpg' },
      { color: 'yellow', colorLabel: 'Yellow', image: '/img/products/t-shirts/angry-gorilla-face-yellow-tshirt.jpg' },
    ],
    defaultColor: 'white',
  },
  {
    id: 't-11', type: 'tshirt',
    name: 'Bike Life Tee (Graphic)', price: 1200,
    image: '/img/products/t-shirts/bike-life-black-t-shirt.jpg',
    description: 'Bike Life graphic tee — for those who live on two wheels.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES, category: 'bmx',
    mockupCredit: 'https://mockupmark.com',
    colorVariants: [
      { color: 'black', colorLabel: 'Black', image: '/img/products/t-shirts/bike-life-black-t-shirt.jpg', modelImage: '/img/products/t-shirts/bike-life-black-white-tshirt-female-model.jpg' },
    ],
    defaultColor: 'black',
  },
  {
    id: 't-12', type: 'tshirt',
    name: 'Bike Nike Logo Tee', price: 1200,
    image: '/img/products/t-shirts/bike-nike-logo-black-tshirt.jpg',
    description: 'Custom Nike-inspired bike logo on a premium black tee. Just ride it.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES, category: 'bmx',
    mockupCredit: 'https://mockupmark.com',
    colorVariants: [
      { color: 'black', colorLabel: 'Black', image: '/img/products/t-shirts/bike-nike-logo-black-tshirt.jpg' },
    ],
    defaultColor: 'black',
  },
  {
    id: 't-13', type: 'tshirt',
    name: 'BMX BMX BMX Rasta Tee', price: 1200,
    image: '/img/products/t-shirts/bmx-bmx-bmx-rasta-white-tshirt.jpg',
    description: 'Triple BMX rasta energy on a quality cotton tee.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES, category: 'bmx',
    mockupCredit: 'https://mockupmark.com',
    colorVariants: [
      { color: 'white', colorLabel: 'White', image: '/img/products/t-shirts/bmx-bmx-bmx-rasta-white-tshirt.jpg' },
      { color: 'black', colorLabel: 'Black', image: '/img/products/t-shirts/bmx-bmx-bmx-rasta-black-tshirt.jpg' },
    ],
    defaultColor: 'white',
  },
  {
    id: 't-14', type: 'tshirt',
    name: 'BMX Emoji Tee', price: 1200,
    image: '/img/products/t-shirts/bmx-emoji-white-tshirt.jpg',
    description: 'The BMX emoji, supersized on your chest. Say less.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES, category: 'bmx',
    mockupCredit: 'https://mockupmark.com',
    colorVariants: [
      { color: 'white', colorLabel: 'White', image: '/img/products/t-shirts/bmx-emoji-white-tshirt.jpg' },
      { color: 'black', colorLabel: 'Black', image: '/img/products/t-shirts/bmx-emoji-black-tshirt.jpg' },
    ],
    defaultColor: 'white',
  },
  {
    id: 't-15', type: 'tshirt',
    name: 'BMX Handlebars Tee', price: 1200,
    image: '/img/products/t-shirts/bmx-handlebars-with-bmx-text-green-black-tshirt.jpg',
    description: 'BMX handlebars illustration with bold text. Ride culture on your back.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES, category: 'bmx',
    mockupCredit: 'https://mockupmark.com',
    colorVariants: [
      { color: 'black', colorLabel: 'Black', image: '/img/products/t-shirts/bmx-handlebars-with-bmx-text-green-black-tshirt.jpg' },
    ],
    defaultColor: 'black',
  },
  {
    id: 't-16', type: 'tshirt',
    name: 'BMX Life Tee (Graphic)', price: 1200,
    image: '/img/products/t-shirts/bmx-life-white-tshirt.jpg',
    description: "BMX Life graphic tee. It's not a phase, it's a lifestyle.",
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES, category: 'bmx',
    mockupCredit: 'https://mockupmark.com',
    colorVariants: [
      { color: 'white', colorLabel: 'White', image: '/img/products/t-shirts/bmx-life-white-tshirt.jpg' },
    ],
    defaultColor: 'white',
  },
  {
    id: 't-17', type: 'tshirt',
    name: 'BMX Sunflower Tee', price: 1200,
    image: '/img/products/t-shirts/bmx-sunflower-white-tshirt.jpg',
    description: 'BMX meets sunflower art. Bright, positive, and uniquely yours.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES, category: 'bmx',
    mockupCredit: 'https://mockupmark.com',
    colorVariants: [
      { color: 'white', colorLabel: 'White', image: '/img/products/t-shirts/bmx-sunflower-white-tshirt.jpg' },
    ],
    defaultColor: 'white',
  },
  {
    id: 't-18', type: 'tshirt',
    name: 'BMX Typography Rasta Tee', price: 1200,
    image: '/img/products/t-shirts/bmx-typography-rasta-white-tshirt.jpg',
    description: 'Bold BMX typography in rasta colours on a quality cotton tee.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES, category: 'bmx',
    mockupCredit: 'https://mockupmark.com',
    colorVariants: [
      { color: 'white', colorLabel: 'White', image: '/img/products/t-shirts/bmx-typography-rasta-white-tshirt.jpg' },
      { color: 'black', colorLabel: 'Black', image: '/img/products/t-shirts/bmx-typography-rasta-black-tshirt.jpg' },
    ],
    defaultColor: 'white',
  },
  {
    id: 't-19', type: 'tshirt',
    name: 'Born to Ride Forced to Work Tee', price: 1200,
    image: '/img/products/t-shirts/born-to-ride-forced-to-work-white-tshirt.jpg',
    description: 'Born to ride, forced to work — the struggle every rider wears proudly.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES, category: 'bmx',
    mockupCredit: 'https://mockupmark.com',
    colorVariants: [
      { color: 'white', colorLabel: 'White', image: '/img/products/t-shirts/born-to-ride-forced-to-work-white-tshirt.jpg' },
    ],
    defaultColor: 'white',
  },
  {
    id: 't-20', type: 'tshirt',
    name: 'Chain Link Footprint Tee', price: 1200,
    image: '/img/products/t-shirts/chain-link-footprint-black-tshirt.jpg',
    description: 'Chain link footprint art on a premium black tee. Subtle but unmissable.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES, category: 'cycling',
    mockupCredit: 'https://mockupmark.com',
    colorVariants: [
      { color: 'black', colorLabel: 'Black', image: '/img/products/t-shirts/chain-link-footprint-black-tshirt.jpg' },
    ],
    defaultColor: 'black',
  },
  {
    id: 't-21', type: 'tshirt',
    name: 'Falling Is a Form of Art Tee', price: 1200,
    image: '/img/products/t-shirts/falling-is-a-form-of-art-white-tshirt.jpg',
    description: "Falling is a form of art — wear the philosophy.",
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES, category: 'bmx',
    mockupCredit: 'https://mockupmark.com',
    colorVariants: [
      { color: 'white', colorLabel: 'White', image: '/img/products/t-shirts/falling-is-a-form-of-art-white-tshirt.jpg', modelImage: '/img/products/t-shirts/falling-is-a-form-of-art-white-tshirt-male-model-rasta.jpg' },
    ],
    defaultColor: 'white',
  },
  {
    id: 't-22', type: 'tshirt',
    name: 'He Is Rizin Tee', price: 1200,
    image: '/img/products/t-shirts/he-is-rizin-black-jesus-rasta-with-bmx-white-tshirt.jpg',
    description: "Black Jesus on a BMX — he is rizin. Bold graphic tee for the brave.",
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES, category: 'bmx',
    mockupCredit: 'https://mockupmark.com',
    colorVariants: [
      { color: 'white', colorLabel: 'White', image: '/img/products/t-shirts/he-is-rizin-black-jesus-rasta-with-bmx-white-tshirt.jpg' },
      { color: 'black', colorLabel: 'Black', image: '/img/products/t-shirts/he-is-rizin-black-jesus-rasta-with-bmx-black-tshirt.jpg' },
      { color: 'yellow', colorLabel: 'Yellow', image: '/img/products/t-shirts/he-is-rizin-black-jesus-rasta-with-bmx-yellow-tshirt.jpg' },
    ],
    defaultColor: 'white',
  },
  {
    id: 't-23', type: 'tshirt',
    name: 'Heath Ledger Joker Tee', price: 1300,
    image: '/img/products/t-shirts/heath-leger-joker-not-detailed-white-tshirt.jpg',
    description: "Why so serious? Heath Ledger's Joker on a premium graphic tee.",
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES, category: 'pop-culture',
    mockupCredit: 'https://mockupmark.com',
    colorVariants: [
      { color: 'white', colorLabel: 'White', image: '/img/products/t-shirts/heath-leger-joker-not-detailed-white-tshirt.jpg' },
      { color: 'yellow', colorLabel: 'Yellow', image: '/img/products/t-shirts/heath-leger-joker-not-detailed-yellow-tshirt.jpg' },
    ],
    defaultColor: 'white',
  },
  {
    id: 't-24', type: 'tshirt',
    name: "I Don't Crash Tee", price: 1200,
    image: '/img/products/t-shirts/i-dont-crash-i-do-random-gravity-checks-rasta-white-tshirt.jpg',
    description: "I don't crash — I do random gravity checks. Rasta BMX humour tee.",
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES, category: 'bmx',
    mockupCredit: 'https://mockupmark.com',
    colorVariants: [
      { color: 'white', colorLabel: 'White', image: '/img/products/t-shirts/i-dont-crash-i-do-random-gravity-checks-rasta-white-tshirt.jpg' },
      { color: 'black', colorLabel: 'Black', image: '/img/products/t-shirts/i-dont-crash-i-do-random-gravity-checks-rasta-black-tshirt.jpg' },
      { color: 'yellow', colorLabel: 'Yellow', image: '/img/products/t-shirts/i-dont-crash-i-do-random-gravity-checks-rasta-yellow-tshirt.jpg' },
    ],
    defaultColor: 'white',
  },
  {
    id: 't-25', type: 'tshirt',
    name: 'I Love BMX Tee', price: 1200,
    image: '/img/products/t-shirts/i-love-bmx-white-tshirt.jpg',
    description: 'Simple. True. I love BMX. Quality cotton tee for true riders.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES, category: 'bmx',
    mockupCredit: 'https://mockupmark.com',
    colorVariants: [
      { color: 'white', colorLabel: 'White', image: '/img/products/t-shirts/i-love-bmx-white-tshirt.jpg' },
    ],
    defaultColor: 'white',
  },
  {
    id: 't-26', type: 'tshirt',
    name: 'Life Behind Bars Tee', price: 1200,
    image: '/img/products/t-shirts/life-behind-bars-white-tshirt.jpg',
    description: 'Life behind bars — the only bars worth living behind.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES, category: 'bmx',
    mockupCredit: 'https://mockupmark.com',
    colorVariants: [
      { color: 'white', colorLabel: 'White', image: '/img/products/t-shirts/life-behind-bars-white-tshirt.jpg' },
    ],
    defaultColor: 'white',
  },
  {
    id: 't-27', type: 'tshirt',
    name: 'Love BMX Rasta Tee', price: 1200,
    image: '/img/products/t-shirts/love-bmx-rasta-white-tshirt.jpg',
    description: 'Love BMX in full rasta colour. Wear the vibe.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES, category: 'bmx',
    mockupCredit: 'https://mockupmark.com',
    colorVariants: [
      { color: 'white', colorLabel: 'White', image: '/img/products/t-shirts/love-bmx-rasta-white-tshirt.jpg' },
      { color: 'red', colorLabel: 'Red', image: '/img/products/t-shirts/love-bmx-rasta-red-thirt.jpg' },
    ],
    defaultColor: 'white',
  },
  {
    id: 't-28', type: 'tshirt',
    name: 'Love Weed Tee', price: 1200,
    image: '/img/products/t-shirts/love-weed-green-white-tshirt.jpg',
    description: 'Cheeky Love Weed graphic tee. Not for the faint of heart.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES, category: 'humour',
    mockupCredit: 'https://mockupmark.com',
    colorVariants: [
      { color: 'white', colorLabel: 'White', image: '/img/products/t-shirts/love-weed-green-white-tshirt.jpg' },
      { color: 'black', colorLabel: 'Black', image: '/img/products/t-shirts/love-weed-green-black-tshirt.jpg' },
    ],
    defaultColor: 'white',
  },
  {
    id: 't-29', type: 'tshirt',
    name: 'Monster Energy Tee', price: 1200,
    image: '/img/products/t-shirts/monster-energy-white-tshirt.jpg',
    description: 'Monster Energy fan graphic tee. Fuel your ride or your grind.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES, category: 'street',
    mockupCredit: 'https://mockupmark.com',
    colorVariants: [
      { color: 'white', colorLabel: 'White', image: '/img/products/t-shirts/monster-energy-white-tshirt.jpg' },
      { color: 'black', colorLabel: 'Black', image: '/img/products/t-shirts/monster-energy-black-tshirt.jpg' },
    ],
    defaultColor: 'white',
  },
  {
    id: 't-30', type: 'tshirt',
    name: 'Monster Energy With M Logo Tee', price: 1200,
    image: '/img/products/t-shirts/monster-energy-with-m-logo.jpg',
    description: 'Monster Energy with the M logo — double the brand energy on one tee.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES, category: 'street',
    mockupCredit: 'https://mockupmark.com',
    colorVariants: [
      { color: 'default', colorLabel: 'Classic', image: '/img/products/t-shirts/monster-energy-with-m-logo.jpg' },
    ],
    defaultColor: 'default',
  },
  {
    id: 't-31', type: 'tshirt',
    name: 'My Only Ex I Still Ride Tee', price: 1200,
    image: '/img/products/t-shirts/my-only-ex-i-still-ride-bmx-white-tshirt.jpg',
    description: "My only ex I still ride — BMX never breaks your heart.",
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES, category: 'bmx',
    mockupCredit: 'https://mockupmark.com',
    colorVariants: [
      { color: 'white', colorLabel: 'White', image: '/img/products/t-shirts/my-only-ex-i-still-ride-bmx-white-tshirt.jpg', modelImage: '/img/products/t-shirts/my-only-ex-i-still-ride-bmx-white-tshirt-male-model-rasta.jpg' },
      { color: 'blue', colorLabel: 'Blue', image: '/img/products/t-shirts/my-only-ex-i-still-ride-bmx-blue-tshirt.jpg' },
      { color: 'yellow', colorLabel: 'Yellow', image: '/img/products/t-shirts/my-only-ex-i-still-ride-bmx-yellow-tshirt.jpg' },
    ],
    defaultColor: 'white',
  },
  {
    id: 't-32', type: 'tshirt',
    name: 'Red Bull Logo Tee', price: 1200,
    image: '/img/products/t-shirts/red-bull-logo-white-tshirt.jpg',
    description: 'Red Bull graphic tee — gives your wardrobe wings.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES, category: 'street',
    mockupCredit: 'https://mockupmark.com',
    colorVariants: [
      { color: 'white', colorLabel: 'White', image: '/img/products/t-shirts/red-bull-logo-white-tshirt.jpg' },
    ],
    defaultColor: 'white',
  },
  {
    id: 't-33', type: 'tshirt',
    name: 'Rick and Morty Portal Tee', price: 1300,
    image: '/img/products/t-shirts/rick-and-morty-portal-white-tshirt.jpg',
    description: 'Step through the portal. Rick & Morty graphic tee for true fans.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES, category: 'pop-culture',
    mockupCredit: 'https://mockupmark.com',
    colorVariants: [
      { color: 'white', colorLabel: 'White', image: '/img/products/t-shirts/rick-and-morty-portal-white-tshirt.jpg' },
      { color: 'black', colorLabel: 'Black', image: '/img/products/t-shirts/rick-and-morty-portal-black-tshirt.jpg' },
    ],
    defaultColor: 'white',
  },
  {
    id: 't-34', type: 'tshirt',
    name: 'Rick and Morty Red Tee', price: 1300,
    image: '/img/products/t-shirts/rick-and-morty-red-black-tshirt.jpg',
    description: 'Rick & Morty red edition graphic tee. Bold design, quality print.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES, category: 'pop-culture',
    mockupCredit: 'https://mockupmark.com',
    colorVariants: [
      { color: 'black', colorLabel: 'Black', image: '/img/products/t-shirts/rick-and-morty-red-black-tshirt.jpg' },
    ],
    defaultColor: 'black',
  },
  {
    id: 't-35', type: 'tshirt',
    name: 'Rick and Morty Thug Life Tee', price: 1300,
    image: '/img/products/t-shirts/rick-and-morty-thug-life-white-tshirt.jpg',
    description: "Thug life chose Rick and Morty. Street-meets-sci-fi on a quality tee.",
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES, category: 'pop-culture',
    mockupCredit: 'https://mockupmark.com',
    colorVariants: [
      { color: 'white', colorLabel: 'White', image: '/img/products/t-shirts/rick-and-morty-thug-life-white-tshirt.jpg' },
      { color: 'blue', colorLabel: 'Blue', image: '/img/products/t-shirts/rick-and-morty-thug-life-blue-tshirt.jpg' },
      { color: 'black', colorLabel: 'Black', image: '/img/products/t-shirts/rick-and-morty-thug-life-black-tshirt.jpg' },
    ],
    defaultColor: 'white',
  },
  {
    id: 't-36', type: 'tshirt',
    name: 'Rick Head Tee', price: 1300,
    image: '/img/products/t-shirts/rick-head-white-tshirt.jpg',
    description: "Rick Sanchez graphic tee — wubba lubba dub dub.",
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES, category: 'pop-culture',
    mockupCredit: 'https://mockupmark.com',
    colorVariants: [
      { color: 'white', colorLabel: 'White', image: '/img/products/t-shirts/rick-head-white-tshirt.jpg' },
      { color: 'black', colorLabel: 'Black', image: '/img/products/t-shirts/rick-head-black-tshirt.jpg' },
      { color: 'yellow', colorLabel: 'Yellow', image: '/img/products/t-shirts/rick-head-yellow-tshirt.jpg' },
    ],
    defaultColor: 'white',
  },
  {
    id: 't-37', type: 'tshirt',
    name: 'Ride Crash Swear Repeat Tee', price: 1200,
    image: '/img/products/t-shirts/ride-crash-swear-repeat-rasts-purple-and-blue-white-tshirt-male-model.jpg',
    description: "Ride, crash, swear, repeat — the official rasta BMX motto tee.",
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES, category: 'bmx',
    mockupCredit: 'https://mockupmark.com',
    colorVariants: [
      { color: 'white', colorLabel: 'White', image: '/img/products/t-shirts/ride-crash-swear-repeat-rasts-purple-and-blue-white-tshirt-male-model.jpg' },
      { color: 'green', colorLabel: 'Green', image: '/img/products/t-shirts/ride-crash-swear-repeat-rasts-purple-and-blue-green-tshirt.jpg' },
      { color: 'red', colorLabel: 'Red', image: '/img/products/t-shirts/ride-crash-swear-repeat-rasts-purple-and-blue-red-tshirt.jpg' },
    ],
    defaultColor: 'white',
  },
  {
    id: 't-38', type: 'tshirt',
    name: 'Shades of BMX Rasta Tee', price: 1200,
    image: '/img/products/t-shirts/shades-of-bmx-rasta-white-tshirt.jpg',
    description: 'BMX in rasta shades — colourful, energetic, unstoppable.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES, category: 'bmx',
    mockupCredit: 'https://mockupmark.com',
    colorVariants: [
      { color: 'white', colorLabel: 'White', image: '/img/products/t-shirts/shades-of-bmx-rasta-white-tshirt.jpg' },
      { color: 'black', colorLabel: 'Black', image: '/img/products/t-shirts/shades-of-bmx-rasta-black-tshirt.jpg' },
      { color: 'blue', colorLabel: 'Blue', image: '/img/products/t-shirts/shades-of-bmx-rasta-blue-tshirt.jpg' },
      { color: 'yellow', colorLabel: 'Yellow', image: '/img/products/t-shirts/shades-of-bmx-rasta-yellow-tshirt.jpg' },
    ],
    defaultColor: 'white',
  },
  {
    id: 't-39', type: 'tshirt',
    name: 'Ski Mask Red Tee', price: 1200,
    image: '/img/products/t-shirts/ski-mask-red-on-black-tshirt.jpg',
    description: 'Red ski mask graphic on a premium black tee. Serious street cred.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES, category: 'street',
    mockupCredit: 'https://mockupmark.com',
    colorVariants: [
      { color: 'black', colorLabel: 'Black', image: '/img/products/t-shirts/ski-mask-red-on-black-tshirt.jpg' },
    ],
    defaultColor: 'black',
  },
  {
    id: 't-40', type: 'tshirt',
    name: 'SpongeBob Raise Hand Tee', price: 1300,
    image: '/img/products/t-shirts/spongebob-raise-hand-white-tshirt.jpg',
    description: "SpongeBob raising his hand — because you always have the answer.",
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES, category: 'pop-culture',
    mockupCredit: 'https://mockupmark.com',
    colorVariants: [
      { color: 'white', colorLabel: 'White', image: '/img/products/t-shirts/spongebob-raise-hand-white-tshirt.jpg' },
      { color: 'black', colorLabel: 'Black', image: '/img/products/t-shirts/spongebob-raise-hand-black-tshirt.jpg' },
      { color: 'yellow', colorLabel: 'Yellow', image: '/img/products/t-shirts/spongebob-raise-hand-yellow-tshirt.jpg' },
    ],
    defaultColor: 'white',
  },
  {
    id: 't-41', type: 'tshirt',
    name: 'Stewie Hands Crossed Tee', price: 1300,
    image: '/img/products/t-shirts/stewie-hands-crossed-white-t-shirt.jpg',
    description: 'Stewie Griffin crossed arms and attitude on a quality white tee.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES, category: 'pop-culture',
    mockupCredit: 'https://mockupmark.com',
    colorVariants: [
      { color: 'white', colorLabel: 'White', image: '/img/products/t-shirts/stewie-hands-crossed-white-t-shirt.jpg' },
    ],
    defaultColor: 'white',
  },
  {
    id: 't-42', type: 'tshirt',
    name: 'Unless They Kill God Tee', price: 1200,
    image: '/img/products/t-shirts/unless-they-kill-god-red-black-tshirt.jpg',
    description: 'Bold and edgy statement graphic tee. Not for the faint of heart.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES, category: 'street',
    mockupCredit: 'https://mockupmark.com',
    colorVariants: [
      { color: 'black', colorLabel: 'Black', image: '/img/products/t-shirts/unless-they-kill-god-red-black-tshirt.jpg' },
      { color: 'white', colorLabel: 'White', image: '/img/products/t-shirts/unless-they-kill-god-white-tshirt.jpg', modelImage: '/img/products/t-shirts/unless-they-kill-god-red-male-model-white-tshirt.jpg' },
    ],
    defaultColor: 'black',
  },
  {
    id: 't-43', type: 'tshirt',
    name: 'Villain Sensei Red Pill Tee', price: 1200,
    image: '/img/products/t-shirts/villain-sensei-red-pill-white-tshirt.jpg',
    description: 'Take the red pill. Original villain sensei artwork on a premium tee.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES, category: 'street',
    mockupCredit: 'https://mockupmark.com',
    colorVariants: [
      { color: 'white', colorLabel: 'White', image: '/img/products/t-shirts/villain-sensei-red-pill-white-tshirt.jpg' },
      { color: 'black', colorLabel: 'Black', image: '/img/products/t-shirts/villain-sensei-red-pill-black-tshirt.jpg' },
      { color: 'logo-white', colorLabel: 'White (Logo)', image: '/img/products/t-shirts/villain-sensei-red-pill-top-left-logo-white-tshirt.jpg' },
      { color: 'logo-black', colorLabel: 'Black (Logo)', image: '/img/products/t-shirts/villain-sensei-red-pill-top-left-logo-black-tshirt.jpg' },
    ],
    defaultColor: 'white',
  },
]
