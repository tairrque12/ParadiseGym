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

  it('loads the dumbbell rack immediately and lazy-loads the other photos', () => {
    render(
      <Providers>
        <Gallery />
      </Providers>
    )

    for (const image of GALLERY_IMAGES) {
      const photo = screen.getByRole('img', { name: image.alt })
      if ('priority' in image && image.priority) {
        expect(photo).toHaveAttribute('fetchpriority', 'high')
        expect(photo).not.toHaveAttribute('loading', 'lazy')
      } else {
        expect(photo).toHaveAttribute('loading', 'lazy')
        expect(photo).not.toHaveAttribute('fetchpriority')
      }
    }
  })
})
