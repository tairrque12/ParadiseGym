'use client'

import { cn } from '@/lib/utils'
import {
  trackJoinOnlineClick,
  type AnalyticsLocation,
  type JoinPlacement,
} from '@/lib/analytics'

const base =
  'inline-flex min-h-11 items-center justify-center rounded-none px-5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon/70 focus-visible:ring-offset-2 focus-visible:ring-offset-carbon motion-reduce:transition-none'

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
  testId,
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
  testId?: string
}) {
  const classes = cn(
    base,
    variant === 'primary' && 'bg-neon text-carbon hover:bg-white',
    variant === 'outline' &&
      'border border-white/25 bg-carbon/30 text-white backdrop-blur-sm hover:border-white/55 hover:bg-white/10',
    disabled && 'pointer-events-none opacity-60',
    className
  )

  if (disabled) {
    return (
      <button type="button" disabled className={classes} data-testid={testId}>
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
        data-testid={testId}
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
    <button type="button" onClick={onClick} className={classes} data-testid={testId}>
      {children}
    </button>
  )
}
