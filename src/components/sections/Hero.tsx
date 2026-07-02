'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Wordmark } from '@/components/Logo'
import { NeonButton } from '@/components/NeonButton'
import { GrainOverlay } from '@/components/motion'
import { useModal } from '@/context/modal-context'
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion'

export function Hero() {
  const { openMembershipModal, openTourModal } = useModal()
  const reducedMotion = usePrefersReducedMotion()
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], ['0%', reducedMotion ? '0%' : '18%'])

  return (
    <section className="relative isolate z-0 min-h-[100svh] overflow-hidden bg-carbon">
      <motion.div className="absolute inset-0 will-change-transform" style={{ y }}>
        <Image
          src="/images/paradise-gym-logo.png"
          alt="Paradise Gym"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-carbon/20 via-transparent to-carbon/90" />
      <GrainOverlay />

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-4 pb-20 pt-28 sm:px-6 sm:pb-28 lg:px-8">
        <div className="max-w-4xl">
          <Wordmark />
          <p className="mt-4 max-w-xl text-lg text-white/75 sm:mt-6 sm:text-xl">
            Where Strength Meets Aesthetics
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row sm:items-center">
            <NeonButton onClick={() => openMembershipModal(null)}>
              Request Membership
            </NeonButton>
            <NeonButton onClick={openTourModal} variant="outline">
              Free Gym Tour
            </NeonButton>
          </div>
        </div>
      </div>
    </section>
  )
}
