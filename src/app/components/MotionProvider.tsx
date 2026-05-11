'use client'
import { LazyMotion, domMax } from 'framer-motion'

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={domMax}>{children}</LazyMotion>
}
