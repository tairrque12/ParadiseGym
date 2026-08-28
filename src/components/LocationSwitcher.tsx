'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LOCATION_LIST, MCALLEN_PATH } from '@/lib/locations'
import { cn } from '@/lib/utils'

export function LocationSwitcher() {
  const pathname = usePathname()
  // Gallery and other shared pages belong to the main Harlingen site.
  const activeId = pathname === MCALLEN_PATH ? 'mcallen' : 'harlingen'

  return (
    <div className="border-t border-white/10 bg-carbon/85 backdrop-blur-md">
      <nav
        aria-label="Gym locations"
        className="mx-auto flex h-12 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8"
      >
        <span className="hidden shrink-0 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40 sm:block">
          Location
        </span>

        <div className="flex items-center gap-2">
          {LOCATION_LIST.map((location) => {
            const active = location.id === activeId

            return (
              <Link
                key={location.id}
                href={location.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon/60',
                  active
                    ? 'border-neon/60 bg-neon/15 text-neon'
                    : 'border-white/15 text-white/60 hover:border-white/35 hover:text-white'
                )}
              >
                {location.name}
                {location.status === 'presale' ? (
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em]',
                      active ? 'bg-neon text-carbon' : 'bg-neon/20 text-neon'
                    )}
                  >
                    Pre-Sale
                  </span>
                ) : null}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
