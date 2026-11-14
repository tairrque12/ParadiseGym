import { ArrowUpRight } from 'lucide-react'
import { SectionReveal } from '@/components/motion'
import { SectionHeading } from '@/components/section-heading'
import { TrackedPlanLink } from '@/components/tracked-plan-link'
import {
  PRICING_DISCOUNT_NOTE,
  PRICING_FOOTER_NOTE,
  type MembershipOption,
} from '@/lib/membership-options'
import { TourPrompt } from '@/components/tour-prompt'
import { ABC_CHECKOUT_NOTE, joinUrl, LOCATIONS } from '@/lib/locations'
import {
  feeDisclosureEnabled,
  planFeeSummary,
  publicDueTodayLabel,
} from '@/lib/plan-fees'
import { SECTION_IDS } from '@/lib/sections'
import { cn } from '@/lib/utils'

function PricingRow({ option }: { option: MembershipOption }) {
  const feeSummary = feeDisclosureEnabled()
    ? planFeeSummary('harlingen', option.slug)
    : null
  const recommended = option.slug === '12_month_contract'

  return (
    <TrackedPlanLink
      href={joinUrl('harlingen', option.slug)}
      location="harlingen"
      plan={option.name}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group grid grid-cols-1 gap-4 border border-white/10 bg-surface/80 px-5 py-5 text-left transition-colors duration-200 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-8 sm:px-6 sm:py-6',
        'hover:border-white/30 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon/70 motion-reduce:transition-none',
        recommended && 'border-l-[3px] border-l-neon bg-surface'
      )}
    >
      <span className="min-w-0">
        {recommended ? (
          <span className="mb-2 block text-xs font-semibold text-neon">Recommended</span>
        ) : null}
        <span className="block text-base font-medium text-white">{option.name}</span>
        {option.subLabel ? (
          <span className="mt-1 block text-sm text-text-3">{option.subLabel}</span>
        ) : null}
      </span>

      <span className="sm:text-right">
        <span className="block text-[2.25rem] font-medium leading-none tracking-tight text-white tabular-nums">
          {option.price}
        </span>
        {option.priceNote ? (
          <span className="mt-1.5 block text-xs text-text-3">{option.priceNote}</span>
        ) : null}
        {dueToday ? (
          <span className="mt-1 block max-w-[14rem] text-sm font-normal normal-case leading-snug tracking-normal text-white">
            {dueToday}
          </span>
        ) : null}
        {feeSummary ? (
          <span className="mt-2 block max-w-[16rem] text-sm font-normal leading-snug text-text-2 sm:ml-auto">
            {feeSummary}
          </span>
        ) : null}
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-neon">
          Join now
          <ArrowUpRight
            className="size-3.5 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px motion-reduce:transition-none"
            aria-hidden
          />
        </span>
      </span>
    </TrackedPlanLink>
  )
}

function PricingColumn({
  label,
  options,
}: {
  label: string
  options: readonly MembershipOption[]
}) {
  return (
    <div>
      <h3 className="text-sm font-medium tracking-[0.04em] text-text-2">{label}</h3>
      <div className="mt-4 flex flex-col gap-3">
        {options.map((option) => (
          <PricingRow key={option.slug} option={option} />
        ))}
      </div>
    </div>
  )
}

export function Pricing() {
  const options = LOCATIONS.harlingen.membershipOptions
  const recurring = options.filter((option) => option.category === 'recurring')
  const singlePayment = options.filter((option) => option.category === 'single_payment')

  return (
    <section
      id={SECTION_IDS.pricing}
      className="relative scroll-mt-32 bg-carbon py-24 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionReveal>
          <SectionHeading
            id="pricing-heading"
            eyebrow="Harlingen"
            title="Membership options"
            description="Monthly plans, or pay once and walk in."
          />
        </SectionReveal>

        <div className="mt-14 grid items-start gap-14 lg:mt-16 lg:grid-cols-2 lg:gap-16">
          <PricingColumn label="Recurring" options={recurring} />
          <PricingColumn label="Single Payment" options={singlePayment} />
        </div>

        <div className="mt-14 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-[11rem_1fr] sm:gap-10">
          <p className="text-xs font-medium tracking-[0.08em] text-text-3">Discounts available</p>
          <div className="space-y-4">
            <p className="max-w-xl text-base leading-relaxed text-text-2">{PRICING_DISCOUNT_NOTE}</p>
            <p className="text-sm leading-relaxed text-text-2">{ABC_CHECKOUT_NOTE}</p>
            <TourPrompt>Not ready to join? Book a free tour</TourPrompt>
            <p className="text-sm leading-relaxed text-text-3">{PRICING_FOOTER_NOTE}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
