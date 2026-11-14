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
  const y = useTransform(scrollY, [0, 800], ['0%', reducedMotion ? '0%' : '2%'])

  return (
    <section className="relative isolate min-h-[78svh] overflow-hidden bg-carbon md:min-h-[100svh]">
      <motion.div
        className="absolute inset-x-0 -top-[8%] -bottom-[8%] will-change-transform"
        style={{ y }}
      >
        <Image
          src="/images/hero-gym-floor.png"
          alt="Paradise Gym training floor with neon green equipment and lighting"
          fill
          priority
          className="object-cover object-[center_72%] md:object-[center_42%]"
          sizes="100vw"
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.78)_0%,rgba(10,10,10,0.46)_34%,rgba(10,10,10,0.22)_68%,rgba(10,10,10,0.4)_100%)] md:bg-[linear-gradient(180deg,rgba(10,10,10,0.72)_0%,rgba(10,10,10,0.16)_22%,rgba(10,10,10,0.08)_58%,rgba(10,10,10,0.9)_100%)]" />
      <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(10,10,10,0.88)_0%,rgba(10,10,10,0.5)_36%,rgba(10,10,10,0.12)_70%,rgba(10,10,10,0.04)_100%)] md:block" />
      <GrainOverlay />

      <div
        className={cn(
          'relative mx-auto flex min-h-[78svh] w-full max-w-7xl flex-col justify-start px-5 pb-10 pt-[calc(var(--header-height,3.75rem)+1.5rem)] sm:px-8 sm:pb-14 md:min-h-[100svh] md:justify-end md:pb-20 md:pt-28 lg:px-10',
          className
        )}
      >
        {children}
      </div>
    </section>
  )
}
