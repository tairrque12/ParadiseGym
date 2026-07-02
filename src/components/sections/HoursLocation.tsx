'use client'

import { useCallback } from 'react'
import { MapPin } from 'lucide-react'
import { CONTACT, HOURS } from '@/lib/contact'
import { detectMapsPlatform, getMapsUrl } from '@/lib/maps'
import { SECTION_IDS } from '@/lib/sections'
import { GrainOverlay, SectionReveal } from '@/components/motion'

export function HoursLocation() {
  const openMaps = useCallback(() => {
    const platform = detectMapsPlatform(navigator.userAgent)
    const url = getMapsUrl(CONTACT.address, platform)
    window.open(url, '_blank', 'noopener,noreferrer')
  }, [])

  return (
    <section
      id={SECTION_IDS.hours}
      className="relative scroll-mt-24 bg-[#0d0d0d] py-20 sm:py-28"
    >
      <div id={SECTION_IDS.tour} className="scroll-mt-24" aria-hidden />
      <GrainOverlay />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionReveal className="mb-12">
          <p className="text-sm uppercase tracking-[0.22em] text-neon">
            Visit Us
          </p>
          <h2 className="mt-3 font-heading text-4xl uppercase tracking-tight text-white sm:text-5xl">
            Hours &amp; Location
          </h2>
        </SectionReveal>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <SectionReveal>
            <h3 className="mb-6 text-sm uppercase tracking-[0.18em] text-white/50">
              Gym Hours
            </h3>
            <table className="w-full text-left">
              <tbody>
                {HOURS.map((row) => (
                  <tr
                    key={row.days}
                    className="border-b border-white/10 last:border-0"
                  >
                    <th
                      scope="row"
                      className="py-4 pr-6 font-normal text-white/80"
                    >
                      {row.days}
                    </th>
                    <td className="py-4 font-heading text-lg tracking-tight text-white">
                      {row.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <h3 className="mb-6 text-sm uppercase tracking-[0.18em] text-white/50">
              Find Us
            </h3>
            <button
              type="button"
              onClick={openMaps}
              className="group flex w-full items-start gap-4 border border-white/10 bg-carbon p-6 text-left transition-colors hover:border-neon/50"
            >
              <MapPin
                className="mt-1 h-5 w-5 shrink-0 text-neon"
                aria-hidden
              />
              <span>
                <span className="block font-heading text-xl uppercase tracking-tight text-white group-hover:text-neon">
                  Get Directions
                </span>
                <span className="mt-2 block text-sm leading-relaxed text-white/65">
                  {CONTACT.address}
                </span>
              </span>
            </button>

            <div className="relative mt-6 aspect-[16/10] overflow-hidden border border-white/10 bg-carbon">
              <iframe
                title="Paradise Gym location map"
                className="h-full w-full grayscale invert opacity-80"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(CONTACT.address)}&output=embed`}
              />
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  )
}
