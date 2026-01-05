/**
 * React hook for analytics tracking
 * Handles session tracking, return detection, and abandonment monitoring
 */

import { useEffect, useRef } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import { 
  trackSessionStarted, 
  trackReturnedSession,
  startAbandonmentTimer,
  cancelAbandonmentTimer
} from '@/lib/analytics/events'

const SESSION_STORAGE_KEY = 'pm_last_session'
const DAILY_STORAGE_KEY = 'pm_last_daily_visit'

export function useSessionTracking() {
  const { user } = useUser()
  const hasTrackedSession = useRef(false)

  useEffect(() => {
    if (!user || hasTrackedSession.current) return

    const now = Date.now()
    const lastSession = localStorage.getItem(SESSION_STORAGE_KEY)
    const lastDailyVisit = localStorage.getItem(DAILY_STORAGE_KEY)

    const isFirstSession = !lastSession
    const isReturningUser = !!lastSession

    // Track session start
    trackSessionStarted(user.id, isReturningUser)

    // Track returned session if it's been a while
    if (lastSession) {
      const daysSinceLast = Math.floor((now - parseInt(lastSession)) / (1000 * 60 * 60 * 24))
      if (daysSinceLast > 0) {
        trackReturnedSession(user.id, daysSinceLast)
      }
    }

    // Track daily return (if new day)
    if (lastDailyVisit) {
      const lastDate = new Date(parseInt(lastDailyVisit))
      const today = new Date()
      if (lastDate.toDateString() !== today.toDateString()) {
        trackReturnedSession(user.id, 0) // Same day return
      }
    }

    // Update storage
    localStorage.setItem(SESSION_STORAGE_KEY, now.toString())
    localStorage.setItem(DAILY_STORAGE_KEY, now.toString())

    hasTrackedSession.current = true
  }, [user])
}

export function useAbandonmentTracking(projectId?: string) {
  const abandonmentTimer = useRef<NodeJS.Timeout>()
  const sessionStartTime = useRef(Date.now())

  useEffect(() => {
    if (!projectId) return

    // Start abandonment timer when project is active
    abandonmentTimer.current = startAbandonmentTimer(projectId, sessionStartTime.current)

    // Cleanup: cancel timer on unmount or project change
    return () => {
      cancelAbandonmentTimer(abandonmentTimer.current)
    }
  }, [projectId])

  // Reset timer on user activity
  const resetTimer = () => {
    if (projectId) {
      cancelAbandonmentTimer(abandonmentTimer.current)
      abandonmentTimer.current = startAbandonmentTimer(projectId, sessionStartTime.current)
    }
  }

  return { resetTimer }
}
