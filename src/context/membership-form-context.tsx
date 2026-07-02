'use client'

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react'

type MembershipFormContextValue = {
  selectedTier: string | null
  setSelectedTier: (tier: string | null) => void
}

const MembershipFormContext = createContext<MembershipFormContextValue | null>(
  null
)

export function MembershipFormProvider({
  children,
  initialTier = null,
}: {
  children: ReactNode
  initialTier?: string | null
}) {
  const [selectedTier, setSelectedTierState] = useState<string | null>(
    initialTier
  )

  const setSelectedTier = useCallback((tier: string | null) => {
    setSelectedTierState(tier)
  }, [])

  return (
    <MembershipFormContext.Provider value={{ selectedTier, setSelectedTier }}>
      {children}
    </MembershipFormContext.Provider>
  )
}

export function useMembershipForm() {
  const context = useContext(MembershipFormContext)
  if (!context) {
    throw new Error(
      'useMembershipForm must be used within MembershipFormProvider'
    )
  }
  return context
}
