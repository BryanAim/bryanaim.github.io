/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === 'development'

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Scripts: self + inline (needed for JSON-LD schema tags) + Vercel analytics
      // unsafe-eval is required by React dev tools (never used in production)
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://va.vercel-scripts.com`,
      // Styles: self + inline (Framer Motion injects inline styles)
      "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com",
      // Fonts
      "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com",
      // Images: self + data URIs (design previews) + known external hosts
      "img-src 'self' data: blob: https://images.unsplash.com https://res.cloudinary.com https://i.imgur.com https://lh3.googleusercontent.com https://avatars.githubusercontent.com https://raw.githubusercontent.com",
      // API calls: self + M-Pesa + Neon DB (server-side only, but listed for completeness)
      "connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com",
      // Media
      "media-src 'self' blob:",
      // Frames: nothing external
      "frame-src 'none'",
      // Objects: nothing
      "object-src 'none'",
      // Base URI locked to self
      "base-uri 'self'",
      // Form submissions only to self
      "form-action 'self'",
    ].join('; '),
  },
]

const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'i.imgur.com' },
    ],
  },
  headers() {
    return Promise.resolve([
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ])
  },
}

module.exports = nextConfig
