import Link from 'next/link'
import { LOCATIONS } from '@/lib/locations'

const MARQUEE_LABEL =
  'New location coming to McAllen, Texas — founding member pricing available now. View pre-sale pricing.'

function MarqueeRun() {
  return (
    <div className="flex shrink-0 items-center gap-3 pr-3 sm:gap-4 sm:pr-4">
      <span>🎉 New Location Coming — McAllen, TX — Founding Member Pricing Available Now</span>
      <span className="text-neon/50">•</span>
      <span>View Pre-Sale Pricing →</span>
      <span className="text-neon/50">•</span>
    </div>
  )
}

export function NewLocationMarquee() {
  return (
    <Link
      href={LOCATIONS.mcallen.href}
      aria-label={MARQUEE_LABEL}
      data-testid="new-location-marquee"
      className="block w-full overflow-hidden border-b border-neon/20 bg-black text-[12px] font-semibold uppercase tracking-[0.12em] text-neon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neon/60"
    >
      <div
        aria-hidden
        data-testid="marquee-track"
        className="flex h-10 w-max items-center whitespace-nowrap animate-marquee motion-reduce:hidden sm:h-9"
      >
        <MarqueeRun />
        <MarqueeRun />
      </div>

      <div
        data-testid="marquee-static"
        className="hidden h-10 items-center justify-center gap-2 whitespace-nowrap px-4 motion-reduce:flex sm:h-9"
      >
        <span className="sm:hidden">🎉 New: McAllen Pre-Sale →</span>
        <span className="hidden sm:inline">
          🎉 New Location Coming — McAllen, TX — Founding Member Pricing
          Available Now — View Pre-Sale Pricing →
        </span>
      </div>
    </Link>
  )
}
