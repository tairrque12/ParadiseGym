import { describe, it, expect } from 'vitest'
import { GALLERY_IMAGES } from '@/lib/gallery'

describe('gallery images', () => {
  it('defines five gym photos with src and alt text', () => {
    expect(GALLERY_IMAGES).toHaveLength(5)

    for (const image of GALLERY_IMAGES) {
      expect(image.src).toMatch(/^\/images\/gallery\//)
      expect(image.alt.length).toBeGreaterThan(0)
    }
  })
})
