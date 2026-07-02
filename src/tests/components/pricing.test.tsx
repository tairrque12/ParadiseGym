import '@/tests/mocks/react'
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Providers } from '@/components/providers'
import { Pricing } from '@/components/sections/Pricing'

describe('Pricing', () => {
  it('highlights the middle tier as Most Popular', () => {
    render(
      <Providers>
        <Pricing />
      </Providers>
    )

    const popularBadge = screen.getByText('Most Popular')
    expect(popularBadge).toBeInTheDocument()

    const popularCard = popularBadge.closest('[data-popular="true"]')
    expect(popularCard).toBeInTheDocument()
    expect(popularCard).toHaveClass('border-neon')
  })

  it('opens membership modal with performance tier pre-selected', async () => {
    const user = userEvent.setup()
    render(
      <Providers>
        <Pricing />
      </Providers>
    )

    const buttons = screen.getAllByRole('button', { name: /get started/i })
    await user.click(buttons[1])

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByLabelText(/membership type/i)).toHaveValue('performance')
    })
  })

  it('opens membership modal with essential and elite tiers', async () => {
    const user = userEvent.setup()
    render(
      <Providers>
        <Pricing />
      </Providers>
    )

    const buttons = screen.getAllByRole('button', { name: /get started/i })

    await user.click(buttons[0])
    await waitFor(() => {
      expect(screen.getByLabelText(/membership type/i)).toHaveValue('essential')
    })

    await user.keyboard('{Escape}')

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    await user.click(buttons[2])
    await waitFor(() => {
      expect(screen.getByLabelText(/membership type/i)).toHaveValue('elite')
    })
  })
})
