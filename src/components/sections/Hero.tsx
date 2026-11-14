'use client'

import { Wordmark } from '@/components/Logo'
import { NeonButton } from '@/components/NeonButton'
import { HeroFrame } from '@/components/hero-frame'
import { NeonRule, Rise } from '@/components/motion'
import { OpenTodayHours } from '@/components/open-today-hours'
import { ABC_CHECKOUT_NOTE, joinUrl, LOCATIONS } from '@/lib/locations'
import { MEMBERSHIP_OPTIONS } from '@/lib/membership-options'

export function Hero() {
  const harlingen = LOCATIONS.harlingen
  const fromPrice = MEMBERSHIP_OPTIONS.find(
    (option) => option.slug === '12_month_contract'
  )?.price

  return (
    <HeroFrame>
      <div className="max-w-xl">
        <p className="text-[13px] font-medium text-white/75">Harlingen</p>
        <NeonRule className="mt-3" trigger="mount" />
        <Wordmark className="mt-4" />
        <Rise delay={0.28}>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/80 sm:text-lg">
            Where Strength Meets Aesthetics
          </p>
          <ul className="mt-5 space-y-1 text-[15px] leading-relaxed text-white/75">
            <li>
              <OpenTodayHours />
            </li>
            <li>{harlingen.address}</li>
            {fromPrice ? <li>From {fromPrice}</li> : null}
          </ul>
        </Rise>
        <Rise delay={0.42}>
          <div data-hero-cta="" className="mt-6 flex flex-col items-stretch gap-3 sm:items-start">
            <NeonButton
              href={joinUrl('harlingen', 'hero')}
              target="_blank"
              rel="noopener noreferrer"
              testId="hero-join"
              membership={{ location: 'harlingen', placement: 'hero' }}
              className="w-full sm:w-auto"
            >
              {harlingen.ctaLabel}
            </NeonButton>
            <p className="max-w-sm text-[13px] leading-relaxed text-white/70">{ABC_CHECKOUT_NOTE}</p>
          </div>
        </Rise>
      </div>
    </HeroFrame>
  )
}
