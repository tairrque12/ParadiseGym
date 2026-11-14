import '@/tests/mocks/react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LocationAnnouncement } from '@/components/LocationAnnouncement'
import { MCALLEN_PATH } from '@/lib/locations'

describe('Location announcement', () => {
  it('links to the McAllen presale and says founding memberships are available', () => {
    render(<LocationAnnouncement />)

    const banner = screen.getByTestId('location-announcement')
    expect(banner.tagName).toBe('A')
    expect(banner).toHaveAttribute('href', MCALLEN_PATH)
    expect(banner).toHaveAccessibleName(
      /mcallen founding memberships are available/i
    )
    expect(banner).toHaveAccessibleName(/view the presale/i)
    expect(banner).toHaveTextContent(/view presale/i)
  })

  it('stays a single static bar without a scrolling marquee', () => {
    render(<LocationAnnouncement />)

    const banner = screen.getByTestId('location-announcement')
    expect(screen.queryByTestId('marquee-run')).not.toBeInTheDocument()
    expect(screen.queryByTestId('marquee-track')).not.toBeInTheDocument()
    expect(banner).not.toHaveClass('animate-marquee')
    expect(banner.className).not.toMatch(/animate-/)
  })
})
