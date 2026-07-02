import '@/tests/mocks/react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'
import { SECTION_IDS } from '@/lib/sections'

describe('Landing page', () => {
  it('renders all section anchors referenced by navigation', () => {
    render(<Home />)

    for (const id of Object.values(SECTION_IDS)) {
      expect(document.getElementById(id)).toBeInTheDocument()
    }
  })

  it('renders hero CTAs with correct anchors', () => {
    render(<Home />)

    expect(
      screen.getByRole('link', { name: /request membership/i })
    ).toHaveAttribute('href', '#membership')
    expect(screen.getByRole('link', { name: /free gym tour/i })).toHaveAttribute(
      'href',
      '#tour'
    )
  })
})
