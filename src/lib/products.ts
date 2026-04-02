// ─── Product catalogue — edit this file to add/update products ───────────────
// Run `/update-shop` in Claude Code to auto-detect new images and add them here.

import { TshirtColor, TSHIRT_COLORS, TSHIRT_SIZES } from '@/lib/shopTypes'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StickerVariant {
  color: string       // e.g. 'green'
  colorLabel: string  // e.g. 'Green'
  image: string       // e.g. '/img/products/stickers/alien-2-green.jpg'
}

export type StickerCategory =
  | 'developer'
  | 'designer'
  | 'bmx'
  | 'cycling'
  | 'pop-culture'
  | 'street'
  | 'humour'

export type TshirtTag = 'bmx' | 'cycling' | 'developer' | 'street' | 'pop-culture' | 'humour'

export interface StickerProduct {
  id: string
  type: 'sticker'
  name: string
  price: number
  image: string
  description: string
  category: StickerCategory
  canUseOn: string[]
  tags?: string[]
  variants?: StickerVariant[]
  defaultColor?: string
  isNew?: boolean
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
  tags: TshirtTag[]
  isNew?: boolean
}

export type CatalogProduct = StickerProduct | TshirtProduct

// ─── Catalogue ────────────────────────────────────────────────────────────────

export const PRODUCTS: CatalogProduct[] = [
  // ── Stickers: Developer ──────────────────────────────────────────────────
  // {
  //   id: 's-dev-1', type: 'sticker', category: 'developer',
  //   name: 'Hello World Sticker', price: 150,
  //   image: '/img/projects/project1.jpg',
  //   description: 'Classic dev starter. For your laptop, phone, or mug.',
  //   canUseOn: ['Laptop', 'Phone', 'Water bottle', 'Notebook'],
  // },
  // {
  //   id: 's-dev-2', type: 'sticker', category: 'developer',
  //   name: '#!/usr/bin/env Sticker', price: 150,
  //   image: '/img/projects/my-portfolio.jpg',
  //   description: 'For those who live in the terminal. Represent your shell.',
  //   canUseOn: ['Laptop', 'Desktop', 'Server rack'],
  // },
  // {
  //   id: 's-dev-3', type: 'sticker', category: 'developer',
  //   name: 'NaxTechMakers Sticker', price: 250,
  //   image: '/img/projects/naxtechmakers.jpg',
  //   description: 'Nakuru tech community pride. Rep the local dev scene.',
  //   canUseOn: ['Laptop', 'Phone', 'Bike', 'Car'],
  // },
  // {
  //   id: 's-dev-4', type: 'sticker', category: 'developer',
  //   name: 'Coffee & Code Pack (3 pcs)', price: 400,
  //   image: '/img/projects/project2.jpg',
  //   description: 'Three-piece sticker pack — coffee, keyboard, and code vibes.',
  //   canUseOn: ['Laptop', 'Flask / Mug', 'Phone'],
  // },
  // {
  //   id: 's-dev-5', type: 'sticker', category: 'developer',
  //   name: 'git push --force Sticker', price: 150,
  //   image: '/img/projects/project3.jpg',
  //   description: 'For the brave devs who yolo the main branch.',
  //   canUseOn: ['Laptop', 'Phone', 'Notebook'],
  // },

  // ── Stickers: Designer ───────────────────────────────────────────────────
  // {
  //   id: 's-des-1', type: 'sticker', category: 'designer',
  //   name: 'Enjoy Music Art Sticker', price: 200,
  //   image: '/img/projects/design/enjoy-music.jpg',
  //   description: 'Original artwork sticker. Music is life.',
  //   canUseOn: ['Laptop', 'Phone', 'Speaker', 'Guitar case'],
  // },
  {
    id: 's-des-2', type: 'sticker', category: 'designer',
    name: 'Ying Yang No Sensei', price: 200,
    image: '/img/projects/design/ying-yang-no-sensei.jpg',
    description: 'Balance & wisdom. Original illustration sticker.',
    canUseOn: ['Laptop', 'Phone', 'Bike', 'Skateboard'],
  },
  {
    id: 's-des-3', type: 'sticker', category: 'designer',
    name: 'World of Perps Sticker', price: 200,
    image: '/img/projects/design/illustrations/world-of-perps.jpg',
    description: 'Bold original illustration. Eye-catching anywhere.',
    canUseOn: ['Laptop', 'Notebook', 'Phone'],
  },
  // {
  //   id: 's-des-4', type: 'sticker', category: 'designer',
  //   name: 'Mike Explode Art Sticker', price: 200,
  //   image: '/img/projects/design/mike-explode.jpg',
  //   description: 'Explosive original artwork. A real statement piece.',
  //   canUseOn: ['Laptop', 'Phone', 'Helmet', 'Bike'],
  // },
  {
    id: 's-des-5', type: 'sticker', category: 'designer',
    name: 'Sensei Wisdom Sticker', price: 150,
    image: '/img/projects/design/illustrations/sensei-no-pills.jpg',
    description: 'Choose your path. Clean original illustration.',
    canUseOn: ['Laptop', 'Phone', 'Notebook'],
  },
  // {
  //   id: 's-des-6', type: 'sticker', category: 'designer',
  //   name: 'Christmas 2024 Sticker', price: 150,
  //   image: '/img/projects/design/illustrations/christmas-2024.jpg',
  //   description: 'Festive original illustration. Gift it or keep it.',
  //   canUseOn: ['Phone', 'Laptop', 'Gift box', 'Notebook'],
  // },

  // ── Stickers: BMX ────────────────────────────────────────────────────────
  // {
  //   id: 's-bmx-1', type: 'sticker', category: 'bmx',
  //   name: 'BMX Life Sticker', price: 200,
  //   image: '/img/bmx/bmx1.jpg',
  //   description: 'For the riders. Slap it on your frame, helmet, or phone.',
  //   canUseOn: ['Bike frame', 'Helmet', 'Phone', 'Laptop'],
  // },
  // {
  //   id: 's-bmx-2', type: 'sticker', category: 'bmx',
  //   name: 'Street BMX Sticker', price: 200,
  //   image: '/img/bmx/bmx3.jpg',
  //   description: 'Streets are yours. Rep your style everywhere.',
  //   canUseOn: ['Bike frame', 'Helmet', 'Skateboard', 'Phone'],
  // },
  // {
  //   id: 's-bmx-3', type: 'sticker', category: 'bmx',
  //   name: 'Air Time BMX Sticker', price: 200,
  //   image: '/img/bmx/bmx5.jpg',
  //   description: 'Catch that air. For riders who fly.',
  //   canUseOn: ['Bike frame', 'Helmet', 'Ramp', 'Gear bag'],
  // },
  // {
  //   id: 's-bmx-4', type: 'sticker', category: 'bmx',
  //   name: 'BMX Nakuru Sticker', price: 250,
  //   image: '/img/bmx/bmx2.jpg',
  //   description: 'Nakuru BMX scene. Local pride on your bike or beyond.',
  //   canUseOn: ['Bike frame', 'Helmet', 'Phone', 'Car'],
  // },
  // {
  //   id: 's-bmx-5', type: 'sticker', category: 'bmx',
  //   name: 'Barspin Sticker', price: 200,
  //   image: '/img/bmx/bmx6.jpg',
  //   description: 'Spin the bars, spin the world.',
  //   canUseOn: ['Bike frame', 'Helmet', 'Phone', 'Laptop'],
  // },

  // // ── Stickers: Cycling ────────────────────────────────────────────────────
  // {
  //   id: 's-cyc-1', type: 'sticker', category: 'cycling',
  //   name: 'Ride or Die Sticker', price: 200,
  //   image: '/img/bmx/bmx7.jpg',
  //   description: "The cyclist's motto. For all two-wheel lovers.",
  //   canUseOn: ['Bike frame', 'Helmet', 'Water bottle', 'Phone'],
  // },
  // {
  //   id: 's-cyc-2', type: 'sticker', category: 'cycling',
  //   name: 'Two Wheels Sticker', price: 200,
  //   image: '/img/bmx/bmx9.jpg',
  //   description: 'Life is better on two wheels.',
  //   canUseOn: ['Bike frame', 'Helmet', 'Water bottle', 'Laptop'],
  // },
  // {
  //   id: 's-cyc-3', type: 'sticker', category: 'cycling',
  //   name: 'Bike Gang Sticker', price: 150,
  //   image: '/img/bmx/bmx4.jpg',
  //   description: 'Ride together, vibe together.',
  //   canUseOn: ['Bike frame', 'Phone', 'Water bottle'],
  // },
  // {
  //   id: 's-cyc-4', type: 'sticker', category: 'cycling',
  //   name: 'Kenyan Roads Sticker', price: 200,
  //   image: '/img/bmx/bmx10.jpg',
  //   description: 'Tarmac, murram, or anything in between. Kenyan cyclist pride.',
  //   canUseOn: ['Bike frame', 'Helmet', 'Car', 'Phone'],
  // },

  // ── Stickers: Pop Culture ────────────────────────────────────────────────
  {
    id: 's-pop-1', type: 'sticker', category: 'pop-culture',
    name: 'Red pill Sensei', price: 200,
    image: '/img/projects/design/illustrations/sensei-red-pill.jpg',
    description: 'Red Pill Sensei balancing a basketball. Original illustration sticker.',
    canUseOn: ['Phone', 'Laptop', 'Water bottle', 'Notebook'],
  },
  // {
  //   id: 's-pop-2', type: 'sticker', category: 'pop-culture',
  //   name: "Krabby Patty Secret Sticker", price: 150,
  //   image: '/img/projects/corona.jpg',
  //   description: 'The formula is yours. SpongeBob-themed sticker. [Placeholder]',
  //   canUseOn: ['Phone', 'Laptop', 'Fridge', 'Water bottle'],
  // },
  // {
  //   id: 's-pop-3', type: 'sticker', category: 'pop-culture',
  //   name: 'Rick & Morty Forever Sticker', price: 200,
  //   image: '/img/projects/design/compositions/mike-explode.jpg',
  //   description: 'Wubba lubba dub dub! Rick & Morty fan sticker. [Placeholder]',
  //   canUseOn: ['Laptop', 'Phone', 'Car', 'Notebook'],
  // },
  // {
  //   id: 's-pop-4', type: 'sticker', category: 'pop-culture',
  //   name: 'Get Schwifty Sticker', price: 200,
  //   image: '/img/background.jpg',
  //   description: 'You gotta get schwifty! Show your Rick & Morty love. [Placeholder]',
  //   canUseOn: ['Phone', 'Laptop', 'Guitar case', 'Helmet'],
  // },

  // ── T-Shirts ─────────────────────────────────────────────────────────────
  {
    id: 't-1', type: 'tshirt',
    name: 'Nakuru Rides Tee', price: 1200,
    image: '/img/bmx/bmx1-banner.jpg',
    description: 'Nakuru BMX & cycling culture on a quality cotton tee. Lightweight, breathable, built to ride in.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES,
    tags: ['bmx', 'cycling'],
  },
  {
    id: 't-2', type: 'tshirt',
    name: 'Code & Create Tee', price: 1200,
    image: '/img/bmx/design1-banner.jpg',
    description: 'For developers and designers who build things. Minimal design, maximum statement.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES,
    tags: ['developer'],
  },
  {
    id: 't-3', type: 'tshirt',
    name: 'Street Art Graphic Tee', price: 1300,
    image: '/img/projects/design/design1.jpg',
    description: 'Original graphic design on a premium cotton tee. Wear your art.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES,
    tags: ['street'],
  },
  {
    id: 't-4', type: 'tshirt',
    name: 'Bike Life Tee', price: 1200,
    image: '/img/bmx/bmx8.jpg',
    description: 'For cyclists and BMX riders who live on two wheels. Comfortable fit for trail or street.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES,
    tags: ['bmx', 'cycling'],
  },
  {
    id: 't-5', type: 'tshirt',
    name: 'Wubba Lubba Tee', price: 1300,
    image: '/img/projects/design/illustrations/world-of-perps.jpg',
    description: 'Rick & Morty vibes on a quality tee. For fans of the multiverse.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES,
    tags: ['pop-culture', 'humour'],
  },
  {
    id: 't-6', type: 'tshirt',
    name: 'Classic Signature Tee', price: 1000,
    image: '/img/portrait.jpg',
    description: 'Clean, minimal signature tee. A wardrobe staple in 5 colours.',
    colors: TSHIRT_COLORS, sizes: TSHIRT_SIZES,
    tags: ['street'],
  },

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
]
