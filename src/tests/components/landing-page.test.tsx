import '@/tests/mocks/react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import Home from '@/app/page'
import { SECTION_IDS } from '@/lib/sections'
import { Providers } from '@/components/providers'
import {
  ABC_CHECKOUT_NOTE,
  joinUrl,
  LOCATIONS,
  MCALLEN_PATH,
} from '@/lib/locations'

vi.mock('next/navigation', () => ({ usePathname: () => '/' }))

function renderHome() {
  return render(
    <Providers>
      <Home />
    </Providers>
  )
}

describe('Landing page', () => {
  it('renders all section anchors on the landing page', () => {
    renderHome()

    for (const id of Object.values(SECTION_IDS)) {
      if (id === SECTION_IDS.tour) continue
      expect(document.getElementById(id)).toBeInTheDocument()
    }
    expect(document.getElementById(SECTION_IDS.tour)).not.toBeInTheDocument()

    expect(document.getElementById('gallery')).not.toBeInTheDocument()
  })

  it('links membership externally and does not offer a tour', () => {
    renderHome()

    const heroJoin = screen.getByTestId('hero-join')
    expect(heroJoin).toHaveTextContent('Join now')
    expect(heroJoin).toHaveClass('bg-neon')
    expect(heroJoin).toHaveAttribute('href', joinUrl('harlingen', 'hero'))
    expect(heroJoin).toHaveAttribute('target', '_blank')
    expect(heroJoin).toHaveAttribute('rel', 'noopener noreferrer')
    expect(screen.getAllByText(ABC_CHECKOUT_NOTE).length).toBeGreaterThan(0)
    expect(screen.getByText(/open today/i)).toBeInTheDocument()
    expect(screen.getAllByText(LOCATIONS.harlingen.address).length).toBeGreaterThan(0)
    expect(screen.getByText('From $39.99/mo')).toBeInTheDocument()
    expect(screen.getByTestId('header-phone')).toHaveAttribute(
      'href',
      'tel:+19569905277'
    )
    expect(screen.queryByRole('link', { name: /request membership/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /book a free tour/i })).not.toBeInTheDocument()
    expect(screen.getByTestId('opening-banner')).toHaveAttribute('href', '/mcallen')
  })

  it('routes to the McAllen page from the header location toggle', () => {
    renderHome()

    expect(screen.queryByTestId('location-announcement')).not.toBeInTheDocument()
    const switcher = within(
      screen.getAllByRole('group', { name: /gym locations/i })[0]
    )
    expect(switcher.getByRole('button', { name: /mcallen/i })).toHaveAttribute(
      'href',
      MCALLEN_PATH
    )
    expect(switcher.getByRole('button', { name: /harlingen/i })).toHaveAttribute(
      'aria-current',
      'page'
    )
  })

  it('keeps the homepage scoped to Harlingen content', () => {
    renderHome()

    expect(screen.getByText('Recurring')).toBeInTheDocument()
    expect(screen.getByText('Week Pass')).toBeInTheDocument()
    expect(screen.getAllByText('Mon – Fri').length).toBeGreaterThan(0)
    expect(
      within(document.getElementById('hours') as HTMLElement).getByText(
        LOCATIONS.harlingen.address
      )
    ).toBeInTheDocument()

    expect(screen.queryByText(/hours coming soon/i)).not.toBeInTheDocument()
    expect(screen.queryByTestId('grand-opening-note')).not.toBeInTheDocument()
    expect(
      screen.queryByTestId('new-location-announcement')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText(/pre-sale membership options/i)
    ).not.toBeInTheDocument()
  })
})
