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
import { Menu, Phone, X } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Toggle, ToggleGroup } from '@/components/ui/toggle-group'
import {
  Tooltip,
  TooltipPopup,
  TooltipPortal,
  TooltipPositioner,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useModal } from '@/context/modal-context'
import { CONTACT } from '@/lib/contact'
import {
  joinUrl,
  LOCATIONS,
  MCALLEN_PATH,
  TOUR_FALLBACK_LABEL,
  type LocationId,
} from '@/lib/locations'
import { MEMBERSHIP_OPTIONS } from '@/lib/membership-options'
import { handleSectionNavClick, sectionHrefForPath } from '@/lib/section-nav'
import { GALLERY_PATH, NAV_LINKS } from '@/lib/sections'
import { trackJoinOnlineClick, type JoinPlacement } from '@/lib/analytics'
import { cn } from '@/lib/utils'

const DESKTOP_NAV_QUERY = '(min-width: 1280px)'

const HEADER_LINKS = NAV_LINKS.filter((link) => link.href !== GALLERY_PATH)

const fromPrice = MEMBERSHIP_OPTIONS.find(
  (option) => option.slug === '12_month_contract'
)?.price

const menuJoinLabel = fromPrice ? `Join today · from ${fromPrice}` : 'Join today'

function useHeaderHeight(headerRef: RefObject<HTMLElement | null>) {
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
  }, [headerRef])
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

function LocationToggle({
  activeId,
  onNavigate,
  className,
}: {
  activeId: LocationId
  onNavigate?: () => void
  className?: string
}) {
  return (
    <ToggleGroup
      value={[activeId]}
      className={cn(
        'rounded-lg border border-line-strong bg-background p-0.5',
        className
      )}
      render={<nav aria-label="Gym locations" />}
    >
      <Toggle
        value="harlingen"
        nativeButton={false}
        aria-current={activeId === 'harlingen' ? 'page' : undefined}
        className={cn(
          'rounded-md',
          activeId === 'harlingen' && 'bg-white text-carbon'
        )}
        render={<Link href="/" onClick={onNavigate} />}
      >
        Harlingen
      </Toggle>
      <Toggle
        value="mcallen"
        nativeButton={false}
        aria-current={activeId === 'mcallen' ? 'page' : undefined}
        className={cn(
          'gap-1.5 rounded-md',
          activeId === 'mcallen' && 'bg-white text-carbon'
        )}
        render={<Link href={MCALLEN_PATH} onClick={onNavigate} />}
      >
        McAllen
        <Badge
          variant="outline"
          className={cn(
            'border-current',
            activeId === 'mcallen' ? 'text-carbon' : 'text-white'
          )}
        >
          Pre-sale
        </Badge>
      </Toggle>
    </ToggleGroup>
  )
}

export function Navbar() {
  const { openTourModal } = useModal()
  const pathname = usePathname()
  const headerRef = useRef<HTMLElement>(null)
  const location = LOCATIONS[activeLocationId(pathname)]
  const [menuOpen, setMenuOpen] = useState(false)
  const [hash, setHash] = useState('')

  useHeaderHeight(headerRef)

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

  function openTour(placement: 'header' | 'mobile_menu') {
    setMenuOpen(false)
    openTourModal(placement)
  }

  function trackJoin(placement: JoinPlacement) {
    trackJoinOnlineClick({ location: location.id, placement })
  }

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50 h-[60px] border-b border-border bg-background/90 text-white backdrop-blur xl:h-[72px]"
    >
      <div className="mx-auto flex h-full max-w-7xl flex-nowrap items-center gap-2 px-3 xl:gap-3 xl:px-6">
        <Link
          href="/"
          aria-label="Paradise Gym home"
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-md"
        >
          <Logo compact />
        </Link>

        <NavigationMenu
          aria-label="Main"
          data-testid="desktop-nav"
          className="ml-2 hidden min-w-0 xl:flex"
        >
          <NavigationMenuList className="gap-1">
            {HEADER_LINKS.map((link) => {
              const href = sectionHrefForPath(link.href, pathname)
              const active = isLinkActive(href, pathname, hash)
              return (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink
                    href={href}
                    active={active}
                    className={cn(
                      active &&
                        'underline decoration-neon decoration-2 underline-offset-8'
                    )}
                    onClick={(event) => onSectionClick(event, href)}
                  >
                    {link.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-auto flex shrink-0 flex-nowrap items-center gap-2">
          <LocationToggle
            activeId={location.id}
            className="hidden xl:inline-flex"
          />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                data-testid="header-phone"
                aria-label="Call"
                className="hidden size-11 items-center justify-center rounded-md text-white hover:bg-white/5 xl:inline-flex"
                render={<a href={CONTACT.phoneHref} />}
              >
                <Phone className="size-5" />
              </TooltipTrigger>
              <TooltipPortal>
                <TooltipPositioner sideOffset={8}>
                  <TooltipPopup>{CONTACT.phone}</TooltipPopup>
                </TooltipPositioner>
              </TooltipPortal>
            </Tooltip>
          </TooltipProvider>

          <Button
            variant="outline"
            data-testid="header-tour"
            className="hidden h-11 border-line-strong bg-transparent px-3 text-white hover:bg-white/5 xl:inline-flex"
            onClick={() => openTour('header')}
          >
            Book a tour
          </Button>

          <Button
            size="sm"
            nativeButton={false}
            data-testid="header-cta"
            className="hidden h-11 bg-neon px-3 text-carbon hover:bg-white xl:inline-flex"
            render={
              <a
                href={joinUrl(location.id, 'header')}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
            onClick={() => trackJoin('header')}
          >
            Join today
          </Button>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <Button
              size="sm"
              nativeButton={false}
              data-testid="mobile-header-join"
              className="h-11 bg-neon px-3 text-carbon hover:bg-white xl:hidden"
              render={
                <a
                  href={joinUrl(location.id, 'header')}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              onClick={() => trackJoin('header')}
            >
              Join
            </Button>
            <SheetTrigger
              data-testid="mobile-menu-button"
              aria-label="Open menu"
              className="inline-flex size-11 items-center justify-center rounded-md text-white hover:bg-white/5 xl:hidden"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader className="px-4 pt-3">
                <Link
                  href="/"
                  aria-label="Paradise Gym home"
                  className="inline-flex size-11 items-center justify-center rounded-md"
                  onClick={() => setMenuOpen(false)}
                >
                  <Logo compact />
                </Link>
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Paradise Gym locations, pages, and membership
                </SheetDescription>
                <SheetClose
                  aria-label="Close menu"
                  className="inline-flex size-11 items-center justify-center rounded-md text-white hover:bg-white/5"
                >
                  <X className="size-5" />
                </SheetClose>
              </SheetHeader>

              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-4">
                <p className="mt-4 text-sm text-white">McAllen pre-sale is open</p>
                <LocationToggle
                  activeId={location.id}
                  onNavigate={() => setMenuOpen(false)}
                  className="mt-3"
                />

                <nav aria-label="Mobile" className="mt-6">
                  <ul className="flex flex-col">
                    {HEADER_LINKS.map((link, index) => {
                      const href = sectionHrefForPath(link.href, pathname)
                      const active = isLinkActive(href, pathname, hash)
                      return (
                        <li key={link.href}>
                          {index > 0 ? <Separator className="bg-line" /> : null}
                          <Link
                            href={href}
                            aria-current={active ? 'page' : undefined}
                            onClick={(event) => onSectionClick(event, href)}
                            className={cn(
                              'flex h-[52px] items-center border-l-2 px-4 text-lg text-white',
                              active ? 'border-neon' : 'border-transparent'
                            )}
                          >
                            {link.label}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </nav>
              </div>

              <SheetFooter className="px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <Button
                  size="sm"
                  nativeButton={false}
                  data-testid="mobile-join"
                  className="h-12 w-full bg-neon text-carbon hover:bg-white"
                  render={
                    <a
                      href={joinUrl(location.id, 'mobile_menu')}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                  onClick={() => trackJoin('mobile_menu')}
                >
                  {menuJoinLabel}
                </Button>
                <p className="text-center text-xs text-text-2">
                  Secure checkout by ABC Fitness
                </p>
                <Button
                  variant="outline"
                  data-testid="mobile-tour"
                  className="h-12 w-full border-line-strong bg-transparent text-white hover:bg-white/5"
                  onClick={() => openTour('mobile_menu')}
                >
                  {TOUR_FALLBACK_LABEL}
                </Button>
                <Button
                  variant="ghost"
                  nativeButton={false}
                  className="h-11 w-full text-white hover:bg-white/5"
                  render={<a href={CONTACT.phoneHref} />}
                >
                  <Phone className="size-5" />
                  Call
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
