import posthog from 'posthog-js'

export const initPostHog = () => {
  if (typeof window !== 'undefined') {
    const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'
    
    if (apiKey) {
      posthog.init(apiKey, {
        api_host: host,
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') {
            posthog.debug()
            console.log('PostHog initialized with session recording + autocapture')
          }
        },
        capture_pageviews: true,
        capture_pageleave: true,
        // Enable session recording - invaluable with <100 users
        session_recording: {
          recordCrossOriginIframes: false,
          maskAllInputs: false, // Set true if handling sensitive data
          maskTextSelector: '[data-mask]', // Add data-mask to sensitive elements
        },
        // Enable autocapture for discovering usage patterns
        autocapture: {
          dom_event_allowlist: ['click', 'submit', 'change'],
          url_allowlist: ['/canvas', '/projects'],
          element_allowlist: ['button', 'a'],
        },
      })
    }
  }
}

/**
 * Track event to both PostHog (analytics) and usage_logs (debugging)
 * This dual tracking ensures we have analytics insights + raw data for debugging
 */
export const trackEvent = async (
  eventName: string,
  properties?: Record<string, any>
) => {
  // Track to PostHog for analytics
  if (typeof window !== 'undefined') {
    posthog.capture(eventName, properties)
  }

  // Also send to our usage_logs API for debugging/redundancy
  try {
    await fetch('/api/usage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: eventName,
        project_id: properties?.project_id || null,
        event_data: properties || null,
      })
    })
  } catch (error) {
    // Silently fail - analytics should never break the app
    console.debug('Failed to log to usage_logs:', error)
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
