'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useModal } from '@/context/modal-context'
import { joinUrl, MCALLEN_PATH, type LocationId } from '@/lib/locations'
import { cn } from '@/lib/utils'

const ROUTES = new Set(['/', MCALLEN_PATH, '/gallery'])

function useHeroCtasInView(pathname: string) {
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('[data-hero-cta]'))
    if (nodes.length === 0 || typeof IntersectionObserver === 'undefined') {
      setInView(false)
      return
    }

    const visible = new Set<Element>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target)
          else visible.delete(entry.target)
        }
        setInView(visible.size > 0)
      },
      { threshold: 0 }
    )

    for (const node of nodes) observer.observe(node)
    return () => observer.disconnect()
  }, [pathname])

  return inView
}

export function MobileActionBar() {
  const pathname = usePathname()
  const { activeModal, openTourModal } = useModal()
  const heroInView = useHeroCtasInView(pathname ?? '')
  const onRoute = Boolean(pathname && ROUTES.has(pathname))
  const show = onRoute && !activeModal && !heroInView

  if (!onRoute) return null

  const locationId: LocationId = pathname === MCALLEN_PATH ? 'mcallen' : 'harlingen'

  return (
    <div
      data-testid="mobile-action-bar"
      hidden={!show}
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-carbon px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] xl:hidden',
        show && 'motion-safe:animate-mobile-bar-in motion-reduce:animate-none'
      )}
    >
      <div className="mx-auto flex max-w-lg gap-2">
        <a
          href={joinUrl(locationId, 'mobile_bar')}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 flex-1 items-center justify-center bg-neon px-3 text-sm font-semibold text-carbon"
        >
          Join
        </a>
        <button
          type="button"
          onClick={() => openTourModal('sticky')}
          className="inline-flex h-12 flex-1 items-center justify-center border border-line-strong px-3 text-sm text-white"
        >
          Tour
        </button>
      </div>
    </div>
  )
}
