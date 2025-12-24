import useStore from '@/stores/flow-store'
import type { Node, Edge } from '@xyflow/react'

/**
 * Save current canvas state to server as a snapshot
 */
export async function saveSnapshotToServer(
  projectId: string,
  nodes: Node[],
  edges: Edge[],
  type: 'manual' | 'autosave' = 'autosave'
): Promise<boolean> {
  try {
    const response = await fetch(`/api/projects/${projectId}/snapshots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        snapshot_data: { nodes, edges },
      }),
    })

    if (response.ok) {
      return true
    } else {
      console.error('Failed to save snapshot:', await response.text())
      return false
    }
  } catch (error) {
    console.error('Error saving snapshot:', error)
    return false
  }
}

/**
 * Load a specific snapshot by ID
 */
export async function loadSnapshotById(
  projectId: string,
  snapshotId: string
): Promise<{ nodes: Node[]; edges: Edge[] } | null> {
  try {
    const response = await fetch(`/api/projects/${projectId}/snapshots/${snapshotId}`)

    if (response.ok) {
      const data = await response.json()
      return data.snapshot.snapshot_data as { nodes: Node[]; edges: Edge[] }
    } else {
      console.error('Failed to load snapshot:', await response.text())
      return null
    }
  } catch (error) {
    console.error('Error loading snapshot:', error)
    return null
  }
}

/**
 * Load the most recent snapshot for a project
 */
export async function loadLatestSnapshot(
  projectId: string
): Promise<{ nodes: Node[]; edges: Edge[] } | null> {
  try {
    const response = await fetch(`/api/projects/${projectId}/snapshots?limit=1`)

    if (response.ok) {
      const data = await response.json()
      if (data.snapshots && data.snapshots.length > 0) {
        return data.snapshots[0].snapshot_data as { nodes: Node[]; edges: Edge[] }
      }
      return null
    } else {
      console.error('Failed to load latest snapshot:', await response.text())
      return null
    }
  } catch (error) {
    console.error('Error loading latest snapshot:', error)
    return null
  }
}

/**
 * Hook for autosave functionality
 * Call this in your canvas component with useEffect
 */
export function useAutosave(intervalMs: number = 120000) {
  const projectId = useStore((state) => state.projectId)
  const isDirty = useStore((state) => state.isDirty)
  const nodes = useStore((state) => state.nodes)
  const edges = useStore((state) => state.edges)
  const markClean = useStore((state) => state.markClean)

  const performAutosave = async () => {
    if (!projectId || !isDirty) return

    const success = await saveSnapshotToServer(projectId, nodes, edges, 'autosave')
    if (success) {
      markClean()
      useStore.setState({ lastSavedAt: new Date().toISOString() })
    }
  }

  return { performAutosave, canSave: !!projectId && isDirty }
}
