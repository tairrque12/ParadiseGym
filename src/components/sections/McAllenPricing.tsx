import { ArrowUpRight } from 'lucide-react'
import { GrainOverlay, SectionReveal } from '@/components/motion'
import { LOCATIONS } from '@/lib/locations'
import { PRICING_DISCOUNT_NOTE } from '@/lib/membership-options'
import { SECTION_IDS } from '@/lib/sections'

export function McAllenPricing() {
  const mcallen = LOCATIONS.mcallen

  return (
    <section
      id={SECTION_IDS.pricing}
      className="relative isolate scroll-mt-32 overflow-hidden bg-[#0d0d0d] py-16 sm:py-24"
    >
      <GrainOverlay />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionReveal className="mb-10 md:mb-14">
          <p className="text-sm uppercase tracking-[0.22em] text-neon">
            Founding Members
          </p>
          <h2 className="mt-3 max-w-4xl font-heading text-4xl uppercase leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Pre-Sale Membership Options
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70">
            {mcallen.presaleNote}
          </p>
        </SectionReveal>

        <div className="grid gap-5 md:grid-cols-3 md:gap-6">
          {mcallen.membershipOptions.map((option) => (
            <a
              key={option.slug}
              href={mcallen.joinLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between border border-white/12 bg-carbon/60 p-6 transition-colors hover:border-neon/60 hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon/60 sm:p-8"
            >
              <div>
                <span className="block text-sm font-medium uppercase tracking-[0.14em] text-white/70 transition-colors group-hover:text-white">
                  {option.name}
                </span>

                <span className="mt-5 block font-heading text-5xl leading-none tracking-tight text-neon sm:text-6xl">
                  {option.price}
                </span>

                {option.priceNote ? (
                  <span className="mt-2 block text-sm font-medium text-white/50">
                    {option.priceNote}
                  </span>
                ) : null}

                {option.subLabel ? (
                  <span className="mt-3 block text-xs uppercase tracking-[0.16em] text-white/45">
                    {option.subLabel}
                  </span>
                ) : null}
              </div>

              <span className="mt-8 inline-flex items-center justify-center gap-2 rounded-sm bg-neon px-5 py-3 text-sm font-semibold uppercase tracking-wider text-carbon transition-shadow group-hover:shadow-neon">
                Join Now
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </span>
            </a>
          ))}
        </div>

        <SectionReveal className="mt-10 border border-neon/20 bg-carbon/70 px-5 py-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neon">
            Discounts Available
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            {PRICING_DISCOUNT_NOTE}
          </p>
        </SectionReveal>
      </div>
    </section>
  )
}
