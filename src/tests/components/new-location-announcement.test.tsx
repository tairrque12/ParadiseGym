import '@/tests/mocks/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NewLocationAnnouncement } from '@/components/NewLocationAnnouncement'
import { LocationProvider, useLocation } from '@/context/location-context'
import type { LocationId } from '@/lib/locations'

function SelectedLocationProbe() {
  const { locationId } = useLocation()
  return <span data-testid="selected-location">{locationId}</span>
}

function renderFor(locationId: LocationId) {
  return render(
    <LocationProvider initialLocationId={locationId}>
      <NewLocationAnnouncement />
      <SelectedLocationProbe />
      <section id="pricing">Pricing</section>
    </LocationProvider>
  )
}

describe('NewLocationAnnouncement', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
  })

  it('announces McAllen while Harlingen is selected', () => {
    renderFor('harlingen')

    expect(screen.getByTestId('new-location-announcement')).toBeInTheDocument()
    expect(screen.getByText('New Location')).toBeInTheDocument()
    expect(
      screen.getByText(/mcallen opens soon — founding member pricing is live/i)
    ).toBeInTheDocument()
  })

  it('stays visible when McAllen is already selected', () => {
    renderFor('mcallen')

    expect(screen.getByTestId('new-location-announcement')).toBeInTheDocument()
  })

  it('switches to McAllen and scrolls to pricing from its CTA', async () => {
    const user = userEvent.setup()
    renderFor('harlingen')

    const pricing = document.getElementById('pricing') as HTMLElement
    const scrollIntoView = vi.fn()
    pricing.scrollIntoView = scrollIntoView

    await user.click(
      screen.getByRole('button', { name: /view pre-sale pricing/i })
    )

    expect(screen.getByTestId('selected-location')).toHaveTextContent('mcallen')
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    })
  })

  it('drops the glow animation when reduced motion is preferred', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    renderFor('harlingen')

    expect(screen.getByTestId('new-location-announcement')).not.toHaveClass(
      'animate-neon-halo'
    )
  })
})
