import { cn } from '@/lib/utils'

const base =
  'inline-flex items-center justify-center rounded-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon/60'

export function NeonButton({
  href,
  onClick,
  children,
  variant = 'primary',
  className,
}: {
  href?: string
  onClick?: () => void
  children: React.ReactNode
  variant?: 'primary' | 'outline'
  className?: string
}) {
  const classes = cn(
    base,
    variant === 'primary' &&
      'bg-neon px-6 py-3 text-sm uppercase tracking-wider text-carbon hover:scale-[1.03] hover:shadow-neon md:px-8 md:py-3.5 md:text-base',
    variant === 'outline' &&
      'border border-white/30 bg-transparent px-6 py-3 text-sm uppercase tracking-wider text-white hover:scale-[1.03] hover:border-neon hover:text-neon hover:shadow-neon-sm md:px-8 md:py-3.5 md:text-base',
    className
  )

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={classes}>
        {children}
      </button>
    )
  }

  return (
    <a href={href} className={classes}>
      {children}
    </a>
  )
}
