import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  GrainOverlay,
  SectionReveal,
  StaggerContainer,
  StaggerItem,
} from '@/components/motion'
import { PRICING_TIERS } from '@/lib/pricing'
import { SECTION_IDS } from '@/lib/sections'
import { cn } from '@/lib/utils'

export function Pricing() {
  return (
    <section
      id={SECTION_IDS.pricing}
      className="relative scroll-mt-24 bg-[#0d0d0d] py-20 sm:py-28"
    >
      <div id={SECTION_IDS.membership} className="scroll-mt-24" aria-hidden />
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

        <StaggerContainer className="grid gap-6 lg:grid-cols-3 lg:gap-5">
          {PRICING_TIERS.map((tier) => (
            <StaggerItem key={tier.name}>
              <Card
                data-popular={tier.popular ? 'true' : 'false'}
                className={cn(
                  'h-full rounded-sm border-white/10 bg-carbon/80 text-white ring-0',
                  tier.popular &&
                    'border-neon shadow-neon-sm lg:-translate-y-3'
                )}
              >
                <CardHeader className="space-y-3">
                  {tier.popular && (
                    <Badge className="w-fit rounded-sm bg-neon px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-carbon hover:bg-neon">
                      Most Popular
                    </Badge>
                  )}
                  <CardTitle className="font-heading text-2xl uppercase tracking-tight">
                    {tier.name}
                  </CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="font-heading text-5xl tracking-tight text-white">
                      {tier.price}
                    </span>
                    <span className="text-sm text-white/50">{tier.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-white/70">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex gap-2">
                        <span className="text-neon" aria-hidden>
                          —
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link
                    href={`#${SECTION_IDS.membership}`}
                    className={cn(
                      'inline-flex w-full items-center justify-center rounded-sm px-4 py-3 text-sm font-semibold uppercase tracking-wider transition-all duration-300',
                      tier.popular
                        ? 'bg-neon text-carbon hover:scale-[1.02] hover:shadow-neon'
                        : 'border border-white/20 text-white hover:border-neon hover:text-neon hover:shadow-neon-sm'
                    )}
                  >
                    Get Started
                  </Link>
                </CardFooter>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
