'use client'

import type { ReactNode } from 'react'
import { ModalProvider } from '@/context/modal-context'
import { ModalHost } from '@/components/modals/modal-host'
import { HashScrollHandler } from '@/components/hash-scroll-handler'
import { MobileActionBar } from '@/components/mobile-action-bar'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ModalProvider>
      <HashScrollHandler />
      {children}
      <MobileActionBar />
      <ModalHost />
    </ModalProvider>
  )
}
