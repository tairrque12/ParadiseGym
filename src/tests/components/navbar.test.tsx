import '@/tests/mocks/react'
import { describe, it, expect } from 'vitest'
import { render, screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Navbar } from '@/components/sections/Navbar'

describe('Navbar', () => {
  it('toggles mobile menu open and closed', async () => {
    const user = userEvent.setup()
    render(<Navbar />)

    const menuButton = screen.getByTestId('mobile-menu-button')
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')

    await user.click(menuButton)

    await waitFor(() => {
      expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    })
    expect(screen.getByRole('navigation', { name: /mobile/i })).toBeVisible()

    await user.click(menuButton)

    await waitFor(() => {
      expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    })
  })

  it('renders anchor links to page sections', async () => {
    const user = userEvent.setup()
    render(<Navbar />)

    await user.click(screen.getByTestId('mobile-menu-button'))

    const mobileNav = screen.getByRole('navigation', { name: /mobile/i })

    expect(within(mobileNav).getByRole('link', { name: 'Amenities' })).toHaveAttribute(
      'href',
      '#amenities'
    )
    expect(within(mobileNav).getByRole('link', { name: 'Pricing' })).toHaveAttribute(
      'href',
      '#pricing'
    )
    expect(within(mobileNav).getByRole('link', { name: 'Reviews' })).toHaveAttribute(
      'href',
      '#reviews'
    )
    expect(within(mobileNav).getByRole('link', { name: 'Hours' })).toHaveAttribute(
      'href',
      '#hours'
    )
  })

  it('renders Free Tour CTA linking to tour anchor', async () => {
    const user = userEvent.setup()
    render(<Navbar />)

    await user.click(screen.getByTestId('mobile-menu-button'))

    const mobileNav = screen.getByRole('navigation', { name: /mobile/i })
    const tourLink = within(mobileNav).getByRole('link', { name: /free tour/i })
    expect(tourLink).toHaveAttribute('href', '#tour')
  })
})
