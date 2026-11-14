'use client'

import { useEffect, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { trackAnnouncementBarClick } from '@/lib/analytics'
import { MCALLEN_PATH } from '@/lib/locations'
import { isMcAllenOpen } from '@/lib/mcallen-opening'
import { cn } from '@/lib/utils'

const PRE_OPEN_LABEL = {
  mobile: 'McAllen grand opening Nov 28 · Tap for McAllen location',
  desktop: 'McAllen grand opening Nov 28 · See the McAllen location',
  accessible:
    'McAllen grand opening November 28. See the McAllen location.',
} as const

const OPEN_LABEL = {
  visible: 'McAllen now open',
  accessible: 'McAllen now open. See the McAllen location.',
} as const

export function McallenOpeningBanner({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(isMcAllenOpen())
  }, [])

  if (pathname === MCALLEN_PATH) return null

  const accessible = open ? OPEN_LABEL.accessible : PRE_OPEN_LABEL.accessible

  return (
    <div
      className={cn(
        'grid transition-[grid-template-rows] duration-200 motion-reduce:transition-none',
        collapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'
      )}
    >
      <div className="overflow-hidden">
        <a
          href={MCALLEN_PATH}
          data-testid="opening-banner"
          aria-label={accessible}
          onClick={() => trackAnnouncementBarClick()}
          className="flex min-h-11 items-center gap-3 bg-[#0a0a0a] px-4 text-sm text-white"
        >
          <span className="min-w-0 flex-1 text-left leading-snug">
            {open ? (
              OPEN_LABEL.visible
            ) : (
              <>
                <span className="lg:hidden">{PRE_OPEN_LABEL.mobile}</span>
                <span className="hidden lg:inline">{PRE_OPEN_LABEL.desktop}</span>
              </>
            )}
          </span>
          <ChevronRight
            aria-hidden
            className="size-4 shrink-0 text-neon lg:hidden"
          />
          <ChevronRight
            aria-hidden
            className="hidden size-4 shrink-0 text-neon lg:block"
          />
        </a>
      </div>
    </div>
  )
}
