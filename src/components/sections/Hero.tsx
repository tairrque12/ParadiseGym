'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Wordmark } from '@/components/Logo'
import { NeonButton } from '@/components/NeonButton'
import { GrainOverlay } from '@/components/motion'
import { useModal } from '@/context/modal-context'
import { ABC_CHECKOUT_NOTE, LOCATIONS, TOUR_FALLBACK_LABEL } from '@/lib/locations'
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion'

export function Hero() {
  const { openTourModal } = useModal()
  const harlingen = LOCATIONS.harlingen
  const reducedMotion = usePrefersReducedMotion()
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], ['0%', reducedMotion ? '0%' : '18%'])

  return (
    <section className="relative isolate z-0 min-h-[100svh] overflow-hidden bg-carbon">
      <motion.div className="absolute inset-0 will-change-transform" style={{ y }}>
        <Image
          src="/images/hero-gym-floor.png"
          alt="Paradise Gym training floor with neon green equipment and lighting"
          fill
          priority
          className="object-cover object-[center_30%]"
          sizes="100vw"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-carbon/50 via-carbon/25 to-carbon/95" />
      <GrainOverlay />

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-4 pb-20 pt-28 sm:px-6 sm:pb-28 lg:px-8">
        <div className="max-w-4xl">
          <Wordmark />
          <p className="mt-4 max-w-xl text-lg text-white/75 sm:mt-6 sm:text-xl">
            Where Strength Meets Aesthetics
          </p>
          <div className="mt-8 flex flex-col items-start gap-4 sm:mt-10">
            <div className="flex flex-col items-start gap-2">
              <NeonButton
                href={harlingen.joinLink}
                target="_blank"
                rel="noopener noreferrer"
                className="normal-case tracking-normal"
                testId="hero-join"
                membership={{ location: 'harlingen', placement: 'hero' }}
              >
                {harlingen.ctaLabel}
              </NeonButton>
              <p className="max-w-sm text-sm text-white/80">{ABC_CHECKOUT_NOTE}</p>
            </div>
            <NeonButton
              onClick={() => openTourModal('hero')}
              variant="outline"
              className="normal-case tracking-normal"
            >
              {TOUR_FALLBACK_LABEL}
            </NeonButton>
          </div>
        </div>
      </div>
    </section>
  )
}
