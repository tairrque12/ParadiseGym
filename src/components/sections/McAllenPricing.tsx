import { ArrowUpRight } from 'lucide-react'
import { NeonRule, SectionReveal } from '@/components/motion'
import { SectionHeading } from '@/components/section-heading'
import { TrackedPlanLink } from '@/components/tracked-plan-link'
import { ABC_CHECKOUT_NOTE, joinUrl, LOCATIONS } from '@/lib/locations'
import {
  feeDisclosureEnabled,
  planFeeSummary,
  publicDueTodayLabel,
} from '@/lib/plan-fees'
import { PRICING_DISCOUNT_NOTE } from '@/lib/membership-options'
import { SECTION_IDS } from '@/lib/sections'
import { cn } from '@/lib/utils'

export function McAllenPricing() {
  const mcallen = LOCATIONS.mcallen

  return (
    <section
      id={SECTION_IDS.pricing}
      className="relative scroll-mt-24 bg-carbon py-16 sm:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionReveal>
          <SectionHeading
            eyebrow="Founding members"
            title="Pre-Sale Membership Options"
            description={mcallen.presaleNote}
          />
        </SectionReveal>

        <div className="mt-10 grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-5">
          {mcallen.membershipOptions.map((option) => {
            const feeSummary = feeDisclosureEnabled()
              ? planFeeSummary('mcallen', option.slug)
              : null
            const dueToday = feeSummary
              ? null
              : publicDueTodayLabel('mcallen', option.slug)
            const recommended = option.slug === '12_month_contract'

            return (
              <TrackedPlanLink
                key={option.slug}
                href={joinUrl('mcallen', option.slug)}
                location="mcallen"
                plan={option.name}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'group flex h-full min-w-0 flex-col border border-white/10 bg-surface p-5 transition-colors duration-200 hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon/70 sm:p-6 motion-reduce:transition-none',
                  recommended && 'border-l-[3px] border-l-neon'
                )}
              >
                <span className="block text-sm font-medium text-white">
                  {option.name}
                  {recommended ? (
                    <span className="ml-2 inline-flex items-center border border-neon/50 px-2 py-0.5 align-middle text-xs font-semibold text-neon">
                      Recommended
                    </span>
                  ) : null}
                </span>
                {recommended ? <NeonRule className="mt-3" /> : null}

                <span className="mt-5 block font-sans text-[2.75rem] font-medium leading-none tracking-tight text-white tabular-nums">
                  {option.price}
                </span>

                {option.priceNote ? (
                  <span className="mt-2 block text-sm text-text-2">{option.priceNote}</span>
                ) : null}

                {option.subLabel ? (
                  <span className="mt-2 block text-sm text-text-2">{option.subLabel}</span>
                ) : null}

                {dueToday ? (
                  <span className="mt-3 block text-sm font-normal leading-snug text-white">
                    {dueToday}
                  </span>
                ) : null}

                {feeSummary ? (
                  <span className="mt-3 block text-sm font-normal leading-snug text-text-2">
                    {feeSummary}
                  </span>
                ) : null}

                <span className="mt-auto block w-full pt-6">
                  <span
                    className={cn(
                      'inline-flex h-11 w-full items-center justify-center gap-2 px-5 text-sm font-semibold transition-colors duration-200 motion-reduce:transition-none',
                      recommended
                        ? 'bg-neon text-carbon group-hover:bg-white'
                        : 'border border-white/25 text-white group-hover:border-white/50'
                    )}
                  >
                    Join Now
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </span>
                </span>
              </TrackedPlanLink>
            )
          })}
        </div>

        <p className="mt-6 text-sm leading-relaxed text-text-2">{ABC_CHECKOUT_NOTE}</p>

        <div className="mt-10 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-[11rem_1fr] sm:gap-10">
          <p className="text-xs font-medium text-text-3">Discounts available</p>
          <p className="max-w-xl text-base leading-relaxed text-text-2">{PRICING_DISCOUNT_NOTE}</p>
        </div>
      </div>
    </section>
  )
}
