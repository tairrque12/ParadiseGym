'use client'

import { useLocation } from '@/context/location-context'
import { LOCATION_LIST } from '@/lib/locations'
import { cn } from '@/lib/utils'

export function LocationSwitcher() {
  const { locationId, setLocationId } = useLocation()

  return (
    <div className="border-t border-white/10 bg-carbon/85 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <span className="hidden shrink-0 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40 sm:block">
          Location
        </span>

        <div
          role="group"
          aria-label="Select gym location"
          className="flex items-center gap-2"
        >
          {LOCATION_LIST.map((location) => {
            const selected = location.id === locationId

            return (
              <button
                key={location.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setLocationId(location.id)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon/60',
                  selected
                    ? 'border-neon/60 bg-neon/15 text-neon'
                    : 'border-white/15 text-white/60 hover:border-white/35 hover:text-white'
                )}
              >
                {location.name}
                {location.status === 'presale' ? (
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em]',
                      selected
                        ? 'bg-neon text-carbon'
                        : 'bg-neon/20 text-neon'
                    )}
                  >
                    Pre-Sale
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
