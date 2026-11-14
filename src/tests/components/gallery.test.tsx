import '@/tests/mocks/react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Gallery } from '@/components/sections/Gallery'
import { GALLERY_IMAGES } from '@/lib/gallery'

describe('Gallery', () => {
  it('renders the gallery section with all photos', () => {
    render(<Gallery />)

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(
      screen.getByRole('heading', { level: 1, name: /the gym/i })
    ).toBeInTheDocument()

    for (const image of GALLERY_IMAGES) {
      expect(screen.getByRole('img', { name: image.alt })).toBeInTheDocument()
    }
  })

  it('loads the first photo immediately and leaves the rest lazy', () => {
    render(<Gallery />)

    const images = GALLERY_IMAGES.map((image) =>
      screen.getByRole('img', { name: image.alt })
    )

    expect(images[0]).toHaveAttribute('fetchpriority', 'high')
    expect(images[0]).not.toHaveAttribute('loading', 'lazy')

    for (const image of images.slice(1)) {
      expect(image).toHaveAttribute('loading', 'lazy')
      expect(image).not.toHaveAttribute('fetchpriority')
    }
  })
})
