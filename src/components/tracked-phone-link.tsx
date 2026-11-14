'use client'

import type { ComponentProps } from 'react'
import {
  trackPhoneClick,
  type AnalyticsLocation,
  type PhonePlacement,
} from '@/lib/analytics'

type TrackedPhoneLinkProps = ComponentProps<'a'> & {
  location: AnalyticsLocation
  placement: PhonePlacement
}

export function TrackedPhoneLink({
  location,
  placement,
  onClick,
  ...props
}: TrackedPhoneLinkProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        trackPhoneClick({ location, placement })
        onClick?.(event)
      }}
    />
  )
}
