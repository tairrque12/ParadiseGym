'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { usePathname } from 'next/navigation'
import {
  analyticsLocation,
  trackTourCtaClick,
  type TourPlacement,
} from '@/lib/analytics'

export type ActiveModal = 'tour' | null

type ModalContextValue = {
  activeModal: ActiveModal
  openTourModal: (placement: TourPlacement) => void
  closeModal: () => void
}

const ModalContext = createContext<ModalContextValue | null>(null)

export function ModalProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [activeModal, setActiveModal] = useState<ActiveModal>(null)

  const openTourModal = useCallback(
    (placement: TourPlacement) => {
      trackTourCtaClick({
        location: analyticsLocation(pathname ?? '/'),
        placement,
      })
      setActiveModal('tour')
    },
    [pathname]
  )

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
