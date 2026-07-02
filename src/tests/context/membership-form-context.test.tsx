import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  MembershipFormProvider,
  useMembershipForm,
} from '@/context/membership-form-context'

function TierTester() {
  const { selectedTier, setSelectedTier } = useMembershipForm()

  return (
    <div>
      <span data-testid="selected-tier">{selectedTier ?? 'none'}</span>
      <button type="button" onClick={() => setSelectedTier('12_month_contract')}>
        Select 12 Month
      </button>
      <button type="button" onClick={() => setSelectedTier('month_to_month')}>
        Select Month to Month
      </button>
      <button type="button" onClick={() => setSelectedTier('day_pass')}>
        Select Day Pass
      </button>
    </div>
  )
}

describe('MembershipFormProvider', () => {
  it('updates selectedTier for membership option slugs', async () => {
    const user = userEvent.setup()
    render(
      <MembershipFormProvider>
        <TierTester />
      </MembershipFormProvider>
    )

    expect(screen.getByTestId('selected-tier')).toHaveTextContent('none')

    await user.click(screen.getByRole('button', { name: 'Select 12 Month' }))
    expect(screen.getByTestId('selected-tier')).toHaveTextContent(
      '12_month_contract'
    )

    await user.click(screen.getByRole('button', { name: 'Select Month to Month' }))
    expect(screen.getByTestId('selected-tier')).toHaveTextContent('month_to_month')

    await user.click(screen.getByRole('button', { name: 'Select Day Pass' }))
    expect(screen.getByTestId('selected-tier')).toHaveTextContent('day_pass')
  })
})
