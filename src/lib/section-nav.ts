import type { MouseEvent } from 'react'

export function getSectionIdFromNavHref(href: string): string | null {
  if (!href.startsWith('/#')) return null
  return href.slice(2)
}

export function scrollToSection(sectionId: string, behavior: ScrollBehavior = 'smooth') {
  const target = document.getElementById(sectionId)
  if (!target) return false

  target.scrollIntoView({ behavior, block: 'start' })
  window.history.pushState(null, '', `/#${sectionId}`)
  return true
}

export function handleSectionNavClick(
  event: MouseEvent<HTMLAnchorElement>,
  href: string
) {
  const sectionId = getSectionIdFromNavHref(href)
  if (!sectionId) return

  if (window.location.pathname === '/') {
    event.preventDefault()
    scrollToSection(sectionId)
  }
}
