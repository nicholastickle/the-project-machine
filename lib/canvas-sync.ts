import { type Node, type Edge } from '@xyflow/react'
import { createClient } from '@/lib/supabase/client'

export interface TaskFromBackend {
  id: string
  project_id: string
  title: string
  description: string | null
  status: string
  estimated_hours: number | null
  time_spent: number
  sort_order: number
  created_at: string
  updated_at: string
}

/**
 * Load project data: Merge latest snapshot + current tasks
 */
export async function loadProjectCanvas(
  projectId: string
): Promise<{ nodes: Node[]; edges: Edge[] }> {
  try {
    console.log(`[Canvas Sync] Loading project: ${projectId}`)
    
    // Fetch in parallel
    const [snapshotRes, tasksRes] = await Promise.all([
      fetch(`/api/projects/${projectId}/snapshots?limit=1`),
      fetch(`/api/projects/${projectId}/tasks`)
    ])

    if (!snapshotRes.ok || !tasksRes.ok) {
      console.error('[Canvas Sync] Failed to load project data', {
        snapshotStatus: snapshotRes.status,
        tasksStatus: tasksRes.status
      })
      return { nodes: [], edges: [] }
    }

    const snapshotData = await snapshotRes.json()
    const tasksData = await tasksRes.json()
    
    console.log('[Canvas Sync] Snapshot response:', {
      snapshots: snapshotData.snapshots,
      count: snapshotData.snapshots?.length
    })
    
    const snapshot = snapshotData.snapshots?.[0]
    const tasks: TaskFromBackend[] = tasksData.tasks || []

    console.log(`[Canvas Sync] Loaded ${tasks.length} tasks, snapshot:`, snapshot ? 'YES' : 'NO')

    // No snapshot? Start fresh with tasks only
    if (!snapshot || !snapshot.snapshotData) {
      console.log('[Canvas Sync] No snapshot found, creating nodes from tasks')
      return {
        nodes: tasks.map((task, index) => createNodeFromTask(task, index)),
        edges: []
      }
    }

    // Merge: Keep positions from snapshot, update data from tasks
    const snapshotNodes = snapshot.snapshotData.nodes || []
    const snapshotTaskIds = new Set<string>()
    
    const mergedNodes = snapshotNodes.map((node: Node) => {
      const taskId = node.data?.taskId || node.data?.id
      if (taskId && typeof taskId === 'string') snapshotTaskIds.add(taskId)
      
      const currentTask = tasks.find(t => t.id === taskId)
      
      if (currentTask) {
        return {
          ...node,
          data: {
            ...node.data,
            ...mapTaskToNodeData(currentTask)
          }
        }
      }
      return node
    })
    
    // Add any tasks that exist in backend but NOT in snapshot
    const newTaskNodes = tasks
      .filter(task => !snapshotTaskIds.has(task.id))
      .map((task, index) => {
        console.log(`[Canvas Sync] Adding missing task to canvas: ${task.title}`)
        return createNodeFromTask(task, mergedNodes.length + index)
      })

    const nodes = [...mergedNodes, ...newTaskNodes]
    const edges = snapshot.snapshotData.edges || []
    
    console.log(`[Canvas Sync] ✅ Loaded: ${nodes.length} nodes (${newTaskNodes.length} new), ${edges.length} edges`)
    return { nodes, edges }

  } catch (error) {
    console.error('[Canvas Sync] Load error:', error)
    return { nodes: [], edges: [] }
  }
}

/**
 * Save canvas snapshot (positions + edges)
 */
export async function saveCanvasSnapshot(
  projectId: string,
  nodes: Node[],
  edges: Edge[],
  type: 'manual' | 'autosave' = 'autosave'
): Promise<boolean> {
  try {
    console.log(`[Canvas Sync] Saving snapshot (${type}): ${nodes.length} nodes`)
    
    const response = await fetch(`/api/projects/${projectId}/snapshots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        snapshot_data: { nodes, edges },
        snapshot_type: type
      })
    })

    if (response.ok) {
      console.log(`[Canvas Sync] ✅ Snapshot saved`)
      return true
    }
    
    const errorText = await response.text()
    console.error('[Canvas Sync] ❌ Snapshot save failed:', errorText)
    return false
  } catch (error) {
    console.error('[Canvas Sync] Save error:', error)
    return false
  }
}

/**
 * Map frontend status to backend status
 */
function mapStatusToBackend(frontendStatus: string): string {
  const statusMap: Record<string, string> = {
    'Not started': 'Backlog',
    'On-going': 'In Progress',
    'Stuck': 'Stuck',
    'Complete': 'Completed',
    // Backend values pass through
    'Backlog': 'Backlog',
    'Planned': 'Planned',
    'In Progress': 'In Progress',
    'Completed': 'Completed',
    'Cancelled': 'Cancelled'
  }
  return statusMap[frontendStatus] || frontendStatus
}

/**
 * Map backend status to frontend status
 */
function mapStatusToFrontend(backendStatus: string): string {
  const statusMap: Record<string, string> = {
    'Backlog': 'Not started',
    'Planned': 'Not started',
    'In Progress': 'On-going',
    'Stuck': 'Stuck',
    'Completed': 'Complete',
    'Cancelled': 'Complete'
  }
  return statusMap[backendStatus] || backendStatus
}

/**
 * Update task in backend (business data)
 */
export async function updateTaskInBackend(
  projectId: string,
  taskId: string,
  updates: Partial<{
    title: string
    description: string
    status: string
    estimatedHours: number
    timeSpent: number
  }>
): Promise<boolean> {
  try {
    // Map frontend status to backend status if present
    const backendUpdates = { ...updates }
    if (backendUpdates.status) {
      backendUpdates.status = mapStatusToBackend(backendUpdates.status)
    }
    
    console.log(`[Canvas Sync] Updating task: ${taskId}`, backendUpdates)
    
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backendUpdates)
    })

    if (response.ok) {
      console.log(`[Canvas Sync] ✅ Task updated`)
      return true
    }
    
    const errorText = await response.text()
    console.error('[Canvas Sync] ❌ Task update failed:', errorText)
    return false
  } catch (error) {
    console.error('[Canvas Sync] Update error:', error)
    return false
  }
}

/**
 * Subscribe to realtime task updates
 */
export function subscribeToProjectUpdates(
  projectId: string,
  onUpdate: (task: TaskFromBackend) => void
) {
  const supabase = createClient()
  
  console.log(`[Canvas Sync] 📡 Setting up realtime subscription for project: ${projectId}`)
  
  const channel = supabase
    .channel(`project:${projectId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `project_id=eq.${projectId}`
      },
      (payload) => {
        console.log('[Canvas Sync] 🔄 Realtime update received:', payload.eventType)
        if (payload.new && payload.eventType !== 'DELETE') {
          onUpdate(payload.new as TaskFromBackend)
        }
      }
    )
    .subscribe((status) => {
      console.log(`[Canvas Sync] Subscription status: ${status}`)
    })

  // Return cleanup function
  return () => {
    console.log('[Canvas Sync] 🔌 Unsubscribing from realtime')
    supabase.removeChannel(channel)
  }
}

// ====================================
// HELPER FUNCTIONS
// ====================================

/**
 * Map backend task to node data format
 */
function mapTaskToNodeData(task: TaskFromBackend) {
  return {
    taskId: task.id,
    title: task.title,
    description: task.description || '',
    status: mapStatusToFrontend(task.status),
    estimatedHours: task.estimated_hours,
    timeSpent: task.time_spent,
    subtasks: [] // TODO: Load from subtasks table if needed
  }
}

/**
 * Create new node from task (no snapshot position available)
 */
function createNodeFromTask(task: TaskFromBackend, index: number): Node {
  return {
    id: `task-${task.id}`,
    type: 'taskCardNode',
    position: { 
      x: -500 + (index * 700), // Horizontal layout
      y: 200 
    },
    data: mapTaskToNodeData(task)
  }
}
