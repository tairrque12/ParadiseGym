'use client'

import type { ReactNode } from 'react'
import { LocationProvider } from '@/context/location-context'
import { ModalProvider } from '@/context/modal-context'
import { ModalHost } from '@/components/modals/modal-host'
import { HashScrollHandler } from '@/components/hash-scroll-handler'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LocationProvider>
      <ModalProvider>
        <HashScrollHandler />
        {children}
        <ModalHost />
      </ModalProvider>
    </LocationProvider>
  )
}
