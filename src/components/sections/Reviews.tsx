import { Star } from 'lucide-react'
import { TESTIMONIALS } from '@/lib/reviews'
import { SECTION_IDS } from '@/lib/sections'
import {
  GrainOverlay,
  SectionReveal,
  StaggerContainer,
  StaggerItem,
} from '@/components/motion'

export function Reviews() {
  return (
    <section
      id={SECTION_IDS.reviews}
      className="relative scroll-mt-24 overflow-hidden bg-carbon py-20 sm:py-28"
    >
      <GrainOverlay />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <SectionReveal className="lg:col-span-4">
            <p className="text-sm uppercase tracking-[0.22em] text-neon">
              Member Voices
            </p>
            <h2 className="mt-3 font-heading text-4xl uppercase leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-6xl">
              What Our Members Say
            </h2>
            {/* PLACEHOLDER: Demo testimonials — replace with real member reviews before launch. */}
          </SectionReveal>

          <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:col-span-8">
            {TESTIMONIALS.map((review, index) => (
              <StaggerItem
                key={review.name}
                className={index === 1 ? 'sm:translate-y-6' : ''}
              >
                <figure className="h-full border border-white/10 bg-white/[0.02] p-6">
                  <div className="mb-4 flex gap-1" aria-label={`${review.rating} stars`}>
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-neon text-neon"
                        aria-hidden
                      />
                    ))}
                  </div>
                  <blockquote className="text-sm leading-relaxed text-white/75 sm:text-base">
                    &ldquo;{review.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 text-sm font-medium uppercase tracking-[0.12em] text-neon">
                    {review.name}
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  )
}
