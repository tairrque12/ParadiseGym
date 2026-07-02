'use client'

import type { ReactNode } from 'react'
import { MembershipFormProvider } from '@/context/membership-form-context'
import { ModalProvider } from '@/context/modal-context'
import { ModalHost } from '@/components/modals/modal-host'
import { HashScrollHandler } from '@/components/hash-scroll-handler'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MembershipFormProvider>
      <ModalProvider>
        <HashScrollHandler />
        {children}
        <ModalHost />
      </ModalProvider>
    </MembershipFormProvider>
  )
}
