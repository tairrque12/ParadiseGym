'use client'

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
  type RefObject,
} from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { LocationAnnouncement } from '@/components/LocationAnnouncement'
import { LocationSwitcher } from '@/components/LocationSwitcher'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useModal } from '@/context/modal-context'
import { CONTACT } from '@/lib/contact'
import {
  ABC_CHECKOUT_NOTE,
  JOIN_NOW_LABEL,
  joinUrl,
  LOCATIONS,
  MCALLEN_PATH,
  TOUR_FALLBACK_LABEL,
  type GymLocation,
  type LocationId,
} from '@/lib/locations'
import { handleSectionNavClick, sectionHrefForPath } from '@/lib/section-nav'
import { NAV_LINKS } from '@/lib/sections'
import { trackJoinOnlineClick, type JoinPlacement } from '@/lib/analytics'
import { cn } from '@/lib/utils'

const DESKTOP_NAV_QUERY = '(min-width: 1280px)'

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon/70 focus-visible:ring-offset-2 focus-visible:ring-offset-carbon'

function useHeaderHeight(
  headerRef: RefObject<HTMLElement | null>,
  dependency: boolean
) {
  useLayoutEffect(() => {
    const header = headerRef.current
    if (!header) return

    const apply = () => {
      document.documentElement.style.setProperty(
        '--header-height',
        `${header.offsetHeight}px`
      )
    }

    apply()
    if (typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver(apply)
    observer.observe(header)
    return () => observer.disconnect()
  }, [headerRef, dependency])
}

function activeLocationId(pathname: string): LocationId {
  return pathname === MCALLEN_PATH ? 'mcallen' : 'harlingen'
}

function isLinkActive(href: string, pathname: string, hash: string) {
  const hashIndex = href.indexOf('#')
  if (hashIndex !== -1) {
    const linkPath = href.slice(0, hashIndex) || '/'
    return pathname === linkPath && hash === href.slice(hashIndex)
  }
  return pathname === href
}

function MembershipLink({
  location,
  placement,
  campaign,
  className,
  testId,
}: {
  location: GymLocation
  placement: JoinPlacement
  campaign: 'header' | 'mobile_menu'
  className?: string
  testId?: string
}) {
  return (
    <a
      href={joinUrl(location.id, campaign)}
      target="_blank"
      rel="noopener noreferrer"
      data-testid={testId}
      className={className}
      onClick={() =>
        trackJoinOnlineClick({
          location: location.id,
          placement,
        })
      }
    >
      {JOIN_NOW_LABEL}
    </a>
  )
}

const membershipClassName = cn(
  'inline-flex min-h-11 items-center justify-center bg-neon px-4 text-sm font-semibold text-carbon transition-colors duration-200 hover:bg-white',
  focusRing,
  'motion-reduce:transition-none'
)

const tourClassName = cn(
  'inline-flex min-h-11 items-center justify-center border border-white/30 px-4 text-sm font-medium text-white transition-colors duration-200 hover:border-white/60 hover:bg-white/5',
  focusRing,
  'motion-reduce:transition-none'
)

export function Navbar() {
  const { openTourModal } = useModal()
  const pathname = usePathname()
  const headerRef = useRef<HTMLElement>(null)
  const showAnnouncement = pathname !== MCALLEN_PATH
  const location = LOCATIONS[activeLocationId(pathname)]
  const [menuOpen, setMenuOpen] = useState(false)
  const [hash, setHash] = useState('')

  useHeaderHeight(headerRef, showAnnouncement)

  useEffect(() => {
    const sync = () => setHash(window.location.hash)
    sync()
    window.addEventListener('hashchange', sync)
    window.addEventListener('popstate', sync)
    return () => {
      window.removeEventListener('hashchange', sync)
      window.removeEventListener('popstate', sync)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_NAV_QUERY)
    const closeOnDesktop = () => {
      if (media.matches) setMenuOpen(false)
    }
    closeOnDesktop()
    media.addEventListener('change', closeOnDesktop)
    return () => media.removeEventListener('change', closeOnDesktop)
  }, [])

  function onSectionClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
    handleSectionNavClick(event, href)
    const hashIndex = href.indexOf('#')
    if (hashIndex !== -1) setHash(href.slice(hashIndex))
    setMenuOpen(false)
  }

  function openTourFromMenu() {
    setMenuOpen(false)
    openTourModal('mobile_menu')
  }

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-carbon/95 text-white backdrop-blur-md"
    >
      {showAnnouncement ? <LocationAnnouncement /> : null}

      <div className="mx-auto flex max-w-7xl flex-col gap-2.5 px-4 py-3 sm:px-6 xl:flex-row xl:items-center xl:gap-6 xl:px-8 xl:py-3">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            aria-label="Paradise Gym home"
            className={cn('shrink-0 rounded-sm', focusRing)}
          >
            <Logo compact className="sm:hidden" />
            <Logo className="hidden sm:flex" />
          </Link>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen} modal={false}>
            <SheetTrigger
              className={cn(
                'inline-flex h-10 w-10 items-center justify-center rounded-sm text-white transition-colors duration-200 hover:bg-white/5 xl:hidden motion-reduce:transition-none',
                focusRing
              )}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              data-testid="mobile-menu-button"
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </SheetTrigger>
            <SheetContent>
              <div className="mx-auto flex w-full max-w-lg flex-col px-6 py-6">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <SheetDescription>
                  Paradise Gym pages, locations, and membership
                </SheetDescription>

                <nav id="mobile-nav" aria-label="Mobile" className="mt-6">
                  <ul className="flex flex-col">
                    {NAV_LINKS.map((link) => {
                      const href = sectionHrefForPath(link.href, pathname)
                      const active = isLinkActive(href, pathname, hash)
                      return (
                        <li key={link.href}>
                          <Link
                            href={href}
                            aria-current={active ? 'page' : undefined}
                            onClick={(event) => onSectionClick(event, href)}
                            className={cn(
                              'flex items-center justify-between border-b border-white/10 py-3.5 text-base font-medium text-white/80 transition-colors duration-200 hover:text-white motion-reduce:transition-none',
                              focusRing,
                              active && 'text-white'
                            )}
                          >
                            {link.label}
                            {active ? (
                              <span
                                aria-hidden
                                className="h-1.5 w-1.5 rounded-full bg-neon"
                              />
                            ) : null}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>

                  <div className="mt-6 flex flex-col gap-3">
                    <MembershipLink
                      location={location}
                      placement="mobile_menu"
                      campaign="mobile_menu"
                      testId="mobile-join"
                      className={cn(membershipClassName, 'w-full')}
                    />
                    <p className="text-sm text-white/80">{ABC_CHECKOUT_NOTE}</p>
                    <button
                      type="button"
                      data-testid="mobile-tour"
                      onClick={openTourFromMenu}
                      className={cn(tourClassName, 'w-full')}
                    >
                      {TOUR_FALLBACK_LABEL}
                    </button>
                  </div>
                </nav>
                <SheetClose className="sr-only">Close menu</SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <nav
          aria-label="Main"
          data-testid="desktop-nav"
          className="hidden items-center gap-x-6 xl:ml-10 xl:flex"
        >
          {NAV_LINKS.map((link) => {
            const href = sectionHrefForPath(link.href, pathname)
            const active = isLinkActive(href, pathname, hash)
            return (
              <Link
                key={link.href}
                href={href}
                aria-current={active ? 'page' : undefined}
                onClick={(event) => onSectionClick(event, href)}
                className={cn(
                  'text-sm font-medium text-white/70 transition-colors duration-200 hover:text-white motion-reduce:transition-none',
                  focusRing,
                  active &&
                    'text-white underline decoration-neon decoration-2 underline-offset-8'
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex min-w-0 items-center gap-3 xl:ml-auto xl:gap-4">
          <a
            href={CONTACT.phoneHref}
            data-testid="header-phone"
            className={cn(
              'inline-flex min-h-11 items-center px-2 text-sm text-white',
              focusRing
            )}
          >
            <span className="xl:hidden">Call</span>
            <span className="hidden xl:inline">{CONTACT.phone}</span>
          </a>
          <LocationSwitcher />
          <Separator
            orientation="vertical"
            aria-hidden
            className="hidden h-4 w-px bg-white/15 xl:block"
          />
          <div className="hidden flex-col items-end gap-1 xl:flex">
            <div className="flex items-center gap-2">
              <MembershipLink
                location={location}
                placement="header"
                campaign="header"
                testId="header-cta"
                className={membershipClassName}
              />
              <button
                type="button"
                data-testid="header-tour"
                onClick={() => openTourModal('header')}
                className={tourClassName}
              >
                {TOUR_FALLBACK_LABEL}
              </button>
            </div>
            <p className="max-w-xs text-right text-xs leading-snug text-white/80">
              {ABC_CHECKOUT_NOTE}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
