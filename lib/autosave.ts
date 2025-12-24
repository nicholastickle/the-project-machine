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
  console.log(`[Autosave] Saving snapshot: projectId=${projectId}, type=${type}, nodes=${nodes.length}, edges=${edges.length}`)
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
      console.log('[Autosave] ✅ Snapshot saved successfully')
      return true
    } else {
      console.error('[Autosave] ❌ Failed to save snapshot:', await response.text())
      return false
    }
  } catch (error) {
    console.error('[Autosave] ❌ Error saving snapshot:', error)
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
  console.log(`[Autosave] Loading latest snapshot for projectId=${projectId}`)
  try {
    const response = await fetch(`/api/projects/${projectId}/snapshots?limit=1`)

    if (response.ok) {
      const data = await response.json()
      if (data.snapshots && data.snapshots.length > 0) {
        const snapshotData = data.snapshots[0].snapshot_data
        if (!snapshotData || !snapshotData.nodes) {
          console.error('[Autosave] ❌ Snapshot data is missing or malformed:', data.snapshots[0])
          return null
        }
        const snapshot = snapshotData as { nodes: Node[]; edges: Edge[] }
        console.log(`[Autosave] ✅ Snapshot loaded: nodes=${snapshot.nodes.length}, edges=${snapshot.edges.length}`)
        return snapshot
      }
      console.log('[Autosave] ⚠️ No snapshots found for this project')
      return null
    } else {
      console.error('[Autosave] ❌ Failed to load latest snapshot:', await response.text())
      return null
    }
  } catch (error) {
    console.error('[Autosave] ❌ Error loading latest snapshot:', error)
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
    if (!projectId) {
      console.log('[Autosave] ⚠️ Skipped: No projectId set')
      return
    }
    if (!isDirty) {
      console.log('[Autosave] ⚠️ Skipped: Canvas is clean (no changes)')
      return
    }

    console.log('[Autosave] 🔄 Starting autosave...')
    const success = await saveSnapshotToServer(projectId, nodes, edges, 'autosave')
    if (success) {
      markClean()
      useStore.setState({ lastSavedAt: new Date().toISOString() })
      console.log('[Autosave] ✅ Autosave complete')
    } else {
      console.log('[Autosave] ❌ Autosave failed')
    }
  }

  return { performAutosave, canSave: !!projectId && isDirty }
}
