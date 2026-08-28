import '@/tests/mocks/react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Pricing } from '@/components/sections/Pricing'
import { HARLINGEN_JOIN_URL } from '@/lib/locations'

describe('Pricing', () => {
  it('renders recurring and single payment columns with real Harlingen pricing', () => {
    render(<Pricing />)

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
    expect(screen.queryByText('6 Months Paid in Full')).not.toBeInTheDocument()
    expect(screen.getByText('Day Pass')).toBeInTheDocument()
    expect(screen.getByText('$17.99')).toBeInTheDocument()
    expect(screen.getByText(/discounts available/i)).toBeInTheDocument()
    expect(
      screen.getByText(/teachers, veterans, and first responders/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/please see front desk for current enrollment details/i)
    ).toBeInTheDocument()
  })

  it('links every Harlingen membership option to the Harlingen club signup', () => {
    render(<Pricing />)

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(6)

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

  it('does not advertise McAllen pre-sale options on the Harlingen page', () => {
    render(<Pricing />)

    expect(screen.queryByText(/pre-sale/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/grand opening/i)).not.toBeInTheDocument()
  })
})
