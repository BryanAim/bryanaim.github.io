# isalebryan.dev — Full Site Audit
**Date:** 2026-04-29  
**Audited by:** 6 specialist AI agents (Performance, UI/Design, Next.js/SEO, Code Quality, Security, UX/Conversion)  
**Site:** https://isalebryan.dev

---

## Quick-Start: The 5 Things to Do This Week

| # | Fix | Time | Impact |
|---|-----|------|--------|
| 1 | ~~Add "Available for work" badge to homepage hero~~ ✅ 2026-05-16 | 20 min | 🔴 Hiring |
| 2 | ~~Remove "BMX Rider / Lifelong Learner / Friend" from typed strings~~ ✅ 2026-05-16 | 5 min | 🔴 Hiring |
| 3 | ✅ Fix 3 dead dev project URLs (VueGram, Covid Tracker, NaxTechmakers HTTP) | 10 min | 🔴 Credibility |
| 4 | ✅ Delete dead Google Analytics UA script from `layout.tsx:230–236` | 2 min | 🟠 Performance |
| 5 | Fix the M-Pesa callback with no authentication (fake payment injection possible) | 2 hrs | 🔴 Security |

---

## 1. PERFORMANCE

### ✅ 1.1 — Background slideshow migrated to `<Image fill>` *(fixed 2026-05-11)*
**File:** `src/app/HomeClient.tsx`  
CSS `backgroundImage` on plain `<div>` replaced with `<Image fill sizes="100vw" priority={i === 0}>` inside each `motion.div` slide. Next.js now serves optimised WebP/AVIF at the correct viewport size. First slide gets `priority` for LCP; others lazy-load.

---

### ✅ 1.2 — Dead Google Analytics UA script removed *(fixed 2026-05-06)*
Deleted UA-157368874-1 `<Script>` tags and the unused `next/script` import from `layout.tsx`. Saves ~30 KB download + DNS lookup on every page load. `@vercel/analytics` already covers analytics needs.

---

### ✅ 1.3 — Inter font `display: 'swap'` added *(fixed 2026-05-09)*
**File:** `src/app/layout.tsx`  
`Inter({ subsets: ['latin'], display: 'swap' })` — prevents invisible text during font load.

---

### ✅ 1.4 — Dev project cards use raw `<img>` *(fixed 2026-05-11)*
**File:** `src/app/work/WorkClient.tsx:25`  
Replaced with `<Image fill sizes="(max-width: 768px) 100vw, 33vw">` from `next/image`. Kept `wk-dev-img` class for WebKit scale-on-hover (avoids corner-bleed on `overflow-hidden` + `rounded`).

---

### ✅ 1.5 — Portrait image missing `sizes` prop *(fixed 2026-05-11)*
**File:** `src/app/HomeClient.tsx`  
Added `sizes="(max-width: 1023px) 208px, 288px"` — matches `max-lg:w-52` (208px) and `w-72` (288px) container breakpoints. Next.js now serves the correct image size instead of defaulting to `100vw`.

---

### ✅ 1.6 — Font Awesome render-blocking fixed *(fixed 2026-05-11)*
**File:** `src/app/layout.tsx:211-214`
Replaced blocking link with: (1) preload hint to start the fetch early, (2) tiny inline script that creates the link with `media="print"` and flips to `"all"` on load — CSS never blocks render, (3) noscript fallback. `unsafe-inline` already on CSP script-src.

---

### 1.7 — ✅ DONE: AVIF format added to `next.config.js` (2026-04-29)

---

### ✅ 1.8 — Cache headers added for fonts and images *(fixed 2026-05-09)*
**File:** `next.config.js`  
`/fonts/(.*)` → `immutable, max-age=31536000`. `/img/(.*)` → `max-age=86400, stale-while-revalidate=604800`.

---

### ✅ 1.9 — Server shell pattern applied to all routes *(fixed 2026-05-09)*
All main pages (`about`, `work`, `contact`, `bmx`, `shop`, home) are now server components with `export const metadata`. `work/design/[slug]/page.tsx` has `generateStaticParams` for SSG of all 80+ design pages, with `generateMetadata` per slug. Interactive sections are isolated in `*Client.tsx` files.

---

### ✅ 1.10 — LazyMotion saves ~15 KB on every page *(fixed 2026-05-11)*
Created `MotionProvider.tsx` (`'use client'`, `LazyMotion features={domMax}`) — uses `domMax` (not `domAnimation`) to preserve `layoutId` in `Header.tsx` and `BmxClient.tsx`. Wrapped all body content in `layout.tsx`. Replaced `motion` → `m` in all 19 framer-motion files (import + JSX).

---

### 1.11 — ✅ DONE: Removed dead `cdn.sanity.io` remote pattern (2026-04-30)
Deleted `{ protocol: 'https', hostname: 'cdn.sanity.io' }` from `remotePatterns` in `next.config.js`. Sanity is not used in this project.

---

### ✅ 1.12 — Unused dependencies removed *(fixed 2026-05-11)*
Uninstalled `lucide-react`, `class-variance-authority`, `@radix-ui/react-slot`, `sass` (4 packages, 0 KB savings at install, ~15 KB less in client bundle). Deleted unused `src/components/ui/button.tsx` and `card.tsx`. `badge.tsx` kept — used by `ShopClient.tsx`; `clsx`/`tailwind-merge` kept as `badge.tsx` depends on `cn`.

---

## 2. SEO & NEXT.JS TECHNICAL

### ✅ 2.1 — Per-page metadata added *(fixed 2026-05-09)*
Every page now has its own `export const metadata` (or `generateMetadata` for design slug pages). All static routes, shop routes, and 80+ design project pages have unique titles, descriptions, and canonical URLs.

---

### ✅ 2.2 — Root `alternates.canonical` removed *(fixed 2026-05-09)*
`alternates: { canonical: 'https://isalebryan.dev' }` no longer exists in `src/app/layout.tsx`. Per-page canonicals (added in 2.1) now correctly identify each page.

---

### ✅ 2.3 — OG image dimensions corrected *(fixed 2026-05-09)*
**File:** `src/app/layout.tsx`  
Declared dimensions changed from `1200×630` to `800×1000` to match the actual `portrait.jpg` dimensions. LinkedIn/Twitter will now crop correctly.  
*(Option B — a generated 1200×630 banner via `opengraph-image.tsx` — remains a future upgrade for ideal sharing preview.)*

---

### ✅ 2.4 — Sitemap `lastModified` fixed *(fixed 2026-05-09)*
**File:** `src/app/sitemap.ts`  
Replaced all `new Date()` calls with real hardcoded dates per route. Design project slugs now use `new Date(\`${project.year}-01-01\`)` from the project data. Static routes use dates matching their last meaningful content change.

---

### 2.5 — ✅ DONE: Internal `<a>` tags replaced with `<Link>` (2026-04-30)
All 13 internal `<a href>` instances replaced with `<Link>` from `next/link` across 7 files: `Header.tsx` (logo + desktop nav + mobile nav), `layout.tsx` (footer BMX), `page.tsx` (3 CTAs), `about/page.tsx` (Hire Me), `shop/page.tsx` (checkout CTA), `shop/checkout/page.tsx` (3 back/continue links), `shop/custom/page.tsx` (back link). The `/isale_brian_cv.pdf` download link kept as `<a>` — `Link` does not support the `download` attribute.

---

### 2.6 — ✅ DONE: Dead project URLs fixed (2026-04-30)
**File:** `src/app/work/devProjects.ts`

| Project | Problem | Fix Applied |
|---------|---------|-------------|
| VueGram | Heroku free tier shut down Nov 2022 — dead URL | `url` → GitHub repo |
| Covid Tracker | isalebryan.dev/everything-corona-virus — 404 | `url` → GitHub repo |
| NaxTechmakers | `http://` not `https://` — browser security warning | Changed to `https://` |
| Personal Library | `url` and `github` were identical | Removed `url` field |
| GSAP Animation | `url` and `github` were identical | Removed `url` field |

`url` made optional in `DevProject` interface; Work page conditionally renders "View" button only when `url` is present.

---

### 2.7 — ✅ DONE: About page now imports from devProjects (2026-04-30)
Deleted stale `webProjects` array and `Project` interface from `about/page.tsx`. Now imports `devProjects, DevProject` from `../work/devProjects`. `ProjectThumb` updated to use `DevProject` type with conditional `url` rendering (matches work page behaviour).

---

### ✅ 2.8 — `robots.ts` verified and exceeds requirements *(checked 2026-05-09)*
Rules: `*` allows `/`, disallows `/api/` and `/shop/checkout`. Explicit allow rules for GPTBot, Claude-Web, Anthropic-AI, PerplexityBot, and Googlebot (GEO optimized). Sitemap and host declared correctly.

---

### 2.9 — ✅ DONE: `loading.tsx` and `error.tsx` created (2026-04-29)
`not-found.tsx` exists. Added:
```tsx
// src/app/loading.tsx
export default function Loading() {
  return <main className="flex items-center justify-center min-h-screen">
    <div className="w-8 h-8 rounded-full border-2 border-lime border-t-transparent animate-spin" />
  </main>
}
```
```tsx
// src/app/error.tsx
'use client'
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return <main className="flex flex-col items-center justify-center min-h-screen text-center px-8">
    <h2 className="text-4xl font-black text-white mb-4">Something went wrong</h2>
    <button onClick={reset} className="px-6 py-3 bg-lime text-black font-black text-sm uppercase rounded-md">Try again</button>
  </main>
}
```

---

### ~~2.10 — Contact info is duplicated across 4 files (no single source of truth)~~ ✅ 2026-05-01
Created `src/lib/siteConfig.ts` with `SITE` (email, phone, phoneDisplay, waNumber, waMessage, mapsUrl, twitterHandle, url) and `SOCIALS` array (9 platforms). All 5 consumers updated: `contact/page.tsx`, `page.tsx`, `about/page.tsx`, `layout.tsx` (JSON-LD email/telephone/sameAs/FAQ strings), `WhatsAppButton.tsx`. Also fixed Instagram inconsistency — canonical handle is now `isalebryan` everywhere.

---

## 3. UI, AESTHETICS & VISUAL DESIGN

### ✅ 3.1 — RENDERING BUG: `home-cta-primary` and `home-cta-ghost` fixed *(fixed 2026-05-11)*
**File:** `src/app/about/AboutClient.tsx`  
Replaced dead CSS classes with inline Tailwind. "Download CV" → `bg-lime text-black font-black uppercase tracking-widest rounded-md hover:bg-[#c8f000]`. "Hire Me" → `border border-white/20 text-white uppercase tracking-widest rounded-md hover:border-teal hover:text-teal`. Inline `style` props removed.

---

### ~~3.2 — Work page H1 overflows on mobile: `text-[7rem]`~~ ✅ 2026-05-01
Applied `text-[clamp(3rem,10vw,7rem)]` to all 6 pages using this pattern: work, about, bmx, design/[slug], shop/custom, shop/checkout.

---

### ~~3.3 — Portrait hidden on tablet (`max-lg:hidden`) — hero looks empty on iPad~~ ✅ 2026-05-01
`max-lg:hidden` → `max-lg:w-52 max-md:hidden`: portrait now shows at 208px on tablets (768–1024px), hidden only on phones.

---

### ✅ 3.4 — Bio text contrast fixed *(fixed 2026-05-11)*
**File:** `src/app/HomeClient.tsx:173`  
`text-white/50` → `text-white/65` on the rotating bio paragraph. Contrast bumped from ~3.5:1 to ~5.0:1, clearing WCAG AA 4.5:1 for body text.

---

### ✅ 3.5 — Typed.js aria-live fixed *(fixed 2026-05-09)*
`typeRef` span now has `aria-hidden="true"`. A separate `sr-only` span with `aria-live="polite" aria-atomic="true"` announces the full string (from `TYPED_STRINGS[bioIndex]`) only after typing completes, driven by `onStringTyped`.

---

### ~~3.6 — No `focus-visible` styles on any interactive element~~ ✅ 2026-05-01
Added global baseline in `globals.css`: `a:focus-visible, button:focus-visible, [role="button"]:focus-visible { outline: 2px solid #00ddd7; outline-offset: 3px; }`. Color overrides: `.wk-tag-btn` → lime, `.ct-social-card` → `var(--sc-color)`, `.wa-btn` → green.

---

### ~~3.7 — StackCards in About are `div` with `onClick` but no ARIA~~ ✅ 2026-05-01
Added `role="button"`, `tabIndex={0}`, `aria-label="Open {title} details"`, `onKeyDown` (Enter/Space), and `focus-visible:outline-2` with `outlineColor: card.color`.

---

### 3.8 — ✅ DONE: Social icons `aria-label` + touch targets fixed (2026-04-29)
**File:** `src/app/page.tsx:187–201`  
Added `aria-label={s.label}`, removed redundant `title`, added `aria-hidden="true"` to the `<i>` icon, and bumped `w-10 h-10` → `w-11 h-11` (44px WCAG minimum).

---

### ✅ 3.9 — Slide dots made interactive *(fixed 2026-05-11)*
**File:** `src/app/HomeClient.tsx`  
Removed `pointer-events-none`/`aria-hidden` from container. Each dot is now a `<button>` with `onClick={() => goToSlide(i)}`, `aria-label`, `aria-current`, hover opacity, and `focus-visible` outline in lime. `goToSlide` resets the 7s auto-advance interval via `intervalRef` so the timer restarts from the clicked slide.

---

### ✅ 3.10 — Typed.js cursor oversized *(fixed 2026-05-06)*
Set `.typed-cursor { font-size: 1.1em; }` in `scss/main.scss`.

---

### ✅ 3.11 — Typed.js `startDelay: 800` added *(fixed 2026-05-09)*
Cursor holds for 800ms before typing begins. The bio text (`TYPED_BIOS[0]`) is shown immediately at `bioIndex = 0`, which correctly matches the first string — no mismatch during the delay.

---

### ~~3.12 — `duration-1400` should use explicit arbitrary syntax~~ N/A
Tailwind v4 supports bare numeric durations natively — `duration-1400` is the canonical form and the linter confirms it. No change needed.

---

### ✅ 3.13 — Font family conflict resolved: Nunito via `next/font` *(fixed 2026-05-09)*
Replaced `Inter` with `Nunito` in `layout.tsx` (loaded via `next/font/google`, `variable: '--font-nunito'`, `display: 'swap'`). Applied as `nunito.variable` on `<body>`. Updated `globals.css`: `--font-family-sans` now references `var(--font-nunito)` and `body { font-family: var(--font-family-sans) }` — no more hardcoded string or missing font reference.

---

## 4. CONVERSION, UX & GETTING HIRED

### ✅ 4.1 — "Available for freelance" signal added *(fixed 2026-05-16)*
**Note:** Brian is full-time employed — framing is freelance clients, not job seeking. "Open to work" language is intentionally avoided.

Two placements added:
1. **Hero badge** (`HomeClient.tsx`) — pulsing lime dot + "Available for freelance projects" text above the CTA buttons, animated in with the rest of the hero.
2. **About page callout** (`AboutClient.tsx`) — lime-bordered box with copy: *"Available for select freelance projects. I take on web development and brand design work on the side…"* + link to `/contact`. Positioned between the bio badges and the Download CV / Hire Me buttons.

---

### ✅ 4.2 — Typed loop trimmed to professional strings only *(fixed 2026-05-16)*
`TYPED_STRINGS` and `TYPED_BIOS` in `HomeClient.tsx` reduced to 3 entries: Full Stack Developer, Creative Designer, Community Builder. Personal strings removed from the loop entirely.

Personal side preserved as a quiet one-liner: *"Off the clock: BMX rider, lifelong learner & friend →"* added below the slide dots, styled `text-white/30`, links to `/bmx`.

---

### 4.3 — Work page defaults to Services tab — wrong for hiring
**File:** `src/app/work/page.tsx:122–124`  
A recruiter navigating to `/work` lands on a KES freelance price list. Change the default:
```tsx
// Before: const [tab, setTab] = useState<Tab>('services')
// After:
const [tab, setTab] = useState<Tab>(() =>
  paramTab === 'design' || paramTab === 'services' ? paramTab : 'dev'
)
```
Also reorder tabs: Development / Design / Services.

---

### 4.4 — Dev projects shuffle randomly — best project isn't reliably first
**File:** `src/app/work/page.tsx:136–138`  
Random shuffle buries the portfolio site (your strongest, most recent work). Fix: pin the portfolio site to position 1 in `devProjects.ts`, stop shuffling, or use a stable sort that keeps your best work first.

---

### ✅ 4.5 — Contact form added *(fixed 2026-05-11)*
**Files:** `src/app/contact/ContactForm.tsx`, `src/app/api/contact/route.ts`, `src/app/contact/ContactClient.tsx`
Fields: name, email, subject (Job Opportunity / Freelance Project / Collaboration / General Inquiry), message. Honeypot spam guard + IP rate limit (max 3/IP/24h). Submissions stored in Neon `contact_submissions` table (auto-created). Inline success/error states; no redirect. Section inserted between hero and "Let's Work Together".

---

### 4.6 — CV is buried on About page — not on homepage
**Intentionally skipped** (2026-05-16): Brian is not job hunting — freelance clients don't need a CV on the homepage. A CV download on the hero signals "hire me full-time." CV stays on the About page where clients who want more background can find it.

---

### ✅ 4.7 — Google Scholar credential surfaced on homepage *(fixed 2026-05-16)*
Implemented as SVG curved text arcing along the top of the portrait circle: `· GOOGLE AFRICA SCHOLAR · ANDELA 2019 ·` in `rgba(255,255,255,0.35)`. Paired with `· AVAILABLE FOR FREELANCE ·` curving along the bottom arc in lime. Both use a single `<path>` in SVG `<defs>` with a `<textPath>` overlay on the portrait. Mobile fallback: two pill badges shown `lg:hidden` between bio and CTAs. Credential also present as a badge on the About page bio.

---

### ✅ 4.8 — Scroll hint with nothing below the fold *(resolved 2026-05-06)*
`TestimonialsStrip` now renders below the `min-h-screen` hero, giving the scroll hint a real destination. No code change needed — resolved by the testimonials system added 2026-05-05.

---

### ~~4.9 — Skill percentages in About page stack card may harm hiring~~ ✅ 2026-05-01
~~TypeScript 60%, Next.js 65% tells a recruiter you are partially competent. Either remove numbers (list technologies only) or replace with years: "TypeScript — 3 years" signals seniority without inviting comparison.~~
Replaced raw percentages with animated tier labels (Familiar / Proficient / Advanced / Expert) that typewrite in alongside the bar fill.

---

### 4.10 — M-Pesa integration is invisible as a portfolio piece
This is your most market-differentiated technical skill. Safaricom Daraja API integration is specialized, high-demand across East Africa. It exists in the codebase but nowhere in the public portfolio.

Add a dev project card:
```ts
{
  title: 'M-Pesa STK Push Integration',
  img: '/img/projects/mpesa-checkout.jpg', // screenshot of checkout flow
  url: 'https://isalebryan.dev/shop/checkout',
  desc: 'Full M-Pesa Daraja API integration — STK Push, webhook callbacks, order tracking, Neon Postgres storage.',
  tags: ['M-Pesa', 'Safaricom Daraja', 'Next.js', 'Neon Postgres', 'TypeScript'],
}
```

---

### ✅ 4.11 — No testimonials anywhere *(fixed 2026-05-05)*
Full testimonials system built: project-locked collection forms at `/testimonial/[slug]`, Neon Postgres storage, auto-publish with admin override at `/admin/testimonials`. Displays on home page (marquee strip), About page (grid), design project pages (project-specific), and shop page (product reviews). Shop slugs: `shop-stickers`, `shop-tshirts`, `shop-custom`. Requires `ADMIN_SECRET` env var.

---

### ✅ 4.12 — Freelance availability statement added *(fixed 2026-05-16)*
**Context:** Brian is full-time employed; goal is freelance clients, not full-time roles. "Open to work" / job-seeker framing intentionally avoided everywhere.

Addressed via §4.1 fix — the About page callout box and hero badge together serve as the availability statement. Copy reads: *"Available for select freelance projects — web development and brand design work on the side."*

---

### 4.13 — ✅ DONE: WhatsApp promoted to primary CTA on Contact page (2026-04-30)
Reordered CTAs to: WhatsApp Me (solid `#25d366` bg, black text — primary) → Send an Email (ghost) → View My Work (dim ghost). File: `src/app/contact/page.tsx`.

---

### 4.14 — ✅ DONE: BMX moved from nav to footer (2026-04-30)
Removed "BMX Life" and dead "My Blog" from `navLinks` in `Header.tsx` (nav now: Home, About Me, Work, Contact, Shop). Footer in `layout.tsx` uses inline Tailwind flex with `justify-between` to show copyright left, BMX link right.

---

### 4.15 — Dual positioning (Dev + Design) is unclear to tech recruiters
"Full Stack Developer & Creative Designer" can read as specialist in neither. Frame it as: "a developer who can design his own UI/UX without needing a separate designer" — that's a genuine hiring edge. Make Dev the primary identity on the homepage; let Design be the compelling secondary differentiator.

---

## 5. SECURITY

### C-1 — CRITICAL: M-Pesa callback has no authentication
**File:** `src/app/api/mpesa/callback/route.ts:4–38`  
The callback endpoint accepts any POST from any IP. An attacker can craft a fake `ResultCode: 0` payload to mark an order as paid without real payment.

**Fix:**
```ts
// callback/route.ts — verify request before processing
const existing = await getOrderByCheckoutId(CheckoutRequestID)
if (!existing || existing.status !== 'pending') {
  return NextResponse.json({ received: true }) // silently reject
}
// Also add Safaricom IP allowlist via x-forwarded-for check
```

---

### H-1 — Hardcoded sandbox URLs in STK push
**File:** `src/app/api/mpesa/stkpush/route.ts:34,78`  
Both the OAuth token URL and STK push URL point to `sandbox.safaricom.co.ke` — hardcoded. Payments fail silently in production.
```ts
const MPESA_BASE = process.env.MPESA_ENV === 'production'
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke'
```

---

### H-2 — `design_ids` array elements not UUID-validated
**File:** `src/app/api/mpesa/stkpush/route.ts:24–25`
```ts
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
if (design_ids && (!Array.isArray(design_ids) || design_ids.length > 10
    || !design_ids.every(id => typeof id === 'string' && UUID_RE.test(id)))) {
  return NextResponse.json({ error: 'Invalid design_ids' }, { status: 400 })
}
```

---

### H-3 — No rate limiting on STK push endpoint
**File:** `src/app/api/mpesa/stkpush/route.ts`  
An attacker can spam this to send unlimited real STK push notifications to any phone number. Apply the same rate limiter pattern from `upload/route.ts`.

---

### H-4 — In-memory rate limiter on upload is bypassed by serverless cold starts
**File:** `src/app/api/upload/route.ts:17–28`  
The `Map`-based rate limiter resets per serverless instance. Replace with Upstash Redis via `@vercel/kv` for persistent rate limiting.

---

### M-1 — `'unsafe-inline'` in `script-src` weakens CSP
**File:** `next.config.js:18`  
Defeats most XSS protection. Was added for JSON-LD script tags, but Next.js App Router supports nonce-based CSP. Implement nonces in middleware to remove `unsafe-inline`.

---

### M-2 — Status polling leaks `CheckoutRequestID` — receipt number is PII
**File:** `src/app/api/mpesa/status/[checkoutRequestId]/route.ts`  
Unauthenticated. Anyone who knows the ID (returned to browser after STK push) can poll another user's order status and see the M-Pesa receipt number.

---

### M-3 — Orders API uses plain string comparison for secret
**File:** `src/app/api/mpesa/orders/route.ts:5–8`  
Use timing-safe comparison to prevent timing attacks:
```ts
import { timingSafeEqual } from 'crypto'
const valid = authHeader && timingSafeEqual(Buffer.from(authHeader), Buffer.from(process.env.ORDERS_API_SECRET!))
```

---

### M-4 — Unsanitised text fields — stored XSS risk
**File:** `src/app/api/mpesa/stkpush/route.ts:20–23`  
`delivery_option`, `notes`, and customer fields are stored raw. Sanitise before storage or ensure rendering contexts are always React (which escapes by default).

---

### L-1 — `X-XSS-Protection: 1; mode=block` is deprecated
**File:** `next.config.js:9` — Remove. Modern browsers ignore it. The CSP policy is the correct replacement.

---

### L-2 — HSTS header not explicitly set
Vercel injects it at edge, but add explicitly for clarity:
```js
{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }
```

---

### What security does well (keep these)
- ✅ All DB queries use parameterized `neon` tagged templates — no SQL injection possible
- ✅ Upload validates by magic bytes, not just MIME type
- ✅ UUID regex guard in `getDesignById` before DB query
- ✅ No `NEXT_PUBLIC_*` for secrets — all stay server-side
- ✅ `.env.local` gitignored
- ✅ `design/[id]` sets `X-Content-Type-Options: nosniff`

---

## 6. FULL PRIORITY LIST

### 🔴 Critical (Do This Week)
1. ~~Add "Available for work" badge to homepage~~ ✅ 2026-05-16 (freelance framing, not job-seeker)
2. ~~Remove BMX Rider/Learner/Friend from typed strings~~ ✅ 2026-05-16 (personal aside link added below slide dots)
3. ~~Fix 3 dead dev project URLs — `devProjects.ts`~~ ✅ 2026-04-30
4. ~~Delete dead UA Google Analytics script — `layout.tsx:230–236`~~ ✅ 2026-05-06
5. Fix M-Pesa callback auth (fake payment injection) — `callback/route.ts`
6. ~~Fix unstyled CV/Hire Me buttons on About page — `about/page.tsx:479,483`~~ ✅ 2026-05-11

### 🟠 High (Do This Month)
7. ~~Add contact form — new component + `/api/contact` route~~ ✅ 2026-05-11
8. Add CV download button to homepage hero — `page.tsx`
9. Change Work page default tab from `'services'` to `'dev'` — `work/page.tsx:122`
10. ~~Fix OG image dimensions — `layout.tsx:46`~~ ✅ 2026-05-09 (declared 800×1000 to match actual portrait.jpg)
11. Add `<link rel="preload">` for first background slide — `layout.tsx <head>`
12. ~~Replace `<a>` with `<Link>` for all internal navigation~~ ✅ 2026-04-30
13. ~~Add per-page canonical metadata~~ ✅ 2026-05-09
14. ~~Add AVIF format to `next.config.js`~~ ✅ 2026-04-29
15. ~~Add `display: 'swap'` to Inter font — `layout.tsx:11`~~ ✅ 2026-05-09
16. ~~Fix Work heading mobile overflow (`text-[7rem]` → `clamp`) — `work/page.tsx:151`~~ ✅ 2026-05-01
17. Add M-Pesa integration as a dev project card
18. Move portfolio site to position 1 in `devProjects.ts`, stop random shuffle
19. ~~Add `sizes` prop to portrait Image — `page.tsx:231`~~ ✅ 2026-05-11
20. Add rate limiting to STK push endpoint — `stkpush/route.ts`

### 🟡 Medium (Next Quarter)
21. ~~Convert `work/design/[slug]` to SSG with `generateStaticParams` + `generateMetadata`~~ ✅ 2026-05-09
22. ~~Add `loading.tsx` and `error.tsx`~~ ✅ 2026-04-29
23. ~~Add `focus-visible:` styles to all interactive elements~~ ✅ 2026-05-01
24. ~~Fix StackCard `div` missing `role="button"` + keyboard handler — `about/page.tsx:334`~~ ✅ 2026-05-01
25. ~~Fix `aria-live` on Typed.js target~~ ✅ 2026-05-09
26. ~~Add "Available for work" + availability statement to About page~~ ✅ 2026-05-16
27. ✅ Add testimonials system — done 2026-05-05
28. ~~Add "What I'm looking for" paragraph to About or Contact~~ ✅ 2026-05-16 (freelance callout on About page)
29. ~~Move BMX from main nav to footer / About page~~ ✅ 2026-04-30
30. Add `will-change-transform` to hover-animated cards — `work/page.tsx:17`
31. ~~Fix bio text contrast `text-white/50` → `text-white/65` — `page.tsx:155`~~ ✅ 2026-05-11
32. ~~Make slide dots clickable — `page.tsx:206`~~ ✅ 2026-05-11
33. ~~Remove scroll hint or add below-fold content section~~ ✅ 2026-05-06 (TestimonialsStrip is the below-fold section)
34. ~~Remove/update skill percentages in About stack cards~~ ✅ 2026-05-01
35. ~~Fix sitemap `lastModified` dates — `sitemap.ts`~~ ✅ 2026-05-09
36. ~~Add `startDelay: 800` to Typed.js config~~ ✅ 2026-05-09
37. ~~Add immutable cache headers for `/fonts/` and `/img/` — `next.config.js`~~ ✅ 2026-05-09
38. ~~Remove dead `cdn.sanity.io` remote pattern — `next.config.js:44`~~ ✅ 2026-04-30

### 🟢 Low (Nice to Have)
39. Replace Font Awesome with `lucide-react` + inline SVGs for brand icons
40. ~~Implement `LazyMotion + domAnimation` — saves ~15 KB~~ ✅ 2026-05-11 (used `domMax` to preserve `layoutId`)
41. Add `opengraph-image.tsx` generated OG banner
42. ~~Centralize contact/social config in `src/lib/siteConfig.ts`~~ ✅ 2026-05-01
43. ~~Add `src/components/ui/` button using shadcn pattern, or remove unused shadcn deps~~ ✅ 2026-05-11 (removed `class-variance-authority`, `@radix-ui/react-slot`, deleted `button.tsx` + `card.tsx`)
44. ~~Move `sass` from `dependencies` to `devDependencies`~~ ✅ 2026-05-11 (uninstalled entirely — no `.scss` files)
45. ~~Fix `duration-1400` → `duration-[1400ms]`~~ N/A — Tailwind v4 accepts bare numerics; `duration-1400` is canonical
46. ~~Remove orphan `.quote` class — `about/page.tsx:528`~~ ✅ 2026-04-30 (replaced Steve Jobs quote with Charles Eames)
47. Add "Currently" section to About page (building X, learning Y, open to Z)
48. Add year labels to dev project cards
49. Rewrite About page bio opening line
50. Add USD pricing note to services for international clients
51. ~~Reorder nav: Home / Work / About / Contact / Blog / Shop / (BMX in footer)~~ ✅ 2026-04-30 (Blog removed — dead; BMX moved to footer; nav: Home / About Me / Work / Contact / Shop)
52. Replace in-memory rate limiter with Upstash Redis (persists across instances)
53. Use timing-safe comparison for orders API secret — `orders/route.ts`
54. Remove deprecated `X-XSS-Protection` header — `next.config.js:9`
55. Add explicit HSTS header — `next.config.js`

**Also completed (not in numbered list):**
- ✅ Social icons: `aria-label`, `aria-hidden` on `<i>`, touch targets 44px — `page.tsx` (2026-04-29) [was §3.8]
- ✅ WhatsApp promoted to primary CTA on Contact page — `contact/page.tsx` (2026-04-30) [was §4.13]
- ✅ About page Steve Jobs quote → Charles Eames — `about/page.tsx` (2026-04-30)
- ✅ About page `webProjects` stale copy replaced with `devProjects` import — `about/page.tsx` (2026-04-30) [was §2.7]
- ✅ Navigation progress bar added — `NavigationProgress.tsx` injected in `layout.tsx` (2026-05-05). Lime top-bar animates on every Next.js route transition; improves perceived performance and navigation feedback.
- ✅ Product detail pages added — `/product/[slug]` for each shop item (2026-05-05). Linked from shop card and product modal via "View details →" and "View full page & reviews →". Enables per-product testimonial display and shareable product URLs.
- ✅ Font Awesome upgraded v5 → v6 Free (2026-05-16): installed `@fortawesome/fontawesome-free`, copied CSS + webfonts to `public/fonts/`. Enables `fa-brands fa-x-twitter` and `fa-tiktok` icons. All existing `fab`/`fas`/`far` classes preserved via FA6 aliases.
- ✅ `siteConfig.ts` — Twitter updated to X: icon `fa-brands fa-x-twitter`, handle `@bryanaim00`, URL `https://x.com/bryanaim00`; TikTok moved to end of SOCIALS (was causing blank-button gap between Twitter and YouTube in FA5). `SITE.twitterHandle` updated to `@bryanaim00` (2026-05-16).
- ✅ `HomeClient.tsx` — portrait changed from `max-md:hidden` to `max-lg:hidden`; only shows on lg+ (1024px+) where side-by-side layout applies. Fixes messy stacked layout at 768–1023px range (2026-05-16).

---

## What Is Already Excellent (Don't Touch)

- ✅ JSON-LD schemas (Person + WebSite + FAQ) — outstanding for AEO/GEO
- ✅ Security headers — comprehensive CSP, X-Frame-Options, Permissions-Policy
- ✅ QuoteModal — best feature on the site; step-by-step, live pricing, WhatsApp export
- ✅ Vercel Analytics + Speed Insights — correctly wired
- ✅ Portrait uses `<Image priority>` — correct
- ✅ `metadataBase` is set — correct
- ✅ Keywords array covers all known aliases (BryanAim, Janja, etc.)
- ✅ Dynamic `robots.ts` and `sitemap.ts` — using App Router correctly
- ✅ All DB queries parameterized — no SQL injection possible
- ✅ Upload validates by magic bytes, not just MIME type
- ✅ No secrets in `NEXT_PUBLIC_*` env vars
- ✅ Framer Motion usage is purposeful, not excessive
- ✅ Color palette (lime + teal on dark) is distinctive and memorable
- ✅ 80+ design projects gallery is impressive and well-executed
- ✅ Service pricing transparency is a differentiator
- ✅ Global floating WhatsApp button — good for African market
- ✅ All `<img>` tags have proper `alt` text — no missing alt text
- ✅ No TypeScript `any` types found
- ✅ `not-found.tsx` exists

---

*Report generated 2026-04-29 by 6 specialist agents: Performance Optimizer, Tailwind/UI Expert, Next.js Pro, Code Explore, Security Auditor, UX/Conversion Specialist.*  
*Start with the 🔴 Critical section — items 1–6 take under 2 hours combined (excluding the contact auth fix) and have the highest impact on first impressions and getting hired.*
