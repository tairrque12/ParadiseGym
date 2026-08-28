import '@/tests/mocks/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  LOCATION_STORAGE_KEY,
  LocationProvider,
  useLocation,
} from '@/context/location-context'

function LocationProbe() {
  const { locationId, location, setLocationId } = useLocation()

  return (
    <div>
      <span data-testid="location-id">{locationId}</span>
      <span data-testid="location-name">{location.name}</span>
      <span data-testid="location-status">{location.status}</span>
      <button type="button" onClick={() => setLocationId('mcallen')}>
        Choose McAllen
      </button>
      <button type="button" onClick={() => setLocationId('harlingen')}>
        Choose Harlingen
      </button>
    </div>
  )
}

function renderProbe() {
  return render(
    <LocationProvider>
      <LocationProbe />
    </LocationProvider>
  )
}

describe('LocationProvider', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
  })

  it('defaults to Harlingen', () => {
    renderProbe()

    expect(screen.getByTestId('location-id')).toHaveTextContent('harlingen')
    expect(screen.getByTestId('location-status')).toHaveTextContent('open')
  })

  it('updates shared state and persists the selection to sessionStorage', async () => {
    const user = userEvent.setup()
    renderProbe()

    await user.click(screen.getByRole('button', { name: 'Choose McAllen' }))

    expect(screen.getByTestId('location-id')).toHaveTextContent('mcallen')
    expect(screen.getByTestId('location-name')).toHaveTextContent('McAllen')
    expect(screen.getByTestId('location-status')).toHaveTextContent('presale')
    expect(window.sessionStorage.getItem(LOCATION_STORAGE_KEY)).toBe('mcallen')

    await user.click(screen.getByRole('button', { name: 'Choose Harlingen' }))

    expect(screen.getByTestId('location-id')).toHaveTextContent('harlingen')
    expect(window.sessionStorage.getItem(LOCATION_STORAGE_KEY)).toBe(
      'harlingen'
    )
  })

  it('restores the stored selection on reload', async () => {
    window.sessionStorage.setItem(LOCATION_STORAGE_KEY, 'mcallen')

    renderProbe()

    await waitFor(() => {
      expect(screen.getByTestId('location-id')).toHaveTextContent('mcallen')
    })
  })

  it('ignores an unknown stored selection', async () => {
    window.sessionStorage.setItem(LOCATION_STORAGE_KEY, 'brownsville')

    renderProbe()

    await waitFor(() => {
      expect(screen.getByTestId('location-id')).toHaveTextContent('harlingen')
    })
  })
})
