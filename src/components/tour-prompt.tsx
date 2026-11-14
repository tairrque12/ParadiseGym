'use client'

import type { ReactNode } from 'react'
import { useModal } from '@/context/modal-context'

export function TourPrompt({ children }: { children: ReactNode }) {
  const { openTourModal } = useModal()

  return (
    <button
      type="button"
      onClick={() => openTourModal('section')}
      className="inline-flex min-h-11 items-center justify-center border border-white/30 px-4 text-sm text-white transition-colors hover:border-white/60"
    >
      {children}
    </button>
  )
}
