import '@/tests/mocks/react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HoursLocation } from '@/components/sections/HoursLocation'
import { LOCATIONS } from '@/lib/locations'

describe('HoursLocation', () => {
  it('defaults to the Harlingen hours table and address', () => {
    render(<HoursLocation />)

    expect(screen.getByText('Mon – Fri')).toBeInTheDocument()
    expect(screen.getByText('5am – Midnight')).toBeInTheDocument()
    expect(screen.getByText(LOCATIONS.harlingen.address)).toBeInTheDocument()
    expect(screen.queryByText(/hours coming soon/i)).not.toBeInTheDocument()
    expect(
      screen.getByTitle('Paradise Gym Harlingen location map')
    ).toBeInTheDocument()
  })

  it('shows a coming soon state and McAllen address for the pre-sale location', () => {
    render(<HoursLocation location={LOCATIONS.mcallen} />)

    expect(screen.getByText(/hours coming soon/i)).toBeInTheDocument()
    expect(
      screen.getByText(/full schedule announced closer to opening day/i)
    ).toBeInTheDocument()
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
