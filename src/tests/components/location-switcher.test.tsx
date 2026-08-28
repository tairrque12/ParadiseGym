import '@/tests/mocks/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LocationSwitcher } from '@/components/LocationSwitcher'

const usePathname = vi.hoisted(() => vi.fn(() => '/'))

vi.mock('next/navigation', () => ({ usePathname }))

describe('LocationSwitcher', () => {
  beforeEach(() => {
    usePathname.mockReturnValue('/')
  })

  it('renders both locations as links with a pre-sale badge on McAllen', () => {
    render(<LocationSwitcher />)

    const harlingen = screen.getByRole('link', { name: /harlingen/i })
    const mcallen = screen.getByRole('link', { name: /mcallen/i })

    expect(harlingen).toHaveAttribute('href', '/')
    expect(mcallen).toHaveAttribute('href', '/mcallen')
    expect(mcallen).toHaveTextContent(/pre-sale/i)
    expect(harlingen).not.toHaveTextContent(/pre-sale/i)
  })

  it('marks Harlingen as the current page on the main site', () => {
    render(<LocationSwitcher />)

    expect(screen.getByRole('link', { name: /harlingen/i })).toHaveAttribute(
      'aria-current',
      'page'
    )
    expect(
      screen.getByRole('link', { name: /mcallen/i })
    ).not.toHaveAttribute('aria-current')
  })

  it('marks McAllen as the current page on the McAllen route', () => {
    usePathname.mockReturnValue('/mcallen')

    render(<LocationSwitcher />)

    expect(screen.getByRole('link', { name: /mcallen/i })).toHaveAttribute(
      'aria-current',
      'page'
    )
    expect(
      screen.getByRole('link', { name: /harlingen/i })
    ).not.toHaveAttribute('aria-current')
  })

  it('keeps Harlingen current on other shared pages', () => {
    usePathname.mockReturnValue('/gallery')

    render(<LocationSwitcher />)

    expect(screen.getByRole('link', { name: /harlingen/i })).toHaveAttribute(
      'aria-current',
      'page'
    )
  })
})
