import '@/tests/mocks/react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NewLocationAnnouncement } from '@/components/NewLocationAnnouncement'
import { MCALLEN_PATH } from '@/lib/locations'

describe('NewLocationAnnouncement', () => {
  it('announces the McAllen opening', () => {
    render(<NewLocationAnnouncement />)

    expect(screen.getByTestId('new-location-announcement')).toBeInTheDocument()
    expect(screen.getByText('New Location')).toBeInTheDocument()
    expect(
      screen.getByText(/mcallen opens soon — founding member pricing is live/i)
    ).toBeInTheDocument()
  })

  it('links its CTA to the dedicated McAllen page', () => {
    render(<NewLocationAnnouncement />)

    expect(
      screen.getByRole('link', { name: /view pre-sale pricing/i })
    ).toHaveAttribute('href', MCALLEN_PATH)
  })

  it('gates its glow animation on prefers-reduced-motion', () => {
    render(<NewLocationAnnouncement />)

    expect(screen.getByTestId('new-location-announcement')).toHaveClass(
      'motion-safe:animate-neon-halo'
    )
  })
})
