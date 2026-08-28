import '@/tests/mocks/react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import McAllenPage from '@/app/mcallen/page'
import { Providers } from '@/components/providers'
import { LOCATIONS, MCALLEN_JOIN_URL } from '@/lib/locations'

vi.mock('next/navigation', () => ({ usePathname: () => '/mcallen' }))

function renderMcAllen() {
  return render(
    <Providers>
      <McAllenPage />
    </Providers>
  )
}

describe('McAllen page', () => {
  it('leads with a McAllen-specific hero', () => {
    renderMcAllen()

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent(/paradise gym/i)
    expect(heading).toHaveTextContent(/mcallen/i)
    expect(screen.getByText('Pre-Sale Now Open')).toBeInTheDocument()
    expect(screen.getByText(/20,000 sq ft of custom-built/i)).toBeInTheDocument()
  })

  it('shows static grand opening copy instead of a live countdown', () => {
    renderMcAllen()

    expect(screen.getByTestId('grand-opening-note')).toHaveTextContent(
      'Official Grand Opening Date — Coming Soon'
    )
    expect(screen.queryByTestId('presale-countdown')).not.toBeInTheDocument()
    expect(screen.queryByText(/opening in/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/\bdays\b/i)).not.toBeInTheDocument()
  })

  it('places the pre-sale pricing section directly after the hero', () => {
    renderMcAllen()

    const sections = Array.from(
      document.querySelectorAll('main > section')
    ) as HTMLElement[]

    expect(sections.length).toBeGreaterThan(2)
    expect(sections[1]).toHaveAttribute('id', 'pricing')
    expect(
      within(sections[1]).getByRole('heading', {
        name: /pre-sale membership options/i,
      })
    ).toBeInTheDocument()
  })

  it('links all three pre-sale options to the McAllen club signup', () => {
    renderMcAllen()

    const pricing = within(document.getElementById('pricing') as HTMLElement)
    const links = pricing.getAllByRole('link')
    expect(links).toHaveLength(3)

    for (const [name, price] of [
      [/1 year paid in full/i, '$499.99'],
      [/12 month contract/i, '$39.99/mo'],
      [/month to month/i, '$49.99/mo'],
    ] as const) {
      const link = pricing.getByRole('link', { name })
      expect(link).toHaveAttribute('href', MCALLEN_JOIN_URL)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      expect(link).toHaveTextContent(price)
      expect(link).toHaveTextContent(/join now/i)
    }

    expect(pricing.queryByText('Week Pass')).not.toBeInTheDocument()
    expect(pricing.queryByText('Day Pass')).not.toBeInTheDocument()
    expect(pricing.queryByText('One Month')).not.toBeInTheDocument()
  })

  it('sends the hero CTA to the McAllen signup', () => {
    renderMcAllen()

    expect(
      screen.getByRole('link', { name: /lock in founding member pricing/i })
    ).toHaveAttribute('href', MCALLEN_JOIN_URL)
  })

  it('shows McAllen hours and address instead of Harlingen details', () => {
    renderMcAllen()

    const hours = within(document.getElementById('hours') as HTMLElement)
    expect(hours.getByText(/hours coming soon/i)).toBeInTheDocument()
    expect(hours.getByText(LOCATIONS.mcallen.address)).toBeInTheDocument()
    expect(screen.queryByText('Mon – Fri')).not.toBeInTheDocument()
    expect(
      screen.queryByText(LOCATIONS.harlingen.address)
    ).not.toBeInTheDocument()
  })

  it('marks McAllen as the current location in the shared switcher', () => {
    renderMcAllen()

    const switcher = within(
      screen.getByRole('navigation', { name: /gym locations/i })
    )
    expect(switcher.getByRole('link', { name: /mcallen/i })).toHaveAttribute(
      'aria-current',
      'page'
    )
    expect(
      switcher.getByRole('link', { name: /harlingen/i })
    ).not.toHaveAttribute('aria-current')
  })

  it('keeps the shared amenities and reviews sections', () => {
    renderMcAllen()

    expect(document.getElementById('amenities')).toBeInTheDocument()
    expect(document.getElementById('reviews')).toBeInTheDocument()
  })
})
