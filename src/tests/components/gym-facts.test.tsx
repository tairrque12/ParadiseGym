import '@/tests/mocks/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GymFacts } from '@/components/sections/GymFacts'

describe('GymFacts', () => {
  beforeEach(() => {
    vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  })

  it('renders final stat values when reduced motion is preferred', () => {
    render(<GymFacts />)

    expect(screen.getByText('7,500')).toBeInTheDocument()
    expect(screen.getByText('70+')).toBeInTheDocument()
    expect(screen.getByText('Custom-Built Equipment')).toBeInTheDocument()
  })

  it('renders stat labels', () => {
    render(<GymFacts />)

    expect(screen.getByText(/sq ft/i)).toBeInTheDocument()
    expect(screen.getByText(/custom machines/i)).toBeInTheDocument()
  })
})
