'use client'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function NavigationProgress() {
  const pathname = usePathname()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const prevPath = useRef(pathname)
  const interval = useRef<ReturnType<typeof setInterval> | null>(null)
  const completing = useRef(false)

  function startProgress() {
    if (completing.current) return
    if (interval.current) clearInterval(interval.current)
    setVisible(true)
    setProgress(8)
    let p = 8
    interval.current = setInterval(() => {
      const step = p < 40 ? 10 : p < 65 ? 6 : p < 80 ? 3 : p < 88 ? 1 : 0
      if (step === 0) { clearInterval(interval.current!); return }
      p = Math.min(p + step, 90)
      setProgress(p)
    }, 200)
  }

  function completeProgress() {
    completing.current = true
    if (interval.current) clearInterval(interval.current)
    setProgress(100)
    const hide = setTimeout(() => {
      setVisible(false)
      setProgress(0)
      completing.current = false
    }, 400)
    return () => clearTimeout(hide)
  }

  // Intercept link clicks to start the bar before navigation
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const a = (e.target as Element).closest('a')
      if (!a) return
      const href = a.getAttribute('href') ?? ''
      // Skip external links, anchors, mailto, tel, and same-page
      if (!href || href.startsWith('#') || href.startsWith('http') ||
          href.startsWith('mailto') || href.startsWith('tel')) return
      if (href.split('?')[0] === pathname) return
      startProgress()
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [pathname])

  // Detect when Next.js finishes navigating (pathname changed)
  useEffect(() => {
    if (pathname !== prevPath.current) {
      prevPath.current = pathname
      completeProgress()
    }
  }, [pathname])

  if (!visible) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none">
      <div
        className="h-full bg-lime shadow-[0_0_8px_#b1db00aa] transition-[width] duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
