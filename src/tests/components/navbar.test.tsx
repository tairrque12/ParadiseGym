import '@/tests/mocks/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Providers } from '@/components/providers'
import { Navbar } from '@/components/sections/Navbar'

const usePathname = vi.hoisted(() => vi.fn(() => '/'))

vi.mock('next/navigation', () => ({ usePathname }))

describe('Navbar', () => {
  beforeEach(() => {
    usePathname.mockReturnValue('/')
  })

  it('renders the McAllen marquee above the nav row on the main site', () => {
    render(
      <Providers>
        <Navbar />
      </Providers>
    )

    const header = screen.getByRole('banner')
    const marquee = screen.getByTestId('new-location-marquee')

    expect(header).toContainElement(marquee)
    expect(header.firstElementChild).toBe(marquee)
  })

  it('hides the marquee on the McAllen page it promotes', () => {
    usePathname.mockReturnValue('/mcallen')

    render(
      <Providers>
        <Navbar />
      </Providers>
    )

    expect(
      screen.queryByTestId('new-location-marquee')
    ).not.toBeInTheDocument()
  })

  it('toggles mobile menu open and closed', async () => {
    const user = userEvent.setup()
    render(
      <Providers>
        <Navbar />
      </Providers>
    )

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
    render(
      <Providers>
        <Navbar />
      </Providers>
    )

    await user.click(screen.getByTestId('mobile-menu-button'))

    const mobileNav = screen.getByRole('navigation', { name: /mobile/i })

    expect(within(mobileNav).getByRole('link', { name: 'Amenities' })).toHaveAttribute(
      'href',
      '/#amenities'
    )
    expect(within(mobileNav).getByRole('link', { name: 'Gallery' })).toHaveAttribute(
      'href',
      '/gallery'
    )
    expect(within(mobileNav).getByRole('link', { name: 'Pricing' })).toHaveAttribute(
      'href',
      '/#pricing'
    )
    expect(within(mobileNav).getByRole('link', { name: 'Reviews' })).toHaveAttribute(
      'href',
      '/#reviews'
    )
    expect(within(mobileNav).getByRole('link', { name: 'Hours' })).toHaveAttribute(
      'href',
      '/#hours'
    )
  })

  it('opens tour modal from Free Tour CTA', async () => {
    const user = userEvent.setup()
    render(
      <Providers>
        <Navbar />
      </Providers>
    )

    await user.click(screen.getByTestId('mobile-menu-button'))
    await user.click(within(screen.getByRole('navigation', { name: /mobile/i })).getByRole('button', { name: /free tour/i }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/free gym tour/i)).toBeInTheDocument()
  })
})
