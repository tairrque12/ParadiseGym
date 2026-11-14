import { TESTIMONIALS } from '@/lib/reviews'
import { SECTION_IDS } from '@/lib/sections'
import { SectionReveal, StaggerContainer, StaggerItem } from '@/components/motion'
import { SectionHeading } from '@/components/section-heading'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} stars`}>
      {Array.from({ length: rating }).map((_, index) => (
        <svg
          key={index}
          viewBox="0 0 20 20"
          className="h-3 w-3 fill-white/70"
          aria-hidden
        >
          <path d="M10 1.5 12.59 7 19 7.9l-4.5 4.4 1.06 6.2L10 15.8 4.44 18.5 5.5 12.3 1 7.9l6.41-.9L10 1.5Z" />
        </svg>
      ))}
    </div>
  )
}

function ReviewCard({
  name,
  rating,
  quote,
}: {
  name: string
  rating: number
  quote: string
}) {
  return (
    <figure className="flex h-full flex-col border border-white/10 bg-carbon p-6 sm:p-7">
      <StarRating rating={rating} />
      <blockquote className="mt-4 max-w-[38ch] text-base font-sans leading-relaxed text-white/90">
        {quote}
      </blockquote>
      <figcaption className="mt-6 text-sm text-text-3">{name}</figcaption>
    </figure>
  )
}

export function Reviews() {
  return (
    <section
      id={SECTION_IDS.reviews}
      className="relative scroll-mt-24 overflow-hidden bg-surface py-16 sm:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(12rem,16rem)_minmax(0,1fr)] lg:gap-16">
          <SectionReveal>
            <SectionHeading
              eyebrow="Members"
              title="What our members say"
              titleClassName="text-[clamp(1.625rem,2.2vw,2rem)] leading-snug"
            />
          </SectionReveal>

          <StaggerContainer className="grid gap-4 sm:grid-cols-2">
            {TESTIMONIALS.map((review) => (
              <StaggerItem key={review.name} className="h-full">
                <ReviewCard name={review.name} rating={review.rating} quote={review.quote} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  )
}
