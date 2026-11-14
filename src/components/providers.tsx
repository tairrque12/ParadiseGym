'use client'

import type { ReactNode } from 'react'
import { HashScrollHandler } from '@/components/hash-scroll-handler'
import { MobileActionBar } from '@/components/mobile-action-bar'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <HashScrollHandler />
      {children}
      <MobileActionBar />
    </>
  )
}
