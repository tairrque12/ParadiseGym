'use client'

import type { ReactNode } from 'react'
import { ModalProvider } from '@/context/modal-context'
import { ModalHost } from '@/components/modals/modal-host'
import { HashScrollHandler } from '@/components/hash-scroll-handler'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ModalProvider>
      <HashScrollHandler />
      {children}
      <ModalHost />
    </ModalProvider>
  )
}
