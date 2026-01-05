/**
 * Analytics event definitions for v0.3 instrumentation
 * Implements passive feedback tracking: usage patterns, abandonment, return behavior
 */

import { trackEvent } from './posthog'

// ============================================
// SESSION & LIFECYCLE EVENTS
// ============================================

export function trackSessionStarted(userId?: string, isReturningUser?: boolean) {
  trackEvent('session_started', {
    user_id: userId,
    is_returning_user: isReturningUser,
    timestamp: new Date().toISOString(),
  })
}

export function trackReturnedSession(userId: string, daysSinceLastVisit: number) {
  trackEvent('returned_session', {
    user_id: userId,
    days_since_last_visit: daysSinceLastVisit,
    timestamp: new Date().toISOString(),
  })
}

// ============================================
// PROJECT & TASK EVENTS
// ============================================

export function trackFirstTaskCreated(projectId: string, userId: string) {
  trackEvent('first_task_created', {
    project_id: projectId,
    user_id: userId,
    milestone: true, // Flag for important lifecycle events
    timestamp: new Date().toISOString(),
  })
}

export function trackPlanSaved(
  projectId: string, 
  saveType: 'manual' | 'autosave' | 'ai_generated',
  nodeCount?: number,
  edgeCount?: number
) {
  trackEvent('plan_saved', {
    project_id: projectId,
    save_type: saveType,
    node_count: nodeCount,
    edge_count: edgeCount,
    timestamp: new Date().toISOString(),
  })
}

export function trackPlanAbandoned(
  projectId: string,
  timeSpentSeconds: number,
  hasUnsavedChanges: boolean
) {
  trackEvent('plan_abandoned', {
    project_id: projectId,
    time_spent_seconds: timeSpentSeconds,
    has_unsaved_changes: hasUnsavedChanges,
    timestamp: new Date().toISOString(),
  })
}

// ============================================
// NAVIGATION & DISCOVERY EVENTS
// ============================================

export function trackHistoryViewed(
  projectId: string,
  viewType: 'snapshots' | 'reflections' | 'notes'
) {
  trackEvent('history_viewed', {
    project_id: projectId,
    view_type: viewType,
    timestamp: new Date().toISOString(),
  })
}

// ============================================
// EXPORT & COLLABORATION EVENTS
// ============================================

export function trackExportClicked(
  projectId: string,
  exportType: 'excel' | 'pdf' | 'csv' | 'json'
) {
  trackEvent('export_clicked', {
    project_id: projectId,
    export_type: exportType,
    timestamp: new Date().toISOString(),
  })
}

export function trackCollaborationEvent(
  projectId: string,
  eventType: 'invite_sent' | 'member_added' | 'member_removed',
  targetEmail?: string
) {
  trackEvent('collaboration_event', {
    project_id: projectId,
    event_type: eventType,
    target_email: targetEmail,
    timestamp: new Date().toISOString(),
  })
}

// ============================================
// AI INTERACTION EVENTS
// ============================================

export function trackAIInteraction(
  projectId: string,
  interactionType: 'chat_sent' | 'suggestion_accepted' | 'suggestion_rejected',
  messageLength?: number
) {
  trackEvent('ai_interaction', {
    project_id: projectId,
    interaction_type: interactionType,
    message_length: messageLength,
    timestamp: new Date().toISOString(),
  })
}

// ============================================
// PASSIVE FEEDBACK: ABANDONMENT DETECTION
// ============================================

/**
 * Track when user becomes idle (for abandonment detection)
 * Call this when user stops interacting with canvas/tasks
 */
export function startAbandonmentTimer(projectId: string, startTime: number) {
  if (typeof window === 'undefined') return

  const ABANDONMENT_THRESHOLD_MS = 5 * 60 * 1000 // 5 minutes

  const timer = setTimeout(() => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    trackPlanAbandoned(projectId, timeSpent, true)
  }, ABANDONMENT_THRESHOLD_MS)

  // Store timer ID to cancel if user returns
  return timer
}

export function cancelAbandonmentTimer(timerId?: NodeJS.Timeout) {
  if (timerId) {
    clearTimeout(timerId)
  }
}
