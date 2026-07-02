'use client'

import Image from 'next/image'
import { SECTION_IDS } from '@/lib/sections'
import { GrainOverlay, SectionReveal, SlideReveal } from '@/components/motion'

const AMENITIES = [
  {
    numeral: '01',
    title: 'Showers',
    description:
      'Spacious locker rooms with premium showers — rinse off and head out feeling fresh after every session.',
    align: 'left' as const,
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
    featured: true as const,
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
    align: 'right' as const,
    image: {
      src: '/images/posing-room.png',
      alt: 'Dedicated posing room with mirrors at Paradise Gym',
    },
  },
] as const

function AmenityNumeral({ value }: { value: string }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none select-none font-heading text-[clamp(4rem,12vw,7rem)] leading-none tracking-tight text-[#1a3d12]/80"
    >
      {value}
    </span>
  )
}

function IncludedLabel() {
  return (
    <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-neon">
      Included in Membership
    </p>
  )
}

function AmenityImage({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <div className={`relative aspect-[4/3] overflow-hidden ${className ?? ''}`}>
      <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 40vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-carbon/60 via-transparent to-transparent" />
    </div>
  )
}

function CompactAmenityRow({
  numeral,
  title,
  description,
  align,
  image,
}: {
  numeral: string
  title: string
  description: string
  align: 'left' | 'right'
  image: { src: string; alt: string }
}) {
  const isRight = align === 'right'

  return (
    <SlideReveal from={isRight ? 'right' : 'left'}>
      <article className="grid items-center gap-8 py-8 sm:py-10 lg:grid-cols-12 lg:gap-10">
        <div
          className={`${
            isRight
              ? 'lg:col-span-7 lg:col-start-6 lg:order-2'
              : 'lg:col-span-7 lg:order-1'
          } ${isRight ? 'ml-auto max-w-xl text-right' : 'max-w-xl text-left'}`}
        >
          <div
            className={`mb-2 flex items-end gap-4 ${
              isRight ? 'flex-row-reverse justify-end' : ''
            }`}
          >
            <AmenityNumeral value={numeral} />
          </div>
          <h3 className="font-heading text-3xl uppercase tracking-tight text-white sm:text-4xl">
            {title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-white/65 sm:text-base">
            {description}
          </p>
          <IncludedLabel />
        </div>

        <AmenityImage
          src={image.src}
          alt={image.alt}
          className={
            isRight
              ? 'lg:col-span-5 lg:col-start-1 lg:order-1'
              : 'lg:col-span-5 lg:order-2'
          }
        />
      </article>
    </SlideReveal>
  )
}

function FeaturedSaunaRow({
  image,
}: {
  image: { src: string; alt: string }
}) {
  return (
    <SlideReveal from="left" delay={0.08}>
      <article className="grid items-center gap-8 py-10 lg:grid-cols-12 lg:gap-10 lg:py-14">
        <div className="relative lg:col-span-7">
          <div className="mb-3 flex items-end gap-4">
            <AmenityNumeral value="02" />
          </div>
          <h3 className="font-heading text-4xl uppercase tracking-tight text-white sm:text-5xl lg:text-6xl">
            Infrared Saunas
          </h3>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/65 sm:text-base">
            Recover faster with infrared heat built into your membership. No
            add-on fees, no reservation hassles.
          </p>
          <IncludedLabel />
        </div>

        <AmenityImage
          src={image.src}
          alt={image.alt}
          className="lg:col-span-5"
        />
      </article>
    </SlideReveal>
  )
}

export function Amenities() {
  return (
    <section
      id={SECTION_IDS.amenities}
      className="relative scroll-mt-24 overflow-hidden bg-carbon py-20 sm:py-28"
    >
      <GrainOverlay />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionReveal className="mb-10 max-w-2xl md:mb-16">
          <p className="text-sm uppercase tracking-[0.22em] text-neon">
            Member Perks
          </p>
          <h2 className="mt-3 font-heading text-4xl uppercase tracking-tight text-white sm:text-5xl lg:text-6xl">
            Included With Every Membership
          </h2>
        </SectionReveal>

        <div className="flex flex-col gap-2 sm:gap-4">
          <CompactAmenityRow {...AMENITIES[0]} />
          <FeaturedSaunaRow image={AMENITIES[1].image} />
          <CompactAmenityRow {...AMENITIES[2]} />
        </div>
      </div>
    </section>
  )
}
