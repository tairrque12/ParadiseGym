'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  DEFAULT_LOCATION_ID,
  LOCATIONS,
  isLocationId,
  type GymLocation,
  type LocationId,
} from '@/lib/locations'

export const LOCATION_STORAGE_KEY = 'paradise-gym:location'

type LocationContextValue = {
  locationId: LocationId
  location: GymLocation
  setLocationId: (id: LocationId) => void
}

const LocationContext = createContext<LocationContextValue | null>(null)

function readStoredLocationId(): LocationId | null {
  try {
    const stored = window.sessionStorage.getItem(LOCATION_STORAGE_KEY)
    return stored && isLocationId(stored) ? stored : null
  } catch {
    return null
  }
}

export function LocationProvider({
  children,
  initialLocationId = DEFAULT_LOCATION_ID,
}: {
  children: ReactNode
  initialLocationId?: LocationId
}) {
  const [locationId, setLocationIdState] =
    useState<LocationId>(initialLocationId)

  // Read after mount so the server-rendered markup always matches the default.
  useEffect(() => {
    const stored = readStoredLocationId()
    if (stored) setLocationIdState(stored)
  }, [])

  const setLocationId = useCallback((id: LocationId) => {
    setLocationIdState(id)
    try {
      window.sessionStorage.setItem(LOCATION_STORAGE_KEY, id)
    } catch {
      // Session storage is unavailable; selection still applies for this view.
    }
  }, [])

  const value = useMemo(
    () => ({
      locationId,
      location: LOCATIONS[locationId],
      setLocationId,
    }),
    [locationId, setLocationId]
  )

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider')
  }
  return context
}
