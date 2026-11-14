import '@/tests/mocks/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Providers } from '@/components/providers'
import { Navbar } from '@/components/sections/Navbar'
import { joinUrl } from '@/lib/locations'
import { MEMBERSHIP_OPTIONS } from '@/lib/membership-options'

const usePathname = vi.hoisted(() => vi.fn(() => '/'))

vi.mock('next/navigation', () => ({ usePathname }))

const fromPrice = MEMBERSHIP_OPTIONS.find(
  (option) => option.slug === '12_month_contract'
)?.price

describe('Navbar', () => {
  beforeEach(() => {
    usePathname.mockReturnValue('/')
  })

  it('keeps the header to one row and moves the pre-sale note into the menu', async () => {
    const user = userEvent.setup()
    render(
      <Providers>
        <Navbar />
      </Providers>
    )

    const header = screen.getByRole('banner')
    expect(within(header).getByTestId('nav-row')).toHaveClass('h-[60px]')
    expect(screen.getByTestId('opening-banner')).toHaveAttribute('href', '/mcallen')
    expect(screen.getByTestId('opening-banner-arrow')).toHaveClass('bg-neon', 'w-14')
    expect(screen.queryByTestId('location-announcement')).not.toBeInTheDocument()
    expect(within(header).queryByText('Call')).not.toBeInTheDocument()

    await user.click(screen.getByTestId('mobile-menu-button'))
    expect(screen.getByText('McAllen pre-sale is open')).toBeInTheDocument()
  })

  it('points the primary CTA at the active location membership', () => {
    const { rerender } = render(
      <Providers>
        <Navbar />
      </Providers>
    )

    const harlingenCta = screen.getByTestId('header-cta')
    expect(harlingenCta).toHaveTextContent('Join today')
    expect(harlingenCta).toHaveClass('bg-neon')
    expect(harlingenCta).toHaveAttribute('href', joinUrl('harlingen', 'header'))
    expect(harlingenCta).toHaveAttribute('target', '_blank')
    expect(harlingenCta).toHaveAttribute('rel', 'noopener noreferrer')
    expect(screen.queryByTestId('header-tour')).not.toBeInTheDocument()
    expect(screen.queryByTestId('mobile-header-join')).not.toBeInTheDocument()

    usePathname.mockReturnValue('/mcallen')
    rerender(
      <Providers>
        <Navbar />
      </Providers>
    )

    expect(screen.getByTestId('header-cta')).toHaveAttribute(
      'href',
      joinUrl('mcallen', 'header')
    )
    expect(screen.queryByTestId('mobile-header-join')).not.toBeInTheDocument()
  })

  it('keeps McAllen section links on the McAllen page, including reviews', () => {
    usePathname.mockReturnValue('/mcallen')

    render(
      <Providers>
        <Navbar />
      </Providers>
    )

    const desktop = within(screen.getByTestId('desktop-nav'))
    expect(desktop.getByRole('link', { name: 'Amenities' })).toHaveAttribute(
      'href',
      '/mcallen#amenities'
    )
    expect(desktop.getByRole('link', { name: 'Pricing' })).toHaveAttribute(
      'href',
      '/mcallen#pricing'
    )
    expect(desktop.getByRole('link', { name: 'Reviews' })).toHaveAttribute(
      'href',
      '/mcallen#reviews'
    )
    expect(desktop.getByRole('link', { name: 'Hours' })).toHaveAttribute(
      'href',
      '/mcallen#hours'
    )
    expect(desktop.queryByRole('link', { name: 'Gallery' })).not.toBeInTheDocument()
  })

  it('marks the McAllen section that was just clicked as current', async () => {
    usePathname.mockReturnValue('/mcallen')
    const user = userEvent.setup()

    render(
      <Providers>
        <Navbar />
      </Providers>
    )

    const desktop = within(screen.getByTestId('desktop-nav'))
    const pricing = desktop.getByRole('link', { name: 'Pricing' })
    await user.click(pricing)

    expect(pricing).toHaveAttribute('aria-current', 'page')
    expect(desktop.getByRole('link', { name: 'Amenities' })).not.toHaveAttribute(
      'aria-current'
    )
  })

  it('opens a modal menu with location-aware links and the membership price', async () => {
    const user = userEvent.setup()
    usePathname.mockReturnValue('/mcallen')
    render(
      <Providers>
        <Navbar />
      </Providers>
    )

    const menuButton = screen.getByTestId('mobile-menu-button')
    expect(menuButton).toHaveAttribute('aria-label', 'Open menu')
    await user.click(menuButton)

    const dialog = screen.getByRole('dialog')
    const mobileNav = within(dialog).getByRole('navigation', { name: /mobile/i })
    expect(within(mobileNav).getByRole('link', { name: 'Pricing' })).toHaveAttribute(
      'href',
      '/mcallen#pricing'
    )
    expect(within(mobileNav).getByRole('link', { name: 'Reviews' })).toHaveAttribute(
      'href',
      '/mcallen#reviews'
    )
    expect(within(mobileNav).queryByRole('link', { name: 'Gallery' })).not.toBeInTheDocument()

    const join = within(dialog).getByTestId('mobile-join')
    expect(join).toHaveAttribute('href', joinUrl('mcallen', 'mobile_menu'))
    expect(join).toHaveTextContent(`Join today · from ${fromPrice}`)
    expect(
      within(dialog)
        .getAllByRole('link', { name: /^call$/i })
        .some((link) => link.getAttribute('href') === 'tel:+19569905277')
    ).toBe(true)
    expect(within(dialog).queryByTestId('mobile-tour')).not.toBeInTheDocument()
    const locationToggle = within(dialog).getByRole('group', { name: /gym locations/i })
    expect(
      locationToggle.compareDocumentPosition(mobileNav) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
  })

  it('marks the McAllen menu link that was just clicked as current', async () => {
    usePathname.mockReturnValue('/mcallen')
    const user = userEvent.setup()
    render(
      <Providers>
        <Navbar />
      </Providers>
    )

    await user.click(screen.getByTestId('mobile-menu-button'))
    const mobileNav = within(screen.getByRole('dialog')).getByRole('navigation', {
      name: /mobile/i,
    })
    const pricing = within(mobileNav).getByRole('link', { name: 'Pricing' })
    await user.click(pricing)

    expect(pricing).toHaveAttribute('aria-current', 'page')
  })

  it('closes the mobile menu when the viewport reaches desktop width', async () => {
    const user = userEvent.setup()
    let onChange: ((event: { matches: boolean }) => void) | undefined
    const desktopMedia = {
      matches: false,
      media: '(min-width: 1024px)',
      addEventListener: vi.fn(
        (event: string, callback: (event: { matches: boolean }) => void) => {
          if (event === 'change') onChange = callback
        }
      ),
      removeEventListener: vi.fn(),
    }
    const originalMatchMedia = window.matchMedia
    window.matchMedia = vi.fn((query: string) => {
      if (query === '(min-width: 1024px)') {
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
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      desktopMedia.matches = true
      onChange?.({ matches: true })

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    } finally {
      window.matchMedia = originalMatchMedia
    }
  })

  it('closes the menu when a section link or location is chosen', async () => {
    const user = userEvent.setup()
    render(
      <Providers>
        <Navbar />
      </Providers>
    )

    const menuButton = screen.getByTestId('mobile-menu-button')
    await user.click(menuButton)
    const dialog = screen.getByRole('dialog')
    await user.click(
      within(within(dialog).getByRole('navigation', { name: /mobile/i })).getByRole(
        'link',
        { name: 'Pricing' }
      )
    )

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    await user.click(menuButton)
    const reopened = screen.getByRole('dialog')
    await user.click(within(reopened).getByRole('button', { name: /mcallen/i }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

})
