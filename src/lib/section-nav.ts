import type { MouseEvent } from 'react'
import { MCALLEN_PATH } from '@/lib/locations'

export function sectionHrefForPath(href: string, pathname: string): string {
  if (!href.startsWith('/#')) return href
  if (pathname === MCALLEN_PATH) return `${MCALLEN_PATH}${href.slice(1)}`
  return href
}

export function getSectionIdFromNavHref(href: string): string | null {
  const hashIndex = href.indexOf('#')
  if (hashIndex === -1) return null
  return href.slice(hashIndex + 1)
}

export function scrollToSection(
  sectionId: string,
  behavior: ScrollBehavior = 'smooth',
  pathname = window.location.pathname
) {
  const target = document.getElementById(sectionId)
  if (!target) return false

  target.scrollIntoView({ behavior, block: 'start' })
  const next =
    pathname === '/' ? `/#${sectionId}` : `${pathname}#${sectionId}`
  const current = `${window.location.pathname}${window.location.hash}`
  if (current !== next) window.history.pushState(null, '', next)
  return true
}

export function handleSectionNavClick(
  event: MouseEvent<HTMLAnchorElement>,
  href: string,
  pathname = window.location.pathname
) {
  const sectionId = getSectionIdFromNavHref(href)
  if (!sectionId) return

  const linkPath = href.startsWith('/#') ? '/' : href.slice(0, href.indexOf('#'))
  if (linkPath === pathname) {
    event.preventDefault()
    scrollToSection(sectionId, 'smooth', pathname)
  }
}
