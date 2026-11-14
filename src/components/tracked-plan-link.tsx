'use client'

import type { ComponentProps } from 'react'
import { trackPlanClick, type AnalyticsLocation } from '@/lib/analytics'

type TrackedPlanLinkProps = ComponentProps<'a'> & {
  plan: string
  location: AnalyticsLocation
}

export function TrackedPlanLink({
  plan,
  location,
  onClick,
  ...props
}: TrackedPlanLinkProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        trackPlanClick({ plan, location })
        onClick?.(event)
      }}
    />
  )
}
