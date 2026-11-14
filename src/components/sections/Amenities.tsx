'use client'

import Image from 'next/image'
import { SECTION_IDS } from '@/lib/sections'
import { SectionReveal } from '@/components/motion'
import { SectionHeading } from '@/components/section-heading'
import { TourPrompt } from '@/components/tour-prompt'
import { cn } from '@/lib/utils'

const AMENITIES = [
  {
    numeral: '01',
    title: 'Showers',
    description:
      'Spacious locker rooms with premium showers — rinse off and head out feeling fresh after every session.',
    image: {
      src: '/images/showers.png',
      alt: 'Private shower and restroom at Paradise Gym',
    },
  },
  {
    numeral: '02',
    title: 'Infrared Saunas',
    description:
      'Recover faster with infrared heat built into your membership. No add-on fees, no reservation hassles.',
    image: {
      src: '/images/sauna.png',
      alt: 'Paradise Gym infrared sauna recovery room',
    },
  },
  {
    numeral: '03',
    title: 'Posing Room',
    description:
      'Dedicated posing room with optimal lighting for check-ins, progress pics, and prep — included for all members.',
    image: {
      src: '/images/posing-room.png',
      alt: 'Dedicated posing room with mirrors at Paradise Gym',
    },
  },
] as const

function AmenityRow({
  numeral,
  title,
  description,
  image,
  flip,
}: {
  numeral: string
  title: string
  description: string
  image: { src: string; alt: string }
  flip?: boolean
}) {
  return (
    <SectionReveal>
      <article className="grid items-center gap-5 border-t border-white/10 py-8 lg:grid-cols-12 lg:gap-16 lg:py-16">
        <div className={cn('lg:col-span-6', flip && 'lg:order-2')}>
          <div className="group relative aspect-[16/10] overflow-hidden bg-carbon ring-1 ring-white/10 lg:aspect-[4/3]">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              sizes="(max-width: 1024px) 100vw, 42vw"
            />
          </div>
        </div>
        <div className={cn('lg:col-span-5', flip ? 'lg:order-1' : 'lg:col-start-8')}>
          <p className="text-xs font-medium tabular-nums text-text-3">{numeral}</p>
          <h3 className="mt-2 font-sans text-[clamp(1.5rem,5vw,2rem)] font-medium leading-tight tracking-[-0.02em] text-white lg:text-[clamp(1.75rem,3vw,2.5rem)]">
            {title}
          </h3>
          <p className="mt-4 max-w-md text-base leading-relaxed text-text-2">{description}</p>
          <p className="mt-6 flex items-center gap-2 text-xs font-medium tracking-[0.08em] text-text-3">
            <span aria-hidden className="size-1.5 rounded-full bg-neon" />
            Included in Membership
          </p>
        </div>
      </article>
    </SectionReveal>
  )
}

export function Amenities() {
  return (
    <section
      id={SECTION_IDS.amenities}
      className="relative scroll-mt-24 overflow-hidden bg-surface py-16 sm:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionReveal>
          <SectionHeading
            eyebrow="Member perks"
            title="Included with every membership"
            description="Showers, infrared sauna, and a posing room. No add-on fees."
          />
        </SectionReveal>

        <div className="mt-12 lg:mt-16">
          {AMENITIES.map((amenity, index) => (
            <AmenityRow key={amenity.numeral} {...amenity} flip={index === 1} />
          ))}
        </div>

        <div className="mt-4 border-t border-white/10 pt-10">
          <TourPrompt>Not ready? Book a free tour</TourPrompt>
        </div>
      </div>
    </section>
  )
}
