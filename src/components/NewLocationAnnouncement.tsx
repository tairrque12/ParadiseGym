'use client'

import { ArrowRight } from 'lucide-react'
import { useLocation } from '@/context/location-context'
import { LOCATIONS } from '@/lib/locations'
import { scrollToSection } from '@/lib/section-nav'
import { SECTION_IDS } from '@/lib/sections'
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion'
import { cn } from '@/lib/utils'

export function NewLocationAnnouncement({ className }: { className?: string }) {
  const { setLocationId } = useLocation()
  const reducedMotion = usePrefersReducedMotion()
  const mcallen = LOCATIONS.mcallen

  const showPresalePricing = () => {
    setLocationId(mcallen.id)
    scrollToSection(SECTION_IDS.pricing)
  }

  return (
    <div
      data-testid="new-location-announcement"
      className={cn(
        'inline-flex max-w-full flex-wrap items-center gap-x-3 gap-y-2 rounded-full border border-neon/40 bg-carbon/70 py-2 pl-2 pr-4 backdrop-blur-sm',
        !reducedMotion && 'animate-neon-halo',
        className
      )}
    >
      <span className="rounded-full bg-neon px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-carbon">
        New Location
      </span>

      <span className="text-xs leading-snug text-white/80 sm:text-sm">
        {mcallen.name} opens soon — founding member pricing is live.
      </span>

      <button
        type="button"
        onClick={showPresalePricing}
        className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-neon transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon/60"
      >
        View Pre-Sale Pricing
        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
      </button>
    </div>
  )
}
