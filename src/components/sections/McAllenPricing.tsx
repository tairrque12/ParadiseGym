import { ArrowUpRight } from 'lucide-react'
import { SectionReveal } from '@/components/motion'
import { SectionHeading } from '@/components/section-heading'
import { TourPrompt } from '@/components/tour-prompt'
import { TrackedPlanLink } from '@/components/tracked-plan-link'
import { ABC_CHECKOUT_NOTE, joinUrl, LOCATIONS } from '@/lib/locations'
import {
  feeDisclosureEnabled,
  planFeeSummary,
  publicDueTodayLabel,
} from '@/lib/plan-fees'
import { PRICING_DISCOUNT_NOTE } from '@/lib/membership-options'
import { SECTION_IDS } from '@/lib/sections'

export function McAllenPricing() {
  const mcallen = LOCATIONS.mcallen

  return (
    <section
      id={SECTION_IDS.pricing}
      className="relative scroll-mt-32 bg-carbon py-24 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionReveal>
          <SectionHeading
            eyebrow="Founding members"
            title="Pre-Sale Membership Options"
            description={mcallen.presaleNote}
          />
        </SectionReveal>

        <div className="mt-14 grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-5">
          {mcallen.membershipOptions.map((option) => {
            const feeSummary = feeDisclosureEnabled()
              ? planFeeSummary('mcallen', option.slug)
              : null
            const dueToday = feeSummary
              ? null
              : publicDueTodayLabel('mcallen', option.slug)

            return (
              <TrackedPlanLink
                key={option.slug}
                href={joinUrl('mcallen', option.slug)}
                location="mcallen"
                plan={option.name}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full min-w-0 flex-col border border-white/10 bg-surface p-6 transition-colors duration-200 hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon/70 sm:p-7 motion-reduce:transition-none"
              >
                <span className="block text-sm font-medium text-text-2">{option.name}</span>

                <span className="mt-6 block text-[2.75rem] font-medium leading-none tracking-tight text-white tabular-nums">
                  {option.price}
                </span>

                {option.priceNote ? (
                  <span className="mt-2 block text-sm text-white/55">{option.priceNote}</span>
                ) : null}

                {option.subLabel ? (
                  <span className="mt-3 block text-sm text-white/50">{option.subLabel}</span>
                ) : null}

                {dueToday ? (
                  <span className="mt-4 block text-sm font-normal normal-case leading-snug tracking-normal text-white">
                    {dueToday}
                  </span>
                ) : null}

                {feeSummary ? (
                  <span className="mt-4 block text-sm font-normal leading-snug text-white/80">
                    {feeSummary}
                  </span>
                ) : null}

                <span className="mt-auto block w-full pt-8">
                  <span className="inline-flex h-11 w-full items-center justify-center gap-2 bg-neon px-5 text-sm font-semibold text-carbon transition-colors duration-200 group-hover:bg-white motion-reduce:transition-none">
                    Join Now
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </span>
                </span>
              </TrackedPlanLink>
            )
          })}
        </div>

        <p className="mt-8 text-sm leading-relaxed text-white/80">{ABC_CHECKOUT_NOTE}</p>
        <div className="mt-4">
          <TourPrompt>Not ready to join? Book a free tour</TourPrompt>
        </div>

        <div className="mt-14 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-[11rem_1fr] sm:gap-10">
          <p className="text-xs font-medium tracking-[0.08em] text-text-3">Discounts available</p>
          <p className="max-w-xl text-base leading-relaxed text-text-2">{PRICING_DISCOUNT_NOTE}</p>
        </div>
      </div>
    </section>
  )
}
