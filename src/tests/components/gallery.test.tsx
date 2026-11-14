import '@/tests/mocks/react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Gallery } from '@/components/sections/Gallery'
import { Providers } from '@/components/providers'
import { GALLERY_IMAGES } from '@/lib/gallery'

vi.mock('next/navigation', () => ({ usePathname: () => '/gallery' }))

describe('Gallery', () => {
  it('renders the gallery section with all photos', () => {
    render(
      <Providers>
        <Gallery />
      </Providers>
    )

    expect(
      screen.getByRole('button', { name: /book a free tour/i })
    ).toBeInTheDocument()

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(
      screen.getByRole('heading', { level: 1, name: /the gym/i })
    ).toBeInTheDocument()

    for (const image of GALLERY_IMAGES) {
      expect(screen.getByRole('img', { name: image.alt })).toBeInTheDocument()
    }
  })

  it('prioritizes the dumbbell rack and lazy-loads the other photos', () => {
    render(
      <Providers>
        <Gallery />
      </Providers>
    )

    const rack = screen.getByRole('img', {
      name: /premier dumbbell rack/i,
    })
    expect(rack).toHaveAttribute('fetchpriority', 'high')
    expect(rack).not.toHaveAttribute('loading', 'lazy')

    for (const image of GALLERY_IMAGES.filter((entry) => !entry.priority)) {
      const photo = screen.getByRole('img', { name: image.alt })
      expect(photo).toHaveAttribute('loading', 'lazy')
      expect(photo).not.toHaveAttribute('fetchpriority')
    }
  })
})
