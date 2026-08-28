import '@/tests/mocks/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LocationSwitcher } from '@/components/LocationSwitcher'
import {
  LOCATION_STORAGE_KEY,
  LocationProvider,
} from '@/context/location-context'

function renderSwitcher() {
  return render(
    <LocationProvider>
      <LocationSwitcher />
    </LocationProvider>
  )
}

describe('LocationSwitcher', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
  })

  it('renders both locations with a pre-sale badge on McAllen', () => {
    renderSwitcher()

    const harlingen = screen.getByRole('button', { name: /harlingen/i })
    const mcallen = screen.getByRole('button', { name: /mcallen/i })

    expect(harlingen).toBeInTheDocument()
    expect(mcallen).toHaveTextContent(/pre-sale/i)
    expect(harlingen).not.toHaveTextContent(/pre-sale/i)
  })

  it('marks Harlingen as the active selection by default', () => {
    renderSwitcher()

    expect(screen.getByRole('button', { name: /harlingen/i })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(screen.getByRole('button', { name: /mcallen/i })).toHaveAttribute(
      'aria-pressed',
      'false'
    )
  })

  it('switches the active location and stores it for the session', async () => {
    const user = userEvent.setup()
    renderSwitcher()

    await user.click(screen.getByRole('button', { name: /mcallen/i }))

    expect(screen.getByRole('button', { name: /mcallen/i })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(screen.getByRole('button', { name: /harlingen/i })).toHaveAttribute(
      'aria-pressed',
      'false'
    )
    expect(window.sessionStorage.getItem(LOCATION_STORAGE_KEY)).toBe('mcallen')
  })

  it('restores the stored location after a refresh', async () => {
    window.sessionStorage.setItem(LOCATION_STORAGE_KEY, 'mcallen')

    renderSwitcher()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /mcallen/i })).toHaveAttribute(
        'aria-pressed',
        'true'
      )
    })
  })
})
