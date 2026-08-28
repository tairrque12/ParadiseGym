import Image from 'next/image'
import { NeonButton } from '@/components/NeonButton'
import { GrainOverlay } from '@/components/motion'
import { LOCATIONS } from '@/lib/locations'
import { SECTION_IDS } from '@/lib/sections'

export function McAllenHero() {
  const mcallen = LOCATIONS.mcallen

  return (
    <section className="relative isolate z-0 overflow-hidden bg-carbon">
      <Image
        src="/images/hero-gym-floor.png"
        alt="Paradise Gym training floor with neon green equipment and lighting"
        fill
        priority
        className="object-cover object-[center_30%]"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-carbon/60 via-carbon/40 to-carbon/95" />
      <GrainOverlay />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-32 sm:px-6 sm:pb-20 sm:pt-40 lg:px-8">
        <div className="max-w-4xl">
          <span className="inline-flex items-center rounded-full bg-neon px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-carbon">
            Pre-Sale Now Open
          </span>

          <h1 className="mt-5 font-heading text-[clamp(2.5rem,10vw,6rem)] uppercase leading-[0.9] tracking-[0.04em] text-white">
            Paradise Gym
            <span className="block text-neon">McAllen</span>
          </h1>

          <p className="mt-4 max-w-xl text-lg text-white/75 sm:mt-6 sm:text-xl">
            {mcallen.sqft.toLocaleString('en-US')} sq ft of custom-built
            training, coming to {mcallen.address.split(',')[1]?.trim()}.
          </p>

          <p
            data-testid="grand-opening-note"
            className="mt-6 font-heading text-2xl uppercase leading-tight tracking-tight text-neon sm:text-3xl lg:text-4xl"
          >
            {mcallen.grandOpeningNote}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row sm:items-center">
            <NeonButton
              href={mcallen.joinLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {mcallen.ctaLabel}
            </NeonButton>
            <NeonButton href={`#${SECTION_IDS.pricing}`} variant="outline">
              View Pre-Sale Pricing
            </NeonButton>
          </div>
        </div>
      </div>
    </section>
  )
}
