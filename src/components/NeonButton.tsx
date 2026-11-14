'use client'

import { cn } from '@/lib/utils'
import {
  trackJoinOnlineClick,
  type AnalyticsLocation,
  type JoinPlacement,
} from '@/lib/analytics'

const base =
  'inline-flex items-center justify-center rounded-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon/60'

export function NeonButton({
  href,
  target,
  rel,
  onClick,
  disabled,
  children,
  variant = 'primary',
  className,
  membership,
}: {
  href?: string
  target?: React.HTMLAttributeAnchorTarget
  rel?: string
  onClick?: () => void
  disabled?: boolean
  children: React.ReactNode
  variant?: 'primary' | 'outline'
  className?: string
  membership?: {
    location: AnalyticsLocation
    placement: JoinPlacement
  }
}) {
  const classes = cn(
    base,
    variant === 'primary' &&
      'bg-neon px-6 py-3 text-sm uppercase tracking-wider text-carbon hover:scale-[1.03] hover:shadow-neon md:px-8 md:py-3.5 md:text-base',
    variant === 'outline' &&
      'border border-white/30 bg-transparent px-6 py-3 text-sm uppercase tracking-wider text-white hover:scale-[1.03] hover:border-neon hover:text-neon hover:shadow-neon-sm md:px-8 md:py-3.5 md:text-base',
    disabled && 'cursor-not-allowed opacity-60 hover:scale-100 hover:shadow-none',
    className
  )

  if (disabled) {
    return (
      <button type="button" disabled className={classes}>
        {children}
      </button>
    )
  }

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={classes}
        onClick={() => {
          if (membership) trackJoinOnlineClick(membership)
          onClick?.()
        }}
      >
        {children}
      </a>
    )
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  )
}
