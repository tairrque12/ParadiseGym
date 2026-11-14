import '@/tests/mocks/react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import McAllenPage, { metadata } from '@/app/mcallen/page'
import { Providers } from '@/components/providers'
import { joinUrl, LOCATIONS } from '@/lib/locations'

vi.mock('next/navigation', () => ({ usePathname: () => '/mcallen' }))

function renderMcAllen() {
  return render(
    <Providers>
      <McAllenPage />
    </Providers>
  )
}

describe('McAllen page', () => {
  it('keeps the SEO title and description for McAllen', () => {
    expect(metadata.title).toBe('Paradise Gym McAllen')
    expect(metadata.description).toMatch(/Official Grand Opening Date — Coming Soon/i)
    expect(metadata.description).not.toMatch(/sq ft/i)
  })

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
    expect(screen.queryByText(/\bdays left\b/i)).not.toBeInTheDocument()
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

    for (const [name, price, slug] of [
      [/1 year paid in full/i, '$499.99', '1_year_paid_in_full'],
      [/12 month contract/i, '$39.99/mo', '12_month_contract'],
      [/month to month/i, '$49.99/mo', 'month_to_month'],
    ] as const) {
      const link = pricing.getByRole('link', { name })
      expect(link).toHaveAttribute('href', joinUrl('mcallen', slug))
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      expect(link).toHaveTextContent(price)
      expect(link).toHaveTextContent(/join now/i)
      if (slug === '12_month_contract') {
        expect(link).toHaveTextContent('Recommended')
        expect(link).toHaveTextContent('Amount due today $43.29')
      } else {
        expect(link).not.toHaveTextContent(/due today/i)
      }
      expect(link).not.toHaveTextContent(/\$30/)
    }

    expect(pricing.queryByText('Week Pass')).not.toBeInTheDocument()
    expect(pricing.queryByText('Day Pass')).not.toBeInTheDocument()
    expect(pricing.queryByText('One Month')).not.toBeInTheDocument()
  })

  it('sends the hero CTA to the McAllen signup', () => {
    renderMcAllen()

    const heroJoin = screen.getByTestId('hero-join')
    expect(heroJoin).toHaveTextContent('Join founding membership')
    expect(heroJoin).toHaveAttribute('href', joinUrl('mcallen', 'hero'))
    expect(heroJoin).toHaveAttribute('target', '_blank')
    expect(
      screen.getAllByRole('button', { name: /book a free tour/i }).length
    ).toBeGreaterThan(0)
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
      screen.getAllByRole('group', { name: /gym locations/i })[0]
    )
    expect(switcher.getByRole('button', { name: /mcallen/i })).toHaveAttribute(
      'aria-current',
      'page'
    )
    expect(
      switcher.getByRole('button', { name: /harlingen/i })
    ).not.toHaveAttribute('aria-current')
  })

  it('does not promote itself with the McAllen marquee banner', () => {
    renderMcAllen()

    expect(
      screen.queryByTestId('location-announcement')
    ).not.toBeInTheDocument()
  })

  it('keeps the shared amenities and reviews sections', () => {
    renderMcAllen()

    expect(document.getElementById('amenities')).toBeInTheDocument()
    expect(document.getElementById('reviews')).toBeInTheDocument()
  })
})
