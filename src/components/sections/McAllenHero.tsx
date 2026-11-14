'use client'

import { useEffect, useState } from 'react'
import { NeonButton } from '@/components/NeonButton'
import { HeroFrame } from '@/components/hero-frame'
import { MaskedLine, NeonRule, Rise } from '@/components/motion'
import { ABC_CHECKOUT_NOTE, joinUrl, LOCATIONS } from '@/lib/locations'
import {
  isMcAllenOpen,
  MCALLEN_NOW_OPEN_LABEL,
  MCALLEN_OPENS_LABEL,
} from '@/lib/mcallen-opening'
import { SECTION_IDS } from '@/lib/sections'

export function McAllenHero() {
  const mcallen = LOCATIONS.mcallen
  const [openingLabel, setOpeningLabel] = useState(MCALLEN_OPENS_LABEL)

  useEffect(() => {
    if (isMcAllenOpen()) setOpeningLabel(MCALLEN_NOW_OPEN_LABEL)
  }, [])

  return (
    <HeroFrame>
      <div className="max-w-xl">
        <p className="inline-flex items-center gap-2 text-[13px] font-medium text-white">
          <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-neon" />
          Pre-Sale Now Open
        </p>
        <NeonRule className="mt-3" trigger="mount" />

        <p
          data-testid="mcallen-opening"
          className="mt-4 text-[13px] font-medium text-white"
        >
          {openingLabel}
        </p>
        <h1 className="mt-2 font-sans text-[clamp(2.75rem,11vw,3.5rem)] font-medium leading-[1.04] tracking-[-0.03em] text-white md:text-[clamp(3.5rem,5vw,4.5rem)]">
          <MaskedLine>Paradise Gym</MaskedLine>
          <MaskedLine delay={0.12}>McAllen</MaskedLine>
        </h1>

        <Rise delay={0.28}>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/80 sm:text-lg">
            {mcallen.sqft.toLocaleString('en-US')} sq ft of custom-built training,
            coming to {mcallen.address.split(',')[1]?.trim()}.
          </p>

          {mcallen.presaleNote ? (
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80">
              {mcallen.presaleNote}
            </p>
          ) : null}
        </Rise>

        <Rise delay={0.42}>
          <div data-hero-cta="" className="mt-6 flex flex-col items-stretch gap-3 sm:items-start">
            <NeonButton
              href={joinUrl('mcallen', 'hero')}
              target="_blank"
              rel="noopener noreferrer"
              testId="hero-join"
              membership={{ location: 'mcallen', placement: 'hero' }}
              className="w-full bg-neon text-carbon sm:w-auto"
            >
              {mcallen.ctaLabel}
            </NeonButton>
            <a
              href={`#${SECTION_IDS.pricing}`}
              className="inline-flex min-h-11 items-center text-sm text-white/75 underline decoration-white/25 underline-offset-4 transition-colors duration-200 hover:text-white hover:decoration-white"
            >
              View pre-sale pricing
            </a>
            <p className="max-w-sm text-[13px] leading-relaxed text-white/70">{ABC_CHECKOUT_NOTE}</p>
            <p className="text-[13px] leading-relaxed text-white/70" data-testid="hero-photo-caption">
              Photo from our Harlingen gym.{' '}
              {openingLabel === MCALLEN_NOW_OPEN_LABEL
                ? 'McAllen is now open.'
                : 'McAllen opens Nov 28.'}
            </p>
          </div>
        </Rise>
      </div>
    </HeroFrame>
  )
}
