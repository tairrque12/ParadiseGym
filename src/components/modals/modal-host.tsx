'use client'

import { TourRequestModal } from '@/components/modals/tour-request-modal'
import { useModal } from '@/context/modal-context'

export function ModalHost() {
  const { activeModal, closeModal } = useModal()

  return (
    <TourRequestModal
      open={activeModal === 'tour'}
      onOpenChange={(open) => {
        if (!open) closeModal()
      }}
    />
  )
}
