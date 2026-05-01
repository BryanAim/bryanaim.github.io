# isalebryan.dev — Full Site Audit
**Date:** 2026-04-29  
**Audited by:** 6 specialist AI agents (Performance, UI/Design, Next.js/SEO, Code Quality, Security, UX/Conversion)  
**Site:** https://isalebryan.dev

---

## Quick-Start: The 5 Things to Do This Week

| # | Fix | Time | Impact |
|---|-----|------|--------|
| 1 | Add "Available for work" badge to homepage hero | 20 min | 🔴 Hiring |
| 2 | Remove "BMX Rider / Lifelong Learner / Friend" from typed strings | 5 min | 🔴 Hiring |
| 3 | ✅ Fix 3 dead dev project URLs (VueGram, Covid Tracker, NaxTechmakers HTTP) | 10 min | 🔴 Credibility |
| 4 | Delete dead Google Analytics UA script from `layout.tsx:230–236` | 2 min | 🟠 Performance |
| 5 | Fix the M-Pesa callback with no authentication (fake payment injection possible) | 2 hrs | 🔴 Security |

---

## 1. PERFORMANCE

### 1.1 — Background slideshow bypasses Next.js Image optimizer
**File:** `src/app/page.tsx:99–111`  
The 4 background slides use CSS `backgroundImage` on plain `<div>` elements. The browser cannot preload these. The first slide is almost certainly the LCP element on desktop.

**Quick fix (1 line):** Add a preload hint for the first slide in `layout.tsx <head>`:
```tsx
<link rel="preload" as="image" href="/img/background.jpg" fetchPriority="high" />
```

**Full fix:** Convert slides to `<Image fill>`:
```tsx
{BG_IMAGES.map((src, i) => (
  <div key={src} className="home-bg-slide absolute inset-0 transition-opacity duration-[1400ms]"
    style={{ opacity: i === bgIndex ? 1 : 0 }}>
    <Image src={src} alt="" fill priority={i === 0} sizes="100vw" className="object-cover" />
  </div>
))}
```

---

### 1.2 — Dead Google Analytics UA script (remove immediately)
**File:** `src/app/layout.tsx:230–236`  
Universal Analytics (UA-157368874-1) shut down July 2023. This script downloads ~30 KB, executes on every page, runs a DNS lookup, and records nothing. `@vercel/analytics` already covers your needs.

**Fix:** Delete lines 230–236 entirely.

---

### 1.3 — Inter font missing `display: 'swap'`
**File:** `src/app/layout.tsx:11`
```tsx
// Before
const inter = Inter({ subsets: ['latin'] })
// After
const inter = Inter({ subsets: ['latin'], display: 'swap' })
```

---

### 1.4 — Dev project cards use raw `<img>`
**File:** `src/app/work/page.tsx:25`  
Replace with `next/image` for WebP optimization and correct CLS sizing:
```tsx
<div className="relative aspect-video overflow-hidden">
  <Image src={p.img} alt={p.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
</div>
```

---

### 1.5 — Portrait image missing `sizes` prop
**File:** `src/app/page.tsx:231`  
Without `sizes`, Next.js defaults to `100vw` and serves an 800px image for a 288px container — 3× wasted bandwidth on mobile.
```tsx
<Image src="/img/portrait.jpg" alt="Brian Isale" fill sizes="288px" priority className="object-cover object-top rounded-full" />
```

---

### 1.6 — Font Awesome is render-blocking
**File:** `src/app/layout.tsx:218`  
`<link rel="stylesheet" href="/fonts/css/all.min.css" />` in `<head>` blocks rendering. It loads 53 KB CSS + ~252 KB of webfonts. Short-term fix:
```html
<link rel="stylesheet" href="/fonts/css/all.min.css" media="print" onLoad="this.media='all'" />
<noscript><link rel="stylesheet" href="/fonts/css/all.min.css" /></noscript>
```
Long-term: migrate to `lucide-react` (already in `package.json`) for tree-shaken icons. Keep brand icons (GitHub, LinkedIn, etc.) as inline SVGs.

---

### 1.7 — ✅ DONE: AVIF format added to `next.config.js` (2026-04-29)

---

### 1.8 — Font webfonts have no long-term cache headers
**File:** `next.config.js`  
Add to `headers()`:
```js
{ source: '/fonts/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
{ source: '/img/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }] },
```

---

### 1.9 — All pages are `'use client'` — no SSG anywhere
Every page ships as a client bundle with no static HTML shell. Highest-impact architectural change available:

**SSG candidates:**
- `work/design/[slug]/page.tsx` — 80+ pages, currently all blank JS shells. Converting to SSG with `generateStaticParams` gives Google 80+ indexed pages with unique content and near-zero TTFB.
- `about/page.tsx`, `contact/page.tsx`, `bmx/page.tsx` — all static data, no server-side data needs.

**Pattern (server shell + client island):**
```tsx
// work/design/[slug]/page.tsx — SERVER component
export function generateStaticParams() {
  return designProjects.map(p => ({ slug: p.slug }))
}
export async function generateMetadata({ params }) {
  const p = designProjects.find(x => x.slug === (await params).slug)
  return { title: p?.title, description: p?.description.slice(0, 120), alternates: { canonical: `https://isalebryan.dev/work/design/${p?.slug}` } }
}
export default async function Page({ params }) {
  const project = designProjects.find(p => p.slug === (await params).slug)
  if (!project) notFound()
  return <DesignProjectClient slug={project.slug} />
}
```

---

### 1.10 — LazyMotion saves ~15 KB on every page
Replace `motion.div` with `m.div` and wrap app in `LazyMotion`:
```tsx
// layout.tsx
import { LazyMotion, domAnimation } from 'framer-motion'
<LazyMotion features={domAnimation} strict>{children}</LazyMotion>
```
```tsx
// all pages: import { m } from 'framer-motion'  →  <m.div ...>
```

---

### 1.11 — ✅ DONE: Removed dead `cdn.sanity.io` remote pattern (2026-04-30)
Deleted `{ protocol: 'https', hostname: 'cdn.sanity.io' }` from `remotePatterns` in `next.config.js`. Sanity is not used in this project.

---

### 1.12 — Unused dependencies inflating bundle
`lucide-react` v1.7.0 is installed and unused (Font Awesome handles all icons). `class-variance-authority`, `@radix-ui/react-slot` are shadcn scaffolding that was never used (a `src/components/ui/button.tsx` exists but is not imported by any page). `sass` is in `dependencies` but should be `devDependencies`.

```bash
npm uninstall lucide-react
# audit: grep -r "from 'class-variance-authority'\|from '@radix-ui/react-slot'" src/
```

---

## 2. SEO & NEXT.JS TECHNICAL

### 2.1 — Per-page metadata missing (all pages get root description)
Every page (`/about`, `/work`, `/contact`, `/bmx`, all 80+ design slug pages) currently shows the root layout description in Google search results. Fix requires the server shell pattern (see 1.9).

**Metadata to add per page:**
```tsx
// about/page.tsx wrapper
export const metadata: Metadata = {
  title: 'About',
  description: 'Brian Isale — Full Stack Developer & Creative Designer, Nakuru Kenya. Google Africa Scholar, 6+ years experience.',
  alternates: { canonical: 'https://isalebryan.dev/about' },
}
// work/page.tsx wrapper
export const metadata: Metadata = {
  title: 'Work',
  description: 'Design portfolio and development projects — logos, brand identities, and full-stack web applications by Brian Isale.',
  alternates: { canonical: 'https://isalebryan.dev/work' },
}
// contact/page.tsx wrapper
export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Brian Isale for web development, brand design, or collaboration. Based in Nakuru, Kenya.',
  alternates: { canonical: 'https://isalebryan.dev/contact' },
}
```

---

### 2.2 — Root `alternates.canonical` harms inner pages
**File:** `src/app/layout.tsx:72`  
`alternates: { canonical: 'https://isalebryan.dev' }` at root layout level applies to ALL pages, telling Google every page is canonically the homepage. Remove from root once per-page canonicals are added.

---

### 2.3 — OG image declared wrong dimensions
**File:** `src/app/layout.tsx:46–49`  
`portrait.jpg` is declared `1200×630` but is actually `800×1000`. LinkedIn/Twitter crops it incorrectly on every share.

**Option A (quick):** Fix the declared dimensions to `800×1000`.  
**Option B (best):** Generate a real 1200×630 OG banner at `src/app/opengraph-image.tsx`:
```tsx
import { ImageResponse } from 'next/og'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export default function Image() {
  return new ImageResponse(
    <div style={{ background: '#111', width: '100%', height: '100%', display: 'flex', alignItems: 'center', padding: 60, gap: 60 }}>
      <img src="https://isalebryan.dev/img/portrait.jpg" width={300} height={375} style={{ borderRadius: '50%', objectFit: 'cover', objectPosition: 'top' }} alt="" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <span style={{ fontSize: 64, fontWeight: 900, color: '#b1db00' }}>Brian Isale</span>
        <span style={{ fontSize: 26, color: '#fff' }}>Full Stack Developer & Creative Designer</span>
        <span style={{ fontSize: 20, color: '#666' }}>Nakuru, Kenya · Google Africa Scholar</span>
      </div>
    </div>
  )
}
```

---

### 2.4 — Sitemap `lastModified` stamps every URL with today's date
**File:** `src/app/sitemap.ts`  
Using `new Date()` for all entries triggers unnecessary recrawls on every deploy. Use real dates:
```ts
const STATIC_DATES: Record<string, string> = {
  '/': '2026-04-29', '/about': '2026-04-29', '/work': '2026-04-15',
  '/contact': '2026-01-01', '/shop': '2026-03-01',
}
// For design projects: new Date(`${p.year}-01-01`)
```

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

### 2.8 — `robots.ts` exists but verify it's working
**File:** `src/app/robots.ts` — confirm it includes:
```ts
export default function robots() {
  return { rules: { userAgent: '*', allow: '/' }, sitemap: 'https://isalebryan.dev/sitemap.xml' }
}
```

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

### 2.10 — Contact info is duplicated across 4 files (no single source of truth)
Email, phone, and social URLs appear separately in `contact/page.tsx`, `layout.tsx` (JSON-LD), `about/page.tsx`, and `page.tsx`. Create `src/lib/siteConfig.ts`:
```ts
export const SITE = {
  email: 'isale.bryan@gmail.com',
  phone: '+254728822142',
  whatsapp: 'https://wa.me/254728822142',
}
export const SOCIALS = [ /* single source */ ]
```

---

## 3. UI, AESTHETICS & VISUAL DESIGN

### 3.1 — RENDERING BUG: `home-cta-primary` and `home-cta-ghost` classes don't exist
**File:** `src/app/about/page.tsx:479,483`  
The "Download CV" and "Hire Me" buttons on the About page reference CSS classes that don't exist in `globals.css`. These buttons are completely unstyled.

**Fix:** Replace with inline Tailwind:
```tsx
// Download CV button
<a href="/isale_brian_cv.pdf" download
  className="inline-flex items-center gap-2 px-6 py-3 bg-lime text-black font-black text-sm uppercase tracking-widest rounded-md hover:bg-[#c8f000] transition-colors">
  <i className="fas fa-download text-xs" /> Download CV
</a>
// Hire Me button
<a href="/contact"
  className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white font-bold text-sm uppercase tracking-widest rounded-md hover:border-teal hover:text-teal transition-colors">
  Hire Me <i className="fas fa-arrow-right text-xs" />
</a>
```

---

### ~~3.2 — Work page H1 overflows on mobile: `text-[7rem]`~~ ✅ 2026-05-01
Applied `text-[clamp(3rem,10vw,7rem)]` to all 6 pages using this pattern: work, about, bmx, design/[slug], shop/custom, shop/checkout.

---

### 3.3 — Portrait hidden on tablet (`max-lg:hidden`) — hero looks empty on iPad
**File:** `src/app/page.tsx:219`  
`max-lg:hidden` hides the portrait below 1024px, leaving the hero right side completely empty on tablets.
```tsx
// Before
className="flex-shrink-0 w-72 aspect-square pointer-events-none max-lg:hidden"
// After
className="flex-shrink-0 w-72 max-lg:w-52 aspect-square pointer-events-none max-md:hidden"
```

---

### 3.4 — Bio text contrast fails WCAG AA at `text-white/50`
**File:** `src/app/page.tsx:155`  
50% white on the dark overlay is ~3.5:1 contrast — below the 4.5:1 WCAG AA minimum for body text at 14px.
```tsx
// Before: text-white/50
// After: text-white/65
```

---

### 3.5 — `aria-live` on Typed.js announces every character to screen readers
**File:** `src/app/page.tsx:144`  
Screen readers announce each letter as it types. Fix: make the typed element `aria-hidden`, add a separate SR-only element updated per complete string:
```tsx
<span ref={typeRef} className="text-lg text-white/75 font-medium" aria-hidden="true" />
<span className="sr-only" aria-live="polite" aria-atomic="true">
  {['Full Stack Developer','Creative Designer','Community Builder'][bioIndex % 3]}
</span>
```

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

### 3.9 — Slide dots are `pointer-events-none` — missed interactivity opportunity
**File:** `src/app/page.tsx:206`  
The dots look clickable but do nothing. Make them interactive:
```tsx
<motion.div className="flex gap-2 mt-4 max-sm:justify-center" aria-label="Background slides">
  {BG_IMAGES.map((_, i) => (
    <button key={i} onClick={() => setBgIndex(i)} aria-label={`Slide ${i + 1}`}
      className={`h-1 rounded transition-all duration-400 cursor-pointer ${i === bgIndex ? 'w-9 bg-lime' : 'w-5 bg-white/20 hover:bg-white/40'}`} />
  ))}
</motion.div>
```

---

### 3.10 — Typed.js cursor is oversized: `font-size: 1.8em`
**File:** `src/app/globals.css:~372`  
The blinking cursor is 1.8× the adjacent text size.
```css
.typed-cursor { font-size: 1.1em; }
```

---

### 3.11 — Typed.js has no `startDelay` — first 5-second scan sees partial text
A visitor who lands on the homepage sees the typed animation mid-word for the first 1.5 seconds. Add:
```tsx
// page.tsx — Typed config
startDelay: 800,  // show cursor for 0.8s before typing begins
```

---

### 3.12 — `duration-1400` should use explicit arbitrary syntax
**File:** `src/app/page.tsx:103`  
```tsx
// Before: duration-1400
// After: duration-[1400ms]
```

---

### 3.13 — Font family conflict in globals.css
**File:** `src/app/globals.css:~362`  
Verify there is no `font-family: 'Nunito'` override conflicting with the Inter font loaded via `next/font`. If Nunito exists in CSS it must be removed or explicitly loaded.

---

## 4. CONVERSION, UX & GETTING HIRED

### 4.1 — No "Available for work" signal anywhere on the site (CRITICAL)
A hiring manager reads the entire site and has no idea if Brian is available, employed, or just maintaining a portfolio. Add to the homepage hero:
```tsx
<span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 rounded-full mb-5">
  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
  Available for work
</span>
```
Remove it when not available. This is the highest-return 20 minutes you can spend.

---

### 4.2 — "BMX Rider / Lifelong Learner / Friend" in the typed loop dilutes professional signal
A recruiter who lands on the page during one of the 3 non-professional strings gets zero useful information in their first 5 seconds. Remove these strings from the homepage. Keep them for the About page where they add personality appropriately:
```tsx
// page.tsx — change strings to:
strings: ['Full Stack Developer.', 'Creative Designer.', 'UI/UX Designer.', 'Google Africa Scholar.']
```

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

### 4.5 — No contact form — meaningful barrier for international clients
The contact page has email, phone, and WhatsApp but no form. Corporate hiring managers and international clients won't compose a cold email from scratch. A simple form:

```tsx
// src/app/contact/ContactForm.tsx
'use client'
export function ContactForm() {
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
    await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) })
  }
  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <input name="name" placeholder="Your name" required className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-teal" />
      <input name="email" type="email" placeholder="Email" required className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-teal" />
      <select name="subject" className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white">
        <option>Job Opportunity</option>
        <option>Freelance Project</option>
        <option>Collaboration</option>
        <option>Other</option>
      </select>
      <textarea name="message" rows={4} placeholder="Message" required className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white resize-none" />
      <button type="submit" className="px-6 py-3 bg-teal text-black font-black text-sm uppercase rounded-md hover:opacity-90">Send Message</button>
    </form>
  )
}
```

---

### 4.6 — CV is buried on About page — not on homepage
**File:** `src/app/page.tsx:163–178`  
Recruiters look for a CV within the first 10 seconds. Add alongside the "About Me" CTA:
```tsx
<a href="/isale_brian_cv.pdf" download
  className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white font-bold text-sm uppercase tracking-widest rounded-md bg-black/40 backdrop-blur hover:border-teal hover:text-teal transition-all">
  <i className="fas fa-download text-xs" /> CV
</a>
```

---

### 4.7 — Google Scholar credential is buried 3 clicks deep
The Andela/Google credential is only visible inside a collapsible stack card modal on the About page. For a hiring-focused portfolio, surface it directly:

Add to the homepage bio or as a badge below the typed text:
```tsx
<div className="flex items-center gap-2 text-xs text-white/40 mt-2">
  <i className="fab fa-google text-[0.7rem]" />
  Google Africa Scholar · Andela 2019
</div>
```

---

### 4.8 — Scroll hint with nothing below the fold
**File:** `src/app/page.tsx:36–59`  
The scroll hint invites scrolling but the homepage only has a footer below. Fix: either remove the `ScrollHint` component, or add a below-fold section:
```tsx
{/* Below hero fold */}
<section className="relative z-10 px-20 py-16 grid grid-cols-3 gap-6 max-sm:grid-cols-1">
  <a href="/work?tab=dev" className="...">Recent Dev Work →</a>
  <a href="/work?tab=design" className="...">Design Portfolio →</a>
  <a href="/contact" className="...">Let's Work Together →</a>
</section>
```

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

### 4.11 — No testimonials anywhere
Zero client quotes on the entire site. One genuine testimonial does more credibility work than all the animations combined. Add to About page or homepage. Even one quote from a past client, mentee, or collaborator.

---

### 4.12 — No "What I'm looking for" statement
The site shows what Brian can do, not what he wants. Add one sentence to the About page or Contact page:
> "Currently open to full-time remote roles in full-stack development, and freelance contracts for web and design projects. Particularly interested in product teams building for African markets."

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
1. Add "Available for work" badge to homepage — `page.tsx`
2. Remove BMX Rider/Learner/Friend from typed strings — `page.tsx:76–83`
3. ~~Fix 3 dead dev project URLs — `devProjects.ts`~~ ✅ 2026-04-30
4. Delete dead UA Google Analytics script — `layout.tsx:230–236`
5. Fix M-Pesa callback auth (fake payment injection) — `callback/route.ts`
6. Fix unstyled CV/Hire Me buttons on About page — `about/page.tsx:479,483`

### 🟠 High (Do This Month)
7. Add contact form — new component + `/api/contact` route
8. Add CV download button to homepage hero — `page.tsx`
9. Change Work page default tab from `'services'` to `'dev'` — `work/page.tsx:122`
10. Fix OG image dimensions (create real 1200×630 banner) — `layout.tsx:46`
11. Add `<link rel="preload">` for first background slide — `layout.tsx <head>`
12. ~~Replace `<a>` with `<Link>` for all internal navigation~~ ✅ 2026-04-30
13. Add per-page canonical metadata (needs server shell pattern first)
14. ~~Add AVIF format to `next.config.js`~~ ✅ 2026-04-29
15. Add `display: 'swap'` to Inter font — `layout.tsx:11`
16. ~~Fix Work heading mobile overflow (`text-[7rem]` → `clamp`) — `work/page.tsx:151`~~ ✅ 2026-05-01
17. Add M-Pesa integration as a dev project card
18. Move portfolio site to position 1 in `devProjects.ts`, stop random shuffle
19. Add `sizes` prop to portrait Image — `page.tsx:231`
20. Add rate limiting to STK push endpoint — `stkpush/route.ts`

### 🟡 Medium (Next Quarter)
21. Convert `work/design/[slug]` to SSG with `generateStaticParams` + `generateMetadata`
22. ~~Add `loading.tsx` and `error.tsx`~~ ✅ 2026-04-29
23. ~~Add `focus-visible:` styles to all interactive elements~~ ✅ 2026-05-01
24. ~~Fix StackCard `div` missing `role="button"` + keyboard handler — `about/page.tsx:334`~~ ✅ 2026-05-01
25. Fix `aria-live` on Typed.js target — `page.tsx:144`
26. Add "Available for work" + availability statement to About page
27. Add 1–2 client testimonials to About page or homepage
28. Add "What I'm looking for" paragraph to About or Contact
29. ~~Move BMX from main nav to footer / About page~~ ✅ 2026-04-30
30. Add `will-change-transform` to hover-animated cards — `work/page.tsx:17`
31. Fix bio text contrast `text-white/50` → `text-white/65` — `page.tsx:155`
32. Make slide dots clickable — `page.tsx:206`
33. Remove scroll hint or add below-fold content section
34. ~~Remove/update skill percentages in About stack cards~~ ✅ 2026-05-01
35. Fix sitemap `lastModified` dates — `sitemap.ts`
36. Add `startDelay: 800` to Typed.js config — `page.tsx:75`
37. Add immutable cache headers for `/fonts/` and `/img/` — `next.config.js`
38. ~~Remove dead `cdn.sanity.io` remote pattern — `next.config.js:44`~~ ✅ 2026-04-30

### 🟢 Low (Nice to Have)
39. Replace Font Awesome with `lucide-react` + inline SVGs for brand icons
40. Implement `LazyMotion + domAnimation` — saves ~15 KB
41. Add `opengraph-image.tsx` generated OG banner
42. Centralize contact/social config in `src/lib/siteConfig.ts`
43. Add `src/components/ui/` button using shadcn pattern, or remove unused shadcn deps
44. Move `sass` from `dependencies` to `devDependencies`
45. Fix `duration-1400` → `duration-[1400ms]` — `page.tsx:103`
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
