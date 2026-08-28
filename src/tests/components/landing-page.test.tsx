import '@/tests/mocks/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '@/app/page'
import { SECTION_IDS } from '@/lib/sections'
import { Providers } from '@/components/providers'
import { HARLINGEN_JOIN_URL, LOCATIONS } from '@/lib/locations'

function renderHome() {
  return render(
    <Providers>
      <Home />
    </Providers>
  )
}

describe('Landing page', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
  })

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
    expect(screen.getByRole('heading', { name: /free gym tour/i })).toBeInTheDocument()
  })

  it('switches every location-aware section when McAllen is selected', async () => {
    const user = userEvent.setup()
    renderHome()

    await user.click(screen.getByRole('button', { name: /mcallen/i }))

    expect(
      screen.getByRole('button', { name: /lock in founding member pricing/i })
    ).toBeDisabled()
    expect(
      screen.queryByRole('link', { name: 'Request Membership' })
    ).not.toBeInTheDocument()

    expect(screen.getByText('Founding Member Pricing')).toBeInTheDocument()
    expect(screen.queryByText('Week Pass')).not.toBeInTheDocument()
    expect(screen.getByTestId('presale-countdown')).toBeInTheDocument()

    expect(screen.getByText(/hours coming soon/i)).toBeInTheDocument()
    expect(screen.getByText(LOCATIONS.mcallen.address)).toBeInTheDocument()
  })

  it('reverts to Harlingen content when switching back', async () => {
    const user = userEvent.setup()
    renderHome()

    await user.click(screen.getByRole('button', { name: /mcallen/i }))
    await user.click(screen.getByRole('button', { name: /harlingen/i }))

    expect(
      screen.getByRole('link', { name: 'Request Membership' })
    ).toHaveAttribute('href', HARLINGEN_JOIN_URL)
    expect(screen.getByText('Recurring')).toBeInTheDocument()
    expect(screen.getByText('Week Pass')).toBeInTheDocument()
    expect(screen.queryByTestId('presale-countdown')).not.toBeInTheDocument()
    expect(screen.getByText('Mon – Fri')).toBeInTheDocument()
  })
})
