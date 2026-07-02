'use client'

import { MembershipRequestModal } from '@/components/modals/membership-request-modal'
import { TourRequestModal } from '@/components/modals/tour-request-modal'
import { useModal } from '@/context/modal-context'

export function ModalHost() {
  const { activeModal, closeModal } = useModal()

  return (
    <>
      <MembershipRequestModal
        open={activeModal === 'membership'}
        onOpenChange={(open) => {
          if (!open) closeModal()
        }}
      />
      <TourRequestModal
        open={activeModal === 'tour'}
        onOpenChange={(open) => {
          if (!open) closeModal()
        }}
      />
    </>
  )
}
