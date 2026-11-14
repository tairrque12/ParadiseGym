'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LOCATION_LIST, MCALLEN_PATH, type LocationStatus } from '@/lib/locations'
import { cn } from '@/lib/utils'

const STATUS_LABEL: Record<LocationStatus, string | null> = {
  open: null,
  presale: 'Pre-sale',
}

export function LocationSwitcher({ className }: { className?: string }) {
  const pathname = usePathname()
  // Gallery and other shared pages belong to the operating Harlingen site.
  const activeId = pathname === MCALLEN_PATH ? 'mcallen' : 'harlingen'

  return (
    <nav aria-label="Gym locations" className={cn('min-w-0', className)}>
      <div className="flex items-center rounded-full border border-white/15 bg-white/[0.04] p-0.5">
        {LOCATION_LIST.map((location) => {
          const active = location.id === activeId
          const status = STATUS_LABEL[location.status]

          return (
            <Link
              key={location.id}
              href={location.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors duration-200 xl:px-3.5',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon/70 focus-visible:ring-offset-2 focus-visible:ring-offset-carbon',
                'motion-reduce:transition-none',
                active
                  ? 'bg-white text-carbon'
                  : 'text-white/70 hover:text-white'
              )}
            >
              <span>{location.name}</span>
              {status ? (
                <span
                  className={cn(
                    'text-[10px] font-medium uppercase tracking-wide',
                    active ? 'text-carbon/70' : 'text-white/60'
                  )}
                >
                  {status}
                </span>
              ) : null}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
