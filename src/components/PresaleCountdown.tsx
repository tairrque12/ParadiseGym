'use client'

import { useEffect, useState } from 'react'
import { getCountdownParts, type CountdownParts } from '@/lib/countdown'
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion'
import { cn } from '@/lib/utils'

const UNIT_LABELS = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hrs' },
  { key: 'minutes', label: 'Min' },
] as const

export function PresaleCountdown({
  target,
  className,
}: {
  target: string
  className?: string
}) {
  const reducedMotion = usePrefersReducedMotion()
  const [parts, setParts] = useState<CountdownParts | null>(null)

  useEffect(() => {
    const update = () => setParts(getCountdownParts(target))

    update()
    const timer = setInterval(update, 30_000)
    return () => clearInterval(timer)
  }, [target])

  const complete = parts?.isComplete ?? false

  return (
    <div
      data-testid="presale-countdown"
      className={cn(
        'flex flex-wrap items-center gap-x-5 gap-y-3 sm:gap-x-7',
        className
      )}
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
        {complete ? 'Opening' : 'Opening In'}
      </span>

      {complete ? (
        <span className="font-heading text-2xl uppercase tracking-tight text-neon sm:text-3xl">
          Any Day Now
        </span>
      ) : (
        <div className="flex items-end gap-5 sm:gap-7">
          {UNIT_LABELS.map((unit) => (
            <div key={unit.key} className="flex items-baseline gap-1.5">
              <span
                className={cn(
                  'font-heading text-3xl leading-none tracking-tight text-neon sm:text-4xl',
                  !reducedMotion && 'animate-neon-pulse'
                )}
              >
                {parts ? parts[unit.key] : '--'}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
