'use client'

import { NeonButton } from '@/components/NeonButton'
import { HeroFrame } from '@/components/hero-frame'
import { RevealOnMount } from '@/components/motion'
import { useModal } from '@/context/modal-context'
import {
  ABC_CHECKOUT_NOTE,
  joinUrl,
  LOCATIONS,
  TOUR_FALLBACK_LABEL,
} from '@/lib/locations'
import { SECTION_IDS } from '@/lib/sections'

export function McAllenHero() {
  const { openTourModal } = useModal()
  const mcallen = LOCATIONS.mcallen

  return (
    <HeroFrame>
      <RevealOnMount className="max-w-xl">
        <p className="flex items-center gap-2 text-xs font-medium tracking-[0.08em] text-white/75">
          <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-neon" />
          Pre-Sale Now Open
        </p>

        <h1 className="mt-4 font-sans text-[clamp(2.75rem,5.4vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.03em] text-white">
          Paradise Gym
          <span className="block">McAllen</span>
        </h1>

        <p className="mt-5 max-w-md text-base leading-relaxed text-white/80 sm:text-lg">
          {mcallen.sqft.toLocaleString('en-US')} sq ft of custom-built training,
          coming to {mcallen.address.split(',')[1]?.trim()}.
        </p>

        <p
          data-testid="grand-opening-note"
          className="mt-3 max-w-md text-sm leading-relaxed text-white/55"
        >
          {mcallen.grandOpeningNote}
        </p>

        <div data-hero-cta="" className="mt-8 flex flex-col items-start gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <NeonButton
              href={joinUrl('mcallen', 'hero')}
              target="_blank"
              rel="noopener noreferrer"
              testId="hero-join"
              membership={{ location: 'mcallen', placement: 'hero' }}
            >
              {mcallen.ctaLabel}
            </NeonButton>
            <NeonButton variant="outline" onClick={() => openTourModal('hero')}>
              {TOUR_FALLBACK_LABEL}
            </NeonButton>
          </div>
          <a
            href={`#${SECTION_IDS.pricing}`}
            className="inline-flex min-h-11 items-center text-sm text-white/75 underline decoration-white/25 underline-offset-4 transition-colors duration-200 hover:text-white hover:decoration-white"
          >
            View pre-sale pricing
          </a>
          <p className="max-w-sm text-xs leading-relaxed text-white/75">{ABC_CHECKOUT_NOTE}</p>
        </div>
      </RevealOnMount>
    </HeroFrame>
  )
}
