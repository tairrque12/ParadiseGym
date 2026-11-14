import '@/tests/mocks/react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { Pricing } from '@/components/sections/Pricing'
import { Providers } from '@/components/providers'
import { joinUrl } from '@/lib/locations'

vi.mock('next/navigation', () => ({ usePathname: () => '/' }))

describe('Pricing', () => {
  it('renders recurring and single payment columns with real Harlingen pricing', () => {
    render(
      <Providers>
        <Pricing />
      </Providers>
    )

    expect(screen.getByText('Recurring')).toBeInTheDocument()
    expect(screen.getByText('Single Payment')).toBeInTheDocument()
    expect(screen.getByText('12 Month Contract')).toBeInTheDocument()
    expect(screen.getByText('Recommended')).toBeInTheDocument()
    expect(screen.getByText('$39.99/mo')).toBeInTheDocument()
    expect(screen.getByText('Amount due today $75.76')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /month to month/i })
    ).not.toHaveTextContent(/due today/i)
    expect(screen.queryByText(/maintenance fee/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/\$30\.00 enrollment/i)).not.toBeInTheDocument()
    const dayPass = screen.getByRole('link', { name: /day pass/i })
    expect(dayPass).toHaveTextContent('$17.99')
    expect(dayPass).not.toHaveTextContent('Due today')
    expect(dayPass).not.toHaveTextContent('enrollment')
    expect(screen.getByText('Month to Month')).toBeInTheDocument()
    expect(screen.getByText('No contract')).toBeInTheDocument()
    expect(screen.getByText('1 Year Paid in Full')).toBeInTheDocument()
    expect(screen.getByText('$499.99')).toBeInTheDocument()
    expect(screen.getByText('Week Pass')).toBeInTheDocument()
    expect(screen.getByText('$49.99')).toBeInTheDocument()
    expect(screen.queryByText('6 Months Paid in Full')).not.toBeInTheDocument()
    expect(screen.getByText('Day Pass')).toBeInTheDocument()
    expect(screen.getByText('$17.99')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /book a free tour/i })
    ).not.toBeInTheDocument()
    expect(screen.getByTestId('mobile-action-bar')).toBeInTheDocument()
    expect(screen.getByText(/discounts available/i)).toBeInTheDocument()
    expect(
      screen.getByText(/teachers, veterans, and first responders/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/please see front desk for current enrollment details/i)
    ).toBeInTheDocument()
  })

  it('links every Harlingen membership option to the Harlingen club signup', () => {
    render(
      <Providers>
        <Pricing />
      </Providers>
    )

    const pricing = within(document.getElementById('pricing') as HTMLElement)
    expect(pricing.getAllByRole('link')).toHaveLength(6)

    for (const [name, slug] of [
      [/12 month contract/i, '12_month_contract'],
      [/month to month/i, 'month_to_month'],
      [/1 year paid in full/i, '1_year_paid_in_full'],
      [/one month/i, 'one_month'],
      [/week pass/i, 'week_pass'],
      [/day pass/i, 'day_pass'],
    ] as const) {
      const link = pricing.getByRole('link', { name })
      expect(link).toHaveAttribute('href', joinUrl('harlingen', slug))
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })

  it('does not advertise McAllen pre-sale options on the Harlingen page', () => {
    render(
      <Providers>
        <Pricing />
      </Providers>
    )

    expect(screen.queryByText(/pre-sale/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/grand opening/i)).not.toBeInTheDocument()
  })
})
