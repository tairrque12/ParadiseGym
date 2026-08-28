'use client'

import { useEffect, useState } from 'react'

export function usePrefersReducedMotion(): boolean {
  // Starts false so the first client render matches server HTML; resolved on mount.
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(media.matches)

    const handler = (event: MediaQueryListEvent) => setReduced(event.matches)
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [])

  return reduced
}
