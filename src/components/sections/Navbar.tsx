'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { NAV_LINKS, ADMIN_LOGIN_PATH } from '@/lib/sections'
import { useModal } from '@/context/modal-context'
import { cn } from '@/lib/utils'

export function Navbar() {
  const { openTourModal } = useModal()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-all duration-300',
        scrolled
          ? 'border-white/10 bg-carbon/90 backdrop-blur-md'
          : 'border-transparent bg-transparent'
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0" aria-label="Paradise Gym home">
          <Logo compact className="sm:hidden" />
          <Logo className="hidden sm:flex" />
        </Link>

        <nav
          aria-label="Main"
          className="hidden items-center gap-8 md:flex"
          data-testid="desktop-nav"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-neon"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={ADMIN_LOGIN_PATH}
            className="text-sm uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-neon"
          >
            Admin
          </Link>
        </nav>

        <div className="hidden md:block">
          <button
            type="button"
            onClick={openTourModal}
            className="inline-flex items-center justify-center rounded-sm bg-neon px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-carbon transition-all duration-300 hover:scale-[1.03] hover:shadow-neon"
          >
            Free Tour
          </button>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-sm p-2 text-white md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
          data-testid="mobile-menu-button"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-white/10 bg-carbon/95 px-4 py-6 backdrop-blur-md md:hidden"
        >
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block text-lg uppercase tracking-[0.12em] text-white/80"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={ADMIN_LOGIN_PATH}
                className="block text-lg uppercase tracking-[0.12em] text-white/80"
                onClick={() => setMenuOpen(false)}
              >
                Admin
              </Link>
            </li>
            <li>
              <button
                type="button"
                className="mt-2 inline-flex w-full items-center justify-center rounded-sm bg-neon px-5 py-3 text-sm font-semibold uppercase tracking-wider text-carbon"
                onClick={() => {
                  setMenuOpen(false)
                  openTourModal()
                }}
              >
                Free Tour
              </button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
