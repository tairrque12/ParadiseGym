import '@/tests/mocks/react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '@/app/page'
import { SECTION_IDS } from '@/lib/sections'
import { Providers } from '@/components/providers'

describe('Landing page', () => {
  it('renders all section anchors referenced by navigation', () => {
    render(
      <Providers>
        <Home />
      </Providers>
    )

    for (const id of Object.values(SECTION_IDS)) {
      expect(document.getElementById(id)).toBeInTheDocument()
    }
  })

  it('opens membership and tour modals from hero CTAs', async () => {
    const user = userEvent.setup()
    render(
      <Providers>
        <Home />
      </Providers>
    )

    await user.click(screen.getByRole('button', { name: 'Request Membership' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /request membership/i })
    ).toBeInTheDocument()

    await user.keyboard('{Escape}')

    await user.click(screen.getByRole('button', { name: 'Free Gym Tour' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /free gym tour/i })).toBeInTheDocument()
  })
})
