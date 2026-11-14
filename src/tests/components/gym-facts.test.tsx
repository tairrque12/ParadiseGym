import '@/tests/mocks/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderToString } from 'react-dom/server'
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

  it('renders the final stat numbers in the server HTML', () => {
    const html = renderToString(<GymFacts />)

    expect(html).toContain('>7,500<')
    expect(html).toContain('>70+<')
    expect(html).not.toContain('>0<')
    expect(html).not.toContain('>0+<')
    expect(html).not.toContain('0 SQ FT')
  })

  it('renders stat labels', () => {
    render(<GymFacts />)

    expect(screen.getByText(/sq ft/i)).toBeInTheDocument()
    expect(screen.getByText(/custom machines/i)).toBeInTheDocument()
  })
})
