'use client'

import { track } from '@vercel/analytics'

export type AnalyticsLocation = 'harlingen' | 'mcallen'
export type TourPlacement = 'hero' | 'header' | 'mobile_menu'
export type JoinPlacement = 'hero' | 'header' | 'mobile_menu'
export type PhonePlacement = 'footer'

type AnalyticsValue = string | number | boolean | null

export function analyticsLocation(pathname: string): AnalyticsLocation {
  return pathname === '/mcallen' ? 'mcallen' : 'harlingen'
}

function trackEvent(name: string, properties: Record<string, AnalyticsValue>) {
  try {
    track(name, properties)
  } catch (error) {
    console.error('Analytics event failed:', error)
  }
}

export function trackTourCtaClick(properties: {
  location: AnalyticsLocation
  placement: TourPlacement
}) {
  trackEvent('tour_cta_click', properties)
}

export function trackTourFormSubmit(properties: { location: AnalyticsLocation }) {
  trackEvent('tour_form_submit', properties)
}

export function trackJoinOnlineClick(properties: {
  location: AnalyticsLocation
  placement: JoinPlacement
}) {
  trackEvent('join_online_click', properties)
}

export function trackPlanClick(properties: {
  plan: string
  location: AnalyticsLocation
}) {
  trackEvent('plan_click', properties)
}

export function trackPhoneClick(properties: {
  location: AnalyticsLocation
  placement: PhonePlacement
}) {
  trackEvent('phone_click', properties)
}
