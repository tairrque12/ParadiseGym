import '@/tests/mocks/react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
      expect(document.getElementById(id)).toBeInTheDocument()
    }

    expect(document.getElementById('gallery')).not.toBeInTheDocument()
  })

  it('links membership externally and opens the tour modal from hero CTAs', async () => {
    const user = userEvent.setup()
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

    await user.click(screen.getAllByRole('button', { name: /book a free tour/i })[0])
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /book a free tour/i })
    ).toBeInTheDocument()
  })

  it('routes to the McAllen page from the marquee banner and the switcher', () => {
    renderHome()

    const announcement = screen.getByTestId('location-announcement')
    expect(announcement).toHaveAttribute('href', MCALLEN_PATH)
    expect(document.querySelector('header')?.firstElementChild).toBe(announcement)

    const switcher = within(
      screen.getByRole('navigation', { name: /gym locations/i })
    )
    expect(switcher.getByRole('link', { name: /mcallen/i })).toHaveAttribute(
      'href',
      MCALLEN_PATH
    )
    expect(switcher.getByRole('link', { name: /harlingen/i })).toHaveAttribute(
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
