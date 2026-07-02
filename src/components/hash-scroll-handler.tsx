'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { scrollToSection } from '@/lib/section-nav'

export function HashScrollHandler() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname !== '/') return

    const scrollFromHash = () => {
      const sectionId = window.location.hash.replace('#', '')
      if (!sectionId) return
      scrollToSection(sectionId, 'auto')
    }

    scrollFromHash()
    window.addEventListener('hashchange', scrollFromHash)
    return () => window.removeEventListener('hashchange', scrollFromHash)
  }, [pathname])

  return null
}
