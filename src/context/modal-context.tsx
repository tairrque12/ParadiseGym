'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useMembershipForm } from '@/context/membership-form-context'

export type ActiveModal = 'membership' | 'tour' | null

type ModalContextValue = {
  activeModal: ActiveModal
  openMembershipModal: (tier?: string | null) => void
  openTourModal: () => void
  closeModal: () => void
}

const ModalContext = createContext<ModalContextValue | null>(null)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null)
  const { setSelectedTier } = useMembershipForm()

  const openMembershipModal = useCallback(
    (tier?: string | null) => {
      setSelectedTier(tier ?? null)
      setActiveModal('membership')
    },
    [setSelectedTier]
  )

  const openTourModal = useCallback(() => {
    setActiveModal('tour')
  }, [])

  const closeModal = useCallback(() => {
    setActiveModal(null)
  }, [])

  const value = useMemo(
    () => ({
      activeModal,
      openMembershipModal,
      openTourModal,
      closeModal,
    }),
    [activeModal, openMembershipModal, openTourModal, closeModal]
  )

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  )
}

export function useModal() {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within ModalProvider')
  }
  return context
}
