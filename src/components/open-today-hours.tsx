'use client'

import { useEffect, useState } from 'react'
import { openTodayLabel, POSTED_HOURS_SUMMARY } from '@/lib/contact'

export function OpenTodayHours() {
  const [label, setLabel] = useState(POSTED_HOURS_SUMMARY)

  useEffect(() => {
    setLabel(openTodayLabel())
  }, [])

  return <span data-testid="open-today-hours">{label}</span>
}
