import '@/tests/mocks/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HoursLocation } from '@/components/sections/HoursLocation'
import { LocationProvider } from '@/context/location-context'
import { LOCATIONS } from '@/lib/locations'
import type { LocationId } from '@/lib/locations'

function renderFor(locationId: LocationId) {
  return render(
    <LocationProvider initialLocationId={locationId}>
      <HoursLocation />
    </LocationProvider>
  )
}

describe('HoursLocation', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
  })

  it('shows the Harlingen hours table and address', () => {
    renderFor('harlingen')

    expect(screen.getByText('Mon – Fri')).toBeInTheDocument()
    expect(screen.getByText('5am – Midnight')).toBeInTheDocument()
    expect(screen.getByText(LOCATIONS.harlingen.address)).toBeInTheDocument()
    expect(screen.queryByText(/hours coming soon/i)).not.toBeInTheDocument()
    expect(
      screen.getByTitle('Paradise Gym Harlingen location map')
    ).toBeInTheDocument()
  })

  it('shows a coming soon state and McAllen address for the pre-sale location', () => {
    renderFor('mcallen')

    expect(screen.getByText(/hours coming soon/i)).toBeInTheDocument()
    expect(screen.getByText(/opening late 2026/i)).toBeInTheDocument()
    expect(screen.queryByText('Mon – Fri')).not.toBeInTheDocument()
    expect(screen.getByText(LOCATIONS.mcallen.address)).toBeInTheDocument()
    expect(screen.getByText(/20,000 sq ft/i)).toBeInTheDocument()

    const map = screen.getByTitle('Paradise Gym McAllen location map')
    expect(map).toHaveAttribute(
      'src',
      `https://maps.google.com/maps?q=${encodeURIComponent(LOCATIONS.mcallen.address)}&output=embed`
    )
  })
})
