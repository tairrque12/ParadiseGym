'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { GrainOverlay } from '@/components/motion'
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion'
import { cn } from '@/lib/utils'

export function HeroFrame({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const reducedMotion = usePrefersReducedMotion()
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 800], ['0%', reducedMotion ? '0%' : '3%'])

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-carbon">
      <motion.div
        className="absolute inset-x-0 -top-[10%] -bottom-[10%] will-change-transform"
        style={{ y }}
      >
        <Image
          src="/images/hero-gym-floor.png"
          alt="Paradise Gym training floor with neon green equipment and lighting"
          fill
          priority
          className="object-cover object-[center_36%]"
          sizes="100vw"
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.78)_0%,rgba(10,10,10,0.18)_20%,rgba(10,10,10,0.08)_62%,rgba(10,10,10,0.92)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,10,0.9)_0%,rgba(10,10,10,0.62)_38%,rgba(10,10,10,0.18)_72%,rgba(10,10,10,0.05)_100%)]" />
      <GrainOverlay />

      <div
        className={cn(
          'relative mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-end px-5 pb-14 pt-28 sm:px-8 sm:pb-20 lg:px-10',
          className
        )}
      >
        {children}
      </div>
    </section>
  )
}
