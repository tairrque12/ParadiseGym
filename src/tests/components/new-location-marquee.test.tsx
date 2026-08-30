import '@/tests/mocks/react'
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { NewLocationMarquee } from '@/components/NewLocationMarquee'
import { MCALLEN_PATH } from '@/lib/locations'

describe('NewLocationMarquee', () => {
  it('links the whole strip to the McAllen page', () => {
    render(<NewLocationMarquee />)

    const banner = screen.getByTestId('new-location-marquee')
    expect(banner.tagName).toBe('A')
    expect(banner).toHaveAttribute('href', MCALLEN_PATH)
    expect(
      screen.getByRole('link', { name: /new location coming to mcallen/i })
    ).toBe(banner)
  })

  it('repeats the ticker copy twice so the loop is seamless', () => {
    render(<NewLocationMarquee />)

    const track = screen.getByTestId('marquee-track')
    expect(track).toHaveClass('animate-marquee')
    expect(track).toHaveAttribute('aria-hidden')

    expect(
      within(track).getAllByText(/new location coming — mcallen, tx/i)
    ).toHaveLength(2)
    expect(
      within(track).getAllByText(/view pre-sale pricing/i)
    ).toHaveLength(2)
    expect(within(track).getAllByText('•')).toHaveLength(4)
  })

  it('swaps the animation for static copy under reduced motion', () => {
    render(<NewLocationMarquee />)

    const track = screen.getByTestId('marquee-track')
    const fallback = screen.getByTestId('marquee-static')

    expect(track).toHaveClass('motion-reduce:hidden')
    expect(fallback).toHaveClass('hidden', 'motion-reduce:flex')
  })

  it('keeps a short static line for narrow screens and a full line for wider ones', () => {
    render(<NewLocationMarquee />)

    const fallback = within(screen.getByTestId('marquee-static'))

    const short = fallback.getByText('🎉 New: McAllen Pre-Sale →')
    expect(short).toHaveClass('sm:hidden')

    const full = fallback.getByText(/new location coming — mcallen, tx/i)
    expect(full).toHaveClass('hidden', 'sm:inline')
  })
})
