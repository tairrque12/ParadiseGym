import '@/tests/mocks/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Pricing } from '@/components/sections/Pricing'
import { LocationProvider } from '@/context/location-context'
import {
  HARLINGEN_JOIN_URL,
  MCALLEN_JOIN_URL,
  type LocationId,
} from '@/lib/locations'

function renderFor(locationId: LocationId) {
  return render(
    <LocationProvider initialLocationId={locationId}>
      <Pricing />
    </LocationProvider>
  )
}

describe('Pricing', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
  })

  it('renders recurring and single payment columns with real Harlingen pricing', () => {
    renderFor('harlingen')

    expect(screen.getByText('Recurring')).toBeInTheDocument()
    expect(screen.getByText('Single Payment')).toBeInTheDocument()
    expect(screen.getByText('12 Month Contract')).toBeInTheDocument()
    expect(screen.getByText('$39.99/mo')).toBeInTheDocument()
    expect(screen.getByText('Month to Month')).toBeInTheDocument()
    expect(screen.getByText('No contract')).toBeInTheDocument()
    expect(screen.getByText('1 Year Paid in Full')).toBeInTheDocument()
    expect(screen.getByText('$499.99')).toBeInTheDocument()
    expect(screen.getByText('Week Pass')).toBeInTheDocument()
    expect(screen.getByText('$49.99')).toBeInTheDocument()
    expect(
      screen.queryByText('6 Months Paid in Full')
    ).not.toBeInTheDocument()
    expect(screen.getByText('Day Pass')).toBeInTheDocument()
    expect(screen.getByText('$17.99')).toBeInTheDocument()
    expect(screen.getByText(/discounts available/i)).toBeInTheDocument()
    expect(
      screen.getByText(/teachers, veterans, and first responders/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/please see front desk for current enrollment details/i)
    ).toBeInTheDocument()
    expect(screen.queryByTestId('presale-countdown')).not.toBeInTheDocument()
  })

  it('links every Harlingen membership option directly to ABC Fitness', () => {
    renderFor('harlingen')

    for (const name of [
      /12 month contract/i,
      /month to month/i,
      /1 year paid in full/i,
      /one month/i,
      /week pass/i,
      /day pass/i,
    ]) {
      const link = screen.getByRole('link', { name })
      expect(link).toHaveAttribute('href', HARLINGEN_JOIN_URL)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })

  it('renders only the three McAllen pre-sale options in a single column', () => {
    renderFor('mcallen')

    expect(screen.getByText('Founding Member Pricing')).toBeInTheDocument()
    expect(screen.queryByText('Recurring')).not.toBeInTheDocument()
    expect(screen.queryByText('Single Payment')).not.toBeInTheDocument()

    expect(screen.getByText('1 Year Paid in Full')).toBeInTheDocument()
    expect(screen.getByText('$499.99')).toBeInTheDocument()
    expect(screen.getByText('12 Month Contract')).toBeInTheDocument()
    expect(screen.getByText('$39.99/mo')).toBeInTheDocument()
    expect(screen.getByText('Month to Month')).toBeInTheDocument()
    expect(screen.getByText('$49.99/mo')).toBeInTheDocument()

    expect(screen.queryByText('Week Pass')).not.toBeInTheDocument()
    expect(screen.queryByText('Day Pass')).not.toBeInTheDocument()
    expect(screen.queryByText('One Month')).not.toBeInTheDocument()
  })

  it('explains the McAllen pre-sale and counts down to opening', () => {
    renderFor('mcallen')

    expect(screen.getByText(/mcallen pre-sale/i)).toBeInTheDocument()
    expect(
      screen.getByText(/founding member pricing available now/i)
    ).toBeInTheDocument()
    expect(screen.getByTestId('presale-countdown')).toBeInTheDocument()
    expect(
      screen.queryByText(/please see front desk for current enrollment details/i)
    ).not.toBeInTheDocument()
  })

  it('links McAllen pre-sale rows to the McAllen club signup', () => {
    renderFor('mcallen')

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(3)

    for (const link of links) {
      expect(link).toHaveAttribute('href', MCALLEN_JOIN_URL)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }

    expect(
      screen.getByRole('link', { name: /1 year paid in full/i })
    ).toHaveAttribute('href', MCALLEN_JOIN_URL)
  })
})
