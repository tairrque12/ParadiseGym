'use client'

import type { ComponentProps } from 'react'
import {
  trackMembershipClick,
  type AnalyticsLocation,
  type MembershipPlacement,
} from '@/lib/analytics'

type TrackedMembershipLinkProps = ComponentProps<'a'> & {
  location: AnalyticsLocation
  placement: MembershipPlacement
  plan?: string
}

export function TrackedMembershipLink({
  location,
  placement,
  plan,
  onClick,
  ...props
}: TrackedMembershipLinkProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        trackMembershipClick({ location, placement, plan })
        onClick?.(event)
      }}
    />
  )
}
