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
  const dueToday = feeSummary ? null : publicDueTodayLabel('harlingen', option.slug)
  const recommended = option.slug === '12_month_contract'

  return (
    <TrackedPlanLink
      href={joinUrl('harlingen', option.slug)}
      location="harlingen"
      plan={option.name}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group flex flex-col gap-4 border border-white/10 bg-surface px-5 py-5 text-left transition-colors duration-200',
        'hover:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon/70 motion-reduce:transition-none',
        'lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-8 lg:px-6 lg:py-6',
        recommended && 'border-l-[3px] border-l-neon'
      )}
    >
      <span className="min-w-0">
        {recommended ? (
          <span className="mb-2 block text-xs font-semibold text-neon">Recommended</span>
        ) : null}
        <span className="block text-base font-medium text-white">{option.name}</span>
        {option.subLabel ? (
          <span className="mt-1 block text-sm text-text-2">{option.subLabel}</span>
        ) : null}
      </span>

      <span className="flex flex-col gap-3 lg:items-end">
        <span>
          <span className="block font-sans text-[2rem] font-medium leading-none tracking-tight text-white tabular-nums lg:text-[2.25rem]">
            {option.price}
          </span>
          {option.priceNote ? (
            <span className="mt-1.5 block text-sm text-text-2">{option.priceNote}</span>
          ) : null}
          {dueToday ? (
            <span className="mt-2 block max-w-[16rem] text-sm leading-snug text-white lg:text-right">
              {dueToday}
            </span>
          ) : null}
          {feeSummary ? (
            <span className="mt-2 block max-w-[16rem] text-sm leading-snug text-text-2 lg:text-right">
              {feeSummary}
            </span>
          ) : null}
        </span>
        <span
          className={cn(
            'inline-flex h-11 w-full items-center justify-center gap-1.5 px-4 text-sm font-semibold',
            recommended
              ? 'bg-neon text-carbon'
              : 'border border-white/25 text-white',
            'lg:w-auto lg:min-w-[7.5rem]'
          )}
        >
          Join now
          <ArrowUpRight className="size-4" aria-hidden />
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
      <h3 className="text-sm font-medium text-text-2">{label}</h3>
      <div className="mt-3 flex flex-col gap-3">
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
      className="relative scroll-mt-24 bg-carbon py-16 sm:py-20 lg:py-28"
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

        <div className="mt-10 grid items-start gap-10 lg:mt-14 lg:grid-cols-2 lg:gap-16">
          <PricingColumn label="Recurring" options={recurring} />
          <PricingColumn label="Single Payment" options={singlePayment} />
        </div>

        <div className="mt-10 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-[11rem_1fr] sm:gap-10">
          <p className="text-xs font-medium text-text-3">Discounts available</p>
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
