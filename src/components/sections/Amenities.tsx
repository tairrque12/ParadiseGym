import { Droplets, Flame, Camera } from 'lucide-react'
import { SECTION_IDS } from '@/lib/sections'
import {
  GrainOverlay,
  SectionReveal,
  StaggerContainer,
  StaggerItem,
} from '@/components/motion'

const AMENITIES = [
  {
    icon: Droplets,
    title: 'Showers',
    description:
      'Spacious locker rooms with premium showers — rinse off and head out feeling fresh after every session.',
    offset: 'md:translate-y-8',
  },
  {
    icon: Flame,
    title: 'Infrared Saunas',
    description:
      'Recover faster with infrared heat built into your membership. No add-on fees, no reservation hassles.',
    offset: 'md:-translate-y-4',
  },
  {
    icon: Camera,
    title: 'Posing Room',
    description:
      'Dedicated posing room with optimal lighting for check-ins, progress pics, and prep — included for all members.',
    offset: 'md:translate-y-12',
  },
] as const

export function Amenities() {
  return (
    <section
      id={SECTION_IDS.amenities}
      className="relative scroll-mt-24 overflow-hidden bg-carbon py-20 sm:py-28"
    >
      <GrainOverlay />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionReveal className="mb-14 max-w-2xl md:mb-20">
          <p className="text-sm uppercase tracking-[0.22em] text-neon">
            Member Perks
          </p>
          <h2 className="mt-3 font-heading text-4xl uppercase tracking-tight text-white sm:text-5xl lg:text-6xl">
            Included With Every Membership
          </h2>
        </SectionReveal>

        <StaggerContainer className="grid gap-8 md:grid-cols-12 md:gap-6">
          {AMENITIES.map((item, index) => (
            <StaggerItem
              key={item.title}
              className={`md:col-span-4 ${item.offset}`}
            >
              <article
                className={`group relative border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-neon/40 sm:p-8 ${
                  index === 1 ? 'md:border-neon/30 md:bg-neon/[0.03]' : ''
                }`}
              >
                <item.icon
                  className="mb-5 h-8 w-8 text-neon"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <h3 className="font-heading text-2xl uppercase tracking-tight text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65 sm:text-base">
                  {item.description}
                </p>
                <p className="mt-4 text-xs uppercase tracking-[0.16em] text-neon/80">
                  Included in membership
                </p>
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
