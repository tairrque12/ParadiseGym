'use client'

import { Wordmark } from '@/components/Logo'
import { NeonButton } from '@/components/NeonButton'
import { HeroFrame } from '@/components/hero-frame'
import { RevealOnMount } from '@/components/motion'
import { useModal } from '@/context/modal-context'
import { OpenTodayHours } from '@/components/open-today-hours'
import {
  ABC_CHECKOUT_NOTE,
  joinUrl,
  LOCATIONS,
  TOUR_FALLBACK_LABEL,
} from '@/lib/locations'
import { MEMBERSHIP_OPTIONS } from '@/lib/membership-options'

export function Hero() {
  const { openTourModal } = useModal()
  const harlingen = LOCATIONS.harlingen
  const fromPrice = MEMBERSHIP_OPTIONS.find(
    (option) => option.slug === '12_month_contract'
  )?.price

  return (
    <HeroFrame>
      <RevealOnMount className="max-w-xl">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/70">
          Harlingen
        </p>
        <Wordmark className="mt-4" />
        <p className="mt-5 max-w-md text-lg leading-relaxed text-white/80 sm:text-xl">
          Where Strength Meets Aesthetics
        </p>
        <ul className="mt-7 space-y-1.5 text-sm leading-relaxed text-white/70">
          <li>
            <OpenTodayHours />
          </li>
          <li>{harlingen.address}</li>
          {fromPrice ? <li>From {fromPrice}</li> : null}
        </ul>
        <div data-hero-cta="" className="mt-8 flex flex-col items-start gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <NeonButton
              href={joinUrl('harlingen', 'hero')}
              target="_blank"
              rel="noopener noreferrer"
              testId="hero-join"
              membership={{ location: 'harlingen', placement: 'hero' }}
            >
              {harlingen.ctaLabel}
            </NeonButton>
            <NeonButton variant="outline" onClick={() => openTourModal('hero')}>
              {TOUR_FALLBACK_LABEL}
            </NeonButton>
          </div>
          <p className="max-w-sm text-xs leading-relaxed text-white/75">{ABC_CHECKOUT_NOTE}</p>
        </div>
      </RevealOnMount>
    </HeroFrame>
  )
}
