'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { MCALLEN_PATH } from '@/lib/locations'

export function HashScrollHandler() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname !== '/' && pathname !== MCALLEN_PATH) return

    const sectionId = window.location.hash.replace('#', '')
    if (!sectionId) return

    if (sectionId.toLowerCase() === 'tour') {
      const next = pathname === MCALLEN_PATH ? MCALLEN_PATH : '/'
      window.history.replaceState(null, '', next)
      return
    }

    const target = document.getElementById(sectionId)
    if (!target) return
    // The URL already contains this hash. Scrolling must not push another
    // history entry, or the first Back press stays on the same page.
    target.scrollIntoView({ behavior: 'auto', block: 'start' })
  }, [pathname])

  return null
}
