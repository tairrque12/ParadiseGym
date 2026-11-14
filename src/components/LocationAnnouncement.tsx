import Link from 'next/link'
import { LOCATIONS } from '@/lib/locations'

const LABEL =
  'McAllen founding memberships are available. View the presale.'

export function LocationAnnouncement() {
  return (
    <Link
      href={LOCATIONS.mcallen.href}
      aria-label={LABEL}
      data-testid="location-announcement"
      className="group flex h-9 w-full items-center justify-center gap-3 border-b border-white/10 bg-carbon px-4 text-[13px] leading-none text-white/75 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neon/70 motion-reduce:transition-none"
    >
      <span className="min-w-0 truncate">
        <span className="sm:hidden">McAllen founding memberships</span>
        <span className="hidden sm:inline">
          McAllen founding memberships are available
        </span>
      </span>
      <span className="shrink-0 text-white underline decoration-white/30 underline-offset-4 transition-colors duration-200 group-hover:text-neon group-hover:decoration-neon/70 motion-reduce:transition-none">
        View presale
      </span>
    </Link>
  )
}
