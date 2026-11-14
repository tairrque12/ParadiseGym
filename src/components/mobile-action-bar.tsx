'use client'

import { usePathname } from 'next/navigation'
import { useModal } from '@/context/modal-context'
import { CONTACT } from '@/lib/contact'
import { ABC_CHECKOUT_NOTE, joinUrl, MCALLEN_PATH, type LocationId } from '@/lib/locations'

const ROUTES = new Set(['/', MCALLEN_PATH, '/gallery'])

export function MobileActionBar() {
  const pathname = usePathname()
  const { activeModal, openTourModal } = useModal()

  if (!pathname || !ROUTES.has(pathname) || activeModal) return null

  const locationId: LocationId = pathname === MCALLEN_PATH ? 'mcallen' : 'harlingen'

  return (
    <div
      data-testid="mobile-action-bar"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-carbon px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] xl:hidden"
    >
      <div className="mx-auto flex max-w-lg gap-2">
        <a
          href={joinUrl(locationId, 'mobile_bar')}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 flex-1 items-center justify-center bg-neon px-3 text-sm font-semibold text-carbon"
        >
          Join now
        </a>
        <button
          type="button"
          onClick={openTourModal}
          className="inline-flex min-h-11 flex-1 items-center justify-center border border-white/30 px-3 text-sm text-white"
        >
          Tour
        </button>
        <a
          href={CONTACT.phoneHref}
          className="inline-flex min-h-11 flex-1 items-center justify-center border border-white/30 px-3 text-sm text-white"
        >
          Call
        </a>
      </div>
      <p className="mt-1 text-center text-xs leading-snug text-white/80">{ABC_CHECKOUT_NOTE}</p>
    </div>
  )
}
