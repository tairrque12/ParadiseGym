'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

const control =
  'inline-flex h-[52px] items-center justify-center rounded-lg px-6 text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-carbon'

export function JoinAction({
  href,
  children,
  className,
  testId,
  onClick,
}: {
  href: string
  children: ReactNode
  className?: string
  testId?: string
  onClick?: () => void
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-testid={testId}
      onClick={onClick}
      className={cn(
        control,
        'bg-neon text-carbon hover:brightness-95 active:scale-[0.98] motion-reduce:active:scale-100',
        className
      )}
    >
      {children}
    </a>
  )
}

export function TourAction({
  children,
  className,
  testId,
  onClick,
}: {
  children: ReactNode
  className?: string
  testId?: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      onClick={onClick}
      className={cn(
        control,
        'border border-line-strong bg-transparent text-white hover:bg-white/5',
        className
      )}
    >
      {children}
    </button>
  )
}
