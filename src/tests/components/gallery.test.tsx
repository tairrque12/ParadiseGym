import '@/tests/mocks/react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Gallery } from '@/components/sections/Gallery'
import { GALLERY_IMAGES } from '@/lib/gallery'
import { SECTION_IDS } from '@/lib/sections'

describe('Gallery', () => {
  it('renders the gallery section with all photos', () => {
    render(<Gallery />)

    expect(document.getElementById(SECTION_IDS.gallery)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /the gym/i })).toBeInTheDocument()

    for (const image of GALLERY_IMAGES) {
      expect(screen.getByRole('img', { name: image.alt })).toBeInTheDocument()
    }
  })
})
