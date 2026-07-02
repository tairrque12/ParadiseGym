import { cn } from '@/lib/utils'

type LogoProps = {
  compact?: boolean
  className?: string
}

export function Logo({ compact = false, className }: LogoProps) {
  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <span
          aria-hidden
          className="flex h-9 w-9 items-center justify-center rounded-sm border border-neon/60 bg-carbon font-heading text-sm font-bold tracking-tight text-neon"
        >
          PG
        </span>
        <span className="sr-only">Paradise Gym</span>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span
        aria-hidden
        className="flex h-10 w-10 items-center justify-center rounded-sm border border-neon/50 bg-carbon font-heading text-base font-bold tracking-tight text-neon shadow-neon-sm"
      >
        PG
      </span>
      <span className="font-heading text-lg uppercase tracking-[0.12em] text-white sm:text-xl">
        Paradise Gym
      </span>
    </div>
  )
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <h1
      className={cn(
        'font-heading text-[clamp(2.75rem,12vw,7rem)] uppercase leading-[0.9] tracking-[0.06em] text-white',
        className
      )}
    >
      Paradise Gym
    </h1>
  )
}
