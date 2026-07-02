import { TESTIMONIALS } from '@/lib/reviews'
import { SECTION_IDS } from '@/lib/sections'
import {
  GrainOverlay,
  SectionReveal,
  StaggerContainer,
  StaggerItem,
} from '@/components/motion'
import { cn } from '@/lib/utils'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} stars`}>
      {Array.from({ length: rating }).map((_, index) => (
        <svg
          key={index}
          viewBox="0 0 20 20"
          className="h-3 w-3 fill-neon"
          aria-hidden
        >
          <path d="M10 1.5 12.59 7 19 7.9l-4.5 4.4 1.06 6.2L10 15.8 4.44 18.5 5.5 12.3 1 7.9l6.41-.9L10 1.5Z" />
        </svg>
      ))}
    </div>
  )
}

type ReviewCardProps = {
  name: string
  rating: number
  quote: string
  variant: 'accent-top' | 'borderless'
  className?: string
}

function ReviewCard({
  name,
  rating,
  quote,
  variant,
  className,
}: ReviewCardProps) {
  return (
    <figure
      className={cn(
        'relative px-1',
        variant === 'accent-top' && 'border-t-2 border-neon/50 pt-6',
        variant === 'borderless' && 'pt-2',
        className
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -left-1 -top-4 select-none font-heading text-[clamp(3.5rem,10vw,5.5rem)] leading-none text-[#1a3d12]/70"
      >
        &ldquo;
      </span>

      <div className="relative">
        <StarRating rating={rating} />
        <blockquote className="mt-5 text-lg font-medium leading-snug tracking-tight text-white/90 sm:text-xl">
          {quote}
        </blockquote>
        <figcaption className="mt-6 text-[10px] uppercase tracking-[0.2em] text-neon/80">
          {name}
        </figcaption>
      </div>
    </figure>
  )
}

const LEFT_COLUMN = [
  { index: 0, variant: 'accent-top' as const, offset: '' },
  { index: 2, variant: 'borderless' as const, offset: 'lg:translate-y-10' },
]

const RIGHT_COLUMN = [
  { index: 1, variant: 'borderless' as const, offset: 'sm:mt-10 lg:mt-14' },
  { index: 3, variant: 'accent-top' as const, offset: 'lg:translate-y-6' },
]

export function Reviews() {
  return (
    <section
      id={SECTION_IDS.reviews}
      className="relative scroll-mt-24 overflow-hidden bg-carbon py-20 sm:py-28"
    >
      <GrainOverlay />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <SectionReveal className="lg:col-span-4">
            <p className="text-sm uppercase tracking-[0.22em] text-neon">
              Member Voices
            </p>
            <h2 className="mt-3 font-heading text-4xl uppercase leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-6xl">
              What Our Members Say
            </h2>
            {/* PLACEHOLDER: Demo testimonials — replace with real member reviews before launch. */}
          </SectionReveal>

          <StaggerContainer className="grid gap-10 sm:grid-cols-2 lg:col-span-8 lg:gap-12">
            <div className="flex flex-col gap-12 sm:gap-14">
              {LEFT_COLUMN.map(({ index, variant, offset }) => {
                const review = TESTIMONIALS[index]
                return (
                  <StaggerItem key={review.name} className={offset}>
                    <ReviewCard
                      name={review.name}
                      rating={review.rating}
                      quote={review.quote}
                      variant={variant}
                    />
                  </StaggerItem>
                )
              })}
            </div>

            <div className="flex flex-col gap-12 sm:gap-14">
              {RIGHT_COLUMN.map(({ index, variant, offset }) => {
                const review = TESTIMONIALS[index]
                return (
                  <StaggerItem key={review.name} className={offset}>
                    <ReviewCard
                      name={review.name}
                      rating={review.rating}
                      quote={review.quote}
                      variant={variant}
                    />
                  </StaggerItem>
                )
              })}
            </div>
          </StaggerContainer>
        </div>
      </div>
    </section>
  )
}
