'use client'

import type { ReactNode } from 'react'
import { MembershipFormProvider } from '@/context/membership-form-context'
import { ModalProvider } from '@/context/modal-context'
import { ModalHost } from '@/components/modals/modal-host'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MembershipFormProvider>
      <ModalProvider>
        {children}
        <ModalHost />
      </ModalProvider>
    </MembershipFormProvider>
  )
}
