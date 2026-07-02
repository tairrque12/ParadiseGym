import { describe, it, expect, vi } from 'vitest'
import {
  getSectionIdFromNavHref,
  scrollToSection,
} from '@/lib/section-nav'

describe('section-nav', () => {
  it('extracts section ids from home hash links', () => {
    expect(getSectionIdFromNavHref('/#amenities')).toBe('amenities')
    expect(getSectionIdFromNavHref('/gallery')).toBeNull()
  })

  it('scrolls to a section and updates the hash', () => {
    const target = document.createElement('section')
    target.id = 'pricing'
    document.body.appendChild(target)

    target.scrollIntoView = vi.fn()

    const scrolled = scrollToSection('pricing', 'auto')

    expect(scrolled).toBe(true)
    expect(target.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'auto',
      block: 'start',
    })
    expect(window.location.hash).toBe('#pricing')

    target.remove()
  })
})
