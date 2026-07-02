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
      <button type="button" onClick={() => setSelectedTier('essential')}>
        Select Essential
      </button>
      <button type="button" onClick={() => setSelectedTier('performance')}>
        Select Performance
      </button>
      <button type="button" onClick={() => setSelectedTier('elite')}>
        Select Elite
      </button>
    </div>
  )
}

describe('MembershipFormProvider', () => {
  it('updates selectedTier for all three tier values', async () => {
    const user = userEvent.setup()
    render(
      <MembershipFormProvider>
        <TierTester />
      </MembershipFormProvider>
    )

    expect(screen.getByTestId('selected-tier')).toHaveTextContent('none')

    await user.click(screen.getByRole('button', { name: 'Select Essential' }))
    expect(screen.getByTestId('selected-tier')).toHaveTextContent('essential')

    await user.click(screen.getByRole('button', { name: 'Select Performance' }))
    expect(screen.getByTestId('selected-tier')).toHaveTextContent('performance')

    await user.click(screen.getByRole('button', { name: 'Select Elite' }))
    expect(screen.getByTestId('selected-tier')).toHaveTextContent('elite')
  })
})
