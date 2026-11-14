import Image from 'next/image'
import { cn } from '@/lib/utils'

type LogoProps = {
  compact?: boolean
  className?: string
}

export function Logo({ compact = false, className }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Image
        src="/images/paradise-mark.png"
        alt="Paradise Gym"
        width={327}
        height={368}
        className={cn('w-auto object-contain', compact ? 'h-8' : 'h-10')}
      />
      {compact ? (
        <span className="sr-only">Paradise Gym</span>
      ) : (
        <span className="text-sm font-medium tracking-[0.01em] text-white">
          Paradise Gym
        </span>
      )}
    </div>
  )
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <h1
      className={cn(
        'font-heading text-[clamp(3.5rem,7vw,5.75rem)] font-medium leading-[0.92] tracking-[-0.025em] text-white',
        className
      )}
    >
      Paradise
      <span className="block">Gym</span>
    </h1>
  )
}
