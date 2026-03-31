import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {}

function Badge({ className, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-sm px-2 py-[0.2rem] text-[0.65rem] font-bold uppercase bg-lime text-[#1a1a1a]',
        className
      )}
      {...props}
    />
  )
}

export { Badge }
