import '@/tests/mocks/react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '@/app/page'
import { SECTION_IDS } from '@/lib/sections'
import { Providers } from '@/components/providers'
import { HARLINGEN_JOIN_URL, LOCATIONS, MCALLEN_PATH } from '@/lib/locations'

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

    const membershipLink = screen.getByRole('link', {
      name: 'Request Membership',
    })
    expect(membershipLink).toHaveAttribute('href', HARLINGEN_JOIN_URL)
    expect(membershipLink).toHaveAttribute('target', '_blank')
    expect(membershipLink).toHaveAttribute('rel', 'noopener noreferrer')

    await user.click(screen.getByRole('button', { name: 'Free Gym Tour' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /free gym tour/i })
    ).toBeInTheDocument()
  })

  it('routes to the McAllen page from the announcement and the switcher', () => {
    renderHome()

    const announcement = within(
      screen.getByTestId('new-location-announcement')
    )
    expect(
      announcement.getByRole('link', { name: /view pre-sale pricing/i })
    ).toHaveAttribute('href', MCALLEN_PATH)

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
    expect(screen.queryByTestId('presale-countdown')).not.toBeInTheDocument()
    expect(
      screen.queryByText(/pre-sale membership options/i)
    ).not.toBeInTheDocument()
  })
})
