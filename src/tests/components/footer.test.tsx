import '@/tests/mocks/react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { Footer } from '@/components/sections/Footer'
import { CONTACT } from '@/lib/contact'
import { LOCATIONS } from '@/lib/locations'

vi.mock('next/navigation', () => ({ usePathname: () => '/' }))

describe('Footer', () => {
  it('shows phone and business address without a public email', () => {
    render(<Footer />)

    const contact = within(
      screen.getByRole('heading', { name: /contact/i }).parentElement as HTMLElement
    )

    const phone = contact.getByRole('link', { name: CONTACT.phone })
    expect(phone).toHaveAttribute('href', CONTACT.phoneHref)
    expect(contact.getByText(LOCATIONS.harlingen.address)).toBeInTheDocument()

    expect(contact.queryByRole('link', { name: /@/ })).not.toBeInTheDocument()
    expect(screen.queryByText(/gmail\.com/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/mailto:/i)).not.toBeInTheDocument()
  })

  it('uses the McAllen address when that location is selected', () => {
    render(<Footer location={LOCATIONS.mcallen} />)

    expect(screen.getByText(LOCATIONS.mcallen.address)).toBeInTheDocument()
    expect(
      screen.queryByText(LOCATIONS.harlingen.address)
    ).not.toBeInTheDocument()
    expect(screen.queryByText(/gmail\.com/i)).not.toBeInTheDocument()
  })
})
