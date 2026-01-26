import { type Edge } from '@/stores/types'
import { type Node, type Task } from '@/stores/types'
import { createClient } from '@/lib/supabase/client'

export interface TaskFromBackend {
  id: string
  projectId: string
  title: string
  description: string | null
  status: string
  estimatedHours: number | null
  timeSpent: number
  sortOrder: number
  createdBy: string
  createdAt: string
  updatedAt: string
}

/**
 * Load project data: Merge latest snapshot + current tasks
 */
export async function loadProjectCanvas(
  projectId: string
): Promise<{ nodes: Node[]; edges: Edge[]; tasks: Task[] }> {
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
      return { nodes: [], edges: [], tasks: [] }
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

    // Convert backend tasks to frontend Task format (node_id will be set after nodes are finalized)
    const frontendTasks: Task[] = tasks.map(backendTask => ({
      id: backendTask.id,
      node_id: '', // Will be populated below after nodes are finalized
      project_id: backendTask.projectId,
      title: backendTask.title,
      description: backendTask.description || '',
      status: mapStatusToFrontend(backendTask.status) as any,
      estimated_hours: backendTask.estimatedHours || 0,
      time_spent: backendTask.timeSpent || 0,
      subtasks: [],
      sort_order: backendTask.sortOrder || 0,
      created_by: backendTask.createdBy,
      created_at: backendTask.createdAt,
      updated_at: backendTask.updatedAt
    }))

    console.log('[Canvas Sync] Converted tasks:', frontendTasks.length)

    // No snapshot? Start fresh with tasks only
    if (!snapshot || !snapshot.snapshotData) {
      console.log('[Canvas Sync] No snapshot found, creating nodes from tasks')
      const nodes = tasks.map((task, index) => createNodeFromTask(task, index))
      
      // Populate node_id in tasks
      const tasksWithNodeIds = frontendTasks.map(task => {
        const node = nodes.find(n => n.content_id === task.id)
        return {
          ...task,
          node_id: node?.id || ''
        }
      })
      
      return {
        nodes,
        edges: [],
        tasks: tasksWithNodeIds
      }
    }

    // Merge: Keep positions from snapshot, update data from tasks
    const snapshotNodes = snapshot.snapshotData.nodes || []
    const snapshotTaskIds = new Set<string>()
    
    const mergedNodes = snapshotNodes
      .map((node: Node) => {
        // Try multiple ways to find the task ID (for backwards compatibility)
        const taskId = node.content_id || node.data?.taskId || node.data?.id
        if (taskId && typeof taskId === 'string') snapshotTaskIds.add(taskId)
        
        const currentTask = tasks.find(t => t.id === taskId)
        
        if (currentTask) {
          return {
            ...node,
            data: {
              ...node.data,
              ...mapTaskToNodeData(currentTask)
            },
            // CRITICAL: Ensure content_id is always set
            content_id: currentTask.id,
            project_id: currentTask.projectId
          }
        }
        
        // Task was deleted - don't include this node
        console.log(`[Canvas Sync] Removing orphaned node (task deleted): ${taskId}`)
        return null
      })
      .filter((node: Node | null): node is Node => node !== null) // Filter out deleted task nodes
    
    // Add any tasks that exist in backend but NOT in snapshot
    const newTaskNodes = tasks
      .filter(task => !snapshotTaskIds.has(task.id))
      .map((task, index) => {
        console.log(`[Canvas Sync] Adding missing task to canvas: ${task.title}`)
        return createNodeFromTask(task, mergedNodes.length + index)
      })

    const nodes = [...mergedNodes, ...newTaskNodes]
    const edges = snapshot.snapshotData.edges || []
    
    // CRITICAL: Populate node_id in all tasks based on final nodes
    const tasksWithNodeIds = frontendTasks.map(task => {
      const node = nodes.find(n => n.content_id === task.id)
      if (!node) {
        console.warn(`[Canvas Sync] No node found for task ${task.id}`)
      }
      return {
        ...task,
        node_id: node?.id || ''
      }
    })
    
    console.log(`[Canvas Sync] ✅ Loaded: ${nodes.length} nodes (${newTaskNodes.length} new), ${edges.length} edges, ${tasksWithNodeIds.filter(t => t.node_id).length} tasks with node_id`)
    return { nodes, edges, tasks: tasksWithNodeIds }

  } catch (error) {
    console.error('[Canvas Sync] Load error:', error)
    return { nodes: [], edges: [], tasks: [] }
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
 * Frontend: 'backlog', 'planned', 'in_progress', etc.
 * Backend: 'Backlog', 'Planned', 'In Progress', etc.
 */
export function mapStatusToBackend(frontendStatus: string): string {
  const statusMap: Record<string, string> = {
    'backlog': 'Backlog',
    'planned': 'Planned',
    'in_progress': 'In Progress',
    'stuck': 'Stuck',
    'completed': 'Completed',
    'cancelled': 'Cancelled',
    // Legacy values
    'Not started': 'Backlog',
    'On-going': 'In Progress',
    'Complete': 'Completed',
    // Backend values pass through
    'Backlog': 'Backlog',
    'Planned': 'Planned',
    'In Progress': 'In Progress',
    'Completed': 'Completed',
    'Cancelled': 'Cancelled'
  }
  return statusMap[frontendStatus] || 'Backlog'
}

/**
 * Map backend status to frontend status
 */
export function mapStatusToFrontend(backendStatus: string): string {
  const statusMap: Record<string, string> = {
    'Backlog': 'backlog',
    'Planned': 'planned',
    'In Progress': 'in_progress',
    'Stuck': 'stuck',
    'Completed': 'completed',
    'Cancelled': 'cancelled'
  }
  return statusMap[backendStatus] || 'backlog'
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
    estimatedHours: task.estimatedHours,
    timeSpent: task.timeSpent,
    subtasks: [] // TODO: Load from subtasks table if needed
  }
}

/**
 * Create new node from task (no snapshot position available)
 */
function createNodeFromTask(task: TaskFromBackend, index: number): Node {
  return {
    id: `task-${task.id}`,
    type: 'task',
    position: { 
      x: -500 + (index * 700), // Horizontal layout
      y: 200 
    },
    data: mapTaskToNodeData(task),
    project_id: task.projectId,    content_id: task.id
  }
}