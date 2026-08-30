import Link from 'next/link'
import { LOCATIONS } from '@/lib/locations'

const MARQUEE_LABEL =
  'New location coming to McAllen, Texas — founding member pricing available now. View pre-sale pricing.'

// Each run is at least as wide as the viewport, so when the first run finishes
// sliding out the second one already covers the strip at any screen width.
function MarqueeRun() {
  return (
    <div
      aria-hidden
      data-testid="marquee-run"
      className="flex h-10 min-w-full shrink-0 items-center justify-around gap-3 whitespace-nowrap pr-3 animate-marquee sm:h-9 sm:gap-4 sm:pr-4"
    >
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
      <div data-testid="marquee-track" className="flex motion-reduce:hidden">
        <MarqueeRun />
        <MarqueeRun />
      </div>

      <div
        data-testid="marquee-static"
        className="hidden h-10 w-full items-center justify-center gap-2 whitespace-nowrap px-4 motion-reduce:flex sm:h-9"
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
