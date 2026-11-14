'use client'

import { useEffect, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { trackAnnouncementBarClick } from '@/lib/analytics'
import { MCALLEN_PATH } from '@/lib/locations'
import { isMcAllenOpen } from '@/lib/mcallen-opening'
import { cn } from '@/lib/utils'

const PRE_OPEN_LABEL =
  'McAllen Grand Opening Nov 28- Click Here to See The McAllen Location'

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

  const accessible = open ? OPEN_LABEL.accessible : PRE_OPEN_LABEL

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
          className="flex min-h-12 w-full items-stretch bg-[#0a0a0a] text-sm text-white"
        >
          <span className="flex min-w-0 flex-1 items-center px-4 py-2.5 text-left leading-snug">
            {open ? OPEN_LABEL.visible : PRE_OPEN_LABEL}
          </span>
          <span
            aria-hidden
            data-testid="opening-banner-arrow"
            className="flex w-14 shrink-0 items-center justify-center self-stretch bg-neon text-carbon shadow-neon lg:my-1.5 lg:size-9 lg:self-center"
          >
            <ChevronRight
              className="size-8 motion-safe:animate-banner-nudge lg:size-5"
              strokeWidth={2.75}
            />
          </span>
        </a>
      </div>
    </div>
  )
}
