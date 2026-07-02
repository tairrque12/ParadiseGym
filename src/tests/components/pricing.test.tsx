import '@/tests/mocks/react'
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Providers } from '@/components/providers'
import { Pricing } from '@/components/sections/Pricing'

describe('Pricing', () => {
  it('renders recurring and single payment columns with real pricing data', () => {
    render(
      <Providers>
        <Pricing />
      </Providers>
    )

    expect(screen.getByText('Recurring')).toBeInTheDocument()
    expect(screen.getByText('Single Payment')).toBeInTheDocument()
    expect(screen.getByText('12 Month Contract')).toBeInTheDocument()
    expect(screen.getByText('$39.99/mo')).toBeInTheDocument()
    expect(screen.getByText('Month to Month')).toBeInTheDocument()
    expect(screen.getByText('No contract')).toBeInTheDocument()
    expect(screen.getByText('1 Year Paid in Full')).toBeInTheDocument()
    expect(screen.getByText('$430')).toBeInTheDocument()
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

  it('opens membership modal with 12 month contract pre-selected', async () => {
    const user = userEvent.setup()
    render(
      <Providers>
        <Pricing />
      </Providers>
    )

    await user.click(screen.getByRole('button', { name: /12 month contract/i }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByLabelText(/membership type/i)).toHaveValue(
        '12_month_contract'
      )
    })
  })

  it('opens membership modal with day pass pre-selected', async () => {
    const user = userEvent.setup()
    render(
      <Providers>
        <Pricing />
      </Providers>
    )

    await user.click(screen.getByRole('button', { name: /day pass/i }))

    await waitFor(() => {
      expect(screen.getByLabelText(/membership type/i)).toHaveValue('day_pass')
    })
  })
})
