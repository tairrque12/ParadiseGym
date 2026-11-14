'use client'

import { useCallback } from 'react'
import { LOCATIONS, type GymLocation } from '@/lib/locations'
import { detectMapsPlatform, getMapsUrl } from '@/lib/maps'
import { SECTION_IDS } from '@/lib/sections'
import { SectionReveal } from '@/components/motion'
import { SectionHeading } from '@/components/section-heading'

export function HoursLocation({
  location = LOCATIONS.harlingen,
}: {
  location?: GymLocation
}) {
  const { address, hours } = location

  const openMaps = useCallback(() => {
    const platform = detectMapsPlatform(navigator.userAgent)
    const url = getMapsUrl(address, platform)
    window.open(url, '_blank', 'noopener,noreferrer')
  }, [address])

  return (
    <section
      id={SECTION_IDS.hours}
      className="relative scroll-mt-32 bg-carbon py-24 sm:py-28 lg:py-32"
    >
      <div id={SECTION_IDS.tour} className="scroll-mt-32" aria-hidden />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionReveal>
          <SectionHeading
            eyebrow="Visit"
            title="Hours & location"
            description={`${location.name} · ${location.sqft.toLocaleString('en-US')} sq ft`}
          />
        </SectionReveal>

        <div className="mt-14 grid gap-14 lg:mt-16 lg:grid-cols-2 lg:gap-24">
          <SectionReveal>
            <h3 className="text-sm font-medium text-text-2">Gym hours</h3>
            {hours ? (
              <dl className="mt-5">
                {hours.map((row) => (
                  <div
                    key={row.days}
                    className="grid grid-cols-[minmax(7.5rem,1fr)_auto] items-baseline gap-6 border-b border-white/10 py-4"
                  >
                    <dt className="text-base text-text-2">{row.days}</dt>
                    <dd className="text-right text-base font-medium tabular-nums text-white">
                      {row.time}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <div className="mt-5 border border-white/10 p-6">
                <p className="text-xl font-medium tracking-tight text-white">Hours coming soon</p>
                <p className="mt-2 text-sm leading-relaxed text-text-2">
                  Full schedule announced closer to opening day.
                </p>
              </div>
            )}
          </SectionReveal>

          <SectionReveal delay={0.08}>
            <h3 className="text-sm font-medium text-text-2">Find us</h3>
            <p className="mt-5 max-w-sm text-xl font-medium leading-snug tracking-tight text-white sm:text-2xl">
              {address}
            </p>
            <button
              type="button"
              onClick={openMaps}
              className="mt-5 inline-flex min-h-11 items-center text-sm font-medium text-white underline decoration-white/30 underline-offset-4 transition-colors duration-200 hover:decoration-neon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon/70 motion-reduce:transition-none"
            >
              Get directions
            </button>

            <div className="relative mt-8 aspect-[16/10] overflow-hidden ring-1 ring-white/15">
              <iframe
                title={`Paradise Gym ${location.name} location map`}
                className="h-full w-full [filter:grayscale(1)_invert(0.9)_contrast(1.05)_brightness(1.55)]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
              />
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  )
}
