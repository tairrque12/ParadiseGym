'use client'

import type { ReactNode } from 'react'
import { useModal } from '@/context/modal-context'

export function TourPrompt({ children }: { children: ReactNode }) {
  const { openTourModal } = useModal()

  return (
    <button
      type="button"
      onClick={() => openTourModal('section')}
      className="inline-flex min-h-11 items-center text-sm font-medium text-white underline decoration-white/30 underline-offset-4 transition-colors duration-200 hover:decoration-neon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon/70 motion-reduce:transition-none"
    >
      {children}
    </button>
  )
}
