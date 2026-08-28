import '@/tests/mocks/react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '@/app/page'
import { SECTION_IDS } from '@/lib/sections'
import { Providers } from '@/components/providers'
import { MEMBERSHIP_JOIN_URL } from '@/lib/membership-options'

describe('Landing page', () => {
  it('renders all section anchors on the landing page', () => {
    render(
      <Providers>
        <Home />
      </Providers>
    )

    for (const id of Object.values(SECTION_IDS)) {
      expect(document.getElementById(id)).toBeInTheDocument()
    }

    expect(document.getElementById('gallery')).not.toBeInTheDocument()
  })

  it('links membership externally and opens the tour modal from hero CTAs', async () => {
    const user = userEvent.setup()
    render(
      <Providers>
        <Home />
      </Providers>
    )

    const membershipLink = screen.getByRole('link', {
      name: 'Request Membership',
    })
    expect(membershipLink).toHaveAttribute('href', MEMBERSHIP_JOIN_URL)
    expect(membershipLink).toHaveAttribute('target', '_blank')
    expect(membershipLink).toHaveAttribute('rel', 'noopener noreferrer')

    await user.click(screen.getByRole('button', { name: 'Free Gym Tour' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /free gym tour/i })).toBeInTheDocument()
  })
})
