'use client'

import { formatCountDisplay } from '@/lib/count-up'
import { GYM_STATS } from '@/lib/contact'
import { useCountUp } from '@/hooks/use-count-up'
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion'
import { cn } from '@/lib/utils'

function StatValue({
  children,
  numeric,
}: {
  children: React.ReactNode
  numeric?: boolean
}) {
  return (
    <span
      className={cn(
        'mt-3 block font-medium tracking-[-0.03em] text-white',
        numeric
          ? 'text-[clamp(2.75rem,4vw,3.75rem)] leading-none tabular-nums'
          : 'max-w-[16ch] text-[clamp(1.5rem,2.2vw,2rem)] leading-snug'
      )}
    >
      {children}
    </span>
  )
}

function CountStat({
  value,
  suffix,
  label,
  index,
}: {
  value: number
  suffix: string
  label: string
  index: string
}) {
  const reducedMotion = usePrefersReducedMotion()
  const { ref, value: count } = useCountUp(value, 900)

  const display = reducedMotion
    ? formatCountDisplay(value, { suffix })
    : formatCountDisplay(count, { suffix })

  return (
    <div className="flex h-full flex-col">
      <span className="text-xs font-medium tracking-[0.12em] text-text-3">
        {index}
      </span>
      <StatValue numeric>
        <span ref={ref}>{display}</span>
      </StatValue>
      <span className="mt-auto block pt-4 text-xs font-medium tracking-[0.08em] text-text-2">
        {label}
      </span>
    </div>
  )
}

export function GymFacts() {
  return (
    <section className="relative border-t border-white/10 bg-carbon">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-text-3">
          The floor
        </p>
        <div className="mt-10 grid gap-12 md:grid-cols-3 md:gap-0">
          {GYM_STATS.map((stat, index) => (
            <div
              key={stat.label}
              className={cn(
                'flex h-full flex-col',
                index > 0 && 'md:border-l md:border-white/10 md:pl-10',
                index < GYM_STATS.length - 1 && 'md:pr-10'
              )}
            >
              {stat.type === 'count' ? (
                <CountStat
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                  index={`0${index + 1}`}
                />
              ) : (
                <div className="flex h-full flex-col">
                  <span className="text-xs font-medium tracking-[0.12em] text-text-3">
                    0{index + 1}
                  </span>
                  <StatValue>{stat.value}</StatValue>
                  <span className="mt-auto block pt-4 text-xs font-medium tracking-[0.08em] text-text-2">
                    {stat.label}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
