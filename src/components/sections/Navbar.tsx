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

const DESKTOP_NAV_QUERY = '(min-width: 1024px)'

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
        'rounded-none border border-white/15 bg-transparent p-0.5',
        className
      )}
      render={<nav aria-label="Gym locations" />}
    >
      <Toggle
        value="harlingen"
        nativeButton={false}
        aria-current={activeId === 'harlingen' ? 'page' : undefined}
        className={cn(
          'rounded-none px-2.5 text-[13px] font-medium tracking-normal text-white/75 transition-colors duration-200 hover:text-white motion-reduce:transition-none',
          activeId === 'harlingen' && 'bg-white text-carbon hover:text-carbon'
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
          'rounded-none px-2.5 text-[13px] font-medium tracking-normal text-white/75 transition-colors duration-200 hover:text-white motion-reduce:transition-none',
          activeId === 'mcallen' && 'bg-white text-carbon hover:text-carbon'
        )}
        render={<Link href={MCALLEN_PATH} onClick={onNavigate} />}
      >
        McAllen
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
    const root = document.documentElement
    if (menuOpen) root.setAttribute('data-menu-open', '')
    else root.removeAttribute('data-menu-open')
    return () => root.removeAttribute('data-menu-open')
  }, [menuOpen])

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
      className="fixed inset-x-0 top-0 z-50 h-[60px] border-b border-white/10 bg-carbon/85 text-white backdrop-blur-xl xl:h-[72px]"
    >
      <div className="mx-auto flex h-full max-w-7xl flex-nowrap items-center gap-2 px-4 xl:gap-3 xl:px-6">
        <Link
          href="/"
          aria-label="Paradise Gym home"
          className="inline-flex size-11 shrink-0 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon/70"
        >
          <Logo compact />
        </Link>

        <NavigationMenu
          aria-label="Main"
          data-testid="desktop-nav"
          className="ml-2 hidden min-w-0 lg:flex"
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
                      'px-2 text-sm font-medium tracking-normal text-white/85 transition-colors duration-200 hover:text-white motion-reduce:transition-none',
                      active && 'text-white shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.85)]'
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
            className="hidden lg:inline-flex"
          />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                data-testid="header-phone"
                aria-label="Call"
                className="hidden size-11 items-center justify-center text-white/80 transition-colors duration-200 hover:bg-white/5 hover:text-white lg:inline-flex motion-reduce:transition-none"
                render={<a href={CONTACT.phoneHref} />}
              >
                <Phone className="size-5" />
              </TooltipTrigger>
              <TooltipPortal>
                <TooltipPositioner sideOffset={8}>
                  <TooltipPopup className="whitespace-nowrap tracking-normal">
                    {CONTACT.phone}
                  </TooltipPopup>
                </TooltipPositioner>
              </TooltipPortal>
            </Tooltip>
          </TooltipProvider>

          <Button
            variant="outline"
            data-testid="header-tour"
            className="hidden h-11 border-white/20 bg-transparent px-3 text-sm font-medium tracking-normal text-white hover:border-white/50 hover:bg-white/5 lg:inline-flex"
            onClick={() => openTour('header')}
          >
            Book a Tour
          </Button>

          <Button
            size="sm"
            nativeButton={false}
            data-testid="header-cta"
            className="hidden h-11 bg-neon px-3.5 text-sm font-semibold tracking-normal text-carbon hover:bg-white lg:inline-flex"
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
            <SheetTrigger
              data-testid="mobile-menu-button"
              aria-label="Open menu"
              className="inline-flex size-11 items-center justify-center text-white transition-colors duration-200 hover:bg-white/5 lg:hidden motion-reduce:transition-none"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader className="border-b border-white/10 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
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
                <a
                  href={CONTACT.phoneHref}
                  aria-label="Call"
                  className="ml-auto inline-flex size-11 items-center justify-center text-white hover:bg-white/5"
                >
                  <Phone className="size-5" />
                </a>
                <SheetClose
                  aria-label="Close menu"
                  className="inline-flex size-11 items-center justify-center rounded-md text-white hover:bg-white/5"
                >
                  <X className="size-5" />
                </SheetClose>
              </SheetHeader>

              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-4">
                <p className="mt-6 text-[13px] font-medium text-text-2">
                  McAllen pre-sale is open
                </p>
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
                              'flex h-[52px] items-center border-l px-4 text-base font-medium text-white transition-colors duration-200 motion-reduce:transition-none',
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

              <SheetFooter className="gap-2 border-t border-white/10 px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <Button
                  size="sm"
                  nativeButton={false}
                  data-testid="mobile-join"
                  className="h-11 w-full bg-neon text-sm font-semibold text-carbon hover:bg-white"
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
                <Button
                  variant="outline"
                  data-testid="mobile-tour"
                  className="h-11 w-full border-white/20 bg-transparent text-sm font-medium text-white hover:bg-white/5"
                  onClick={() => openTour('mobile_menu')}
                >
                  {TOUR_FALLBACK_LABEL}
                </Button>
                <p className="text-center text-xs leading-relaxed text-text-2">
                  Secure checkout by ABC Fitness
                </p>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
