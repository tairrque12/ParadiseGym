'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type ActiveModal = 'tour' | null

type ModalContextValue = {
  activeModal: ActiveModal
  openTourModal: () => void
  closeModal: () => void
}

const ModalContext = createContext<ModalContextValue | null>(null)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null)

  const openTourModal = useCallback(() => {
    setActiveModal('tour')
  }, [])

  const closeModal = useCallback(() => {
    setActiveModal(null)
  }, [])

  const value = useMemo(
    () => ({
      activeModal,
      openTourModal,
      closeModal,
    }),
    [activeModal, openTourModal, closeModal]
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
