import Link from 'next/link'
import { cn } from '@/lib/utils'

const base =
  'inline-flex items-center justify-center rounded-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon/60'

export function NeonButton({
  href,
  children,
  variant = 'primary',
  className,
}: {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'outline'
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        base,
        variant === 'primary' &&
          'bg-neon px-6 py-3 text-sm uppercase tracking-wider text-carbon hover:scale-[1.03] hover:shadow-neon md:px-8 md:py-3.5 md:text-base',
        variant === 'outline' &&
          'border border-white/30 bg-transparent px-6 py-3 text-sm uppercase tracking-wider text-white hover:scale-[1.03] hover:border-neon hover:text-neon hover:shadow-neon-sm md:px-8 md:py-3.5 md:text-base',
        className
      )}
    >
      {children}
    </Link>
  )
}
