'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center px-8">
      <h2 className="text-4xl font-black text-white mb-4">Something went wrong</h2>
      <p className="text-white/50 text-base mb-8">An unexpected error occurred. Try again or go back home.</p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="px-6 py-3 bg-lime text-black font-black text-sm uppercase tracking-widest rounded-md hover:bg-[#c8f000] transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-6 py-3 border border-white/20 text-white font-bold text-sm uppercase tracking-widest rounded-md hover:border-teal hover:text-teal transition-colors"
        >
          Go Home
        </Link>
      </div>
    </main>
  )
}
