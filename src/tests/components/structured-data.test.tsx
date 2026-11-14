import '@/tests/mocks/react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'
import McAllenPage from '@/app/mcallen/page'
import GalleryPage from '@/app/gallery/page'
import { Providers } from '@/components/providers'

vi.mock('next/navigation', () => ({ usePathname: () => '/' }))

function jsonLdBlocks(): unknown[] {
  return [...document.querySelectorAll('script[type="application/ld+json"]')].map(
    (script) => JSON.parse(script.textContent ?? '')
  )
}

function renderPage(page: React.ReactElement) {
  return render(<Providers>{page}</Providers>)
}

describe('structured data on pages', () => {
  it('puts one Harlingen HealthClub on the homepage and none on the gallery', () => {
    const { unmount } = renderPage(<Home />)
    const homeBlocks = jsonLdBlocks()

    expect(homeBlocks).toHaveLength(1)
    expect(homeBlocks[0]).toMatchObject({
      '@type': 'HealthClub',
      name: 'Paradise Gym Harlingen',
      address: { streetAddress: '6201 FM 106 UNIT 16A' },
    })
    expect(homeBlocks[0]).toHaveProperty('openingHoursSpecification')
    unmount()

    renderPage(<GalleryPage />)
    expect(jsonLdBlocks()).toEqual([])
    expect(
      screen.getByRole('heading', { level: 1, name: /the gym/i })
    ).toBeInTheDocument()
  })

  it('puts one McAllen HealthClub on the McAllen page without hours', () => {
    renderPage(<McAllenPage />)
    const blocks = jsonLdBlocks()

    expect(blocks).toHaveLength(1)
    expect(blocks[0]).toMatchObject({
      '@type': 'HealthClub',
      name: 'Paradise Gym McAllen',
      address: { streetAddress: '1001 N. Jackson Road' },
    })
    expect(blocks[0]).not.toHaveProperty('openingHoursSpecification')
    expect(JSON.stringify(blocks[0])).not.toMatch(
      /aggregateRating|reviewCount|latitude|longitude/i
    )
  })
})
