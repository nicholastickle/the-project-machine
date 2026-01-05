import posthog from 'posthog-js'

export const initPostHog = () => {
  if (typeof window !== 'undefined') {
    const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'
    
    if (apiKey) {
      posthog.init(apiKey, {
        api_host: host,
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') posthog.debug()
        },
        capture_pageviews: true,
        capture_pageleave: true,
      })
    }
  }
}

export const trackEvent = (
  eventName: string,
  properties?: Record<string, any>
) => {
  if (typeof window !== 'undefined') {
    posthog.capture(eventName, properties)
  }
}

export const identifyUser = (
  userId: string,
  properties?: Record<string, any>
) => {
  if (typeof window !== 'undefined') {
    posthog.identify(userId, properties)
  }
}

export { posthog }
