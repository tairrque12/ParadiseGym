'use client'

import Image from 'next/image'
import { GALLERY_IMAGES } from '@/lib/gallery'
import { SECTION_IDS } from '@/lib/sections'
import { GrainOverlay, SectionReveal, StaggerContainer, StaggerItem } from '@/components/motion'
import { cn } from '@/lib/utils'

function GalleryImage({
  src,
  alt,
  span,
}: {
  src: string
  alt: string
  span: 'default' | 'wide' | 'tall'
}) {
  return (
    <figure
      className={cn(
        'group relative overflow-hidden border border-white/10 bg-[#111111]',
        span === 'wide' && 'sm:col-span-2',
        span === 'tall' && 'sm:row-span-2'
      )}
    >
      <div
        className={cn(
          'relative w-full',
          span === 'tall' ? 'aspect-[3/4] sm:h-full sm:min-h-[28rem] sm:aspect-auto' : 'aspect-[4/3]'
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-carbon/50 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
      </div>
    </figure>
  )
}

export function Gallery() {
  return (
    <section
      id={SECTION_IDS.gallery}
      className="relative scroll-mt-24 overflow-hidden bg-carbon py-20 sm:py-28"
    >
      <GrainOverlay />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionReveal className="mb-10 max-w-2xl md:mb-14">
          <p className="text-sm uppercase tracking-[0.22em] text-neon">Inside Paradise</p>
          <h2 className="mt-3 font-heading text-4xl uppercase tracking-tight text-white sm:text-5xl lg:text-6xl">
            The Gym
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/65 sm:text-base">
            7,500 sq ft of custom-built equipment, neon-lit training space, and a floor
            built for lifters who show up to work.
          </p>
        </SectionReveal>

        <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
          {GALLERY_IMAGES.map((image) => (
            <StaggerItem key={image.src}>
              <GalleryImage src={image.src} alt={image.alt} span={image.span} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
