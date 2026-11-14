'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { MCALLEN_PATH } from '@/lib/locations'
import { scrollToSection } from '@/lib/section-nav'

export function HashScrollHandler() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname !== '/' && pathname !== MCALLEN_PATH) return

    const scrollFromHash = () => {
      const sectionId = window.location.hash.replace('#', '')
      if (!sectionId) return
      scrollToSection(sectionId, 'auto', pathname)
    }

    scrollFromHash()
    window.addEventListener('hashchange', scrollFromHash)
    return () => window.removeEventListener('hashchange', scrollFromHash)
  }, [pathname])

  return null
}
