import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { LOCATIONS } from '@/lib/locations'
import { cn } from '@/lib/utils'

export function NewLocationAnnouncement({ className }: { className?: string }) {
  const mcallen = LOCATIONS.mcallen

  return (
    <div
      data-testid="new-location-announcement"
      className={cn(
        // Card on narrow screens so wrapped lines read as intentional; slim pill once it fits one row.
        'flex max-w-full flex-wrap items-center gap-x-3 gap-y-1.5 rounded-xl border border-neon/40 bg-carbon/70 px-3 py-2.5 backdrop-blur-sm',
        'lg:inline-flex lg:w-auto lg:flex-nowrap lg:rounded-full lg:py-2 lg:pl-2 lg:pr-4',
        'motion-safe:animate-neon-halo',
        className
      )}
    >
      <span className="order-1 rounded-full bg-neon px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-carbon">
        New Location
      </span>

      <span className="order-3 w-full text-[13px] leading-snug text-white/80 lg:order-2 lg:w-auto lg:whitespace-nowrap lg:text-sm">
        {mcallen.name} opens soon — founding member pricing is live.
      </span>

      <Link
        href={mcallen.href}
        className="order-2 ml-auto inline-flex items-center gap-1 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.14em] text-neon transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon/60 lg:order-3 lg:ml-0 lg:text-xs"
      >
        View Pre-Sale Pricing
        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
      </Link>
    </div>
  )
}
