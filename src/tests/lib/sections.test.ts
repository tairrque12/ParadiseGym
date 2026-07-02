import { describe, it, expect } from 'vitest'
import { NAV_LINKS, SECTION_IDS } from '@/lib/sections'

describe('section navigation', () => {
  it('defines all required section ids', () => {
    expect(SECTION_IDS).toEqual({
      amenities: 'amenities',
      gallery: 'gallery',
      pricing: 'pricing',
      reviews: 'reviews',
      hours: 'hours',
      tour: 'tour',
    })
  })

  it('nav links point to valid section anchor ids', () => {
    const validIds = new Set(Object.values(SECTION_IDS))
    for (const link of NAV_LINKS) {
      const id = link.href.replace('#', '')
      expect(validIds.has(id)).toBe(true)
    }
  })

  it('includes amenities, gallery, pricing, reviews, and hours nav links', () => {
    const labels = NAV_LINKS.map((link) => link.label)
    expect(labels).toEqual(['Amenities', 'Gallery', 'Pricing', 'Reviews', 'Hours'])
  })
})
