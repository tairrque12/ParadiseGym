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
import {
  LOCATIONS,
  MCALLEN_PATH,
  type GymLocation,
  type LocationId,
} from '@/lib/locations'
import { handleSectionNavClick } from '@/lib/section-nav'
import { NAV_LINKS } from '@/lib/sections'
import { cn } from '@/lib/utils'

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

function headerCtaLabel(location: GymLocation) {
  if (location.id === 'mcallen') return 'Founding Membership'
  return location.ctaLabel
}

function isLinkActive(href: string, pathname: string, hash: string) {
  if (href.startsWith('/#')) {
    return pathname === '/' && hash === href.slice(1)
  }
  return pathname === href
}

function MembershipLink({
  location,
  className,
  testId,
}: {
  location: GymLocation
  className?: string
  testId?: string
}) {
  return (
    <a
      href={location.joinLink}
      target="_blank"
      rel="noopener noreferrer"
      data-testid={testId}
      className={className}
    >
      {headerCtaLabel(location)}
    </a>
  )
}

const membershipClassName = cn(
  'inline-flex h-10 items-center justify-center bg-neon px-4 text-sm font-semibold text-carbon transition-colors duration-200 hover:bg-white',
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

  function onSectionClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
    handleSectionNavClick(event, href)
    if (href.startsWith('/#')) setHash(href.slice(1))
    setMenuOpen(false)
  }

  function openTourFromMenu() {
    setMenuOpen(false)
    openTourModal()
  }

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-carbon/95 text-white backdrop-blur-md"
    >
      {showAnnouncement ? <LocationAnnouncement /> : null}

      <div className="mx-auto flex max-w-7xl flex-col gap-2.5 px-4 py-3 sm:px-6 xl:h-[4.5rem] xl:flex-row xl:items-center xl:gap-6 xl:px-8 xl:py-0">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            aria-label="Paradise Gym home"
            className={cn('shrink-0 rounded-sm', focusRing)}
          >
            <Logo compact className="sm:hidden" />
            <Logo className="hidden sm:flex" />
          </Link>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
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
                      const active = isLinkActive(link.href, pathname, hash)
                      return (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            aria-current={active ? 'page' : undefined}
                            onClick={(event) => onSectionClick(event, link.href)}
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
                      className={cn(membershipClassName, 'h-11 w-full')}
                    />
                    <button
                      type="button"
                      onClick={openTourFromMenu}
                      className={cn(
                        'inline-flex h-11 w-full items-center justify-center border border-white/15 text-sm font-medium text-white transition-colors duration-200 hover:border-white/40 hover:bg-white/5 motion-reduce:transition-none',
                        focusRing
                      )}
                    >
                      Free Tour
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
            const active = isLinkActive(link.href, pathname, hash)
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                onClick={(event) => onSectionClick(event, link.href)}
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
          <LocationSwitcher />
          <Separator
            orientation="vertical"
            aria-hidden
            className="hidden h-4 w-px bg-white/15 xl:block"
          />
          <div className="hidden items-center gap-2 xl:flex">
            <button
              type="button"
              onClick={openTourModal}
              className={cn(
                'inline-flex h-10 items-center px-3 text-sm font-medium text-white/80 transition-colors duration-200 hover:text-white motion-reduce:transition-none',
                focusRing
              )}
            >
              Free Tour
            </button>
            <MembershipLink
              location={location}
              testId="header-cta"
              className={membershipClassName}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
