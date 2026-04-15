# CLAUDE.md — isalebryan.dev

Portfolio site for **Brian Isale** — Software Developer & Multimedia Designer based in Nakuru, Kenya.
URL: https://isalebryan.dev

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router, `'use client'` where needed) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + SCSS (`globals.css`) |
| Animations | Framer Motion |
| DB | Neon Postgres (`@neondatabase/serverless`) — orders & uploaded designs only |
| Payments | M-Pesa STK Push (Kenya) |
| Hosting | Vercel |
| Analytics | `@vercel/analytics`, `@vercel/speed-insights` |

---

## Project Structure

```
src/app/
├── page.tsx              # Home — hero + quick links
├── about/page.tsx        # About — bio, stats, stack cards, quote
├── work/
│   ├── page.tsx          # Work — tabs: Services / Design / Dev
│   ├── devProjects.ts    # Dev projects data (7 projects, agent-manageable)
│   ├── designProjects.ts # Design portfolio data (80+ projects)
│   └── design/[slug]/    # Individual design project detail page
├── shop/
│   ├── page.tsx          # Shop — stickers, t-shirts, search, cart
│   ├── custom/page.tsx   # Custom order upload flow
│   └── checkout/page.tsx # Checkout + M-Pesa payment
├── contact/page.tsx      # Contact form
├── bmx/page.tsx          # BMX hobby page
├── api/
│   ├── upload/route.ts   # Custom design image upload (base64 → Neon DB)
│   ├── design/[id]/      # Retrieve uploaded design by ID
│   └── mpesa/            # STK push, callback, status, orders, token
├── components/
│   ├── Header.tsx        # Animated sidebar nav
│   ├── PageTransition.tsx
│   ├── QuoteModal.tsx    # Service quote request modal
│   ├── WhatsAppButton.tsx
│   └── JsonLd.tsx        # SEO structured data
├── layout.tsx            # Root layout — fonts, analytics, header
└── globals.css           # All CSS (Tailwind base + custom classes)

src/lib/
├── products.ts           # Shop product catalogue (PRODUCTS array, 100+ items)
└── shopTypes.ts          # TypeScript interfaces for shop

public/
├── img/
│   ├── projects/design/  # Design portfolio images
│   │   ├── logos/        # Logo projects
│   │   ├── print/        # Print design
│   │   ├── compositions/ # Photo manipulations
│   │   └── illustrations/# Digital illustrations
│   ├── projects/         # Dev project screenshots
│   ├── products/
│   │   ├── stickers/     # Sticker product images
│   │   └── t-shirts/     # T-shirt mockups
│   └── bmx/              # BMX page images
└── isale_brian_cv.pdf    # Downloadable CV

agents/                   # Local automation scripts (not committed to git)
├── site-context.md       # Site context loaded by all agents
├── design-memory.json    # Tracks processed design images (gitignored)
├── shop-memory.json      # Tracks processed product images (gitignored)
├── compress-images.mjs   # sharp-based image compression script
├── pre-commit            # Git pre-commit hook source
└── install-hooks.sh      # Installs the pre-commit hook into .git/hooks/

.claude/skills/           # Claude Code slash commands (gitignored)
├── update-design-projects.md  # /update-design-projects — auto-catalogue design images
├── update-dev-projects.md     # /update-dev-projects — sync GitHub repos → devProjects.ts
├── update-shop.md             # /update-shop — auto-catalogue product images
└── tailwind-migrate.md        # /tailwind-migrate — Tailwind v3→v4 helper
```

---

## Key Data Files

### `src/app/work/designProjects.ts`
Single source of truth for the design portfolio. Each entry:
```ts
{
  slug: string        // kebab-case, unique
  title: string
  category: 'logo' | 'print' | 'composition' | 'illustration'
  tags: string[]
  primaryImage: string  // /img/projects/design/{subfolder}/filename.jpg
  images?: { src, label, isChosen?, caption? }[]
  year: string        // '2018'–'2026'
  client?: string
  description: string
  concept: string
  tools: string[]
  color: string       // hex accent
}
```
**Do not edit manually if possible — use `/update-design-projects` instead.**

### `src/app/work/devProjects.ts`
Dev project array (7 entries). Interface: `{ title, img, url, github?, desc, tags[] }`.
**Managed by `/update-dev-projects` skill.**

### `src/lib/products.ts`
Shop catalogue. Two types: `StickerProduct` and `TshirtProduct`.
**Managed by `/update-shop` skill.**

---

## Agent Skills (Slash Commands)

| Command | Trigger | What it does |
|---------|---------|--------------|
| `/update-design-projects` | Manual | Scans `public/img/projects/design/`, moves files to correct subfolders, uses Claude vision to generate metadata, compresses large images, appends to `designProjects.ts` |
| `/update-dev-projects` | Manual | Fetches BryanAim GitHub repos via API, compares to `devProjects.ts`, adds new portfolio-worthy projects |
| `/update-shop` | Manual | Scans `public/img/products/`, parses filenames, groups variants, appends to `products.ts` |

All skills use `agents/` memory files to avoid re-processing known items (token efficiency).

### Running a skill
In Claude Code terminal: type `/update-design-projects` (or whichever command) and press Enter.

### Scheduling (automatic runs)
To run `/update-design-projects` on a weekly schedule, use Claude Code's schedule skill:
```
/schedule weekly /update-design-projects
```
See scheduling section in `.claude/skills/update-design-projects.md` for details.

---

## Image Compression
`agents/compress-images.mjs` uses `sharp` (installed as devDependency).
- Compresses images > 300 KB to WebP at 85% quality and **deletes the original** (WebP is the only copy)
- Called automatically by `/update-design-projects`
- Can also be run manually:
  ```bash
  node agents/compress-images.mjs public/img/projects/design/logos/my-logo.jpg
  ```

---

## Git Hook
A pre-commit hook warns when uncatalogued design images are detected. Install once:
```bash
bash agents/install-hooks.sh
```

---

## CSS Architecture
Everything is in `src/app/globals.css`. Naming conventions:
- Page-specific prefixes: `about-*`, `wk-*` (work), `sv-*` (services), `ms-*` (modal), `dgm-*` (design gallery)
- Shop: `sp-*` (shop page), `pm-*` (product modal), `cart-*`
- Tailwind utility classes used inline for simple layouts

---

## Environment Variables
```
DATABASE_URL          # Neon Postgres connection string
MPESA_CONSUMER_KEY    # Safaricom Daraja API
MPESA_CONSUMER_SECRET
MPESA_SHORTCODE
MPESA_PASSKEY
MPESA_CALLBACK_URL
ORDERS_API_SECRET     # Bearer token for GET /api/mpesa/orders
```
Never committed. Use `vercel env pull` to sync locally.

---

## Common Tasks

**Add a new design project manually:**
1. Put image in `public/img/projects/design/{category}/`
2. Run `/update-design-projects` — Claude does the rest

**Add a new product:**
1. Put image in `public/img/products/stickers/` or `/t-shirts/`
2. Run `/update-shop`

**Check for uncatalogued images:**
```bash
bash agents/pre-commit
```

**Run dev server:**
```bash
npm run dev   # http://localhost:3000
```

**Deploy:**
Push to `master` — Vercel auto-deploys. Or use `/vercel:deploy`.
