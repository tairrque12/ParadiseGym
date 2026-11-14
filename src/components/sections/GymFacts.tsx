import { formatCountDisplay } from '@/lib/count-up'
import { GYM_STATS } from '@/lib/contact'
import { cn } from '@/lib/utils'

export function GymFacts() {
  return (
    <section className="relative border-t border-white/10 bg-carbon">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
        <p className="text-sm font-medium text-text-3">The floor</p>
        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-8 md:mt-10 md:grid-cols-3 md:gap-0">
          {GYM_STATS.map((stat, index) => {
            const figure =
              stat.type === 'count'
                ? formatCountDisplay(stat.value, { suffix: stat.suffix })
                : stat.value

            return (
              <div
                key={stat.label}
                className={cn(
                  'min-w-0',
                  index === GYM_STATS.length - 1 && 'col-span-2 md:col-span-1',
                  index > 0 && 'md:border-l md:border-white/10 md:pl-10',
                  index < GYM_STATS.length - 1 && 'md:pr-10'
                )}
              >
                <p
                  className={cn(
                    'font-sans font-medium tracking-[-0.03em] text-white',
                    stat.type === 'count'
                      ? 'text-[clamp(2rem,8vw,2.75rem)] leading-none tabular-nums md:text-[clamp(2.75rem,4vw,3.75rem)]'
                      : 'max-w-[18ch] text-[clamp(1.35rem,4.2vw,1.75rem)] leading-snug md:text-[clamp(1.5rem,2vw,2rem)]'
                  )}
                >
                  {figure}
                </p>
                <p className="mt-2 text-xs font-medium text-text-2 md:text-sm">{stat.label}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
