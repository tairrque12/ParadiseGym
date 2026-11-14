'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { CONTACT } from '@/lib/contact'
import { joinUrl, MCALLEN_PATH, type LocationId } from '@/lib/locations'
import { MEMBERSHIP_OPTIONS } from '@/lib/membership-options'
import { cn } from '@/lib/utils'

const ROUTES = new Set(['/', MCALLEN_PATH, '/gallery'])

const fromPrice = MEMBERSHIP_OPTIONS.find(
  (option) => option.slug === '12_month_contract'
)?.price

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

function useMenuOpen() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const sync = () => setOpen(root.hasAttribute('data-menu-open'))
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(root, { attributes: true, attributeFilter: ['data-menu-open'] })
    return () => observer.disconnect()
  }, [])

  return open
}

export function MobileActionBar() {
  const pathname = usePathname()
  const heroInView = useHeroCtasInView(pathname ?? '')
  const menuOpen = useMenuOpen()
  const onRoute = Boolean(pathname && ROUTES.has(pathname))
  const show = onRoute && !heroInView && !menuOpen
  const locationId: LocationId = pathname === MCALLEN_PATH ? 'mcallen' : 'harlingen'
  const joinLabel = fromPrice ? `Join · ${fromPrice}` : 'Join'

  if (!onRoute) return null

  return (
    <div
      data-testid="mobile-action-bar"
      hidden={!show}
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-carbon/95 px-4 pt-2 backdrop-blur-xl pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden',
        show && 'motion-safe:animate-mobile-bar-in motion-reduce:animate-none'
      )}
    >
      <div className="mx-auto flex max-w-lg flex-col gap-2">
        <a
          href={joinUrl(locationId, 'mobile_bar')}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 w-full items-center justify-center bg-neon px-3 text-sm font-semibold text-carbon"
        >
          {joinLabel}
        </a>
        <a
          href={CONTACT.phoneHref}
          className="inline-flex h-11 w-full items-center justify-center text-sm font-medium text-white"
        >
          Call
        </a>
      </div>
    </div>
  )
}
