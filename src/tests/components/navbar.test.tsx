import '@/tests/mocks/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Providers } from '@/components/providers'
import { Navbar } from '@/components/sections/Navbar'
import { joinUrl } from '@/lib/locations'

const usePathname = vi.hoisted(() => vi.fn(() => '/'))

vi.mock('next/navigation', () => ({ usePathname }))

describe('Navbar', () => {
  beforeEach(() => {
    usePathname.mockReturnValue('/')
  })

  it('renders the McAllen announcement above the nav row on the main site', () => {
    render(
      <Providers>
        <Navbar />
      </Providers>
    )

    const header = screen.getByRole('banner')
    const announcement = screen.getByTestId('location-announcement')

    expect(header).toContainElement(announcement)
    expect(header.firstElementChild).toBe(announcement)
    expect(
      within(header).getByRole('navigation', { name: /gym locations/i })
    ).toBeInTheDocument()
  })

  it('hides the announcement on the McAllen page it promotes', () => {
    usePathname.mockReturnValue('/mcallen')

    render(
      <Providers>
        <Navbar />
      </Providers>
    )

    expect(screen.queryByTestId('location-announcement')).not.toBeInTheDocument()
  })

  it('points the primary CTA at the active location membership', () => {
    const { rerender } = render(
      <Providers>
        <Navbar />
      </Providers>
    )

    const harlingenCta = screen.getByTestId('header-cta')
    expect(harlingenCta).toHaveTextContent('Join now')
    expect(harlingenCta).toHaveClass('bg-neon')
    expect(harlingenCta).toHaveAttribute('href', joinUrl('harlingen', 'header'))
    expect(harlingenCta).toHaveAttribute('target', '_blank')
    expect(harlingenCta).toHaveAttribute('rel', 'noopener noreferrer')
    expect(screen.getByTestId('header-tour')).toHaveTextContent(
      /book a free tour/i
    )
    expect(screen.getByTestId('header-tour')).not.toHaveClass('bg-neon')

    usePathname.mockReturnValue('/mcallen')
    rerender(
      <Providers>
        <Navbar />
      </Providers>
    )

    const mcallenCta = screen.getByTestId('header-cta')
    expect(mcallenCta).toHaveTextContent('Join now')
    expect(mcallenCta).toHaveAttribute('href', joinUrl('mcallen', 'header'))
  })

  it('marks the gallery link as current on the gallery page', () => {
    usePathname.mockReturnValue('/gallery')

    render(
      <Providers>
        <Navbar />
      </Providers>
    )

    expect(
      within(screen.getByTestId('desktop-nav')).getByRole('link', {
        name: 'Gallery',
      })
    ).toHaveAttribute('aria-current', 'page')
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

  it('closes the mobile menu when the viewport reaches desktop width', async () => {
    const user = userEvent.setup()
    let onChange: ((event: { matches: boolean }) => void) | undefined
    const desktopMedia = {
      matches: false,
      media: '(min-width: 1280px)',
      addEventListener: vi.fn(
        (event: string, callback: (event: { matches: boolean }) => void) => {
          if (event === 'change') onChange = callback
        }
      ),
      removeEventListener: vi.fn(),
    }
    const originalMatchMedia = window.matchMedia
    window.matchMedia = vi.fn((query: string) => {
      if (query === '(min-width: 1280px)') {
        return desktopMedia as unknown as MediaQueryList
      }
      return {
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      } as unknown as MediaQueryList
    }) as unknown as typeof window.matchMedia

    try {
      render(
        <Providers>
          <Navbar />
        </Providers>
      )

      const menuButton = screen.getByTestId('mobile-menu-button')
      await user.click(menuButton)
      await waitFor(() => {
        expect(menuButton).toHaveAttribute('aria-expanded', 'true')
      })

      desktopMedia.matches = false
      onChange?.({ matches: false })
      expect(menuButton).toHaveAttribute('aria-expanded', 'true')

      desktopMedia.matches = true
      onChange?.({ matches: true })

      await waitFor(() => {
        expect(menuButton).toHaveAttribute('aria-expanded', 'false')
      })
      expect(
        screen.queryByRole('navigation', { name: /mobile/i })
      ).not.toBeInTheDocument()
    } finally {
      window.matchMedia = originalMatchMedia
    }
  })

  it('lets the header location switcher dismiss the open menu', async () => {
    const user = userEvent.setup()
    render(
      <Providers>
        <Navbar />
      </Providers>
    )

    const menuButton = screen.getByTestId('mobile-menu-button')
    await user.click(menuButton)
    await waitFor(() => {
      expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    })

    await user.click(
      within(screen.getByRole('navigation', { name: /gym locations/i })).getByRole(
        'link',
        { name: /mcallen/i }
      )
    )

    await waitFor(() => {
      expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    })
    expect(screen.queryByRole('navigation', { name: /mobile/i })).not.toBeInTheDocument()
  })

  it('closes the mobile menu after a link is chosen', async () => {
    const user = userEvent.setup()
    render(
      <Providers>
        <Navbar />
      </Providers>
    )

    const menuButton = screen.getByTestId('mobile-menu-button')
    await user.click(menuButton)

    const mobileNav = screen.getByRole('navigation', { name: /mobile/i })
    await user.click(within(mobileNav).getByRole('link', { name: 'Gallery' }))

    await waitFor(() => {
      expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    })
  })

  it('opens tour modal from Free Tour CTA', async () => {
    const user = userEvent.setup()
    render(
      <Providers>
        <Navbar />
      </Providers>
    )

    await user.click(screen.getByTestId('mobile-menu-button'))
    const mobileNav = screen.getByRole('navigation', { name: /mobile/i })
    const tour = within(mobileNav).getByTestId('mobile-tour')
    const join = within(mobileNav).getByTestId('mobile-join')
    expect(join.compareDocumentPosition(tour) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    await user.click(tour)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /book a free tour/i })
    ).toBeInTheDocument()
  })
})
