'use client'

import { formatCountDisplay } from '@/lib/count-up'
import { GYM_STATS } from '@/lib/contact'
import { useCountUp } from '@/hooks/use-count-up'
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion'
import { GrainOverlay } from '@/components/motion'

function CountStat({
  value,
  suffix,
  label,
}: {
  value: number
  suffix: string
  label: string
}) {
  const reducedMotion = usePrefersReducedMotion()
  const { ref, value: count } = useCountUp(value)

  const display = reducedMotion
    ? formatCountDisplay(value, { suffix })
    : formatCountDisplay(count, { suffix })

  return (
    <div className="text-center md:text-left">
      <span
        ref={ref}
        className="block font-heading text-4xl tracking-tight text-white sm:text-5xl lg:text-6xl"
      >
        {display}
      </span>
      <span className="mt-2 block text-xs uppercase tracking-[0.2em] text-neon sm:text-sm">
        {label}
      </span>
    </div>
  )
}

export function GymFacts() {
  return (
    <section className="relative isolate z-10 -mt-px border-y border-white/10 bg-carbon py-14 sm:py-16">
      <GrainOverlay />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div>
          <div className="grid gap-10 md:grid-cols-3 md:gap-8">
            {GYM_STATS.map((stat) =>
              stat.type === 'count' ? (
                <CountStat
                  key={stat.label}
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                />
              ) : (
                <div key={stat.label} className="text-center md:text-left">
                  <span className="block font-heading text-3xl leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                    {stat.value}
                  </span>
                  <span className="mt-2 block text-xs uppercase tracking-[0.2em] text-neon sm:text-sm">
                    {stat.label}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
