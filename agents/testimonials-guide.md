# Testimonials System — Usage & Testing Guide

## Quick links

| URL | Purpose |
|-----|---------|
| `/admin/testimonials` | Your private dashboard — view, hide, copy share links |
| `/testimonial/[project-slug]` | Send to design/dev clients for project feedback |
| `/shop/stickers` | Public sticker review page (shareable) |
| `/shop/tshirts` | Public t-shirt review page (shareable) |

---

## 1. First-time setup

### Environment variable (IMPORTANT: `#` in passwords needs quotes)

In `.env.local`:
```
ADMIN_SECRET="your-password-here"
```
> ⚠️ Always wrap in double quotes if the password contains `#`, `!`, spaces, or other shell special characters. Without quotes, `#` and everything after it is treated as a comment and the env var gets a truncated value.

In Vercel: set under Project → Environment Variables (not Team-level Shared). Set for **Development**, **Preview**, and **Production**.

After editing `.env.local`, always **restart the dev server** — Next.js reads it once at startup.

---

## 2. Collecting testimonials from design/dev clients

### Step 1: Find the project slug
Each design project has a slug (e.g. `logo-for-safaricom`, `brochure-naxtech`). You can find them in:
- `src/app/work/designProjects.ts` — the `slug` field on each project
- Your admin dashboard → **Share Links** tab — lists every project with a copy button

### Step 2: Share the link
Send the client: `https://isalebryan.dev/testimonial/[slug]`

**Example:** If you did a logo for Safaricom, send:
```
https://isalebryan.dev/testimonial/logo-for-safaricom
```

The page automatically shows the project image, name, and a clean branded form.

### Step 3: What the client fills in
- ★★★★★ Rating (optional)
- Full name (required)
- Role & Company (optional, shown on card)
- Their testimonial text (min 20 characters, max 1000)
- Profile photo (optional — initials avatar shown if skipped)

After they submit → branded thank-you page → testimonial is **immediately live** on your site.

---

## 3. Collecting shop reviews

### Option A: Product review pages (recommended for public sharing)
Share these clean product pages with buyers:

| Product | Share URL |
|---------|-----------|
| Stickers | `https://isalebryan.dev/shop/stickers` |
| T-Shirts | `https://isalebryan.dev/shop/tshirts` |

The page shows products, a review form (no role/company — just name, rating, review, up to 2 product photos), and existing reviews.

### Option B: Direct collection links (for WhatsApp/DMs)
| Product | Link |
|---------|------|
| Stickers | `https://isalebryan.dev/testimonial/shop-stickers` |
| T-Shirts | `https://isalebryan.dev/testimonial/shop-tshirts` |
| Custom order | `https://isalebryan.dev/testimonial/shop-custom` |

### Product photos
Shop reviewers can upload up to **2 photos** of the product they received (e.g. sticker on laptop, shirt being worn). Photos are compressed client-side to ~150–200 KB before upload. They appear in a mini gallery on the review card.

---

## 4. Admin dashboard (`/admin/testimonials`)

1. Visit `https://isalebryan.dev/admin/testimonials` (or `http://localhost:3000/admin/testimonials`)
2. Enter your `ADMIN_SECRET` password
3. Session is saved in the browser tab — closing the tab requires re-login

### What you can do
- **View all testimonials** (published + hidden) in newest-first order
- **Filter** by status (all / published / hidden)
- **Search** by name, text, or project
- **Toggle visibility** — eye icon hides, eye-slash icon shows again. Hidden testimonials are NOT deleted, just invisible on the public site.
- **Share Links tab** — copy collection URLs for any project in one click

### When to hide a testimonial
- Spam or gibberish submissions
- Accidentally submitted with wrong project
- Client asks to remove it

---

## 5. Where testimonials appear on the site

| Location | What shows |
|----------|-----------|
| Home page | Horizontal scrolling marquee (all testimonials, newest first, max 12) |
| About page | 3-column grid (max 6) — appears automatically once you have ≥1 |
| Design project page | Project-specific cards, below the Concept section |
| Shop page | "Customer Reviews" grid (stickers + t-shirts + custom combined) |
| `/shop/stickers` | Sticker-specific reviews with product photos |
| `/shop/tshirts` | T-shirt-specific reviews with product photos |

All sections are **conditionally rendered** — if there are no testimonials yet, the section simply doesn't appear. Nothing breaks.

---

## 6. Testing locally

### Full end-to-end test (5 minutes)
1. Make sure `.env.local` has `ADMIN_SECRET="your-password"` (note the quotes!)
2. Restart dev server: `Ctrl+C` then `npm run dev`
3. Visit `http://localhost:3000/testimonial/logo-for-safaricom` (or any real slug)
4. Fill in the form → submit → check success page
5. Visit `http://localhost:3000/about` → testimonials section should appear
6. Visit `http://localhost:3000/admin/testimonials` → log in → see your submission

### Test shop reviews
1. Visit `http://localhost:3000/shop/stickers`
2. Scroll to the review form → submit a test review (optionally attach a photo)
3. Refresh the page → review should appear in the Reviews section

### Test admin hide/show
1. In admin, click the eye-slash icon on your test submission
2. Reload the about page → the testimonial should be gone
3. Go back to admin, click the eye icon to restore it

### Cleanup test data
Test testimonials don't affect production. To remove them:
- Admin dashboard → find the test entry → hide it (or it'll auto-disappear if you reset the DB)
- OR connect to Neon directly: `DELETE FROM testimonials WHERE name = 'Test Name'`

---

## 7. Spam protection (already built in)
- **Honeypot field**: hidden form field that humans skip but bots fill → silently dropped
- **IP rate limit**: max 2 submissions per IP per project per 24 hours
- **Content validation**: name 2–120 chars, text 20–1000 chars
- **Photo validation**: magic-byte file type check (not just Content-Type header), max 2 MB

---

## 8. Shop product pages — performance note

The `/shop/stickers` and `/shop/tshirts` pages are **not heavy**:
- They're Next.js client components — same as every other page on the site
- Reviews load asynchronously (page renders immediately, reviews appear after ~100ms)
- Product photos are compressed client-side to ~150–200 KB before upload, stored in Neon (same as custom order designs)
- No new dependencies added

The only thing to watch: if you accumulate 100+ reviews with 2 product photos each, the About page grid query (which fetches all) could get slow. That's far in the future — when you hit 50+ reviews, add a `LIMIT 6` to the About page query.

---

## 9. Changing the admin password

1. Update `.env.local`: `ADMIN_SECRET="new-password"`
2. Update Vercel: Project → Environment Variables → ADMIN_SECRET → Edit
3. Redeploy (or it'll take effect on next Vercel deployment)
4. Clear sessionStorage in browser: DevTools → Application → Session Storage → Clear
