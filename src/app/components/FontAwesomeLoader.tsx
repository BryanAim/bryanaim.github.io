'use client'
import { useEffect } from 'react'

export function FontAwesomeLoader() {
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = '/fonts/css/all.min.css'
    document.head.appendChild(link)
  }, [])
  return null
}
