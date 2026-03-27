import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from './components/Header'
import PageTransition from './components/PageTransition'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Brian Isale - Portfolio',
  description: 'Brian Isale is a Nakuru Based Front-End Software developer, Creative Designer and Entrepreneur',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Global site tag (gtag.js) - Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-157368874-1"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'UA-157368874-1');
            `,
          }}
        />
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Header />
        <PageTransition>{children}</PageTransition>
        <SpeedInsights />
        <Analytics />
        <Footer />
      </body>
    </html>
  )
}


function Footer() {
  return (
    <footer id="main-footer">
      &copy; {new Date().getFullYear()} - Brian Isale
    </footer>
  )
}