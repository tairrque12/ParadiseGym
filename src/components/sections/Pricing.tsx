'use client'

import {
  GrainOverlay,
  SectionReveal,
} from '@/components/motion'
import { PresaleCountdown } from '@/components/PresaleCountdown'
import { useLocation } from '@/context/location-context'
import {
  PRICING_DISCOUNT_NOTE,
  PRICING_FOOTER_NOTE,
  type MembershipOption,
} from '@/lib/membership-options'
import { isJoinLinkReady, type GymLocation } from '@/lib/locations'
import { SECTION_IDS } from '@/lib/sections'
import { cn } from '@/lib/utils'

function CategoryHeader({ label }: { label: string }) {
  return (
    <div className="mb-6 inline-flex items-center">
      <span className="rounded-full border border-neon/40 bg-neon/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em] text-neon">
        {label}
      </span>
    </div>
  )
}

function PricingRow({
  option,
  joinLink,
  actionLabel,
}: {
  option: MembershipOption
  joinLink: string | null
  actionLabel: string
}) {
  const content = (
    <>
      <div className="min-w-0 flex-1">
        <span className="block font-medium text-white transition-colors group-hover:text-neon">
          {option.name}
        </span>
        {option.subLabel ? (
          <span className="mt-1 block text-xs uppercase tracking-[0.14em] text-white/45">
            {option.subLabel}
          </span>
        ) : null}
      </div>

      <div className="shrink-0 text-right">
        <span className="font-heading text-xl font-bold tracking-tight text-neon sm:text-2xl">
          {option.price}
        </span>
        {option.priceNote ? (
          <span className="ml-1 text-xs font-medium text-white/50">
            {option.priceNote}
          </span>
        ) : null}
        <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35 transition-colors group-hover:text-neon/70">
          {actionLabel}
        </span>
      </div>
    </>
  )

  const rowClasses = cn(
    'group flex w-full items-center justify-between gap-4 border-t border-white/10 py-5 text-left transition-colors',
    joinLink &&
      'hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon/60'
  )

  if (!joinLink) {
    return <div className={rowClasses}>{content}</div>
  }

  return (
    <a
      href={joinLink}
      target="_blank"
      rel="noopener noreferrer"
      className={rowClasses}
    >
      {content}
    </a>
  )
}

function PricingColumn({
  label,
  options,
  joinLink,
  actionLabel,
}: {
  label: string
  options: readonly MembershipOption[]
  joinLink: string | null
  actionLabel: string
}) {
  return (
    <div className="flex flex-col border-t border-white/15 pt-6">
      <CategoryHeader label={label} />
      <div className="flex flex-col">
        {options.map((option) => (
          <PricingRow
            key={option.slug}
            option={option}
            joinLink={joinLink}
            actionLabel={actionLabel}
          />
        ))}
      </div>
    </div>
  )
}

function PresaleBanner({ location }: { location: GymLocation }) {
  return (
    <SectionReveal className="relative z-10 mb-10 border border-neon/25 bg-carbon/70 px-5 py-5 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neon">
        {location.name} Pre-Sale
      </p>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">
        {location.presaleNote}
      </p>
      {location.openingTarget ? (
        <PresaleCountdown target={location.openingTarget} className="mt-5" />
      ) : null}
    </SectionReveal>
  )
}

export function Pricing() {
  const { location } = useLocation()
  const options = location.membershipOptions
  const joinLink = isJoinLinkReady(location.joinLink) ? location.joinLink : null
  const actionLabel = joinLink ? 'Join Now' : 'Pre-Sale'

  const recurring = options.filter((option) => option.category === 'recurring')
  const singlePayment = options.filter(
    (option) => option.category === 'single_payment'
  )

  // A short pre-sale list reads better as one column than as two sparse ones.
  const splitColumns =
    options.length > 3 && recurring.length > 0 && singlePayment.length > 0

  return (
    <section
      id={SECTION_IDS.pricing}
      className="relative isolate scroll-mt-32 overflow-hidden bg-[#0d0d0d] py-20 sm:py-28"
    >
      <GrainOverlay />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionReveal className="relative z-20 mb-12 bg-[#0d0d0d] md:mb-16">
          <p className="text-sm uppercase tracking-[0.22em] text-neon">
            Join The Floor
          </p>
          <h2
            id="pricing-heading"
            className="mt-3 max-w-3xl font-heading text-4xl uppercase tracking-tight text-white sm:text-5xl"
          >
            Membership Options
          </h2>
          <p className="mt-3 text-sm uppercase tracking-[0.16em] text-white/45">
            {location.name}
          </p>
        </SectionReveal>

        {location.status === 'presale' ? (
          <PresaleBanner location={location} />
        ) : null}

        {splitColumns ? (
          <div className="relative z-10 grid gap-10 lg:grid-cols-2 lg:gap-12">
            <PricingColumn
              label="Recurring"
              options={recurring}
              joinLink={joinLink}
              actionLabel={actionLabel}
            />
            <PricingColumn
              label="Single Payment"
              options={singlePayment}
              joinLink={joinLink}
              actionLabel={actionLabel}
            />
          </div>
        ) : (
          <div className="relative z-10 max-w-3xl">
            <PricingColumn
              label={
                location.status === 'presale'
                  ? 'Founding Member Pricing'
                  : 'Memberships'
              }
              options={options}
              joinLink={joinLink}
              actionLabel={actionLabel}
            />
          </div>
        )}

        <SectionReveal className="mt-10 border border-neon/20 bg-carbon/70 px-5 py-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neon">
            Discounts Available
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            {PRICING_DISCOUNT_NOTE}
          </p>
        </SectionReveal>

        {location.status === 'open' ? (
          <SectionReveal className="mt-6">
            <p className="text-xs leading-relaxed text-white/45">
              {PRICING_FOOTER_NOTE}
            </p>
          </SectionReveal>
        ) : null}
      </div>
    </section>
  )
}
