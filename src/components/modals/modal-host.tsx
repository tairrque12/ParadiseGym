'use client'

import { usePathname } from 'next/navigation'
import { TourRequestModal } from '@/components/modals/tour-request-modal'
import { useModal } from '@/context/modal-context'
import { analyticsLocation } from '@/lib/analytics'

export function ModalHost() {
  const { activeModal, closeModal } = useModal()
  const pathname = usePathname()

  return (
    <TourRequestModal
      open={activeModal === 'tour'}
      location={analyticsLocation(pathname ?? '/')}
      onOpenChange={(open) => {
        if (!open) closeModal()
      }}
    />
  )
}
