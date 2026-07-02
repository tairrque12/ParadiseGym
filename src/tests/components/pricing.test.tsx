import '@/tests/mocks/react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Pricing } from '@/components/sections/Pricing'

describe('Pricing', () => {
  it('highlights the middle tier as Most Popular', () => {
    render(<Pricing />)

    const popularBadge = screen.getByText('Most Popular')
    expect(popularBadge).toBeInTheDocument()

    const popularCard = popularBadge.closest('[data-popular="true"]')
    expect(popularCard).toBeInTheDocument()
    expect(popularCard).toHaveClass('border-neon')
  })

  it('links Get Started buttons to membership anchor', () => {
    render(<Pricing />)

    const ctaButtons = screen.getAllByRole('link', { name: /get started/i })
    expect(ctaButtons.length).toBe(3)
    ctaButtons.forEach((button) => {
      expect(button).toHaveAttribute('href', '#membership')
    })
  })
})
