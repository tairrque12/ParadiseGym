'use client'

import {
  GrainOverlay,
  SectionReveal,
  StaggerContainer,
  StaggerItem,
} from '@/components/motion'
import { useModal } from '@/context/modal-context'
import { PRICING_TIERS } from '@/lib/pricing'
import { SECTION_IDS } from '@/lib/sections'
import { cn } from '@/lib/utils'

function PopularRibbon() {
  return (
    <span className="inline-block bg-neon px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-carbon [clip-path:polygon(0_0,100%_0,92%_100%,0_100%)]">
      Most Popular
    </span>
  )
}

function FeatureList({ features }: { features: readonly string[] }) {
  return (
    <ul className="mt-6 flex flex-col">
      {features.map((feature, index) => (
        <li
          key={feature}
          className={cn(
            'py-3 text-sm leading-snug text-white/65',
            index > 0 && 'border-t border-neon/15'
          )}
        >
          {feature}
        </li>
      ))}
    </ul>
  )
}

function GetStartedButton({
  tierSlug,
  popular,
}: {
  tierSlug: string
  popular: boolean
}) {
  const { openMembershipModal } = useModal()

  const handleClick = () => {
    openMembershipModal(tierSlug)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'inline-flex w-full items-center justify-center px-4 py-3 text-sm font-semibold uppercase tracking-wider transition-all duration-300',
        popular
          ? 'bg-neon text-carbon hover:scale-[1.02] hover:shadow-neon'
          : 'border border-neon bg-transparent text-white hover:bg-neon/10 hover:shadow-neon-sm'
      )}
    >
      Get Started
    </button>
  )
}

export function Pricing() {
  return (
    <section
      id={SECTION_IDS.pricing}
      className="relative scroll-mt-24 bg-[#0d0d0d] py-20 sm:py-28"
    >
      <GrainOverlay />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionReveal className="mb-12 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-neon">
              Join The Floor
            </p>
            <h2
              id="pricing-heading"
              className="mt-3 font-heading text-4xl uppercase tracking-tight text-white sm:text-5xl"
            >
              Membership Options
            </h2>
          </div>
          <p className="max-w-sm text-sm text-white/55">
            {/* PLACEHOLDER: Client will confirm real membership pricing before launch. */}
            Placeholder tiers below — final pricing TBD with gym owner.
          </p>
        </SectionReveal>

        <StaggerContainer className="grid items-end gap-8 lg:grid-cols-3 lg:gap-6">
          {PRICING_TIERS.map((tier) => (
            <StaggerItem key={tier.name}>
              <article
                data-popular={tier.popular ? 'true' : 'false'}
                className={cn(
                  'flex h-full flex-col px-1 pb-2 pt-0',
                  tier.popular
                    ? 'relative z-10 -translate-y-4 border border-neon bg-carbon/90 px-5 pb-6 pt-5 shadow-[0_-12px_48px_rgba(57,255,20,0.14)] md:-translate-y-6'
                    : 'rounded-none border-t border-white/20 bg-transparent'
                )}
              >
                {tier.popular && (
                  <div className="mb-4">
                    <PopularRibbon />
                  </div>
                )}

                <h3 className="font-heading text-2xl uppercase tracking-tight text-white">
                  {tier.name}
                </h3>

                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-heading text-5xl tracking-tight text-white">
                    {tier.price}
                  </span>
                  <span className="text-sm text-white/50">{tier.period}</span>
                </div>

                <FeatureList features={tier.features} />

                <div className="mt-auto pt-8">
                  <GetStartedButton
                    tierSlug={tier.slug}
                    popular={tier.popular}
                  />
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
