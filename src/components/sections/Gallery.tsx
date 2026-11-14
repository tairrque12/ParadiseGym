'use client'

import Image from 'next/image'
import { GALLERY_IMAGES, GALLERY_IMAGE_SIZES } from '@/lib/gallery'
import { SectionReveal } from '@/components/motion'
import { SectionHeading } from '@/components/section-heading'
import { TourPrompt } from '@/components/tour-prompt'
import { cn } from '@/lib/utils'

function GalleryImage({
  src,
  alt,
  span,
  priority = false,
}: {
  src: string
  alt: string
  span: 'default' | 'wide' | 'tall'
  priority?: boolean
}) {
  return (
    <figure
      className={cn(
        'group relative overflow-hidden bg-surface ring-1 ring-white/10',
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
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          sizes={GALLERY_IMAGE_SIZES}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-carbon/50 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
      </div>
    </figure>
  )
}

export function Gallery() {
  return (
    <section className="relative scroll-mt-32 overflow-hidden bg-carbon py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionReveal className="mb-12 max-w-2xl lg:mb-16">
          <SectionHeading
            titleAs="h1"
            eyebrow="Inside Paradise"
            title="The gym"
            description="7,500 sq ft of custom-built equipment, neon-lit training space, and a floor built for lifters who show up to work."
          />
        </SectionReveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
          {GALLERY_IMAGES.map((image) => (
            <div key={image.src}>
              <GalleryImage
                src={image.src}
                alt={image.alt}
                span={image.span}
                priority={'priority' in image && image.priority}
              />
            </div>
          ))}
        </div>

        <div className="mt-10">
          <TourPrompt>Not ready? Book a free tour</TourPrompt>
        </div>
      </div>
    </section>
  )
}
